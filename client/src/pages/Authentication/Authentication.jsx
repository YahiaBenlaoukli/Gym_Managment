import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Dumbbell } from "lucide-react";
import api from "../../services/api";


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
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Login failed ❌");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] flex flex-col items-center justify-center p-5">
            <div className="flex flex-col items-center mb-5 gap-4 py-5">
                <div className="bg-gradient-to-r from-accent to-hover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(255,235,59,0.3)]">
                    <Dumbbell className="w-6 h-5 sm:w-8 sm:h-6 md:w-10 md:h-8 text-secondary" />
                </div>
                <div className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                    FitnessCity Gym
                </div>
            </div>
            <div className="flex flex-col items-center w-full max-w-md bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                <div className="flex flex-col items-center justify-center gap-3 mt-5 w-full">
                    <div className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight text-center">
                        {action}
                    </div>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-white to-inactive-text rounded-sm shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
                </div>
                <div className="mt-8 flex flex-col gap-4 w-full">
                    {action === "Sign Up" && (
                        <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                            <FaUser className="mx-6 sm:mx-8 text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={signupData.username}
                                onChange={handleChange}
                                className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-inactive-text relative z-10"
                            />
                        </div>
                    )}
                    <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaEnvelope className="mx-6 sm:mx-8 text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={action === "Login" ? loginData.email : signupData.email}
                            onChange={handleChange}
                            className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-inactive-text relative z-10"
                        />
                    </div>
                    <div className="flex items-center w-full h-14 sm:h-16 md:h-18 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                        <FaLock className="mx-6 sm:mx-8 text-inactive-text text-base sm:text-lg flex-shrink-0 relative z-10" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={action === "Login" ? loginData.password : signupData.password}
                            onChange={handleChange}
                            className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-2 sm:px-4 placeholder:text-inactive-text relative z-10"
                        />
                    </div>
                </div>
                {action === "Login" && (
                    <div className="mt-5 text-inactive-text text-sm sm:text-base text-center px-2.5">
                        <div>Forgot Password? <span className="text-accent cursor-pointer underline transition-colors duration-300 hover:text-hover">Click Here!</span></div>
                    </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                    <div
                        className={`flex justify-center items-center w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 border-none uppercase tracking-wide relative overflow-hidden ${action === "Login"
                                ? "bg-input-bg text-white border-2 border-inactive-text hover:bg-secondary hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                                : "bg-accent text-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)]"
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
                                ? "bg-input-bg text-white border-2 border-inactive-text hover:bg-secondary hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                                : "bg-accent text-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)]"
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
    );
}

export default Authentication;