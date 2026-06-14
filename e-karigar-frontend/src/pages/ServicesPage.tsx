import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import { Search, MapPin, Filter, Star, ShieldCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    images?: string[];
    vendor: {
        id: string;
        city: string;
        businessName?: string;
        user: {
            name: string;
        };
        verification_badge: boolean;
    };
    category?: {
        name: string;
    };
    vendorRating?: {
        averageRating: number;
        totalReviews: number;
    };
}

const ServicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";

    const [loading, setLoading] = useState(true);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);

    useEffect(() => {
        setLoading(true);
        servicesApi.getAll()
            .then((data) => {
                let results = data;

                if (query) {
                    const lowerQuery = query.toLowerCase();
                    results = results.filter((s: Service) =>
                        s.title.toLowerCase().includes(lowerQuery) ||
                        s.description.toLowerCase().includes(lowerQuery)
                    );
                }

                if (location) {
                    const lowerLoc = location.toLowerCase();
                    results = results.filter((s: Service) =>
                        s.vendor.city.toLowerCase().includes(lowerLoc)
                    );
                }

                if (category) {
                    const lowerCat = category.toLowerCase();
                    results = results.filter((s: Service) =>
                        s.category?.name.toLowerCase() === lowerCat
                    );
                }

                setFilteredServices(results);
            })
            .catch((err) => console.error("Failed to fetch services", err))
            .finally(() => setLoading(false));
    }, [query, location, category]);

    const handleSearchChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };


    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Find Services</h1>
                            <p className="text-slate-500 font-medium">
                                {loading ? "Searching..." : `Found ${filteredServices.length} highly rated professional${filteredServices.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>

                        {/* Filter Inputs */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    value={query}
                                    onChange={(e) => handleSearchChange("query", e.target.value)}
                                    className="input-field pl-10 pr-4 py-2.5 w-full sm:w-72 shadow-sm"
                                />
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="City (e.g. Lahore)"
                                    value={location}
                                    onChange={(e) => handleSearchChange("location", e.target.value)}
                                    className="input-field pl-10 pr-4 py-2.5 w-full sm:w-48 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-[1.5rem] border border-slate-200 h-[380px] animate-pulse">
                                <div className="h-[200px] bg-slate-100 rounded-t-[1.5rem]"></div>
                                <div className="p-5 space-y-4">
                                    <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    <div className="pt-4 border-t border-slate-100">
                                         <div className="h-8 bg-slate-100 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredServices.map((service, idx) => {
                            const rating = service.vendorRating?.averageRating || 0;
                            const reviews = service.vendorRating?.totalReviews || 0;
                            
                            return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                                key={service.id} 
                            >
                                <Link to={`/services/${service.id}`} className="group card flex flex-col h-full hover:border-indigo-200 block">
                                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100 rounded-t-[1.5rem]">
                                        <img
                                            src={(service.images && service.images.length > 0) ? service.images[0] : `https://source.unsplash.com/random/400x300/?repair,worker&sig=${service.id}`}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {service.category && (
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm border border-white/50">
                                                {service.category.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2 font-medium">
                                            <span className="truncate">{service.vendor?.businessName || service.vendor?.user?.name || "E-Karigar Pro"}</span>
                                            {service.vendor?.city && (
                                                <>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full mx-0.5 shrink-0"></span>
                                                    <span className="flex items-center gap-0.5 shrink-0"><MapPin className="w-3 h-3 text-slate-400" /> {service.vendor.city}</span>
                                                </>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight ">{service.title}</h3>
                                        
                                        <div className="flex items-center gap-1.5 mb-2 mt-1">
                                            {reviews > 0 ? (
                                                <>
                                                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span className="font-bold text-xs">{rating.toFixed(1)}</span>
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

                                        <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-4">{service.description}</p>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                 {service.vendor.verification_badge ? (
                                                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100 tracking-wide uppercase">
                                                         <CheckCircle className="w-3 h-3" /> Verified
                                                     </div>
                                                 ) : (
                                                     <div className="flex flex-col justify-center">
                                                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                               <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                                                                    {service.vendor.user.name.charAt(0)}
                                                               </div>
                                                               <span className="truncate max-w-[80px] font-medium">{service.vendor.user.name}</span>
                                                          </div>
                                                     </div>
                                                 )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">From</div>
                                                <div className="text-slate-900 font-bold text-lg leading-none ">Rs. {service.price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 ">No services found</h3>
                        <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">We couldn't find anything matching your criteria. Try adjusting your search or filters.</p>
                        <button
                            onClick={() => setSearchParams({})}
                            className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;
