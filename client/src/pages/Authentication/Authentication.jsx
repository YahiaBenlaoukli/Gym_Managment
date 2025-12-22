import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Dumbbell, Sun, Moon } from "lucide-react";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";


function Authentication() {
    const [action, setAction] = useState('Login');
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        if (action === "Login")
            setLoginData({ ...loginData, [e.target.name]: e.target.value });
        else if (action === "Sign Up")
            setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        try {
            const res = await api.post('auth/register', signupData);
            console.log(res);
            alert("Signup successful");
            navigate(`/verify_otp?user_id=${encodeURIComponent(res.data.userId)}&user_username=${encodeURIComponent(signupData.username)}`);
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed ❌");
        }
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        try {
            const res = await api.post('auth/login', loginData);
            console.log(res);
            alert("Login successful");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Login failed ❌");
        }
    };

    return (
        <div className="min-h-screen max-auto bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] flex flex-col items-center justify-center transition-colors duration-300 relative">

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-5 right-5 p-3 rounded-full bg-white dark:bg-input-bg border border-gray-200 dark:border-accent/20 shadow-lg text-gray-800 dark:text-accent hover:bg-gray-100 dark:hover:bg-accent/10 transition-all duration-300 z-50"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <div className="flex flex-col items-center transform scale-[0.8] origin-center">
                <div className="flex flex-col items-center mb-5 gap-4 py-5">
                    <div className="bg-yellow-500 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <Dumbbell className="w-6 h-5 sm:w-8 sm:h-6 md:w-10 md:h-8 text-white dark:text-secondary" />
                    </div>
                    <div className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
                        FitnessCity Gym
                    </div>
                </div>
                <div className="flex flex-col items-center w-full max-w-md bg-white dark:bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)] transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center gap-3 mt-5 w-full">
                        <div className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
                            {action}
                        </div>
                        <div className="h-1 w-16 sm:w-20 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div className="mt-8 flex flex-col gap-4 w-full">
                        {action === "Sign Up" && (
                            <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-gray-100 dark:bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                                <FaUser className="mx-6 sm:mx-8 text-gray-400 dark:text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={signupData.username}
                                    onChange={handleChange}
                                    className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-gray-400 dark:placeholder:text-inactive-text relative z-10"
                                />
                            </div>
                        )}
                        <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-gray-100 dark:bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                            <FaEnvelope className="mx-6 sm:mx-8 text-gray-400 dark:text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={action === "Login" ? loginData.email : signupData.email}
                                onChange={handleChange}
                                className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-gray-400 dark:placeholder:text-inactive-text relative z-10"
                            />
                        </div>
                        <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-gray-100 dark:bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                            <FaLock className="mx-6 sm:mx-8 text-gray-400 dark:text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={action === "Login" ? loginData.password : signupData.password}
                                onChange={handleChange}
                                className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-gray-400 dark:placeholder:text-inactive-text relative z-10"
                            />
                        </div>
                    </div>
                    {action === "Login" && (
                        <div className="mt-5 text-gray-500 dark:text-inactive-text text-sm sm:text-base text-center px-2.5">
                            <div>Forgot Password? <span className="text-yellow-500 cursor-pointer underline transition-colors duration-300 hover:text-yellow-600">Click Here!</span></div>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                        <div
                            className={`flex justify-center items-center w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 border-none uppercase tracking-wide relative overflow-hidden ${action === "Login"
                                ? "bg-gray-100 dark:bg-input-bg text-gray-900 dark:text-white border-2 border-gray-300 dark:border-inactive-text hover:bg-gray-200 dark:hover:bg-secondary hover:border-yellow-500 dark:hover:border-accent hover:text-yellow-600 dark:hover:text-accent hover:-translate-y-0.5 hover:shadow-lg"
                                : "bg-yellow-500 dark:bg-accent text-white dark:text-secondary hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                                }`}
                            onClick={() => {
                                if (action === "Login") {
                                    setAction("Sign Up");
                                } else {
                                    handleSignup();
                                }
                            }}
                        >
                            <span className="relative z-10">Sign Up</span>
                        </div>
                        <div
                            className={`flex justify-center items-center w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 border-none uppercase tracking-wide relative overflow-hidden ${action === "Sign Up"
                                ? "bg-gray-100 dark:bg-input-bg text-gray-900 dark:text-white border-2 border-gray-300 dark:border-inactive-text hover:bg-gray-200 dark:hover:bg-secondary hover:border-yellow-500 dark:hover:border-accent hover:text-yellow-600 dark:hover:text-accent hover:-translate-y-0.5 hover:shadow-lg"
                                : "bg-yellow-500 dark:bg-accent text-white dark:text-secondary hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                                }`}
                            onClick={() => {
                                if (action === "Sign Up") {
                                    setAction("Login");
                                } else {
                                    handleLogin();
                                }
                            }}
                        >
                            <span className="relative z-10">Log in</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authentication;