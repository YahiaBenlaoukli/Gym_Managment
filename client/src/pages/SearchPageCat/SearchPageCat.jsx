import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.post("product/showProductsByCategory", { category });
                setResults(res.data.products || []);
            } catch (err) {
                console.log("Search error:", err.response?.data || err);
            }
            setLoading(false);
        };

        fetchData();
    }, [category]);

    const handleProductClick = (productId) => {
        navigate(`/product?id=${encodeURIComponent(productId)}`);
    };
    if (loading)
        return (
            <p className="text-center mt-10 text-gray-900 dark:text-text-color text-lg">
                Loading...
            </p>
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-secondary dark:via-primary dark:to-[#2d2d00] transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-5 sm:px-10 md:py-15 lg:py-20">
                <h1 className="text-3xl text-gray-900 dark:text-text-color font-bold mb-6">
                    Search results for: <span className="text-yellow-600 dark:text-accent">{category}</span>
                </h1>

                {results.length === 0 && (
                    <p className="text-gray-500 dark:text-inactive-text text-lg">No products found</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((prod) => (
                        <div
                            key={prod.id}
                            className="bg-white dark:bg-[rgba(26,26,26,0.95)] border border-gray-200 dark:border-accent/20 rounded-2xl p-4 h-full group hover:border-yellow-500 dark:hover:border-accent hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,235,59,0.15)] transition-all duration-300"
                        >
                            <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3]">
                                {(prod.discount || (prod.old_price && prod.current_price && Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100))) > 0 && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                                        {prod.discount || Math.round(((prod.old_price - prod.current_price) / prod.old_price) * 100)}% OFF
                                    </div>
                                )}
                                <img
                                    src={
                                        prod?.image_path && process.env.PHOTO_URL
                                            ? `${process.env.PHOTO_URL}${prod.image_path}`
                                            : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800"
                                    } alt={prod.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <button
                                        onClick={() => {
                                            handleProductClick(prod.id);
                                        }}
                                        className="w-full bg-yellow-500 dark:bg-accent text-white dark:text-secondary py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-gray-900 dark:text-white font-bold text-lg line-clamp-1">{prod.name}</h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-yellow-600 dark:text-accent font-bold">${prod.current_price || prod.price}</span>
                                        {(prod.old_price || prod.originalPrice) && (
                                            <span className="text-gray-400 dark:text-inactive-text text-xs line-through">${prod.old_price || prod.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-inactive-text text-sm line-clamp-2 min-h-[40px]">{prod.description}</p>
                                <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-inactive-text">
                                    <span>{prod.category}</span>
                                    <span>{prod.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchPage;
