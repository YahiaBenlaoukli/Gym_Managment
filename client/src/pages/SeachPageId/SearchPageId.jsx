import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Heart, Share2, Tag, Package, Calendar } from "lucide-react";
import api from "../../services/api.js";
import Navbar from "../../components/Navbar/Navbar.jsx";

const SearchPageId = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);
    const [user, setUser] = useState(null);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("auth/profile");
                setUser(res.data.user);
                console.log("User is authenticated:", res.data.user);
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setAuthChecking(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.post("product/showProductDetails", { productId: id });
                setProduct(res.data.product);
                setLoading(false);
            } catch (err) {
                console.log("Search error:", err.response?.data || err);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product?.stock || 1)) {
            setQuantity(newQty);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCartAdd = async (productId, qty) => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            // Redirect to login page
            navigate('/auth');
            return;
        }
        try {
            await api.post("cart/addToCart", { user_id: user.id, product_id: productId, quantity: qty });
            alert("Product added to cart!");
        } catch (err) {
            console.error("Add to cart error:", err.response?.data || err);
            alert("Failed to add product to cart.");
        }
    };

    if (loading || authChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] flex items-center justify-center">
                <p className="text-center text-text-color text-lg">Loading...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] px-2.5 sm:px-5">
                <Navbar />
                <p className="text-center text-inactive-text text-lg mt-10">Product not found</p>
            </div>
        );
    }

    const discount = product.old_price
        ? Math.round(((product.old_price - product.current_price) / product.old_price) * 100)
        : 0;

    // Handle both single image and multiple images
    const productImages = product.images || [product.image_path];

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] pb-10" >
            <Navbar />

            <div className="max-w-7xl mx-auto mt-10 mb-20">
                {/* Breadcrumb */}
                <div className="text-inactive-text text-sm mb-6 flex items-center gap-2 px-2.5 sm:px-5">
                    <button onClick={() => navigate(-1)} className="hover:text-accent transition">
                        ← Back
                    </button>
                    <span>/</span>
                    <button onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)} className="hover:text-accent cursor-pointer">{product.category}</button>
                    <span>/</span>
                    <span className="text-text-color">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-[rgba(26,26,26,0.95)] border border-gray-200 dark:border-accent/20 rounded-2xl p-6 shadow-2xl dark:shadow-[0_0_20px_rgba(255,235,59,0.15)] transition-all duration-300 px-2.5 sm:px-5">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative bg-primary/30 rounded-xl overflow-hidden aspect-square">
                            <img
                                src={`http://localhost:3000${productImages[selectedImage]}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg z-10">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === idx
                                            ? "border-accent"
                                            : "border-transparent hover:border-inactive-text"
                                            }`}
                                    >
                                        <img
                                            src={`http://localhost:3000${img}`}
                                            alt={`${product.name} view ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <Tag size={14} />
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl text-text-color font-bold mb-4">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl text-accent font-bold">
                                ${product.current_price}
                            </span>
                            {product.old_price && (
                                <span className="text-xl text-inactive-text line-through">
                                    ${product.old_price}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 text-sm">
                            <Package size={18} className={product.stock > 0 ? "text-green-400" : "text-red-400"} />
                            <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="border-t border-inactive-text/20 pt-6">
                            <h3 className="text-text-color text-lg font-semibold mb-3">Description</h3>
                            <p className="text-inactive-text leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div className="space-y-3">
                                <label className="text-text-color text-sm font-medium">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-primary rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="px-4 py-2 text-text-color hover:bg-accent hover:text-black transition"
                                        >
                                            −
                                        </button>
                                        <span className="px-6 py-2 text-text-color font-semibold">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="px-4 py-2 text-text-color hover:bg-accent hover:text-black transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-inactive-text text-sm">
                                        Max: {product.stock}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {product.stock > 0 ? (
                                <button
                                    className="flex-1 bg-accent text-black py-3 rounded-lg font-semibold hover:bg-hover transition flex items-center justify-center gap-2"
                                    onClick={() => handleCartAdd(product.id, quantity)}
                                >
                                    <ShoppingCart size={20} />
                                    {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                                </button>
                            ) : (
                                <button
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-accent text-black py-3 rounded-lg font-semibold hover:bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Out of Stock
                                </button>
                            )}
                            <button className="bg-primary text-text-color px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition flex items-center justify-center gap-2">
                                <Heart size={20} />
                            </button>
                            <button className="bg-primary text-text-color px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition flex items-center justify-center gap-2">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-inactive-text/20 pt-4">
                            <div className="flex items-center gap-2 text-inactive-text text-sm">
                                <Calendar size={16} />
                                <span>Listed on {formatDate(product.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SearchPageId;