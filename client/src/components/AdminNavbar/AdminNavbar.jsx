import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserShield, FaBars, FaTimes, FaDumbbell, FaUserCircle, FaSearch, FaPlus, FaList, FaSignOutAlt, FaTachometerAlt, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import api from "../../services/api";

const AdminNavbar = ({
    showSearch = false,
    searchQuery = '',
    onSearchChange,
    onSearchSubmit,
    showAddButton = false,
    activeView = '',
    setActiveView,
    onRefresh
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await api.post('admin/auth/adminLogout');
            localStorage.removeItem('token');
            navigate('/admin');
        } catch (err) {
            console.error("Logout error:", err);
            localStorage.removeItem('token');
            navigate('/admin');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Header (Visible only on mobile) */}
            <div className="md:hidden w-full flex justify-between items-center py-4 px-5 bg-primary text-white sticky top-0 z-50 shadow-md border-b border-accent/20">
                <div className="flex items-center gap-2">
                    <FaUserShield size={30} className="text-accent" />
                    <span className="font-bold text-sm">FitnessCity Admin</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-accent text-xl">
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Sidebar Container */}
            <nav className={`
                fixed top-0 left-0 h-screen w-64 bg-[#1a1a0a] border-r border-accent/20 z-50
                flex flex-col text-white shadow-[4px_0_24px_rgba(0,0,0,0.4)] transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>

                {/* Logo Area */}
                <div className="p-6 flex flex-col items-center gap-3 border-b border-accent/10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-[#d4c000] flex items-center justify-center shadow-[0_0_20px_rgba(255,235,59,0.3)]">
                        <FaUserShield size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-wide">Admin Portal</h1>
                        <p className="text-xs text-inactive-text">FitnessCity Management</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">

                    {/* Main Nav Items */}
                    <div className="space-y-1">
                        <p className="text-xs uppercase text-inactive-text font-semibold px-4 mb-2 tracking-wider">Menu</p>

                        <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/dashboard') ? 'bg-accent text-secondary font-bold shadow-[0_0_15px_rgba(255,235,59,0.3)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                            <FaTachometerAlt className={isActive('/admin/dashboard') ? 'text-secondary' : 'text-accent group-hover:text-white'} />
                            <span>Dashboard</span>
                        </Link>

                        <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/products') ? 'bg-accent text-secondary font-bold shadow-[0_0_15px_rgba(255,235,59,0.3)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                            <FaBoxOpen className={isActive('/admin/products') ? 'text-secondary' : 'text-accent group-hover:text-white'} />
                            <span>Products</span>
                        </Link>

                        <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/orders') ? 'bg-accent text-secondary font-bold shadow-[0_0_15px_rgba(255,235,59,0.3)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                            <FaClipboardList className={isActive('/admin/orders') ? 'text-secondary' : 'text-accent group-hover:text-white'} />
                            <span>Orders</span>
                        </Link>
                    </div>

                    {/* Product Specific Actions (Only visible when on Products page) */}
                    {(showSearch || showAddButton) && (
                        <div className="mt-8 pt-6 border-t border-accent/10 space-y-4">
                            <p className="text-xs uppercase text-inactive-text font-semibold px-4 tracking-wider">Actions</p>

                            {showAddButton && (
                                <div className="grid grid-cols-2 gap-2 px-2">
                                    <button
                                        onClick={() => { setActiveView('products'); setIsMobileMenuOpen(false); }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeView === 'products' ? 'bg-accent/20 border-accent text-accent' : 'border-transparent bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        <FaList className="mb-1" />
                                        <span className="text-xs">List</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveView('add'); setIsMobileMenuOpen(false); }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeView === 'add' ? 'bg-accent/20 border-accent text-accent' : 'border-transparent bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        <FaPlus className="mb-1" />
                                        <span className="text-xs">Add New</span>
                                    </button>
                                </div>
                            )}

                            {showSearch && (
                                <div className="px-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={onSearchChange}
                                            onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
                                            className="w-full bg-[#0a0a05] border border-accent/20 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-gray-600"
                                        />
                                        <FaSearch
                                            className="absolute left-3 top-3 text-gray-500 cursor-pointer hover:text-accent"
                                            onClick={onSearchSubmit}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Profile / Logout - Fixed at bottom */}
                <div className="p-4 border-t border-accent/10 bg-[#151508]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-colors cursor-pointer group" onClick={toggleUserDropdown}>
                        <div className="relative">
                            <FaUserCircle className="w-9 h-9 text-gray-400 group-hover:text-accent transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#151508]"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">Online</p>
                        </div>
                    </div>

                    {/* Simple Logout for Sidebar */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#ff4757] bg-[#ff4757]/10 rounded-lg hover:bg-[#ff4757]/20 transition-colors"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </nav>
        </>
    );
};

export default AdminNavbar;
