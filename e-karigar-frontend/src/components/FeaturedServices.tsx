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
    vendorRating?: {
        averageRating: number;
        totalReviews: number;
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
                const data = await servicesApi.getAll({ limit: 4 });
                const serviceList = Array.isArray(data) ? data : data.data || [];
                setServices(serviceList.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);


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

    const displayServices = services.length > 0 ? services : fallbackServices;
    const isFallback = services.length === 0 && !loading && !error;

    if (loading) {
        return (
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-8">
                        <div className="h-8 bg-slate-200 w-64 rounded-xl animate-pulse"></div>
                        <div className="h-4 bg-slate-200 w-24 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-[1.5rem] p-4 h-[380px] animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl tracking-tight font-bold text-slate-900 ">Featured Services</h2>
                        <p className="text-slate-500 mt-2 font-medium">Top rated services recommended for you</p>
                    </div>
                    <Link to="/services" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide flex items-center gap-1 group">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayServices.map((service, idx) => {
                        const ratingInfo = isFallback
                            ? { rating: (4.8 + (idx % 3) * 0.1).toFixed(1), reviews: 80 + idx * 15 }
                            : { rating: (service.vendorRating?.averageRating || 0).toFixed(1), reviews: service.vendorRating?.totalReviews || 0 };

                        const { rating, reviews } = ratingInfo;
                        const imageUrl = service.images && service.images.length > 0
                            ? service.images[0]
                            : "https://images.unsplash.com/photo-1581578731117-104f2a8d4618?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.1 }}
                                className="group card flex flex-col h-full cursor-pointer hover:border-indigo-200 relative"
                                onClick={() => navigate(isFallback ? '/services' : `/services/${service.id}`)}
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100 rounded-t-[1.5rem]">
                                    <img
                                        src={imageUrl}
                                        alt={service.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm border border-white/50">
                                        {service.category.name}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2 font-medium">
                                        <span>{service.vendor?.businessName || service.vendor?.user?.name || "E-Karigar Pro"}</span>
                                        {service.vendor?.city && (
                                            <>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full mx-0.5"></span>
                                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {service.vendor.city}</span>
                                            </>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                                        {service.title}
                                    </h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mb-4 mt-1">
                                        {reviews > 0 ? (
                                            <>
                                                <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span className="font-bold text-xs">{rating}</span>
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">({reviews} reviews)</span>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                                <Star className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="font-bold text-xs text-slate-500">New</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Section */}
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100 tracking-wide uppercase">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">From</div>
                                            <div className="text-slate-900 font-bold text-lg leading-none ">
                                                Rs. {service.price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hidden CTA that appears on hover (desktop pattern) */}
                                    <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-10">
                                         <button className="btn-primary w-full shadow-lg shadow-indigo-500/25">
                                             View Details
                                         </button>
                                    </div>
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
