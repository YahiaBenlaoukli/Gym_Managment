import prisma from "../../services/prisma.js";

export const getDashboardAnalytics = async (req, res) => {
    try {
        // --- 1. Analytics & Charts ---

        // Sales over time (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentOrders = await prisma.orders.findMany({
            where: {
                order_date: {
                    gte: thirtyDaysAgo
                }
            },
            select: {
                order_date: true,
                total_amount: true
            },
            orderBy: {
                order_date: 'asc'
            }
        });

        // Group by day for the chart
        const salesMap = {};
        recentOrders.forEach(order => {
            const dateStr = order.order_date.toISOString().split('T')[0];
            salesMap[dateStr] = (salesMap[dateStr] || 0) + Number(order.total_amount);
        });

        const salesChartData = Object.keys(salesMap).map(date => ({
            date,
            sales: salesMap[date]
        }));


        // Revenue by Category
        // This is complex in Prisma without raw SQL for strict aggregation across relations.
        // We'll fetch order_items joined with products to aggregate manually for now.
        const orderItems = await prisma.order_items.findMany({
            include: {
                products: {
                    select: {
                        category: true,
                        name: true
                    }
                }
            }
        });

        const categoryRevenue = {};
        const productSalesCount = {};

        orderItems.forEach(item => {
            // Revenue by Category
            const cat = item.products.category;
            const revenue = Number(item.price) * item.quantity;
            categoryRevenue[cat] = (categoryRevenue[cat] || 0) + revenue;

            // Top Selling Products
            const prodName = item.products.name;
            productSalesCount[prodName] = (productSalesCount[prodName] || 0) + item.quantity;
        });

        const categoryChartData = Object.keys(categoryRevenue).map(cat => ({
            name: cat,
            value: categoryRevenue[cat]
        }));

        const topProducts = Object.entries(productSalesCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));


        // --- 2. Orders Management ---
        const recentOrdersList = await prisma.orders.findMany({
            take: 10,
            orderBy: {
                order_date: 'desc'
            },
            include: {
                users: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        const statusCounts = await prisma.orders.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        });

        // Transform statusCounts to object
        const orderStatusStats = {
            pending: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        statusCounts.forEach(s => {
            if (orderStatusStats.hasOwnProperty(s.status)) {
                orderStatusStats[s.status] = s._count.id;
            }
        });


        // --- 3. Products & Inventory ---
        const totalProducts = await prisma.products.count();
        const outOfStock = await prisma.products.count({
            where: { stock: 0 }
        });
        const lowStock = await prisma.products.count({
            where: { stock: { lte: 10, gt: 0 } }
        });

        // --- 4. Customers ---
        const totalCustomers = await prisma.users.count();

        // New customers today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Assuming no 'created_at' for users in provided schema, but if there was...
        // Checking schema: users schema doesn't have created_at? 
        // Schema provided: model users { ... verified Boolean? ... } NO CREATED_AT.
        // We cannot calculate "New customers today" accurately without created_at.
        // We will return total for now.

        // Top Customers by Spend
        // Group orders by user_id and sum total_amount
        const topCustomersRaw = await prisma.orders.groupBy({
            by: ['user_id'],
            _sum: {
                total_amount: true
            },
            orderBy: {
                _sum: {
                    total_amount: 'desc'
                }
            },
            take: 5
        });

        // Need to fetch usernames for these IDs
        const topCustomerIds = topCustomersRaw.map(c => c.user_id);
        const topCustomerUsers = await prisma.users.findMany({
            where: {
                id: { in: topCustomerIds }
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        const topCustomers = topCustomersRaw.map(c => {
            const user = topCustomerUsers.find(u => u.id === c.user_id);
            return {
                id: c.user_id,
                name: user ? user.username : 'Unknown',
                email: user ? user.email : '',
                totalSpent: c._sum.total_amount
            };
        });


        // --- 5. Payment & Finance ---
        // Assuming all "pending" orders are pending payment and others are paid? 
        // Or strictly looking at status. 
        // For simplicity: Delivery status != Payment status usually, but here likely correlated.
        // We'll just use total revenue.
        const totalRevenueAgg = await prisma.orders.aggregate({
            _sum: {
                total_amount: true
            }
        });
        const totalRevenue = totalRevenueAgg._sum.total_amount || 0;


        res.status(200).json({
            analytics: {
                salesChartData,
                categoryChartData,
                topProducts
            },
            orders: {
                recent: recentOrdersList,
                stats: orderStatusStats
            },
            products: {
                total: totalProducts,
                outOfStock,
                lowStock
            },
            customers: {
                total: totalCustomers,
                top: topCustomers
            },
            finance: {
                totalRevenue
            }
        });

    } catch (error) {
        console.error("Dashboard Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard analytics" });
    }
};
