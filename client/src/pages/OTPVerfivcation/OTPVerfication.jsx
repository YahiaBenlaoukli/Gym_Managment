import React, { useState, useRef, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function OTPVerification() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("user_id");
    const userUsername = params.get("user_username");
    const userEmail = params.get("user_email");

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow single digit
        if (value.length > 1) return;

        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < 4) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);

        // Focus last filled input or next empty
        const nextIndex = Math.min(pastedData.length, 3);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleVerify = async (e) => {
        if (e) e.preventDefault();

        const otpCode = otp.join("");
        if (otpCode.length !== 4) {
            alert("Please enter all 4 digits");
            return;
        }

        // Your API call here
        console.log("OTP:", otpCode);
        alert(`OTP entered: ${otpCode}`);
        try {
            const res = await api.post('auth/verify_otp', { user_id: userId, user_username: userUsername, user_email: userEmail, otp: otpCode });
            console.log(res);
            alert("OTP verified successfully");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Verification failed ❌");
        }
    };

    const handleResend = async () => {
        // Your API call here
        console.log("Resending OTP...");
        alert("OTP resent!");
        // Example:
        // try {
        //     const res = await api.post('auth/resend-otp');
        //     alert("OTP resent successfully");
        // } catch (err) {
        //     alert(err.response?.data?.message || "Resend failed ❌");
        // }
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
                        Verify OTP
                    </div>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-white to-inactive-text rounded-sm shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
                </div>

                <div className="mt-6 text-inactive-text text-sm sm:text-base text-center px-2.5">
                    Enter the 4-digit code sent to your email
                </div>

                <div className="mt-8 flex gap-3 sm:gap-4 w-full justify-center">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 text-white text-2xl sm:text-3xl text-center font-bold outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)]"
                        />
                    ))}
                </div>

                <div className="mt-8 w-full">
                    <div
                        className="flex justify-center items-center w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 border-none uppercase tracking-wide relative overflow-hidden bg-accent text-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)]"
                        onClick={handleVerify}
                    >
                        <span className="relative z-10">Verify</span>
                    </div>
                </div>

                <div className="mt-6 text-inactive-text text-sm sm:text-base text-center px-2.5">
                    Didn't receive the code?{" "}
                    <span
                        className="text-accent cursor-pointer underline transition-colors duration-300 hover:text-hover"
                        onClick={handleResend}
                    >
                        Resend
                    </span>
                </div>
            </div>
        </div>
    );
}

export default OTPVerification;