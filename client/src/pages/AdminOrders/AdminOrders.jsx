import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import api from '../../services/api';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaTrash, FaSearch, FaEye, FaMapMarkerAlt, FaPhone, FaUser, FaCalendar } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = orders;
        if (activeTab !== 'All') {
            result = result.filter(order => order.status && order.status.toLowerCase() === activeTab.toLowerCase());
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(order =>
                (order.id && order.id.toString().includes(term)) ||
                (order.users?.username && order.users.username.toLowerCase().includes(term)) ||
                (order.location && order.location.toLowerCase().includes(term)) ||
                (order.order_items && order.order_items.some(item =>
                    item.products?.name && item.products.name.toLowerCase().includes(term)
                ))
            );
        }
        setFilteredOrders(result);
    }, [orders, activeTab, searchTerm]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/admin/order/getAllOrders');
            const data = res.data.rows || res.data || [];
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e, orderId, action) => {
        e.stopPropagation(); // Prevent row click
        if (!window.confirm(`Mark order #${orderId} as ${action}?`)) return;

        setLoading(true);
        try {
            let endpoint = '';
            if (action === 'Shipped') endpoint = '/admin/order/orderShipped';
            if (action === 'Delivered') endpoint = '/admin/order/orderDelivered';
            if (action === 'Cancelled') endpoint = '/admin/order/orderCancelled';

            await api.put(endpoint, { order_id: orderId });
            fetchOrders();
            setShowModal(false); // Close modal if open
        } catch (err) {
            console.error(err);
            setError(`Failed to update status.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (e, orderId) => {
        e.stopPropagation();
        if (!window.confirm(`Delete order #${orderId}?`)) return;

        setLoading(true);
        try {
            await api.delete('/admin/order/deleteOrder', { data: { order_id: orderId } });
            fetchOrders();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            setError('Failed to delete order.');
        } finally {
            setLoading(false);
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20';
            case 'shipped': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
            case 'delivered': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-200 dark:border-green-400/20';
            case 'cancelled': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-400/10 border-gray-200 dark:border-gray-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300">
            <AdminNavbar />
            <div className="md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto py-10 px-5">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-yellow-500 dark:border-accent pl-4">
                            Order Management
                        </h1>
                        <button onClick={fetchOrders} className="px-4 py-2 bg-yellow-100 dark:bg-accent/10 text-yellow-700 dark:text-accent rounded-lg hover:bg-yellow-200 dark:hover:bg-accent dark:hover:text-secondary transition-all font-semibold text-sm">
                            Refresh Data
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent/20 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                        ? 'bg-yellow-500 dark:bg-accent text-white dark:text-secondary'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search User, Product or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-accent/20 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white focus:border-yellow-500 dark:focus:border-accent outline-none"
                            />
                            <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent/20 rounded-xl overflow-hidden shadow-xl">
                        {loading && !orders.length ? (
                            <div className="text-center py-20 text-yellow-600 dark:text-accent animate-pulse">Loading orders...</div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-500">{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Order ID</th>
                                            <th className="px-6 py-4 font-semibold">Product</th>
                                            <th className="px-6 py-4 font-semibold">Customer</th>
                                            <th className="px-6 py-4 font-semibold">Total</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredOrders.map(order => {
                                            const firstItem = order.order_items?.[0] || {};
                                            const product = firstItem.products || {};
                                            const remainingItems = (order.order_items?.length || 0) - 1;

                                            return (
                                                <tr
                                                    key={order.id}
                                                    onClick={() => openOrderDetails(order)}
                                                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                                                >
                                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-mono text-sm">#{order.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {product.image_path ? (
                                                                <img src={`${process.env.REACT_APP_PHOTO_URL}${product.image_path}`} alt="" className="w-10 h-10 object-cover rounded bg-gray-200 dark:bg-white/10" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded flex items-center justify-center text-gray-500"><FaBox /></div>
                                                            )}
                                                            <div>
                                                                <p className="text-gray-900 dark:text-white text-sm font-medium">{product.name || 'Unknown Product'}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-xs text-gray-500">Qty: {firstItem.quantity || 0}</p>
                                                                    {remainingItems > 0 && (
                                                                        <span className="text-[10px] bg-yellow-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-yellow-700 dark:text-accent font-bold">
                                                                            +{remainingItems} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                                                        {order.users?.username || `User #${order.user_id}`}
                                                    </td>
                                                    <td className="px-6 py-4 text-yellow-600 dark:text-accent font-bold text-sm">
                                                        ${parseFloat(order.total_amount || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => openOrderDetails(order)}
                                                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 rounded-lg"
                                                                title="View Details"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteOrder(e, order.id)}
                                                                className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-white dark:hover:bg-red-500/20 rounded-lg"
                                                                title="Delete"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent/20 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="text-yellow-600 dark:text-accent">Order #{selectedOrder.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><FaTimesCircle size={24} /></button>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
                            {/* Products List */}
                            <div className="col-span-2 p-6 md:p-8">
                                <h3 className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wider">Order Items ({selectedOrder.order_items?.length || 0})</h3>
                                <div className="space-y-4">
                                    {selectedOrder.order_items?.map((item, index) => (
                                        <div key={item.id || index} className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-yellow-500 dark:hover:border-white/10 transition-colors">
                                            {item.products?.image_path ? (
                                                <img src={`${process.env.REACT_APP_PHOTO_URL}${item.products.image_path}`} alt="" className="w-20 h-20 object-cover rounded-lg bg-white dark:bg-black/20" />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-2xl text-gray-600"><FaBox /></div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-gray-900 dark:text-white font-bold">{item.products?.name || 'Unknown Item'}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">{item.products?.category}</p>
                                                    </div>
                                                    <p className="text-yellow-600 dark:text-accent font-mono font-bold">${item.price}</p>
                                                </div>
                                                <div className="mt-3 flex justify-between items-center text-sm">
                                                    <div className="px-2 py-1 bg-gray-200 dark:bg-white/10 rounded text-gray-700 dark:text-gray-300 text-xs">
                                                        Qty: <span className="text-gray-900 dark:text-white font-bold">{item.quantity}</span>
                                                    </div>
                                                    <div className="text-gray-500 dark:text-gray-400">
                                                        Subtotal: <span className="text-gray-900 dark:text-white ml-2">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer & Order Info */}
                            <div className="p-6 md:p-8 space-y-8 bg-gray-50 dark:bg-black/20">
                                <div>
                                    <h3 className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wider">Customer Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-yellow-600 dark:text-accent"><FaUser size={12} /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Customer</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.users?.username || `User #${selectedOrder.user_id}`}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-yellow-600 dark:text-accent"><FaPhone size={12} /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Mobile</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.mobile || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-yellow-600 dark:text-accent shrink-0"><FaMapMarkerAlt size={12} /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Delivery Location</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{selectedOrder.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-yellow-600 dark:text-accent"><FaCalendar size={12} /></div>
                                            <div>
                                                <p className="text-xs text-gray-500">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(selectedOrder.order_date).toLocaleDateString()} {new Date(selectedOrder.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total Amount</span>
                                        <span className="text-3xl font-bold text-yellow-600 dark:text-accent">${parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</span>
                                    </div>

                                    <h3 className="text-xs uppercase text-gray-500 font-bold mb-4 tracking-wider">Update Status</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={(e) => handleStatusUpdate(e, selectedOrder.id, 'Shipped')}
                                            disabled={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
                                            className="w-full py-2.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase flex justify-center items-center gap-2"
                                        >
                                            <FaShippingFast /> Mark as Shipped
                                        </button>
                                        <button
                                            onClick={(e) => handleStatusUpdate(e, selectedOrder.id, 'Delivered')}
                                            disabled={selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
                                            className="w-full py-2.5 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30 rounded-lg hover:bg-green-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase flex justify-center items-center gap-2"
                                        >
                                            <FaCheckCircle /> Mark as Delivered
                                        </button>
                                        <button
                                            onClick={(e) => handleStatusUpdate(e, selectedOrder.id, 'Cancelled')}
                                            disabled={selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled'}
                                            className="w-full py-2.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase flex justify-center items-center gap-2"
                                        >
                                            <FaTimesCircle /> Cancel Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
