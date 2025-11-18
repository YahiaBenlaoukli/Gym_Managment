import { ArrowRight } from "lucide-react"
import heroImage from "./hero.webp" // Import the image

export default function Hero() {
    return (
        <section className="bg-gradient-to-br from-secondary via-primary to-[#2d2d00] text-white py-16 md:py-24 mt-20 max-w-7xl mx-auto border-2 border-accent mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm rounded-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black leading-tight">
                            Power Up Your <span className="text-accent">Gym</span>
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Discover premium fitness equipment and accessories designed for serious athletes and home gym enthusiasts. Elevate your training with professional-grade gear.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-accent text-secondary px-8 py-4 font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 hover:shadow-[0_10px_25px_rgba(255,235,59,0.4)] hover:-translate-y-0.5">
                                Explore Equipment
                                <ArrowRight size={20} />
                            </button>
                            <button className="border-2 border-accent text-accent px-8 py-4 font-bold rounded-xl hover:bg-accent/10 transition-colors">
                                View Deals
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-80 md:h-[450px] bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl overflow-hidden flex items-center justify-center border border-accent/20 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,235,59,0.1)]">
                        <img
                            src={heroImage} // Use the imported image
                            alt="Premium gym equipment collection"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay gradient for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent md:bg-gradient-to-r md:from-primary/60 md:to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}