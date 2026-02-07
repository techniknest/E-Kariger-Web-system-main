import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import BookingModal from "../components/BookingModal";
import { MapPin, Star, ArrowLeft, ShieldCheck, Check } from "lucide-react";

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
        business_phone?: string;
    };
    features?: string[]; // Assuming backend might provide features
}

const ServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
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
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-medium"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                    {/* Left Column: Details (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Image */}
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={`https://source.unsplash.com/random/1200x800/?repair,worker&sig=${service.id}`}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-indigo-600" />
                                {service.vendor.city || "Available Globally"}
                            </div>
                        </div>

                        {/* Service Title & Info */}
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                                {service.title}
                            </h1>
                            <p className="text-slate-500 text-lg">Detailed service description and requirements</p>
                        </div>

                        {/* Vendor Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500 shrink-0 border-2 border-white shadow-lg relative">
                                {service.vendor.user.name.charAt(0)}
                                {service.vendor.verification_badge && (
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Verified Vendor">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-slate-900">{service.vendor.user.name}</h3>
                                    {service.vendor.verification_badge && (
                                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" /> VERIFIED
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /> 4.8 Rating</span>
                                    <span>•</span>
                                    <span>{service.vendor.description || "Professional Service Provider"}</span>
                                </div>
                            </div>
                            <button className="text-indigo-600 font-medium text-sm hover:underline">View Profile</button>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">About this Service</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                <p>{service.description || "No specific description provided by the vendor."}</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Booking Card (Spans 1 column) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-6">
                            <div className="text-center border-b border-slate-100 pb-6">
                                <p className="text-slate-500 font-medium mb-1">Starting Price</p>
                                <div className="text-4xl font-extrabold text-indigo-600">
                                    Rs. {service.price}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Secure payments</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Verified professional</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>

                            {canBook ? (
                                <button
                                    onClick={() => {
                                        if (!token) navigate("/login");
                                        else setIsModalOpen(true);
                                    }}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Book Now
                                </button>
                            ) : (
                                <div className="w-full bg-slate-100 text-slate-500 text-center py-4 rounded-xl font-medium text-sm">
                                    Sign in as a client to book
                                </div>
                            )}

                            <p className="text-xs text-center text-slate-400">
                                No charges until the service is completed.
                            </p>
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
