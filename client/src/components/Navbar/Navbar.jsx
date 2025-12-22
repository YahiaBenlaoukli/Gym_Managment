import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaUserCircle, FaBars, FaTimes, FaSearch, FaShoppingCart } from "react-icons/fa";
import { Sun, Moon } from 'lucide-react';
import api from "../../services/api";
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Placeholder for cart count - in a real app this would come from context/redux
  const [cartCount, setCartCount] = useState(0);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = Boolean(user);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsUserDropdownOpen(false);
        setIsMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    };

    const getCartCount = async () => {
      try {
        const res = await api.get('cart/viewCart');
        console.log(res.data);
        setCartCount(res.data.cart_items.length);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };
    getCartCount();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('button[data-menu-toggle]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchProfile();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("auth/profile");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('auth/logout');
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
      setIsUserDropdownOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`w-full flex justify-between items-center py-5 px-5 sm:px-6 bg-white dark:bg-gradient-to-br dark:from-primary dark:via-secondary dark:to-[#1a1a0a] text-gray-900 dark:text-white shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm border-b border-gray-200 dark:border-b-2 dark:border-accent rounded-lg sticky top-0 z-50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(255,235,59,0.1)] ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>

      {/* LEFT SECTION: Menu Toggle + Logo */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <div className="relative">
          <button
            data-menu-toggle
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-yellow-600 dark:text-accent transition-all duration-300 hover:bg-[rgba(255,235,59,0.1)] hover:scale-110"
            title="Menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Navigation Dropdown */}
          <div
            ref={menuRef}
            className={`absolute top-full left-0 mt-4 w-60 bg-white dark:bg-[#1a1a0a] rounded-2xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-accent overflow-hidden transition-all duration-300 origin-top-left ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'
              }`}
          >
            <div className="py-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/payments', label: 'Payments' },
                { path: '/schedule', label: 'Schedule' },
                { path: '/settings', label: 'Settings' }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-[rgba(255,235,59,0.1)] hover:text-yellow-600 dark:hover:text-accent transition-colors border-l-4 border-transparent hover:border-yellow-600 dark:hover:border-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logo */}
        <Link to="/" className={`flex items-center gap-2 group transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden sm:opacity-100 sm:w-auto' : 'opacity-100'}`}>
          <FaDumbbell size={36} className="text-yellow-600 dark:text-accent group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-gray-900 dark:text-white text-lg sm:text-lg md:text-xl font-bold tracking-wide transition-colors duration-300 group-hover:text-yellow-600 dark:group-hover:text-accent truncate">
            FitnessCity
          </span>
        </Link>
      </div>

      {/* RIGHT SECTION: Search + Cart + Theme + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

        {/* Search */}
        <div className={`flex items-center transition-all duration-300 shadow-sm ${isSearchOpen ? 'bg-gray-100 dark:bg-white/10 pr-2 rounded-full w-full sm:w-auto absolute left-4 right-4 sm:static sm:left-auto sm:right-auto z-[60]' : ''
          }`}>
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 w-full sm:w-48 px-4 py-2 bg-transparent border-none outline-none text-base text-gray-700 dark:text-white placeholder-gray-400"
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-gray-500 hover:text-red-500">
                <FaTimes size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full text-yellow-600 dark:text-accent hover:bg-[rgba(255,235,59,0.1)] transition-colors hover:scale-110"
              title="Search"
            >
              <FaSearch size={20} />
            </button>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative p-2.5 rounded-full text-yellow-600 dark:text-accent hover:bg-[rgba(255,235,59,0.1)] transition-colors group hover:scale-110">
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-[#1a1a1a] shadow-sm transform group-hover:scale-110 transition-transform">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-yellow-600 dark:text-accent hover:bg-[rgba(255,235,59,0.1)] transition-transform active:scale-95 hover:scale-110"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Separator - Hide on small screens to save space */}
        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden md:block"></div>

        {/* Profile */}
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-[rgba(255,235,59,0.1)] animate-pulse"></div>
        ) : isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center rounded-full hover:bg-[rgba(255,235,59,0.1)] transition-all border-2 border-transparent hover:border-yellow-600 dark:hover:border-accent p-0.5"
            >
              <FaUserCircle size={20} className="w-9 h-9 sm:w-10 sm:h-10 text-yellow-600 dark:text-accent" />
            </button>

            {/* Profile Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute top-[calc(100%+12px)] right-0 bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent rounded-2xl shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] py-2 min-w-[220px] z-[100] animate-[dropdownFadeIn_0.3s_ease_forwards] backdrop-blur-sm origin-top-right">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 mx-2 rounded-xl mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-accent hover:bg-[rgba(255,235,59,0.1)] transition-colors border-l-4 border-transparent hover:border-yellow-600 dark:hover:border-accent"
                >
                  <FaUserCircle size={20} className="text-lg" />
                  Your Profile
                </Link>

                <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-4"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-[#ff4757] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left border-l-4 border-transparent hover:border-[#ff4757]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="hidden sm:inline-block px-6 py-2.5 rounded-full bg-transparent border-2 border-yellow-600 dark:border-accent text-gray-800 dark:text-white font-bold transition-all duration-300 hover:bg-yellow-600 hover:text-white dark:hover:bg-accent dark:hover:text-black hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;