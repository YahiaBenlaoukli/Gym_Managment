import React from "react";
import { useState } from "react";
import Hero from "../../components/Hero/Hero.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import ShopByCategory from "../../components/Categories/Categories.jsx";
import api from "../../services/api.js";

function Dashboard() {
    const categories = [
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Sport",
        "Books",
        "Toys & Games",
        "Food & Beverages",
        "Beauty & Personal Care",
        "Automotive",
        "Health & Wellness"
    ];

    const [selectedCategory, setSelectedCategory] = useState("");
    const [category, setCategory] = useState("");
    const [productId, setProductId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] pb-10 px-2.5 sm:px-5">
            <Navbar />
            <Hero />
            <ShopByCategory />S
            <div className="max-w-6xl mx-auto py-10 px-5 sm:px-10 md:py-15 lg:py-20">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2.5 drop-shadow-[0_0_20px_rgba(255,235,59,0.3)] tracking-tight">
                        Product Management
                    </h1>
                    <p className="text-inactive-text text-base sm:text-lg">
                        Manage and view products
                    </p>
                </div>

                <div className="flex flex-col gap-6 sm:gap-7.5">
                    <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-6 sm:p-7.5 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)] tracking-tight border-b-2 border-accent pb-2.5">
                            Product APIs
                        </h2>

                        <div className="mb-5">
                            <button
                                className="w-full h-12 sm:h-14 bg-accent text-secondary rounded-full text-sm sm:text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                                onClick={handleShowAllProducts}
                                disabled={loading}
                            >
                                <span className="relative z-10">Show All Products</span>
                            </button>
                        </div>

                        <div className="mb-5">
                            <label className="block text-white text-sm sm:text-base font-semibold mb-2.5">
                                Select Category
                            </label>
                            <div className="flex items-center w-full h-14 sm:h-16 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden mb-4 focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-5 pr-12 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23b0b0b0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_20px_center] bg-[length:20px]"
                                >
                                    <option value="" className="bg-input-bg text-white">-- Select a category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-input-bg text-white">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="w-full h-12 sm:h-14 bg-accent text-secondary rounded-full text-sm sm:text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                                onClick={handleShowProductsByCategory}
                                disabled={loading || !selectedCategory}
                            >
                                <span className="relative z-10">Show Products by Category</span>
                            </button>
                        </div>

                        {selectedCategory && (
                            <div className="mb-5">
                                <label className="block text-white text-sm sm:text-base font-semibold mb-2.5">
                                    Search in "{selectedCategory}"
                                </label>
                                <div className="flex items-center w-full h-14 sm:h-16 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden mb-4 focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                                    <input
                                        type="text"
                                        placeholder="Enter product name to search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-5 placeholder:text-inactive-text relative z-10"
                                    />
                                </div>
                                <button
                                    className="w-full h-12 sm:h-14 bg-accent text-secondary rounded-full text-sm sm:text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                                    onClick={handleSearchInCategory}
                                    disabled={loading}
                                >
                                    <span className="relative z-10">Search in Category</span>
                                </button>
                            </div>
                        )}

                        <div className="mb-5">
                            <label className="block text-white text-sm sm:text-base font-semibold mb-2.5">
                                Product ID
                            </label>
                            <div className="flex items-center w-full h-14 sm:h-16 bg-input-bg rounded-lg border-2 border-transparent transition-all duration-300 relative overflow-hidden mb-4 focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(255,235,59,0.3)]">
                                <input
                                    type="text"
                                    placeholder="Enter product ID"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm sm:text-base px-5 placeholder:text-inactive-text relative z-10"
                                />
                            </div>
                            <button
                                className="w-full h-12 sm:h-14 bg-accent text-secondary rounded-full text-sm sm:text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] active:translate-y-0 active:shadow-[0_5px_15px_rgba(255,235,59,0.3)] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                                onClick={handleShowProductDetails}
                                disabled={loading}
                            >
                                <span className="relative z-10">Show Product Details</span>
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center text-accent text-base sm:text-lg font-semibold py-5 bg-[rgba(255,235,59,0.1)] rounded-lg border border-accent">
                            Loading...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-[#ff4757] text-sm sm:text-base font-semibold py-5 bg-[rgba(255,71,87,0.1)] rounded-lg border border-[#ff4757]">
                            {error}
                        </div>
                    )}

                    {products && products.length > 0 && (
                        <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-6 sm:p-7.5 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                            <h2 className="text-white text-xl sm:text-2xl font-bold mb-5 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)] tracking-tight border-b-2 border-accent pb-2.5">
                                Products ({products.length})
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                                {products.map((prod) => (
                                    <div key={prod.id} className="bg-input-bg border-2 border-accent/20 rounded-2xl p-5 transition-all duration-300 hover:border-accent hover:shadow-[0_10px_25px_rgba(255,235,59,0.3)] hover:-translate-y-1">
                                        <h3 className="text-white text-lg sm:text-xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] tracking-tight">
                                            {prod.name}
                                        </h3>
                                        {prod.image_path && (
                                            <img
                                                src={prod.image_path}
                                                alt={prod.name}
                                                className="w-full h-auto rounded-lg mb-4 max-h-[300px] object-cover"
                                            />
                                        )}
                                        {prod.category && (
                                            <p className="text-inactive-text text-sm sm:text-base mb-2.5">
                                                Category: {prod.category}
                                            </p>
                                        )}
                                        {prod.price && (
                                            <p className="text-accent text-base sm:text-lg font-semibold mb-2.5">
                                                Price: ${prod.price}
                                            </p>
                                        )}
                                        {prod.description && (
                                            <p className="text-white text-sm sm:text-base leading-relaxed mb-2.5">
                                                {prod.description}
                                            </p>
                                        )}
                                        <p className="text-inactive-text text-xs sm:text-sm mt-2.5 pt-2.5 border-t border-accent/20">
                                            ID: {prod.id}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {product && (
                        <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-6 sm:p-7.5 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                            <h2 className="text-white text-xl sm:text-2xl font-bold mb-5 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)] tracking-tight border-b-2 border-accent pb-2.5">
                                Product Details
                            </h2>
                            <div className="bg-input-bg border-2 border-accent/20 rounded-2xl p-5 max-w-2xl mx-auto transition-all duration-300 hover:border-accent hover:shadow-[0_10px_25px_rgba(255,235,59,0.3)] hover:-translate-y-1">
                                <h3 className="text-white text-lg sm:text-xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,235,59,0.3)] tracking-tight">
                                    {product.name}
                                </h3>
                                {product.image_path && (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="w-full h-auto rounded-lg mb-4 max-h-[300px] object-cover"
                                    />
                                )}
                                {product.category && (
                                    <p className="text-inactive-text text-sm sm:text-base mb-2.5">
                                        Category: {product.category}
                                    </p>
                                )}
                                {product.price && (
                                    <p className="text-accent text-base sm:text-lg font-semibold mb-2.5">
                                        Price: ${product.price}
                                    </p>
                                )}
                                {product.description && (
                                    <p className="text-white text-sm sm:text-base leading-relaxed mb-2.5">
                                        {product.description}
                                    </p>
                                )}
                                <p className="text-inactive-text text-xs sm:text-sm mt-2.5 pt-2.5 border-t border-accent/20">
                                    ID: {product.id}
                                </p>
                            </div>
                        </div>
                    )}

                    {products && products.length === 0 && (
                        <div className="text-center text-inactive-text text-base sm:text-lg py-10 bg-[rgba(26,26,26,0.95)] rounded-2xl border border-accent/20">
                            No products found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;