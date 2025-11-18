import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaUserShield } from "react-icons/fa";
import api from "../../services/api";

function AdminLogin() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] flex flex-col items-center justify-center p-5">
            <div className="flex flex-col items-center mb-8 gap-4">
                <div className="bg-gradient-to-r from-accent to-hover w-16 h-16 rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(255,235,59,0.3)]">
                    <FaUserShield className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-white text-3xl sm:text-4xl font-bold drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                    Admin Portal
                </div>
                <p className="text-inactive-text text-sm sm:text-base text-center">
                    Secure access for administrators only
                </p>
            </div>

            <div className="flex flex-col items-center w-full max-w-md bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                <div className="flex flex-col items-center justify-center gap-3 mb-8 w-full">
                    <div className="text-white text-2xl sm:text-3xl font-bold drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                        Admin Login
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-accent to-hover rounded-sm shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
                </div>

                {error && (
                    <div className="w-full mb-6 text-center text-[#ff4757] text-sm font-semibold py-4 bg-[rgba(255,71,87,0.1)] rounded-lg border border-[#ff4757]">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center w-full h-16 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaEnvelope className="mx-6 text-inactive-text text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Admin Email"
                            value={loginData.email}
                            onChange={handleChange}
                            required
                            className="flex-1 h-full bg-transparent border-none outline-none text-white text-base px-4 placeholder:text-inactive-text relative z-10"
                        />
                    </div>

                    <div className="flex items-center w-full h-16 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaLock className="mx-6 text-inactive-text text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            className="flex-1 h-full bg-transparent border-none outline-none text-white text-base px-4 placeholder:text-inactive-text relative z-10"
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-8 w-full h-14 bg-accent text-secondary rounded-full text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                >
                    <span className="relative z-10">
                        {loading ? 'Logging in...' : 'Login'}
                    </span>
                </button>

                <div className="mt-6 text-inactive-text text-xs text-center">
                    Protected area. Unauthorized access is prohibited.
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;