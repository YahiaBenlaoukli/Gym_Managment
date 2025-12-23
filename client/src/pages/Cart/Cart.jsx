import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState('review');
    const [selectedItem, setSelectedItem] = useState(null);
    const [userMobile, setUserMobile] = useState('');
    const [userWilaya, setUserWilaya] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [checkoutError, setCheckoutError] = useState(null);
    const [checkoutMessage, setCheckoutMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const wilayas = [
        'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
        'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
        'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
        'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
        'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
        'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
        'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
        'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
    ];

    const getCartItems = async () => {
        setLoading(true);
        try {
            const res = await api.get(`cart/viewCart`);
            const items = res.data?.cart_items || [];
            setCartItems(items);
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Please log in to view your cart.");
                setCartItems([]);
                return;
            }
            setError(err.response?.data?.error || "Failed to fetch cart items");
            console.error("Error fetching cart items:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCartItems();
    }, []);

    const resetCheckoutFlow = () => {
        setCheckoutStep('review');
        setUserMobile('');
        setUserWilaya('');
        setUserCity('');
        setUserAddress('');
        setCheckoutError(null);
        setCheckoutMessage(null);
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete("cart/removeFromCart", { data: { cartItemId } });
            getCartItems();
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.put("cart/updateCartItem", { cartItemId, newQuantity });
            getCartItems();
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const beginCheckout = () => {
        setCheckoutStep('details');
        setCheckoutError(null);
        setCheckoutMessage(null);
        setUserMobile('');
        setUserWilaya('');
        setUserCity('');
        setUserAddress('');
    };

    const confirmOrder = async () => {
        if (cartItems.length === 0) {
            setCheckoutError("Cart is empty.");
            return;
        }
        if (!userMobile.trim() || !userWilaya.trim() || !userCity.trim() || !userAddress.trim()) {
            setCheckoutError("Mobile number, wilaya, city, and address are required.");
            return;
        }
        try {
            setActionLoading(true);
            const userLocation = `${userWilaya}, ${userCity}, ${userAddress}`;
            await api.post("cart/confirmOrder", {
                cartItemId: cartItems[0].cartItemId,
                cartId: cartItems[0]?.cart_id,
                userLocation,
                userMobile,
            });
            setCheckoutMessage("Order confirmed successfully!");
            alert("Order confirmed successfully!");
            resetCheckoutFlow();
            getCartItems();
        } catch (err) {
            setCheckoutError(err.response?.data?.error || "Failed to confirm order.");
            console.error("Error confirming order:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const { totalQuantity, totalPrice } = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.products?.current_price) || 0;
                acc.totalQuantity += quantity;
                acc.totalPrice += price * quantity;
                return acc;
            },
            { totalQuantity: 0, totalPrice: 0 }
        );
    }, [cartItems]);

    const renderContent = () => {
        if (loading) {
            return (
                <p className="text-yellow-600 dark:text-accent text-base font-semibold py-4 text-center">
                    Loading your cart...
                </p>
            );
        }

        if (error) {
            return (
                <div className="rounded-xl border border-red-200 dark:border-[#ff4757]/50 bg-red-50 dark:bg-[rgba(255,71,87,0.12)] p-4 text-red-600 dark:text-[#ff4757] text-center">
                    {error}
                </div>
            );
        }

        if (!cartItems.length) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 dark:text-inactive-text text-center text-lg py-10">
                        Your cart is empty.
                    </p>
                    <Link to="/" className="text-yellow-600 dark:text-accent text-base font-semibold py-4 text-center">
                        <button className="rounded-full border border-yellow-500 dark:border-accent/100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600 dark:text-accent transition hover:bg-yellow-500 hover:text-white dark:hover:bg-accent dark:hover:text-secondary">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-10">
                <div className="grid gap-6">
                    {cartItems.map(item => {
                        const product = item.products || {};
                        const priceValue = Number(product.current_price) || 0;
                        return (
                            <div
                                key={item.id}
                                className="flex flex-col gap-5 rounded-2xl border border-gray-200 dark:border-accent/20 bg-white dark:bg-[rgba(26,26,26,0.95)] p-5 text-gray-900 dark:text-white shadow-lg dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-yellow-500 dark:hover:border-accent hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_25px_45px_rgba(0,0,0,0.55)] md:flex-row"
                            >
                                <img
                                    src={`${import.meta.env.PHOTO_URL}${product.image_path}`}
                                    alt={product.name}
                                    className="h-44 w-full rounded-2xl object-cover md:w-44"
                                    onError={e => {
                                        e.target.src = 'https://placehold.co/160x160?text=Image';
                                    }}
                                />
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                                            {product.category || 'Uncategorized'}
                                        </p>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(255,235,59,0.25)]">
                                            {product.name}
                                        </h2>
                                        <p className="mt-3 text-sm text-gray-600 dark:text-inactive-text">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-inactive-text">
                                                Quantity
                                            </p>
                                            <div className="mt-2 flex items-center gap-3">
                                                <button
                                                    className="h-9 w-9 rounded-full border border-gray-300 dark:border-accent/50 text-lg font-bold text-gray-600 dark:text-accent transition hover:bg-yellow-500 hover:text-white dark:hover:bg-accent dark:hover:text-secondary"
                                                    onClick={() => handleQuantityChange(item.id, Number(item.quantity) - 1)}
                                                    disabled={Number(item.quantity) <= 1}
                                                >
                                                    -
                                                </button>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.quantity}</p>
                                                <button
                                                    className="h-9 w-9 rounded-full border border-gray-300 dark:border-accent/50 text-lg font-bold text-gray-600 dark:text-accent transition hover:bg-yellow-500 hover:text-white dark:hover:bg-accent dark:hover:text-secondary"
                                                    onClick={() => handleQuantityChange(item.id, Number(item.quantity) + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-inactive-text">
                                                Price
                                            </p>
                                            <p className="text-2xl font-bold text-yellow-600 dark:text-accent drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(255,235,59,0.35)]">
                                                ${priceValue.toFixed(2) * Number(item.quantity)}
                                            </p>
                                            <button
                                                className="mt-3 text-xs uppercase tracking-[0.2em] text-red-500 hover:text-red-600 dark:text-[#ff6b6b] dark:hover:text-[#ff8787]"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-accent/30 bg-white dark:bg-[rgba(26,26,26,0.95)] p-6 shadow-lg dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <h3 className="text-gray-900 dark:text-white text-2xl font-bold drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,235,59,0.4)]">
                        Order Summary
                    </h3>
                    <div className="mt-6 space-y-3 text-gray-900 dark:text-white">
                        <div className="flex justify-between text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                            <span>Total items</span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-accent/20 pt-4 text-2xl font-bold">
                            <span>Total price</span>
                            <span className="text-yellow-600 dark:text-accent drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,235,59,0.4)]">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        {checkoutStep === 'details' && (
                            <div className="mt-6 space-y-4">
                                <p className="text-sm text-gray-500 dark:text-inactive-text">
                                    Confirming order for <span className="text-gray-900 dark:text-white font-semibold">{totalQuantity} items</span>
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={userMobile}
                                            onChange={e => setUserMobile(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-accent/30 bg-gray-50 dark:bg-transparent px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-accent transition-colors"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                                            Wilaya (Province)
                                        </label>
                                        <select
                                            value={userWilaya}
                                            onChange={e => setUserWilaya(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-accent/30 bg-gray-50 dark:bg-transparent px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-accent transition-colors"
                                        >
                                            <option value="">Select a wilaya</option>
                                            {wilayas.map(wilaya => (
                                                <option key={wilaya} value={wilaya} className="text-gray-900 bg-white dark:bg-primary dark:text-white">
                                                    {wilaya}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={userCity}
                                            onChange={e => setUserCity(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-accent/30 bg-gray-50 dark:bg-transparent px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-accent transition-colors"
                                            placeholder="Enter your city"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-inactive-text">
                                            Address
                                        </label>
                                        <textarea
                                            value={userAddress}
                                            onChange={e => setUserAddress(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-accent/30 bg-gray-50 dark:bg-transparent px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-accent transition-colors"
                                            placeholder="Enter your detailed address"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                {checkoutError && (
                                    <p className="rounded-lg border border-red-300 dark:border-[#ff6b6b]/40 bg-red-50 dark:bg-[rgba(255,107,107,0.1)] p-3 text-sm text-red-600 dark:text-[#ff6b6b]">
                                        {checkoutError}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="flex-1 rounded-full bg-yellow-500 dark:bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white dark:text-secondary transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                                        onClick={confirmOrder}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Confirm Order'}
                                    </button>
                                    <button
                                        className="rounded-full border border-gray-300 dark:border-accent/40 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-accent transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-accent dark:hover:text-secondary"
                                        onClick={resetCheckoutFlow}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'review' && cartItems.length > 0 && (
                            <div className="mt-6">
                                <button
                                    className="w-full rounded-full bg-yellow-500 dark:bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white dark:text-secondary transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)]"
                                    onClick={beginCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}

                        {checkoutMessage && (
                            <p className="mt-4 rounded-lg border border-yellow-200 dark:border-accent/30 bg-yellow-50 dark:bg-[rgba(255,235,59,0.1)] p-3 text-sm text-yellow-700 dark:text-accent">
                                {checkoutMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300">
            <Navbar />
            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 md:py-14">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-bold drop-shadow-sm dark:drop-shadow-[0_0_25px_rgba(255,235,59,0.35)]">
                        Your Cart
                    </h1>
                    <p className="text-gray-500 dark:text-inactive-text text-base sm:text-lg">
                        Review your selected products before checkout
                    </p>
                </div>
                <div className="mt-6">{renderContent()}</div>
            </div>
            <Footer />
        </div>
    );
};
export default Cart;