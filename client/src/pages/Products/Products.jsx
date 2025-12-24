import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Filters state
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        "All",
        "Outdoor Sports",
        "Indoor Sports & Fitness",
        "Water Sports",
        "Winter Sports",
        "Team Sports",
        "Racket Sports",
        "Wellness & Recovery",
        "Men's Apparel & Footwear",
        "Women's Apparel & Footwear",
        "Kids' Sports & Apparel",
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("product/showAllProducts");
                const allProducts = res.data.products || [];
                setProducts(allProducts);
                setFilteredProducts(allProducts);

                // Calculate max price
                if (allProducts.length > 0) {
                    const maxPrice = Math.max(...allProducts.map(p => p.current_price || p.price || 0));
                    setPriceRange(prev => ({ ...prev, max: Math.ceil(maxPrice) + 100 })); // Add buffer
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        // Filter by Category
        if (selectedCategory !== "All") {
            result = result.filter((product) => product.category === selectedCategory);
        }

        // Filter by Price
        result = result.filter((product) => {
            const price = product.current_price || product.price || 0;
            return price >= priceRange.min && price <= priceRange.max;
        });

        setFilteredProducts(result);
    }, [selectedCategory, priceRange, products]);

    const handleProductClick = (productId) => {
        navigate(`/product?id=${encodeURIComponent(productId)}`);
    };

    const clearFilters = () => {
        setSelectedCategory("All");
        setPriceRange({ min: 0, max: 10000 });
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-primary">
                <p className="text-xl text-gray-900 dark:text-text-color animate-pulse">
                    Loading products...
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="flex flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 gap-8">
                {/* Mobile Filter Toggle */}
                <button
                    className="lg:hidden fixed bottom-4 right-4 z-50 bg-yellow-500 text-white p-3 rounded-full shadow-lg"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter size={24} />
                </button>

                {/* Sidebar Filters */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#1a1a1a] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:bg-transparent lg:w-1/4
                    ${showFilters ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="p-6 h-full overflow-y-auto lg:h-auto lg:overflow-visible lg:p-0">
                        <div className="flex justify-between items-center lg:hidden mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Filters</h2>
                            <button onClick={() => setShowFilters(false)}>
                                <X className="dark:text-white" />
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 lg:shadow-sm border border-gray-100 dark:border-white/5 space-y-8">
                            {/* Categories */}
                            {/* Categories */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                                ${selectedCategory === category
                                                    ? 'bg-yellow-500 text-white shadow-md transform scale-105'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Range</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            placeholder="Min"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            placeholder="Max"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="10"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>$0</span>
                                        <span>$2000+</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </aside>
                {/* Overlay for mobile */}
                {showFilters && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setShowFilters(false)}
                    />
                )}

                {/* Product Grid */}
                <main className="flex-1">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            All Products
                            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                ({filteredProducts.length} items)
                            </span>
                        </h1>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/5">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-yellow-600 dark:text-yellow-400 hover:underline"
                            >
                                Clear filters to see all products
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-4 group hover:border-yellow-500 dark:hover:border-yellow-500/50 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(255,235,59,0.1)] transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3]">
                                        {(prod.discount || (prod.old_price && prod.current_price && Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100))) > 0 && (
                                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                                {prod.discount || Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100)}% OFF
                                            </div>
                                        )}
                                        <img
                                            src={
                                                prod?.image_path && process.env.REACT_APP_PHOTO_URL
                                                    ? `${process.env.REACT_APP_PHOTO_URL}${prod.image_path}`
                                                    : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800"
                                            }
                                            alt={prod.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <button
                                                onClick={() => handleProductClick(prod.id)}
                                                className="w-full bg-yellow-500 text-white py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-gray-900 dark:text-white font-bold text-lg line-clamp-1" title={prod.name}>
                                                    {prod.name}
                                                </h3>
                                                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                                                        ${prod.current_price || prod.price}
                                                    </span>
                                                    {(prod.old_price || prod.originalPrice) && (
                                                        <span className="text-gray-400 text-xs line-through">
                                                            ${prod.old_price || prod.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 h-8">
                                                {prod.description}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            <span className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                                {prod.category}
                                            </span>
                                            <span className={`${prod.stock > 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                                {prod.stock > 0 ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Products;
