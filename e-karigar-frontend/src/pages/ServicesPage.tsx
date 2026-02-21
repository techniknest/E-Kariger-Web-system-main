import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import { Search, MapPin, Filter, Star } from "lucide-react";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    images?: string[];
    vendor: {
        id: string;
        city: string;
        user: {
            name: string;
        };
        verification_badge: boolean;
    };
    category?: {
        name: string;
    };
}

const ServicesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);

    useEffect(() => {
        setLoading(true);
        servicesApi.getAll()
            .then((data) => {
                setServices(data);

                // Client-side filtering
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

    // Update URL when filters change manually
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
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Services</h1>
                        <p className="text-slate-500">
                            {loading ? "Searching..." : `Found ${filteredServices.length} result${filteredServices.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Filter Inputs */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={query}
                                onChange={(e) => handleSearchChange("query", e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter by city..."
                                value={location}
                                onChange={(e) => handleSearchChange("location", e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl h-64 animate-pulse">
                                <div className="h-40 bg-slate-200 rounded-t-xl"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredServices.map((service) => (
                            <Link to={`/services/${service.id}`} key={service.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={(service.images && service.images.length > 0) ? service.images[0] : `https://source.unsplash.com/random/400x300/?repair,worker&sig=${service.id}`}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {service.category && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide">
                                            {service.category.name}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                            <Star className="h-3 w-3 text-amber-500 fill-current" />
                                            4.8
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{service.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                                {service.vendor.user.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{service.vendor.user.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 uppercase">Starting at</p>
                                            <p className="font-bold text-slate-900">Rs. {service.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Filter className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No services found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => setSearchParams({})}
                            className="mt-4 text-blue-700 font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;
