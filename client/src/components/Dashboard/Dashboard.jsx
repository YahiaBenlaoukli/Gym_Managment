import React from "react";
import { useState } from "react";
import styles from "./Dashboard.module.css";
import Navbar from "../Navbar/Navbar.jsx";
import api from "../../services/api";

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
        <div className={styles.dashboard}>
            <Navbar />
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardTitle}>Product Management</h1>
                    <p className={styles.dashboardSubtitle}>Manage and view products</p>
                </div>

                <div className={styles.dashboardContent}>
                    <div className={styles.apiSection}>
                        <h2 className={styles.sectionTitle}>Product APIs</h2>

                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.apiButton}
                                onClick={handleShowAllProducts}
                                disabled={loading}
                            >
                                <span>Show All Products</span>
                            </button>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Select Category</label>
                            <div className={styles.input}>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className={styles.selectInput}
                                >
                                    <option value="">-- Select a category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className={styles.apiButton}
                                onClick={handleShowProductsByCategory}
                                disabled={loading || !selectedCategory}
                            >
                                <span>Show Products by Category</span>
                            </button>
                        </div>

                        {selectedCategory && (
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>
                                    Search in "{selectedCategory}"
                                </label>
                                <div className={styles.input}>
                                    <input
                                        type="text"
                                        placeholder="Enter product name to search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    className={styles.apiButton}
                                    onClick={handleSearchInCategory}
                                    disabled={loading}
                                >
                                    <span>Search in Category</span>
                                </button>
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Product ID</label>
                            <div className={styles.input}>
                                <input
                                    type="text"
                                    placeholder="Enter product ID"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                            </div>
                            <button
                                className={styles.apiButton}
                                onClick={handleShowProductDetails}
                                disabled={loading}
                            >
                                <span>Show Product Details</span>
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className={styles.loadingMessage}>Loading...</div>
                    )}

                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}

                    {products && products.length > 0 && (
                        <div className={styles.resultsSection}>
                            <h2 className={styles.sectionTitle}>Products ({products.length})</h2>
                            <div className={styles.productsGrid}>
                                {products.map((prod) => (
                                    <div key={prod.id} className={styles.productCard}>
                                        <h3 className={styles.productName}>{prod.name}</h3>
                                        {prod.image_path && (
                                            <img
                                                src={prod.image_path}
                                                alt={prod.name}
                                                className={styles.productImage}
                                            />
                                        )}
                                        {prod.category && (
                                            <p className={styles.productCategory}>Category: {prod.category}</p>
                                        )}
                                        {prod.price && (
                                            <p className={styles.productPrice}>Price: ${prod.price}</p>
                                        )}
                                        {prod.description && (
                                            <p className={styles.productDescription}>{prod.description}</p>
                                        )}
                                        <p className={styles.productId}>ID: {prod.id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {product && (
                        <div className={styles.resultsSection}>
                            <h2 className={styles.sectionTitle}>Product Details</h2>
                            <div className={`${styles.productCard} ${styles.detailed}`}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                {product.image_path && (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                )}
                                {product.category && (
                                    <p className={styles.productCategory}>Category: {product.category}</p>
                                )}
                                {product.price && (
                                    <p className={styles.productPrice}>Price: ${product.price}</p>
                                )}
                                {product.description && (
                                    <p className={styles.productDescription}>{product.description}</p>
                                )}
                                <p className={styles.productId}>ID: {product.id}</p>
                            </div>
                        </div>
                    )}

                    {products && products.length === 0 && (
                        <div className={styles.noResults}>No products found</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;