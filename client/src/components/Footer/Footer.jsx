import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-text-color border-t-2 border-accent/30">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <FaDumbbell size={32} className="text-accent" />
                            <h3 className="text-xl font-bold text-text-color">FitnessCity</h3>
                        </div>
                        <p className="text-inactive-text text-sm leading-relaxed">
                            Your ultimate destination for fitness equipment, courses, and wellness products.
                            Transform your fitness journey with quality gear and expert guidance.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-text-color mb-4 border-b border-accent/30 pb-2">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="text-inactive-text hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                                >
                                    <span className="text-accent">→</span> Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/courses"
                                    className="text-inactive-text hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                                >
                                    <span className="text-accent">→</span> Courses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/schedule"
                                    className="text-inactive-text hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                                >
                                    <span className="text-accent">→</span> Schedule
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/payments"
                                    className="text-inactive-text hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                                >
                                    <span className="text-accent">→</span> Payments
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/settings"
                                    className="text-inactive-text hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                                >
                                    <span className="text-accent">→</span> Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-text-color mb-4 border-b border-accent/30 pb-2">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-inactive-text text-sm">
                                <MdEmail className="text-accent text-lg mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:support@fitnesscity.com"
                                    className="hover:text-accent transition-colors duration-300"
                                >
                                    support@fitnesscity.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-inactive-text text-sm">
                                <MdPhone className="text-accent text-lg mt-0.5 flex-shrink-0" />
                                <a
                                    href="tel:+213558905104"
                                    className="hover:text-accent transition-colors duration-300"
                                >
                                    +213 558905104
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-inactive-text text-sm">
                                <MdLocationOn className="text-accent text-lg mt-0.5 flex-shrink-0" />
                                <span>
                                    Kouba<br />
                                    Algiers, Algeria
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-text-color mb-4 border-b border-accent/30 pb-2">
                            Follow Us
                        </h3>
                        <p className="text-inactive-text text-sm mb-4">
                            Stay connected with us on social media for updates, tips, and exclusive offers!
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <FaFacebook size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
                                aria-label="YouTube"
                            >
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-accent/30 pt-6 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-inactive-text text-sm text-center md:text-left">
                            © {currentYear} FitnessCity. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link
                                to="/privacy-policy"
                                className="text-inactive-text hover:text-accent transition-colors duration-300"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms-of-service"
                                className="text-inactive-text hover:text-accent transition-colors duration-300"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/refund-policy"
                                className="text-inactive-text hover:text-accent transition-colors duration-300"
                            >
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;