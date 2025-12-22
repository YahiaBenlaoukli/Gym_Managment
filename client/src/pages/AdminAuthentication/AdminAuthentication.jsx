import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUserShield } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";


function AdminLogin() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();


    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post('admin/auth/adminLogin', loginData);
            console.log(res);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300 flex flex-col items-center justify-center p-5 relative">

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-5 right-5 p-3 rounded-full bg-white dark:bg-input-bg border border-gray-200 dark:border-accent/20 shadow-lg text-gray-800 dark:text-accent hover:bg-gray-100 dark:hover:bg-accent/10 transition-all duration-300 z-50"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>


            <div className="flex flex-col items-center mb-8 gap-4">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-accent dark:to-hover w-16 h-16 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_5px_15px_rgba(255,235,59,0.3)]">
                    <FaUserShield className="w-8 h-8 text-white dark:text-secondary" />
                </div>
                <div className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-bold drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                    Admin Portal
                </div>
                <p className="text-gray-500 dark:text-inactive-text text-sm sm:text-base text-center">
                    Secure access for administrators only
                </p>
            </div>

            <div className="flex flex-col items-center w-full max-w-md bg-white dark:bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-2xl p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                <div className="flex flex-col items-center justify-center gap-3 mb-8 w-full">
                    <div className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                        Admin Login
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-accent dark:to-hover rounded-sm shadow-sm dark:shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
                </div>

                {error && (
                    <div className="w-full mb-6 text-center text-red-600 dark:text-[#ff4757] text-sm font-semibold py-4 bg-red-50 dark:bg-[rgba(255,71,87,0.1)] rounded-lg border border-red-200 dark:border-[#ff4757]">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center w-full h-16 bg-gray-50 dark:bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-yellow-500 dark:focus-within:border-accent focus-within:shadow-md dark:focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaEnvelope className="mx-6 text-gray-400 dark:text-inactive-text text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Admin Email"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                            className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-base px-4 placeholder:text-gray-400 dark:placeholder:text-inactive-text relative z-10"
                        />
                    </div>

                    <div className="flex items-center w-full h-16 bg-gray-50 dark:bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-yellow-500 dark:focus-within:border-accent focus-within:shadow-md dark:focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaLock className="mx-6 text-gray-400 dark:text-inactive-text text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-base px-4 placeholder:text-gray-400 dark:placeholder:text-inactive-text relative z-10"
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-8 w-full h-14 bg-yellow-500 dark:bg-accent text-white dark:text-secondary rounded-full text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-md dark:active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                >
                    <span className="relative z-10">
                        {loading ? 'Logging in...' : 'Login'}
                    </span>
                </button>

                <div className="mt-6 text-gray-500 dark:text-inactive-text text-xs text-center">
                    Protected area. Unauthorized access is prohibited.
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;