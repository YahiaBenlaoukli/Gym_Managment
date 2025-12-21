import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from "react-icons/fa";
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsUserDropdownOpen(false); // Close dropdown when hiding navbar
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    fetchProfile();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("auth/profile");
      console.log("Profile fetched:", res.data);
      setUser(res.data.user);
    } catch (err) {
      console.log("User not authenticated:", err.response?.status);
      if (err.response?.status !== 401) {
        console.error("Error fetching profile:", err);
      }
      setUser(null);

    } finally {
      setLoading(false);
    }
  };


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Logout clicked');
      await api.post('auth/logout');
      setUser(null);
      localStorage.removeItem('token'); // Clear token if using localStorage
      navigate('/');
      setIsUserDropdownOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails on backend, clear frontend state
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <nav className={`w-full flex justify-between items-center py-5 px-5 sm:px-6 bg-white dark:bg-gradient-to-br dark:from-primary dark:via-secondary dark:to-[#1a1a0a] text-gray-900 dark:text-white shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm border-b border-gray-200 dark:border-b-2 dark:border-accent rounded-lg sticky top-0 z-50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_12px_40px_rgba(255,235,59,0.1)] ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
      <div className="flex items-center gap-2">
        <FaDumbbell size={40} className="text-yellow-600 dark:text-accent" title="Dumbbell (GameIcons)" />
        <Link to="/" className="text-gray-900 dark:text-white no-underline text-sm sm:text-base font-bold tracking-wide transition-colors duration-300 hover:text-yellow-600 dark:hover:text-accent">
          FitnessCity
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <div
        className="md:hidden text-xl cursor-pointer text-yellow-600 dark:text-accent transition-all duration-300 p-2 rounded-lg bg-[rgba(255,235,59,0.1)] hover:text-hover hover:bg-[rgba(255,235,59,0.2)] hover:scale-110"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2.5 md:gap-6 sm:gap-8 flex-1 justify-center list-none m-0 p-0 absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto w-full md:w-auto bg-white md:bg-transparent rounded-2xl mt-4 md:mt-0 p-5 md:p-0 shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] md:shadow-none border border-gray-200 dark:border-2 dark:border-0 border-accent md:border-transparent z-40`}>
        <li className="relative inline-block m-0 text-lg cursor-pointer w-full md:w-auto text-center md:text-left">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 dark:text-white no-underline font-semibold py-3 px-5 md:py-3 md:px-5 rounded-full md:rounded-full transition-all duration-300 relative bg-transparent border-2 border-transparent hover:text-yellow-600 dark:hover:text-accent hover:bg-[rgba(255,235,59,0.1)] hover:border-yellow-600 dark:hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] active:translate-y-0 block w-full md:w-auto py-4 md:py-3 rounded-xl md:rounded-full"
          >
            Home
          </Link>
        </li>
        <li className="relative inline-block m-0 text-lg cursor-pointer w-full md:w-auto text-center md:text-left">
          <Link
            to="/payments"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 dark:text-white no-underline font-semibold py-3 px-5 md:py-3 md:px-5 rounded-full md:rounded-full transition-all duration-300 relative bg-transparent border-2 border-transparent hover:text-yellow-600 dark:hover:text-accent hover:bg-[rgba(255,235,59,0.1)] hover:border-yellow-600 dark:hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] active:translate-y-0 block w-full md:w-auto py-4 md:py-3 rounded-xl md:rounded-full"
          >
            Payments
          </Link>
        </li>
        <li className="relative inline-block m-0 text-lg cursor-pointer w-full md:w-auto text-center md:text-left">
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 dark:text-white no-underline font-semibold py-3 px-5 md:py-3 md:px-5 rounded-full md:rounded-full transition-all duration-300 relative bg-transparent border-2 border-transparent hover:text-accent hover:bg-[rgba(255,235,59,0.1)] hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] active:translate-y-0 block w-full md:w-auto py-4 md:py-3 rounded-xl md:rounded-full"
          >
            Cart
          </Link>
        </li>
        <li className="relative inline-block m-0 text-lg cursor-pointer w-full md:w-auto text-center md:text-left">
          <Link
            to="/schedule"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 dark:text-white no-underline font-semibold py-3 px-5 md:py-3 md:px-5 rounded-full md:rounded-full transition-all duration-300 relative bg-transparent border-2 border-transparent hover:text-accent hover:bg-[rgba(255,235,59,0.1)] hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] active:translate-y-0 block w-full md:w-auto py-4 md:py-3 rounded-xl md:rounded-full"
          >
            Schedule
          </Link>
        </li>
        <li className="relative inline-block m-0 text-lg cursor-pointer w-full md:w-auto text-center md:text-left">
          <Link
            to="/settings"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 dark:text-white no-underline font-semibold py-3 px-5 md:py-3 md:px-5 rounded-full md:rounded-full transition-all duration-300 relative bg-transparent border-2 border-transparent hover:text-accent hover:bg-[rgba(255,235,59,0.1)] hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] active:translate-y-0 block w-full md:w-auto py-4 md:py-3 rounded-xl md:rounded-full"
          >
            Settings
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-5 relative md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[rgba(255,235,59,0.1)] text-yellow-600 dark:text-accent transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {loading ? (
          // Optional: Show a loading indicator while checking auth status
          <div className="w-10 h-10 rounded-full bg-[rgba(255,235,59,0.1)] animate-pulse"></div>
        ) : isLoggedIn ? (
          <>
            <span className="text-inactive-text font-medium text-base hidden sm:inline md:hidden">
              Welcome, {user?.username}
            </span>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <FaUserCircle
                className="w-12 h-12 cursor-pointer ml-2.5 text-yellow-600 dark:text-accent transition-all duration-300 rounded-full p-1.5 bg-[rgba(255,235,59,0.1)] border-2 border-transparent hover:text-yellow-700 dark:hover:text-hover hover:bg-[rgba(255,235,59,0.2)] hover:border-yellow-600 dark:hover:border-accent hover:scale-110 hover:shadow-[0_0_20px_rgba(255,235,59,0.4)] md:w-10 md:h-10 md:ml-0"
                onClick={toggleUserDropdown}
              />
              {isUserDropdownOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 bg-white dark:bg-primary border border-gray-200 dark:border-2 dark:border-accent rounded-2xl shadow-xl dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] py-2.5 min-w-[200px] z-[1001] opacity-0 translate-y-[-10px] animate-[dropdownFadeIn_0.3s_ease_forwards] backdrop-blur-sm md:right-[-20px] md:min-w-[180px]">
                  <div className="flex items-center gap-3 py-4 px-5 text-gray-900 dark:text-white cursor-pointer transition-all duration-300 border-none bg-none w-full text-left text-base font-medium hover:bg-[rgba(255,235,59,0.1)] hover:text-yellow-600 dark:hover:text-accent">
                    <FaUserCircle className="w-5 h-5 text-yellow-600 dark:text-accent" />
                    <span>Welcome, {user?.username}</span>
                  </div>
                  <div className="h-px bg-[rgba(255,235,59,0.3)] my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-4 px-5 text-[#ff4757] cursor-pointer transition-all duration-300 border-none bg-none w-full text-left text-base font-medium border-t border-[rgba(255,235,59,0.2)] mt-1.25 hover:bg-[rgba(255,71,87,0.1)] hover:text-[#ff3742]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/auth"
            className="text-white no-underline font-semibold py-2.5 px-6 rounded-full transition-all duration-300 bg-accent border-2 border-accent hover:bg-transparent hover:text-accent hover:border-accent hover:shadow-[0_8px_25px_rgba(255,235,59,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;