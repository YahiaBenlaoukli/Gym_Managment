import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#1a1a0a] dark:from-secondary dark:via-primary dark:to-[#1a1a0a] bg-gray-100 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-4xl mx-auto w-full py-10 px-5">
                <h1 className="text-3xl font-bold mb-8 text-white dark:text-white text-gray-900">Settings</h1>

                <div className="bg-[rgba(26,26,26,0.95)] dark:bg-[rgba(26,26,26,0.95)] bg-white rounded-2xl p-8 border border-accent/20 shadow-lg">
                    <h2 className="text-xl font-bold mb-6 text-white dark:text-white text-gray-900 border-b border-accent/20 pb-4">
                        Appearance
                    </h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-white dark:text-white text-gray-900">Theme</h3>
                            <p className="text-inactive-text text-sm mt-1">
                                Customize how the app looks on your device
                            </p>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-input-bg border border-accent/20 hover:border-accent transition-all duration-300"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun size={20} className="text-accent" />
                                    <span className="text-white">Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <Moon size={20} className="text-accent" />
                                    <span className="text-white">Dark Mode</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Settings;
