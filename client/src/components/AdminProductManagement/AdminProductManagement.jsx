import { useEffect } from 'react';
import React, { useState } from 'react';
import api from '../../services/api';

const AdminProductManagement = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

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

    // Add Product State
    const [addProductData, setAddProductData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock: ''
    });

    // Selected Product for Edit/Delete
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);

    // Dashboard Stats
    const [productsCount, setProductsCount] = useState(0);
    const [productsLowStock, setProductsLowStock] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]); // <-- ADDED STATE

    // Update Modal State
    const [updateField, setUpdateField] = useState('');
    const [updateValue, setUpdateValue] = useState('');

    // Discount Modal State
    const [discountPrice, setDiscountPrice] = useState('');


    useEffect(() => {
        try {
            fetchDashboardStats();
        } catch (error) {
            setError('Failed to fetch dashboard stats');
        }
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await api.get('admin/product/dashboardStats');
            setProductsCount(res.data.totalProducts || 0);
            setProductsLowStock(res.data.lowStockCount || 0);
            setLowStockProducts(res.data.lowStockList || []); // <-- UPDATED to store list
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all products
    const fetchAllProducts = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await api.get('admin/product/showAllProducts');
            setProducts(res.data.products || []);
            setActiveView('products');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Search products
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a search query');
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await api.post('admin/product/searchProductsByName', { q: searchQuery });
            setProducts(res.data.products || []);
            setActiveView('products');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    // Add Product
    const handleAddProductChange = (e) => {
        setAddProductData({ ...addProductData, [e.target.name]: e.target.value });
    };

    const handleAddProductSubmit = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.post('/admin/product/adminAddProduct', addProductData);
            setMessage(response.data.message);
            setAddProductData({ name: '', category: '', price: '', description: '', stock: '' });
            setTimeout(() => setMessage(null), 3000);
            fetchDashboardStats(); // Refresh stats after adding
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    // Delete Product
    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteProduct = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.delete('/admin/product/adminDeleteProduct', {
                data: { productId: selectedProduct.id }
            });
            setMessage(response.data.message);
            setShowDeleteModal(false);
            setSelectedProduct(null);
            fetchAllProducts();
            fetchDashboardStats(); // Refresh stats after deleting
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    // Update Product
    const openUpdateModal = (product) => {
        setSelectedProduct(product);
        setUpdateField('');
        setUpdateValue('');
        setShowUpdateModal(true);
    };

    const handleUpdateProduct = async () => {
        if (!updateField || !updateValue) {
            setError('Please select a field and enter a new value');
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.put('/admin/product/adminUpdateProduct', {
                productId: selectedProduct.id,
                field: updateField,
                newattributes: updateValue
            });
            setMessage(response.data.message);
            setShowUpdateModal(false);
            setSelectedProduct(null);
            fetchAllProducts();
            fetchDashboardStats(); // Refresh stats after updating
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error updating product');
        } finally {
            setLoading(false);
        }
    };

    // Discount Product
    const openDiscountModal = (product) => {
        setSelectedProduct(product);
        setDiscountPrice('');
        setShowDiscountModal(true);
    };

    const handleDiscountProduct = async () => {
        if (!discountPrice) {
            setError('Please enter a new price');
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.put('/admin/product/adminDiscountProduct', {
                productId: selectedProduct.id,
                newprice: discountPrice,
                oldprice: selectedProduct.current_price
            });
            setMessage(response.data.message);
            setShowDiscountModal(false);
            setSelectedProduct(null);
            fetchAllProducts();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error discounting product');
        } finally {
            setLoading(false);
        }
    };

    // --- NEW HANDLERS ---

    /**
     * Sets the view back to the dashboard and refreshes stats.
     */
    const showDashboard = () => {
        setActiveView('dashboard');
        fetchDashboardStats();
    };

    /**
     * Sets the products list to only low stock items and shows the product table.
     */
    const showLowStockProducts = () => {
        setProducts(lowStockProducts);
        setActiveView('products');
    };

    // ----------------------

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00]">
            {/* Navbar */}
            <nav className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border-b border-accent/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* --- ADDED DASHBOARD BUTTON --- */}
                            <button
                                onClick={showDashboard}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'dashboard'
                                    ? 'bg-accent text-secondary shadow-[0_0_15px_rgba(255,235,59,0.4)]'
                                    : 'bg-transparent text-white border-2 border-accent/30 hover:border-accent'
                                    }`}
                            >
                                Dashboard
                            </button>
                            {/* ----------------------------- */}
                            <button
                                onClick={() => setActiveView('add')}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'add'
                                    ? 'bg-accent text-secondary shadow-[0_0_15px_rgba(255,235,59,0.4)]'
                                    : 'bg-transparent text-white border-2 border-accent/30 hover:border-accent'
                                    }`}
                            >
                                Add Product
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchAllProducts}
                                disabled={loading}
                                className="px-6 py-2.5 bg-accent text-secondary rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,235,59,0.4)] disabled:opacity-60"
                            >
                                Show All Products
                            </button>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-64 h-10 bg-input-bg border-2 border-transparent rounded-lg px-4 text-white text-sm outline-none transition-all duration-300 focus:border-accent placeholder:text-inactive-text"
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-accent text-secondary rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,235,59,0.4)] disabled:opacity-60"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-10 px-5">
                {/* Status Messages */}
                {loading && (
                    <div className="text-center text-accent text-base font-semibold py-5 bg-[rgba(255,235,59,0.1)] rounded-lg border border-accent mb-6">
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="text-center text-[#ff4757] text-sm font-semibold py-5 bg-[rgba(255,71,87,0.1)] rounded-lg border border-[#ff4757] mb-6">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="text-center text-[#2ecc71] text-sm font-semibold py-5 bg-[rgba(46,204,113,0.1)] rounded-lg border border-[#2ecc71] mb-6">
                        {message}
                    </div>
                )}

                {/* Dashboard View */}
                {activeView === 'dashboard' && (
                    <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                        <h1 className="text-white text-3xl font-bold mb-6 drop-shadow-[0_0_20px_rgba(255,235,59,0.3)]">
                            Admin Dashboard
                        </h1>
                        <p className="text-inactive-text text-lg mb-8">
                            Welcome to the product management system. Use the navigation above to get started.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-input-bg border-2 border-accent/20 rounded-xl p-6 text-center hover:border-accent transition-all duration-300">
                                <div className="text-accent text-4xl font-bold mb-2">{productsCount}</div>
                                <div className="text-white text-sm">Total Products</div>
                            </div>

                            {/* --- UPDATED LOW STOCK CARD --- */}
                            <div
                                className="bg-input-bg border-2 border-accent/20 rounded-xl p-6 text-center hover:border-accent transition-all duration-300 cursor-pointer"
                                onClick={showLowStockProducts}
                            >
                                <div className="text-accent text-4xl font-bold mb-2">{productsLowStock}</div>
                                <div className="text-white text-sm">Low Stock Items</div>
                            </div>
                            {/* ------------------------------ */}

                            <div className="bg-input-bg border-2 border-accent/20 rounded-xl p-6 text-center hover:border-accent transition-all duration-300">
                                <div className="text-accent text-4xl font-bold mb-2">{categories.length}</div>
                                <div className="text-white text-sm">Categories</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Product View */}
                {activeView === 'add' && (
                    <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                        <h2 className="text-white text-2xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)] border-b-2 border-accent pb-2.5">
                            Add New Product
                        </h2>
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2.5">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter product name"
                                    value={addProductData.name}
                                    onChange={handleAddProductChange}
                                    className="w-full h-14 bg-input-bg border-2 border-transparent rounded-lg px-5 text-white text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)] placeholder:text-inactive-text"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2.5">Category</label>
                                <select
                                    name="category"
                                    value={addProductData.category}
                                    onChange={handleAddProductChange}
                                    className="w-full h-14 bg-input-bg border-2 border-transparent rounded-lg px-5 pr-12 text-white text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23b0b0b0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_20px_center] bg-[length:20px]"
                                >
                                    <option value="" className="bg-input-bg text-white">-- Select a category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-input-bg text-white">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2.5">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Enter price"
                                    value={addProductData.price}
                                    onChange={handleAddProductChange}
                                    className="w-full h-14 bg-input-bg border-2 border-transparent rounded-lg px-5 text-white text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)] placeholder:text-inactive-text"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2.5">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Enter product description"
                                    value={addProductData.description}
                                    onChange={handleAddProductChange}
                                    className="w-full min-h-[120px] bg-input-bg border-2 border-transparent rounded-lg px-5 py-4 text-white text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)] placeholder:text-inactive-text resize-vertical"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2.5">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Enter stock quantity"
                                    value={addProductData.stock}
                                    onChange={handleAddProductChange}
                                    className="w-full h-14 bg-input-bg border-2 border-transparent rounded-lg px-5 text-white text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(255,235,59,0.3)] placeholder:text-inactive-text"
                                />
                            </div>
                            <button
                                onClick={handleAddProductSubmit}
                                disabled={loading}
                                className="w-full h-14 bg-accent text-secondary rounded-full text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Table View */}
                {activeView === 'products' && (
                    <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-accent/20 rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                        <h2 className="text-white text-2xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(255,235,59,0.3)] border-b-2 border-accent pb-2.5">
                            Products ({products.length})
                        </h2>
                        {products.length === 0 ? (
                            <div className="text-center text-inactive-text text-lg py-10">
                                No products found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-accent/30">
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">ID</th>
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">Name</th>
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">Category</th>
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">Price</th>
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">Stock</th>
                                            <th className="text-left text-white text-sm font-semibold py-4 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-accent/10 hover:bg-input-bg/50 transition-colors">
                                                <td className="text-inactive-text text-sm py-4 px-4">{product.id}</td>
                                                <td className="text-white text-sm py-4 px-4">{product.name}</td>
                                                <td className="text-inactive-text text-sm py-4 px-4">{product.category}</td>
                                                <td className="text-accent text-sm font-semibold py-4 px-4">${product.current_price}</td>
                                                <td className={`text-sm py-4 px-4 ${product.stock < 10 ? 'text-[#ff4757] font-bold' : 'text-white'}`}>{product.stock}</td>
                                                <td className="text-sm py-4 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openUpdateModal(product)}
                                                            className="px-4 py-2 bg-accent text-secondary rounded-lg text-xs font-semibold hover:shadow-[0_0_10px_rgba(255,235,59,0.4)] transition-all"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => openDiscountModal(product)}
                                                            className="px-4 py-2 bg-[#3498db] text-white rounded-lg text-xs font-semibold hover:shadow-[0_0_10px_rgba(52,152,219,0.4)] transition-all"
                                                        >
                                                            Discount
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(product)}
                                                            className="px-4 py-2 bg-[#ff4757] text-white rounded-lg text-xs font-semibold hover:shadow-[0_0_10px_rgba(255,71,87,0.4)] transition-all"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[rgba(26,26,26,0.98)] border-2 border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                        <h3 className="text-white text-xl font-bold mb-4">Delete Product</h3>
                        <p className="text-inactive-text mb-6">
                            Are you sure you want to delete <span className="text-accent font-semibold">{selectedProduct.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteProduct}
                                disabled={loading}
                                className="flex-1 h-12 bg-[#ff4757] text-white rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(255,71,87,0.4)] disabled:opacity-60"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 h-12 bg-transparent border-2 border-accent/30 text-white rounded-full text-sm font-semibold transition-all hover:border-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[rgba(26,26,26,0.98)] border-2 border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                        <h3 className="text-white text-xl font-bold mb-4">Update Product</h3>
                        <p className="text-inactive-text mb-6">
                            Updating: <span className="text-accent font-semibold">{selectedProduct.name}</span>
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">Field to Update</label>
                                <select
                                    value={updateField}
                                    onChange={(e) => setUpdateField(e.target.value)}
                                    className="w-full h-12 bg-input-bg border-2 border-transparent rounded-lg px-4 text-white text-sm outline-none transition-all focus:border-accent"
                                >
                                    <option value="">Select a field</option>
                                    <option value="name">Name</option>
                                    <option value="category">Category</option>
                                    <option value="price">Price</option>
                                    <option value="description">Description</option>
                                    <option value="stock">Stock</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white text-sm font-semibold mb-2">New Value</label>
                                {updateField === 'category' ? (
                                    <select
                                        value={updateValue}
                                        onChange={(e) => setUpdateValue(e.target.value)}
                                        className="w-full h-12 bg-input-bg border-2 border-transparent rounded-lg px-4 text-white text-sm outline-none transition-all focus:border-accent"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={updateValue}
                                        onChange={(e) => setUpdateValue(e.target.value)}
                                        placeholder="Enter new value"
                                        className="w-full h-12 bg-input-bg border-2 border-transparent rounded-lg px-4 text-white text-sm outline-none transition-all focus:border-accent placeholder:text-inactive-text"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleUpdateProduct}
                                disabled={loading}
                                className="flex-1 h-12 bg-accent text-secondary rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(255,235,59,0.4)] disabled:opacity-60"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="flex-1 h-12 bg-transparent border-2 border-accent/30 text-white rounded-full text-sm font-semibold transition-all hover:border-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Discount Modal */}
            {showDiscountModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[rgba(26,26,26,0.98)] border-2 border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                        <h3 className="text-white text-xl font-bold mb-4">Apply Discount</h3>
                        <p className="text-inactive-text mb-2">
                            Product: <span className="text-accent font-semibold">{selectedProduct.name}</span>
                        </p>
                        <p className="text-inactive-text mb-6">
                            Current Price: <span className="text-white font-semibold">${selectedProduct.current_price}</span>
                        </p>
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">New Discounted Price</label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                placeholder="Enter new price"
                                className="w-full h-12 bg-input-bg border-2 border-transparent rounded-lg px-4 text-white text-sm outline-none transition-all focus:border-accent placeholder:text-inactive-text"
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleDiscountProduct}
                                disabled={loading}
                                className="flex-1 h-12 bg-accent text-secondary rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(255,235,59,0.4)] disabled:opacity-60"
                            >
                                Apply Discount
                            </button>
                            <button
                                onClick={() => setShowDiscountModal(false)}
                                className="flex-1 h-12 bg-transparent border-2 border-accent/30 text-white rounded-full text-sm font-semibold transition-all hover:border-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductManagement;