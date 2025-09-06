import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../Assets/logo.svg';
import { FaDumbbell } from "react-icons/fa";     
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import api from "../../services/api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [user,setUser] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    const fetchProfile = async () => {
      try {
        const res = await api.get("auth/profile");
        console.log(res.data); // check backend response
        setUser(res.data.username); // adjust depending on backend response
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    
  }, []);

  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
      <FaDumbbell size={40}  title="Dumbbell (GameIcons)" />
        <Link to="/" className={styles.Name}>FitnessCity</Link>
      </div>
      
      {/* Mobile menu toggle */}
      <div className={styles.mobileToggle} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`${styles.navbarLinks} ${isMenuOpen ? styles.active : ''}`}>
        <li>
          <Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link>
        </li>
        <li>
        <Link to="/payments" onClick={() => setIsMenuOpen(false)}>Payments</Link>
        </li>
        <li>
          <Link to="/Courses" onClick={() => setIsMenuOpen(false)}>Courses</Link>
        </li>
        <li>
          <Link to="/schedule" onClick={() => setIsMenuOpen(false)}>Schedule</Link>
        </li>
        <li>
        <Link to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link>
        
        </li>
      </ul>

      <div className={styles.navbarUser}>
        <span>Welcome, {user}</span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
        
        {/* User dropdown */}
        <div className={styles.userDropdown} ref={dropdownRef}>
          <FaUserCircle 
            className={styles.userIcon} 
            onClick={toggleUserDropdown}
          />
          {isUserDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem}>
                <FaUserCircle className={styles.dropdownUserIcon} />
                <span>User Profile</span>
              </div>
              <div className={styles.dropdownDivider}></div>
              <button 
                onClick={handleLogout}
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;