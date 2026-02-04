import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import BookingModal from "../components/BookingModal";
import { MapPin, Star, ArrowLeft, ShieldCheck } from "lucide-react";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    vendor: {
        id: string;
        city: string;
        description: string;
        rating?: number;
        user: {
            name: string;
            email: string;
        };
        verification_badge: boolean;
    };
}

const ServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    // Logic: Show if user is client or if not logged in (to prompt login). If vendor, hide.
    const canBook = !token || (userRole === "CLIENT");

    useEffect(() => {
        if (id) {
            servicesApi.getById(id)
                .then((data) => setService(data))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    if (!service) return <div className="min-h-screen flex items-center justify-center text-slate-500">Service not found</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-28">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image */}
                    <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={`https://source.unsplash.com/random/800x600/?repair,worker&sig=${service.id}`}
                            alt={service.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg mb-4 inline-block">
                                {service.vendor.city || "Available"}
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col h-full">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                            {service.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-3xl font-bold text-indigo-600">
                                Rs. {service.price}
                            </div>
                            <span className="text-slate-400 text-sm font-medium">/ Service</span>
                        </div>

                        <p className="text-lg text-slate-600 leading-relaxed mb-10 border-l-4 border-indigo-200 pl-6">
                            {service.description || "No description provided for this service."}
                        </p>

                        {/* Vendor Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl mb-10 transform transition-all hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Provider</h3>
                                {service.vendor.verification_badge && (
                                    <div className="text-emerald-600 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">
                                        <ShieldCheck className="h-3 w-3" /> VERIFIED
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                                    {service.vendor.user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                        {service.vendor.user.name}
                                        <span className="text-yellow-400 flex text-sm"><Star className="h-4 w-4 fill-current" /> 4.8</span>
                                    </div>
                                    <div className="text-slate-500 text-sm flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {service.vendor.city}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto pt-6 border-t border-slate-200">
                            {canBook ? (
                                <button
                                    onClick={() => {
                                        if (!token) navigate("/login");
                                        else setIsModalOpen(true);
                                    }}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-xl shadow-indigo-200 transition-all transform active:scale-95"
                                >
                                    Book Now
                                </button>
                            ) : (
                                <div className="w-full bg-slate-100 text-slate-500 text-center py-4 rounded-xl font-medium">
                                    Vendors cannot book services.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                service={service}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ServiceDetailsPage;
