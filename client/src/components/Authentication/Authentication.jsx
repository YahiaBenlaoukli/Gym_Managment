import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Authentication.module.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Dumbbell } from "lucide-react";
import api from "../../services/api";
import cn from "classnames";


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
        if(action === "Login")
            setLoginData({ ...loginData, [e.target.name]: e.target.value });
        else if(action === "Sign Up")
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
        <div>
            <div>
                <div className={styles.logo}>
                    <div className={styles.iconContainer}>
                        <Dumbbell className={styles.icon} />
                    </div>
                    <div className={styles.logoText}>FitnessCity Gym</div>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.text}>
                        {action}
                    </div>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.inputs}>
                    {action === "Sign Up" && (
                        <div className={styles.input}>
                            <FaUser style={{ margin: '0px 30px' }} />
                            <input 
                                type="text" 
                                name="username"
                                placeholder="Username" 
                                value={signupData.username} 
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    <div className={styles.input}>
                        <FaEnvelope style={{ margin: '0px 30px' }} />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email" 
                            value={action === "Login" ? loginData.email : signupData.email} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className={styles.input}>
                        <FaLock style={{ margin: '0px 30px' }} />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            value={action === "Login" ? loginData.password : signupData.password} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {action === "Login" && (
                    <div className={styles.forgotPassword}>
                        <div>Forgot Password? <span>Click Here!</span></div>
                    </div>
                )}

                <div className={styles.submitContainer}>
                    <div 
                        className={action === "Login" ? `${styles.submit} ${styles.gray}` : styles.submit} 
                        onClick={() => {
                            if (action === "Login") {
                                setAction("Sign Up");
                            } else {
                                handleSignup();
                            }
                        }}
                    >
                        Sign Up
                    </div>
                    <div 
                        className={action === "Sign Up" ? `${styles.submit} ${styles.gray}` : styles.submit} 
                        onClick={() => {
                            if (action === "Sign Up") {
                                setAction("Login");
                            } else {
                                handleLogin();
                            }
                        }}
                    >
                        Log in
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Authentication;