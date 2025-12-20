import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        categories: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('admin/product/dashboardStats');
            setStats({
                totalProducts: res.data.totalProducts || 0,
                lowStock: res.data.lowStockCount || 0,
                categories: res.data.totalCategories || 0, // Assuming API returns totalCategories
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const showLowStockProducts = () => {
        // Navigate to products page with filter or just general products page for now
        navigate('/admin/products?filter=lowStock'); // Example: navigate with a filter
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00]">
            <AdminNavbar />
            <div className="md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto py-10 px-5">
                    <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-accent pl-4">
                        Dashboard Overview
                    </h1>

                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-accent mt-4 font-semibold">Loading stats...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center mb-8">
                            <p>{error}</p>
                            <button
                                onClick={fetchDashboardStats}
                                className="mt-2 text-sm underline hover:text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {/* Total Products Card */}
                                <div className="bg-[#1a1a0a]/80 backdrop-blur-md p-6 rounded-2xl border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,235,59,0.1)] group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-secondary transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent group-hover:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/20 text-green-400">Live</span>
                                    </div>
                                    <h3 className="text-inactive-text text-sm font-medium uppercase tracking-wider">Total Products</h3>
                                    <p className="text-4xl font-bold text-white mt-1">{stats.totalProducts}</p>
                                </div>

                                {/* Low Stock Card */}
                                <div
                                    className="bg-[#1a1a0a]/80 backdrop-blur-md p-6 rounded-2xl border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,235,59,0.1)] group cursor-pointer"
                                    onClick={showLowStockProducts}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${stats.lowStock > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {stats.lowStock > 0 ? 'Action Needed' : 'Good'}
                                        </span>
                                    </div>
                                    <h3 className="text-inactive-text text-sm font-medium uppercase tracking-wider">Low Stock Items</h3>
                                    <p className="text-4xl font-bold text-white mt-1">{stats.lowStock}</p>
                                </div>

                                {/* Categories Card */}
                                <div className="bg-[#1a1a0a]/80 backdrop-blur-md p-6 rounded-2xl border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,235,59,0.1)] group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-inactive-text text-sm font-medium uppercase tracking-wider">Active Categories</h3>
                                    <p className="text-4xl font-bold text-white mt-1">{stats.categories}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
