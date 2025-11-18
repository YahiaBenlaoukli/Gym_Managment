import React, { useState } from 'react';
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
            image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop"
        },
        {
            name: "Team Sports",
            icon: Users,
            image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop"
        },
        {
            name: "Racket Sports",
            icon: Gamepad2, // Good alternative for sports
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431f8?w=400&h=300&fit=crop"
        },
        {
            name: "Wellness & Recovery",
            icon: HeartPulse,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
        },
        {
            name: "Men's Apparel & Footwear",
            icon: Shirt,
            image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=300&fit=crop"
        },
        {
            name: "Women's Apparel & Footwear",
            icon: Sparkles,
            image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=300&fit=crop"
        },
        {
            name: "Kids' Sports & Apparel",
            icon: Baby,
            image: "https://images.unsplash.com/photo-1506506637031-5f5616792c26?w=400&h=300&fit=crop"
        }
    ];

    const handleCategoryClick = (categoryName) => {
        // Navigate to search page with category as a query parameter
        navigate(`/search?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="min-h-screen pb-10 px-2.5 sm:px-5">
            <div className="max-w-6xl mx-auto py-10 px-5 sm:px-10 md:py-15 lg:py-20">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight">
                        Shop by Category
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={category.name}
                                className="relative group cursor-pointer bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border-2 border-accent/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-[0_10px_25px_rgba(255,235,59,0.3)] hover:-translate-y-1"
                                onMouseEnter={() => setHoveredCategory(index)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                onClick={() => handleCategoryClick(category.name)}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Background Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,235,59,0.4)] to-[rgba(26,26,26,0.8)] group-hover:from-[rgba(255,235,59,0.5)] group-hover:to-[rgba(26,26,26,0.7)] transition-all duration-300"></div>

                                    {/* Content */}
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

                                    {/* Shimmer Effect */}
                                    <div className={`absolute inset-0 transform transition-transform duration-1000 ${hoveredCategory === index ? 'translate-x-full' : '-translate-x-full'}`}>
                                        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent skew-x-12"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}

export default ShopByCategory;