import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingsApi, servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import { MapPin, Star, ArrowLeft, ShieldCheck, Clock, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    images?: string[];
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
    category?: {
        name: string;
    };
}

const ServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Booking Form State
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");

    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const canBook = !token || (userRole === "CLIENT");

    useEffect(() => {
        if (id) {
            servicesApi.getById(id)
                .then((data) => setService(data))
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to load service details");
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleBook = async () => {
        if (!token) {
            toast.error("Please login to book a service");
            navigate("/login");
            return;
        }

        if (!date || !time || !address) {
            toast.error("Please fill in all booking details");
            return;
        }

        if (service) {
            setBookingLoading(true);
            try {
                // Combine date and time into ISO string
                const scheduledDate = new Date(`${date}T${time}`).toISOString();

                await bookingsApi.create({
                    serviceId: service.id,
                    scheduledDate: scheduledDate,
                    problemDescription: "Standard Booking via Service Page", // Default description
                    address: address,
                    totalPrice: service.price
                });

                toast.success("Booking request sent successfully!");
                // Optional: Redirect to bookings page or clear form
                setDate("");
                setTime("");
                setAddress("");
            } catch (error: any) {
                console.error("Booking Error:", error);
                const msg = error.response?.data?.message || "Failed to book service";
                toast.error(msg);
            } finally {
                setBookingLoading(false);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div></div>;

    if (!service) return <div className="min-h-screen flex items-center justify-center text-slate-500">Service not found</div>;

    // Use first image if available, else a placeholder
    const serviceImage = (service.images && service.images.length > 0) ? service.images[0] : `https://source.unsplash.com/random/1200x800/?repair,worker&sig=${service.id}`;

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
                    {/* Left Column: Details (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Image */}
                        <div className="relative h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-sm bg-slate-200 group">
                            <img
                                src={serviceImage}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Service Header */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                                {service.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Star className="h-4 w-4 text-amber-500 fill-current" /> 4.8
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" /> {service.vendor.city || "Available Globally"}
                                </span>
                                {service.category && (
                                    <>
                                        <span>•</span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase font-semibold tracking-wide">
                                            {service.category.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Vendor Profile Card */}
                        <div className="border-y border-gray-100 py-6 my-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0 uppercase">
                                {service.vendor.user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    {service.vendor.user.name}
                                    {service.vendor.verification_badge && (
                                        <ShieldCheck className="h-4 w-4 text-blue-600" aria-label="Verified Vendor" />
                                    )}
                                </h3>
                                <p className="text-sm text-slate-500">{service.vendor.description || "Professional Service Provider"}</p>
                            </div>
                            <button className="text-blue-700 text-sm font-medium hover:underline">
                                View Profile
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">About this Service</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm md:text-base">
                                <p>{service.description || "No specific description provided by the vendor."}</p>
                            </div>
                        </div>

                        {/* Reviews Preview (Static for now) */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Reviews</h3>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                U{i}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">User {i}</p>
                                                <div className="flex text-amber-500">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star key={idx} className="h-3 w-3 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600">Great service, very professional and punctual.</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card (Spans 1 column) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white border border-gray-200 shadow-lg rounded-2xl p-6 space-y-6">
                            {/* Price Section */}
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Starting price</p>
                                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Rs. {service.price.toLocaleString()}
                                </div>
                            </div>

                            {/* Booking Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={date}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <select
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
                                        >
                                            <option value="">Select time</option>
                                            <option value="09:00">09:00 AM</option>
                                            <option value="10:00">10:00 AM</option>
                                            <option value="11:00">11:00 AM</option>
                                            <option value="12:00">12:00 PM</option>
                                            <option value="13:00">01:00 PM</option>
                                            <option value="14:00">02:00 PM</option>
                                            <option value="15:00">03:00 PM</option>
                                            <option value="16:00">04:00 PM</option>
                                            <option value="17:00">05:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Work Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your address"
                                            className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700">E-Karigar Guarantee</p>
                                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Verified professionals & secure payments.</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            {canBook ? (
                                <button
                                    onClick={handleBook}
                                    disabled={bookingLoading}
                                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {bookingLoading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Book Securely"
                                    )}
                                </button>
                            ) : (
                                <div className="w-full bg-slate-100 text-slate-500 text-center py-3 rounded-lg font-medium text-xs">
                                    Sign in as a client to book
                                </div>
                            )}

                            <p className="text-xs text-center text-slate-400 mt-3">
                                You won't be charged yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
