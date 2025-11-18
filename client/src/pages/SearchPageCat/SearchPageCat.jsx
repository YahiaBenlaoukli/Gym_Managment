import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import api from "../../services/api.js";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading)
        return (
            <p className="text-center mt-10 text-text-color text-lg">
                Loading...
            </p>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-[#2d2d00] pb-10 px-2.5 sm:px-5">
            <Navbar />
            <h1 className="text-3xl text-text-color font-bold mb-6">
                Search results for: <span className="text-accent">{category}</span>
            </h1>

            {results.length === 0 && (
                <p classnName="text-inactive-text text-lg">No products found</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((p) => (
                    <div
                        key={p.id}
                        className="bg-secondary p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform duration-200"
                    >
                        <img
                            src={p.image_path || "/placeholder.png"}
                            alt={p.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                        />

                        <h3 className="text-xl font-semibold">{p.name}</h3>
                        <p className="text-accent text-lg font-bold">
                            ${p.current_price}
                        </p>

                        {p.old_price && (
                            <p className="line-through text-inactive-text text-sm">
                                ${p.old_price}
                            </p>
                        )}

                        <p className="mt-2 text-sm">
                            Stock:{" "}
                            <span
                                className={
                                    p.stock > 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }
                            >
                                {p.stock > 0 ? p.stock : "Out of stock"}
                            </span>
                        </p>

                        <p className="text-sm mt-2 text-inactive-text">
                            {p.description?.slice(0, 60)}...
                        </p>

                        <button className="w-full mt-4 bg-accent text-black py-2 rounded-lg font-semibold hover:bg-hover transition">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
