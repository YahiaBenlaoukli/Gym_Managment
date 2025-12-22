import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    DollarSign, ShoppingBag, Users, Package, AlertTriangle,
    ArrowUpRight, Clock, CheckCircle, Truck
} from 'lucide-react';

const COLORS = ['#FFD700', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await api.get('admin/dashboard/analytics');
            setData(res.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError('Failed to load dashboard analytics.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#1a1a0a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#1a1a0a] flex items-center justify-center text-gray-900 dark:text-white">
                <p className="text-red-500 text-xl">{error}</p>
                <button onClick={fetchDashboardData} className="ml-4 underline">Retry</button>
            </div>
        );
    }

    const { analytics, orders, products, customers, finance } = data;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111111] text-gray-900 dark:text-white font-sans selection:bg-yellow-500 selection:text-black transition-colors duration-300">
            <AdminNavbar />

            <div className="md:ml-64 p-6 space-y-8 max-w-[1600px] mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-yellow-400 dark:to-yellow-600 bg-clip-text text-transparent">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Welcome back, Admin</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center gap-2"
                        >
                            <Package size={18} /> Add Product
                        </button>
                    </div>
                </header>

                {/* 1. Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`$${finance.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign size={24} />}
                        trend="+12.5%"
                        trendUp={true}
                        color="text-green-600 dark:text-green-400"
                        bgColor="bg-green-100 dark:bg-green-400/10"
                    />
                    <StatCard
                        title="Total Orders"
                        value={orders.stats.pending + orders.stats.shipped + orders.stats.delivered + orders.stats.cancelled}
                        icon={<ShoppingBag size={24} />}
                        trend="+5.2%"
                        trendUp={true}
                        color="text-blue-600 dark:text-blue-400"
                        bgColor="bg-blue-100 dark:bg-blue-400/10"
                    />
                    <StatCard
                        title="Total Customers"
                        value={customers.total}
                        icon={<Users size={24} />}
                        trend="+2.4%"
                        trendUp={true}
                        color="text-purple-600 dark:text-purple-400"
                        bgColor="bg-purple-100 dark:bg-purple-400/10"
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={products.lowStock}
                        icon={<AlertTriangle size={24} />}
                        trend="Action Needed"
                        trendUp={false}
                        color="text-red-600 dark:text-red-400"
                        bgColor="bg-red-100 dark:bg-red-400/10"
                        onClick={() => navigate('/admin/products')}
                    />
                </div>

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Trend */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <ArrowUpRight size={20} className="text-green-500" /> Sales Overview
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-10" />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' }}
                                        itemStyle={{ color: '#d97706' }}
                                        wrapperClassName="text-gray-900"
                                    />
                                    <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} dot={{ fill: '#d97706', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
                        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Revenue by Category</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.categoryChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.categoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#000' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Recent Orders & Order Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="text-sm text-yellow-600 dark:text-yellow-500 hover:text-yellow-500 hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-600 dark:text-gray-400">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-black/20 text-gray-500 dark:text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Order ID</th>
                                        <th className="px-6 py-4 font-semibold">Customer</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Amount</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {orders.recent.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">#{order.id}</td>
                                            <td className="px-6 py-4">{order.users?.username || 'Guest'}</td>
                                            <td className="px-6 py-4">{new Date(order.order_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">${Number(order.total_amount).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-center gap-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Order Statistics</h3>

                        <div className="space-y-4">
                            <StatusRow
                                label="Pending Orders"
                                count={orders.stats.pending}
                                icon={<Clock size={16} />}
                                color="text-yellow-600 dark:text-yellow-500"
                                bgColor="bg-yellow-100 dark:bg-yellow-500/10"
                            />
                            <StatusRow
                                label="Processing/Shipped"
                                count={orders.stats.shipped}
                                icon={<Truck size={16} />}
                                color="text-blue-600 dark:text-blue-500"
                                bgColor="bg-blue-100 dark:bg-blue-500/10"
                            />
                            <StatusRow
                                label="Delivered"
                                count={orders.stats.delivered}
                                icon={<CheckCircle size={16} />}
                                color="text-green-600 dark:text-green-500"
                                bgColor="bg-green-100 dark:bg-green-500/10"
                            />
                            <StatusRow
                                label="Cancelled"
                                count={orders.stats.cancelled}
                                icon={<AlertTriangle size={16} />}
                                color="text-red-600 dark:text-red-500"
                                bgColor="bg-red-100 dark:bg-red-500/10"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Top Products & Customers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <TrendingUpIcon /> Top Selling Products
                        </h3>
                        <div className="space-y-4">
                            {analytics.topProducts.map((prod, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-200 font-medium">{prod.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-500">{prod.count} sold</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Users size={20} className="text-purple-500" /> Top Loyal Customers
                        </h3>
                        <div className="space-y-4">
                            {customers.top.map((cust, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                            {cust.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{cust.name}</p>
                                            <p className="text-xs text-gray-500">{cust.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">${Number(cust.totalSpent).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Sub Components ---

const StatCard = ({ title, value, icon, trend, trendUp, color, bgColor, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group cursor-pointer`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            {/* <span className={`text-xs font-bold px-2 py-1 rounded bg-gray-800 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
            </span> */}
        </div>
        <h3 className="text-gray-500 dark:text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/30',
        shipped: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-500 border-blue-200 dark:border-blue-500/30',
        delivered: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-500 border-green-200 dark:border-green-500/30',
        cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-500 border-red-200 dark:border-red-500/30',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {status}
        </span>
    );
};

const StatusRow = ({ label, count, icon, color, bgColor }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
                {icon}
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{count}</span>
    </div>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default AdminDashboard;
