import { useEffect } from 'react';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar';

const AdminProductManagement = () => {
    const [activeView, setActiveView] = useState('products'); // Default to products view
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

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
        "Kids' Sports & Apparel"
    ];

    // Add Product State
    const [addProductData, setAddProductData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock: '',
        images: []
    });

    // Selected Product for Edit/Delete
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);

    // Update Modal State
    const [updateField, setUpdateField] = useState('');
    const [updateValue, setUpdateValue] = useState('');

    // Discount Modal State
    const [discountPrice, setDiscountPrice] = useState('');


    useEffect(() => {
        fetchAllProducts();
    }, []);

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

    // Filter by Category
    const handleCategoryFilter = async (category) => {
        setSelectedCategory(category);
        setSearchQuery(''); // Clear search query when filtering by category

        if (!category) {
            fetchAllProducts();
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await api.post('admin/product/showProductsByCategory', { category });
            setProducts(res.data.products || []);
            setActiveView('products');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch products by category');
        } finally {
            setLoading(false);
        }
    };

    // Add Product
    const handleAddProductChange = (e) => {
        setAddProductData({ ...addProductData, [e.target.name]: e.target.value });
    };
    const handleImageChange = (e) => {
        setAddProductData({
            ...addProductData,
            images: Array.from(e.target.files)
        });
    };

    // Update the submit function to use FormData
    const handleAddProductSubmit = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('name', addProductData.name);
            formData.append('category', addProductData.category);
            formData.append('price', addProductData.price);
            formData.append('description', addProductData.description);
            formData.append('stock', addProductData.stock);

            // Append all images
            addProductData.images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await api.post('/admin/product/adminAddProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            setAddProductData({ name: '', category: '', price: '', description: '', stock: '', images: [] });
            setTimeout(() => setMessage(null), 3000);
            fetchAllProducts(); // Refresh list
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300">
            <AdminNavbar
                showSearch={false}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onSearchSubmit={handleSearch}
                showAddButton={true}
                activeView={activeView}
                setActiveView={setActiveView}
                onRefresh={fetchAllProducts}
            />


            <div className="md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto py-10 px-5">
                    {/* Search Bar & Category Filter */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-64">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                className="w-full h-[50px] bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent/20 rounded-lg px-4 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 dark:focus:border-accent transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23b0b0b0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_16px_center] bg-[length:20px]"
                            >
                                <option value="" className="bg-white dark:bg-input-bg text-gray-900 dark:text-white">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-input-bg text-gray-900 dark:text-white">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-[50px] bg-white dark:bg-[#1a1a0a] border border-gray-200 dark:border-accent/20 rounded-lg py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 dark:focus:border-accent transition-all"
                            />
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-yellow-500 dark:bg-accent text-white dark:text-secondary px-6 h-[50px] rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            Search
                        </button>
                    </div>

                    {/* Status Messages */}
                    {loading && (
                        <div className="text-center text-yellow-600 dark:text-accent text-base font-semibold py-5 bg-yellow-50 dark:bg-[rgba(255,235,59,0.1)] rounded-lg border border-yellow-200 dark:border-accent mb-6">
                            Loading...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-600 dark:text-[#ff4757] text-sm font-semibold py-5 bg-red-50 dark:bg-[rgba(255,71,87,0.1)] rounded-lg border border-red-200 dark:border-[#ff4757] mb-6">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="text-center text-green-600 dark:text-[#2ecc71] text-sm font-semibold py-5 bg-green-50 dark:bg-[rgba(46,204,113,0.1)] rounded-lg border border-green-200 dark:border-[#2ecc71] mb-6">
                            {message}
                        </div>
                    )}

                    {/* Add Product View */}
                    {activeView === 'add' && (
                        <div className="bg-white dark:bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-2xl p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 border-b-2 border-yellow-500 dark:border-accent pb-2.5">
                                Add New Product
                            </h2>
                            <div className="space-y-4 max-w-2xl mx-auto">
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter product name"
                                        value={addProductData.name}
                                        onChange={handleAddProductChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Category</label>
                                    <select
                                        name="category"
                                        value={addProductData.category}
                                        onChange={handleAddProductChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 pr-12 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23b0b0b0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_20px_center] bg-[length:20px]"
                                    >
                                        <option value="" className="bg-white dark:bg-input-bg text-gray-900 dark:text-white">-- Select a category --</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-white dark:bg-input-bg text-gray-900 dark:text-white">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Enter price"
                                        value={addProductData.price}
                                        onChange={handleAddProductChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter product description"
                                        value={addProductData.description}
                                        onChange={handleAddProductChange}
                                        className="w-full min-h-[120px] bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 py-4 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text resize-vertical"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Image</label>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        multiple
                                        name='images'
                                        onChange={handleImageChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent pt-3"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2.5">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="Enter stock quantity"
                                        value={addProductData.stock}
                                        onChange={handleAddProductChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-5 text-gray-900 dark:text-white text-sm outline-none transition-all duration-300 focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text"
                                    />
                                </div>
                                <button
                                    onClick={handleAddProductSubmit}
                                    disabled={loading}
                                    className="w-full h-14 bg-yellow-500 dark:bg-accent text-white dark:text-secondary rounded-full text-base font-semibold uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Add Product
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Table View */}
                    {activeView === 'products' && (
                        <div className="bg-white dark:bg-[rgba(26,26,26,0.95)] backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-2xl p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 border-b-2 border-yellow-500 dark:border-accent pb-2.5">
                                Products ({products.length})
                            </h2>
                            {products.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-inactive-text text-lg py-10">
                                    No products found
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-accent/30">
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">ID</th>
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">Name</th>
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">Category</th>
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">Price</th>
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">Stock</th>
                                                <th className="text-left text-gray-900 dark:text-white text-sm font-semibold py-4 px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id} className="border-b border-gray-100 dark:border-accent/10 hover:bg-gray-50 dark:hover:bg-input-bg/50 transition-colors">
                                                    <td className="text-gray-500 dark:text-inactive-text text-sm py-4 px-4">{product.id}</td>
                                                    <td className="text-gray-900 dark:text-white text-sm py-4 px-4">{product.name}</td>
                                                    <td className="text-gray-500 dark:text-inactive-text text-sm py-4 px-4">{product.category}</td>
                                                    <td className="text-yellow-600 dark:text-accent text-sm font-semibold py-4 px-4">${product.current_price}</td>
                                                    <td className={`text-sm py-4 px-4 ${product.stock < 10 ? 'text-red-600 dark:text-[#ff4757] font-bold' : 'text-gray-900 dark:text-white'}`}>{product.stock}</td>
                                                    <td className="text-sm py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openUpdateModal(product)}
                                                                className="px-4 py-2 bg-yellow-500 dark:bg-accent text-white dark:text-secondary rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => openDiscountModal(product)}
                                                                className="px-4 py-2 bg-[#3498db] text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
                                                            >
                                                                Discount
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(product)}
                                                                className="px-4 py-2 bg-[#ff4757] text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
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
                        <div className="bg-white dark:bg-[rgba(26,26,26,0.98)] border-2 border-gray-200 dark:border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">Delete Product</h3>
                            <p className="text-gray-600 dark:text-inactive-text mb-6">
                                Are you sure you want to delete <span className="text-yellow-600 dark:text-accent font-semibold">{selectedProduct.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDeleteProduct}
                                    disabled={loading}
                                    className="flex-1 h-12 bg-[#ff4757] text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-60"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 h-12 bg-transparent border-2 border-gray-300 dark:border-accent/30 text-gray-700 dark:text-white rounded-full text-sm font-semibold transition-all hover:border-yellow-500 dark:hover:border-accent"
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
                        <div className="bg-white dark:bg-[rgba(26,26,26,0.98)] border-2 border-gray-200 dark:border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">Update Product</h3>
                            <p className="text-gray-600 dark:text-inactive-text mb-6">
                                Updating: <span className="text-yellow-600 dark:text-accent font-semibold">{selectedProduct.name}</span>
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">Field to Update</label>
                                    <select
                                        value={updateField}
                                        onChange={(e) => setUpdateField(e.target.value)}
                                        className="w-full h-12 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-4 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-yellow-500 dark:focus:border-accent"
                                    >
                                        <option value="">Select a field</option>
                                        <option value="name">Name</option>
                                        <option value="category">Category</option>
                                        <option value="current_price">Price</option>
                                        <option value="old_price">Old Price</option>
                                        <option value="description">Description</option>
                                        <option value="stock">Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">New Value</label>
                                    {updateField === 'category' ? (
                                        <select
                                            value={updateValue}
                                            onChange={(e) => setUpdateValue(e.target.value)}
                                            className="w-full h-12 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-4 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-yellow-500 dark:focus:border-accent"
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
                                            className="w-full h-12 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-4 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleUpdateProduct}
                                    disabled={loading}
                                    className="flex-1 h-12 bg-yellow-500 dark:bg-accent text-white dark:text-secondary rounded-full text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-60"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 h-12 bg-transparent border-2 border-gray-300 dark:border-accent/30 text-gray-700 dark:text-white rounded-full text-sm font-semibold transition-all hover:border-yellow-500 dark:hover:border-accent"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {/* Discount Modal */}
            {showDiscountModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-[rgba(26,26,26,0.98)] border-2 border-gray-200 dark:border-accent/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">Apply Discount</h3>
                        <p className="text-gray-600 dark:text-inactive-text mb-2">
                            Product: <span className="text-yellow-600 dark:text-accent font-semibold">{selectedProduct.name}</span>
                        </p>
                        <p className="text-gray-600 dark:text-inactive-text mb-6">
                            Current Price: <span className="text-gray-900 dark:text-white font-semibold">${selectedProduct.current_price}</span>
                        </p>
                        <div>
                            <label className="block text-gray-900 dark:text-white text-sm font-semibold mb-2">New Discounted Price</label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                placeholder="Enter new price"
                                className="w-full h-12 bg-gray-50 dark:bg-input-bg border-2 border-transparent rounded-lg px-4 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-yellow-500 dark:focus:border-accent placeholder:text-gray-400 dark:placeholder:text-inactive-text"
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleDiscountProduct}
                                disabled={loading}
                                className="flex-1 h-12 bg-yellow-500 dark:bg-accent text-white dark:text-secondary rounded-full text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-60"
                            >
                                Apply Discount
                            </button>
                            <button
                                onClick={() => setShowDiscountModal(false)}
                                className="flex-1 h-12 bg-transparent border-2 border-gray-300 dark:border-accent/30 text-gray-700 dark:text-white rounded-full text-sm font-semibold transition-all hover:border-yellow-500 dark:hover:border-accent"
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