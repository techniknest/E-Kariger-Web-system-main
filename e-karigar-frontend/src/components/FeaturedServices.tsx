import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { servicesApi } from "../services/api";

interface Service {
    id: string;
    title: string;
    price: number;
    description: string;
    category: {
        id: string;
        name: string;
    };
    images: string[];
    vendor: {
        id: string;
        businessName: string;
        user: {
            name: string;
        };
        city: string;
    };
}

const FeaturedServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Fetch top 4 services
                const data = await servicesApi.getAll({ limit: 4 });
                // If API returns { data: [...] } or just [...]
                const serviceList = Array.isArray(data) ? data : data.data || [];
                setServices(serviceList.slice(0, 4)); // Ensure max 4
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Helper to generate consistent dummy rating based on service ID
    const getDummyRating = (id: string) => {
        const charCode = id.charCodeAt(id.length - 1) || 0;
        const rating = (4.5 + (charCode % 5) / 10).toFixed(1); // 4.5 to 4.9
        const reviews = 20 + (charCode % 100); // 20 to 119
        return { rating, reviews };
    };

    // Fallback data (Simulating "Top Rated" from before)
    const fallbackServices: Service[] = [
        {
            id: "f1",
            title: "Master Plumber Service",
            price: 1500,
            description: "Expert plumbing services for all your needs.",
            category: { id: "c1", name: "Plumbing" },
            images: ["https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"],
            vendor: { id: "v1", businessName: "Ali Khan Plumbing", user: { name: "Ali Khan" }, city: "Lahore" }
        },
        {
            id: "f2",
            title: "Interior Painting",
            price: 5000,
            description: "High quality interior painting.",
            category: { id: "c2", name: "Painting" },
            images: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"],
            vendor: { id: "v2", businessName: "Color Magic", user: { name: "Sara Ahmed" }, city: "Karachi" }
        },
        {
            id: "f3",
            title: "Electrical Repairs",
            price: 1200,
            description: "Certified electrician for home repairs.",
            category: { id: "c3", name: "Electrical" },
            images: ["https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"],
            vendor: { id: "v3", businessName: "Quick Fix Electric", user: { name: "Usman Z." }, city: "Islamabad" }
        },
        {
            id: "f4",
            title: "AC Maintenance",
            price: 2500,
            description: "Complete AC service and maintenance.",
            category: { id: "c4", name: "AC Repair" },
            images: ["https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80"],
            vendor: { id: "v4", businessName: "Coolreeze Tech", user: { name: "Bilal T." }, city: "Lahore" }
        }
    ];

    // Determine what to show: API data > Fallback data
    const displayServices = services.length > 0 ? services : fallbackServices;
    const isFallback = services.length === 0 && !loading && !error;

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-8">
                        <div className="h-8 bg-slate-100 w-64 rounded-lg animate-pulse"></div>
                        <div className="h-4 bg-slate-100 w-24 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-slate-100 rounded-xl p-4 h-80 animate-pulse bg-slate-50"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error && services.length === 0) {
        // If error and no data, we could show fallback or nothing. 
        // For now, let's show fallback to keep the site looking good.
    }

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Featured Services</h2>
                        <p className="text-slate-600 mt-2 text-sm leading-relaxed">Top rated services recommended for you</p>
                    </div>
                    <Link to="/services" className="text-blue-700 text-sm font-medium hover:underline flex items-center gap-1 uppercase tracking-wide">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayServices.map((service, idx) => {
                        // Use a fixed or deterministic rating for fallback, dynamic for real
                        const ratingInfo = isFallback
                            ? { rating: (4.8 + (idx % 3) * 0.1).toFixed(1), reviews: 80 + idx * 15 }
                            : getDummyRating(service.id);

                        const { rating, reviews } = ratingInfo;

                        const imageUrl = service.images && service.images.length > 0
                            ? service.images[0]
                            : "https://images.unsplash.com/photo-1581578731117-104f2a8d4618?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"; // Fallback

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                onClick={() => navigate(isFallback ? '/services' : `/services/${service.id}`)}
                            >
                                {/* Image Container */}
                                <div className="aspect-video w-full relative overflow-hidden bg-slate-100">
                                    <img
                                        src={imageUrl}
                                        alt={service.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-blue-700 shadow-sm border border-blue-100">
                                        {service.category.name}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                                        {service.title}
                                    </h3>

                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                                        <span>by {service.vendor?.businessName || service.vendor?.user?.name || "E-Karigar Pro"}</span>
                                        {service.vendor?.city && (
                                            <>
                                                <span className="w-0.5 h-0.5 bg-slate-400 rounded-full mx-1"></span>
                                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {service.vendor.city}</span>
                                            </>
                                        )}
                                        <div className="flex items-center gap-1 ml-auto text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                                        </div>
                                    </div>

                                    {/* Rating & Price */}
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-900 text-sm">{rating}</span>
                                            <span className="text-[10px] text-slate-400">({reviews})</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Starting at</div>
                                            <div className="text-blue-700 font-bold text-base leading-none">
                                                Rs. {service.price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(isFallback ? '/services' : `/services/${service.id}`);
                                        }}
                                        className="w-full mt-3 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-bold py-2 rounded-lg transition-all text-xs uppercase tracking-wide"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedServices;
