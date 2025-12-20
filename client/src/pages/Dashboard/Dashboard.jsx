import React from "react";
import { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ShopByCategory from "../../components/Categories/Categories.jsx";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import api from "../../services/api.js";

function Dashboard() {
    const categories = [
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

    const [selectedCategory, setSelectedCategory] = useState("");
    const [category, setCategory] = useState("");
    const [productId, setProductId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (products && products.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 3));
        }
    };

    const prevSlide = () => {
        if (products && products.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3));
        }
    };

    useEffect(() => {
        handleGetDiscountedProducts();
    }, []);

    const handleGetDiscountedProducts = async () => {
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.get("product/getDiscountedProducts");
            setProducts(res.data.discountedProducts);
            console.log("Discounted products:", res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch discounted products");
            console.error("Error fetching discounted products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAllProducts = async () => {
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.get("product/showAllProducts");
            setProducts(res.data.products);
            console.log("All products:", res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch products");
            console.error("Error fetching all products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowProductsByCategory = async () => {
        if (!selectedCategory) {
            setError("Please select a category");
            return;
        }
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.post("product/showProductsByCategory", { category: selectedCategory });
            setProducts(res.data.products);
            console.log("Products by category:", res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch products by category");
            console.error("Error fetching products by category:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInCategory = async () => {
        if (!selectedCategory) {
            setError("Please select a category first");
            return;
        }
        if (!searchQuery.trim()) {
            setError("Please enter a search query");
            return;
        }
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.post("product/searchProductsByName", { q: searchQuery });
            // Filter results by selected category
            const filteredProducts = res.data.products.filter(
                prod => prod.category === selectedCategory
            );
            setProducts(filteredProducts);
            console.log("Search results in category:", filteredProducts);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to search products");
            console.error("Error searching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowProductDetails = async () => {
        if (!productId.trim()) {
            setError("Please enter a product ID");
            return;
        }
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.post("product/showProductDetails", { productId });
            setProduct(res.data.product);
            console.log("Product details:", res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch product details");
            console.error("Error fetching product details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchProductsByName = async () => {
        if (!searchQuery.trim()) {
            setError("Please enter a search query");
            return;
        }
        setLoading(true);
        setError(null);
        setProducts(null);
        setProduct(null);
        try {
            const res = await api.post("product/searchProductsByName", { q: searchQuery });
            setProducts(res.data.products);
            console.log("Search results:", res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to search products");
            console.error("Error searching products:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00]">
            <Navbar />
            <Hero />
            <div className="transform scale-[0.8] origin-top">
                <ShopByCategory />
                <div className="max-w-7xl mx-auto py-10 px-5 sm:px-10">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-white text-3xl font-bold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                                <Tag className="text-accent" />
                                Special Offers
                            </h2>
                            <p className="text-inactive-text mt-2">Grab our limit-time discounts on premium gear</p>
                        </div>

                        {products && products.length > 3 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 rounded-full bg-input-bg border border-accent/20 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-all duration-300"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 rounded-full bg-input-bg border border-accent/20 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-all duration-300"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-[400px] bg-input-bg/50 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-[#ff4757] py-10 bg-[rgba(255,71,87,0.1)] rounded-xl border border-[#ff4757]/30">
                            {error}
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="overflow-hidden relative">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {products.map((prod) => (
                                    <div key={prod.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                                        <div className="bg-[rgba(26,26,26,0.95)] border border-accent/20 rounded-2xl p-4 h-full group hover:border-accent hover:shadow-[0_0_20px_rgba(255,235,59,0.15)] transition-all duration-300">
                                            <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3]">
                                                {(prod.discount || (prod.old_price && prod.current_price && Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100))) > 0 && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                                        {prod.discount || Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100)}% OFF
                                                    </div>
                                                )}
                                                <img
                                                    src={prod.image_path || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800"}
                                                    alt={prod.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                    <button
                                                        onClick={() => {
                                                            setProductId(prod.id);
                                                            handleShowProductDetails();
                                                        }}
                                                        className="w-full bg-accent text-secondary py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white font-bold text-lg line-clamp-1">{prod.name}</h3>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-accent font-bold">${prod.current_price || prod.price}</span>
                                                        {(prod.old_price || prod.originalPrice) && (
                                                            <span className="text-inactive-text text-xs line-through">${prod.old_price || prod.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-inactive-text text-sm line-clamp-2 min-h-[40px]">{prod.description}</p>
                                                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-inactive-text">
                                                    <span>{prod.category}</span>
                                                    <span>{prod.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-inactive-text py-10">
                            No special offers available at the moment.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;