import React, { useState, useEffect, useRef } from 'react';
import {
    Mountain,
    Dumbbell,
    Waves,
    Snowflake,
    Users,
    Gamepad2,
    HeartPulse,
    Shirt,
    Sparkles,
    Baby
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ShopByCategory() {
    const navigate = useNavigate();
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [visibleCards, setVisibleCards] = useState([]);
    const cardRefs = useRef([]);

    const categories = [
        {
            name: "Outdoor Sports",
            icon: Mountain,
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop"
        },
        {
            name: "Indoor Sports & Fitness",
            icon: Dumbbell,
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
        },
        {
            name: "Water Sports",
            icon: Waves,
            image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=300&fit=crop"
        },
        {
            name: "Winter Sports",
            icon: Snowflake,
            image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?h=300&w=400&fit=crop"
        },
        {
            name: "Team Sports",
            icon: Users,
            image: "https://plus.unsplash.com/premium_photo-1661963855258-218cbf2dadaa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?fit=crop"
        },
        {
            name: "Racket Sports",
            icon: Gamepad2,
            image: "https://images.unsplash.com/photo-1708312604109-16c0be9326cd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&fit=crop"
        },
        {
            name: "Wellness & Recovery",
            icon: HeartPulse,
            image: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&fit=crop"
        },
        {
            name: "Men's Apparel & Footwear",
            icon: Shirt,
            image: "https://images.unsplash.com/photo-1679768763201-e07480531b49?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&fit=crop"
        },
        {
            name: "Women's Apparel & Footwear",
            icon: Sparkles,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1220&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&&fit=crop"
        },
        {
            name: "Kids' Sports & Apparel",
            icon: Baby,
            image: "https://images.unsplash.com/photo-1544333323-ec9ed3218dd1?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&fit=crop"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleCards((prev) => {
                            if (!prev.includes(index)) {
                                setTimeout(() => {
                                    setVisibleCards((p) => [...p, index]);
                                }, index * 150); // 150ms delay per card

                                return prev; // prevent immediate show
                            }
                            return prev;
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -70px 0px'

            }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            cardRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const handleCategoryClick = (categoryName) => {
        navigate(`/search?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="min-h-screen pb-10 px-2.5 sm:px-5">
            <div className="max-w-[1400px] mx-auto py-10 px-2.5 sm:px-10 md:py-15 lg:py-20">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight">
                        Might Interest You
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const isVisible = visibleCards.includes(index);

                        return (
                            <div
                                key={category.name}
                                ref={(el) => (cardRefs.current[index] = el)}
                                data-index={index}
                                className={`relative group cursor-pointer bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border-2 border-accent/20 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent hover:shadow-[0_10px_25px_rgba(255,235,59,0.3)] hover:-translate-y-1 ${isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-20'
                                    }`}
                                onMouseEnter={() => setHoveredCategory(index)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,235,59,0.4)] to-[rgba(26,26,26,0.8)] group-hover:from-[rgba(255,235,59,0.5)] group-hover:to-[rgba(26,26,26,0.7)] transition-all duration-300"></div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
                                        <div className={`transform transition-all duration-500 ${hoveredCategory === index ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                                            <Icon className="w-14 h-14 text-accent mb-3 drop-shadow-[0_0_10px_rgba(255,235,59,0.6)]" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-white text-xl sm:text-2xl font-bold text-center drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] tracking-tight">
                                            {category.name}
                                        </h3>

                                        {/* Hover Arrow */}
                                        <div className={`mt-3 transform transition-all duration-300 ${hoveredCategory === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                            <span className="text-accent text-sm font-semibold flex items-center gap-2">
                                                Explore Now
                                                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`absolute inset-0 transform transition-transform duration-1000 ${hoveredCategory === index ? 'translate-x-full' : '-translate-x-full'}`}>
                                        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent skew-x-12"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ShopByCategory;