import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkoutStep, setCheckoutStep] = useState('review');
    const [selectedItem, setSelectedItem] = useState(null);
    const [userMobile, setUserMobile] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [checkoutError, setCheckoutError] = useState(null);
    const [checkoutMessage, setCheckoutMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const getCartItems = async () => {
        setLoading(true);
        try {
            const res = await api.get(`cart/viewCart`);
            const items = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.cartItems)
                    ? res.data.cartItems
                    : [];
            setCartItems(items);
            setError(null);
        } catch (err) {
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
        setSelectedItem(null);
        setUserMobile('');
        setUserLocation('');
        setCheckoutError(null);
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.post("cart/removeFromCart", { cartItemId });
            getCartItems();
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.post("cart/updateCartItem", { cartItemId, newQuantity });
            getCartItems();
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const beginCheckout = (item) => {
        setSelectedItem(item);
        setCheckoutStep('details');
        setCheckoutError(null);
        setCheckoutMessage(null);
        setUserMobile('');
        setUserLocation('');
    };

    const confirmOrder = async () => {
        if (!selectedItem) {
            setCheckoutError("Select an item to confirm.");
            return;
        }
        if (!userMobile.trim() || !userLocation.trim()) {
            setCheckoutError("Mobile number and location are required.");
            return;
        }
        try {
            setActionLoading(true);
            await api.post("cart/confirmOrder", {
                cartItemId: selectedItem.cartItemId,
                userLocation,
                userMobile
            });
            setCheckoutMessage("Order confirmed successfully!");
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
                const price = Number(item.current_price) || 0;
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
                <p className="text-accent text-base font-semibold py-4 text-center">
                    Loading your cart...
                </p>
            );
        }

        if (error) {
            return (
                <div className="rounded-xl border border-[#ff4757]/50 bg-[rgba(255,71,87,0.12)] p-4 text-[#ff4757] text-center">
                    {error}
                </div>
            );
        }

        if (!cartItems.length) {
            return (
                <p className="text-inactive-text text-center text-lg py-10">
                    Your cart is empty.
                </p>
            );
        }

        return (
            <div className="space-y-10">
                <div className="grid gap-6">
                    {cartItems.map(item => {
                        const priceValue = Number(item.current_price) || 0;
                        return (
                            <div
                                key={item.cartItemId}
                                className="flex flex-col gap-5 rounded-2xl border border-accent/20 bg-[rgba(26,26,26,0.95)] p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(0,0,0,0.55)] md:flex-row"
                            >
                                <img
                                    src={`http://localhost:3000${item.image_path}`}
                                    alt={item.name}
                                    className="h-44 w-full rounded-2xl object-cover md:w-44"
                                    onError={e => {
                                        e.target.src = 'https://placehold.co/160x160?text=Image';
                                    }}
                                />
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-inactive-text">
                                            {item.category || 'Uncategorized'}
                                        </p>
                                        <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(255,235,59,0.25)]">
                                            {item.name}
                                        </h2>
                                        <p className="mt-3 text-sm text-inactive-text">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-inactive-text">
                                                Quantity
                                            </p>
                                            <div className="mt-2 flex items-center gap-3">
                                                <button
                                                    className="h-9 w-9 rounded-full border border-accent/50 text-lg font-bold text-accent transition hover:bg-accent hover:text-secondary"
                                                    onClick={() => handleQuantityChange(item.cartItemId, Number(item.quantity) - 1)}
                                                    disabled={Number(item.quantity) <= 1}
                                                >
                                                    -
                                                </button>
                                                <p className="text-2xl font-bold">{item.quantity}</p>
                                                <button
                                                    className="h-9 w-9 rounded-full border border-accent/50 text-lg font-bold text-accent transition hover:bg-accent hover:text-secondary"
                                                    onClick={() => handleQuantityChange(item.cartItemId, Number(item.quantity) + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-wide text-inactive-text">
                                                Price
                                            </p>
                                            <p className="text-2xl font-bold text-accent drop-shadow-[0_0_12px_rgba(255,235,59,0.35)]">
                                                ${priceValue.toFixed(2)}
                                            </p>
                                            <button
                                                className="mt-3 text-xs uppercase tracking-[0.2em] text-[#ff6b6b] hover:text-[#ff8787]"
                                                onClick={() => removeFromCart(item.cartItemId)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button
                                            className="rounded-full border border-accent/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-secondary"
                                            onClick={() => beginCheckout(item)}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-accent/30 bg-[rgba(26,26,26,0.95)] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <h3 className="text-white text-2xl font-bold drop-shadow-[0_0_15px_rgba(255,235,59,0.4)]">
                        Order Summary
                    </h3>
                    <div className="mt-6 space-y-3 text-white">
                        <div className="flex justify-between text-sm uppercase tracking-[0.2em] text-inactive-text">
                            <span>Total items</span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-accent/20 pt-4 text-2xl font-bold">
                            <span>Total price</span>
                            <span className="text-accent drop-shadow-[0_0_15px_rgba(255,235,59,0.4)]">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>

                        {checkoutStep === 'details' && selectedItem && (
                            <div className="mt-6 space-y-4">
                                <p className="text-sm text-inactive-text">
                                    Confirming: <span className="text-white font-semibold">{selectedItem.name}</span>
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-inactive-text">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={userMobile}
                                            onChange={e => setUserMobile(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-accent/30 bg-transparent px-4 py-3 text-white outline-none focus:border-accent"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.2em] text-inactive-text">
                                            Location / Address
                                        </label>
                                        <textarea
                                            value={userLocation}
                                            onChange={e => setUserLocation(e.target.value)}
                                            className="mt-2 w-full rounded-xl border border-accent/30 bg-transparent px-4 py-3 text-white outline-none focus:border-accent"
                                            placeholder="Enter delivery location"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                {checkoutError && (
                                    <p className="rounded-lg border border-[#ff6b6b]/40 bg-[rgba(255,107,107,0.1)] p-3 text-sm text-[#ff6b6b]">
                                        {checkoutError}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                                        onClick={confirmOrder}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : 'Confirm Order'}
                                    </button>
                                    <button
                                        className="rounded-full border border-accent/40 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-secondary"
                                        onClick={resetCheckoutFlow}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'review' && (
                            <p className="mt-4 text-sm text-inactive-text">
                                Select an item and hit Confirm to proceed.
                            </p>
                        )}

                        {checkoutMessage && (
                            <p className="mt-4 rounded-lg border border-accent/30 bg-[rgba(255,235,59,0.1)] p-3 text-sm text-accent">
                                {checkoutMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00]">
            <Navbar />
            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10 md:py-14">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-white text-3xl sm:text-4xl font-bold drop-shadow-[0_0_25px_rgba(255,235,59,0.35)]">
                        Your Cart
                    </h1>
                    <p className="text-inactive-text text-base sm:text-lg">
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