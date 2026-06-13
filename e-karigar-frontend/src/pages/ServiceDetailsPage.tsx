import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingsApi, servicesApi } from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Star, ArrowLeft, ShieldCheck, Clock, Calendar,
    Briefcase, MessageSquare, ChevronDown,
    ChevronUp, Loader2, X, AlertCircle, Shield
} from "lucide-react";
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
        experience_years?: number;
        verification_badge: boolean;
        business_phone?: string;
        user: {
            name: string;
            email: string;
            profile_photo?: string;
        };
        reviews_received?: {
            id: string;
            rating: number;
            comment?: string;
            created_at: string;
            client: { name: string };
        }[];
    };
    category?: {
        name: string;
    };
    vendorRating?: {
        averageRating: number;
        totalReviews: number;
    };
}

const ServiceDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mobileBookingOpen, setMobileBookingOpen] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Booking Form State
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [problemDescription, setProblemDescription] = useState("");

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userRole = user?.role || null;
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
                const scheduledDate = new Date(`${date}T${time}`).toISOString();

                await bookingsApi.create({
                    serviceId: service.id,
                    scheduledDate: scheduledDate,
                    problemDescription: problemDescription || "Standard Booking via Service Page",
                    address: address,
                    totalPrice: Number(service.price)
                });

                toast.success("Booking request sent! The vendor will review it shortly.");
                setDate("");
                setTime("");
                setAddress("");
                setProblemDescription("");
                setMobileBookingOpen(false);
            } catch (error: any) {
                console.error("Booking Error:", error);
                const msg = error.response?.data?.message || "Failed to book service";
                toast.error(msg);
            } finally {
                setBookingLoading(false);
            }
        }
    };

    // Loading State
    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Loading service matrix...</p>
                </div>
            </div>
        </div>
    );

    if (!service) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center bg-white p-12 rounded-[2rem] border border-slate-200 shadow-sm max-w-md mx-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 mx-auto flex items-center justify-center mb-6">
                        <AlertCircle className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Service Not Found</h2>
                    <p className="text-slate-500 mt-2 font-medium">This service may have been removed or is no longer available in the network.</p>
                    <button onClick={() => navigate("/services")} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                        Browse Services
                    </button>
                </div>
            </div>
        </div>
    );

    // Prepare images
    const allImages = (service.images && service.images.length > 0)
        ? service.images
        : [`https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop`];

    const vendorName = service.vendor.user.name;
    const vendorPhoto = service.vendor.user.profile_photo;
    const vendorInitial = vendorName.charAt(0).toUpperCase();
    const avgRating = service.vendorRating?.averageRating || 0;
    const totalReviews = service.vendorRating?.totalReviews || 0;
    const reviews = service.vendor.reviews_received || [];
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    // Rating distribution
    const ratingDist = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
    }));

    // ---- PREMIUM BOOKING COMPONENT (REUSABLE) ----
    const bookingFormJSX = (
        <div className="flex flex-col h-full space-y-6">
            <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Starting At</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">Rs. {Number(service.price).toLocaleString()}</span>
                    </div>
                 </div>
                 {service.vendor.verification_badge && (
                      <div className="bg-emerald-50 text-emerald-700 p-2 rounded-xl border border-emerald-100 flex flex-col items-center justify-center">
                          <ShieldCheck className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Verified</span>
                      </div>
                 )}
            </div>

            <div className="space-y-5 flex-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-2">DATE</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-2">TIME</label>
                        <div className="relative group">
                            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all outline-none appearance-none"
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
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">SERVICE ADDRESS</label>
                    <div className="relative group">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Apt, Street, City"
                            className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">ISSUE DESCRIPTION</label>
                    <div className="relative group">
                        <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <textarea
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            placeholder="Please provide details about what needs to be done..."
                            rows={3}
                            className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all resize-none outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-2">
                {canBook ? (
                    <button
                        onClick={handleBook}
                        disabled={bookingLoading}
                        className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95 flex items-center justify-center gap-2"
                    >
                        {bookingLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing Request...
                            </>
                        ) : (
                            "Request Booking"
                        )}
                    </button>
                ) : (
                    <div className="w-full bg-slate-100 text-slate-500 text-center py-4 rounded-xl font-bold text-sm border border-slate-200">
                        Sign in as client to request this service
                    </div>
                )}
                <p className="text-xs text-center text-slate-400 font-medium mt-4 px-4 leading-relaxed">
                    You won't be charged yet. The expert will review and confirm availability.
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />

            {/* Overhauled Header & Gallery Structure */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-semibold text-sm group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform border border-slate-200 rounded-full p-0.5 bg-white shadow-sm" /> 
                    Back to search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN: Main Content Context */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-8 lg:space-y-12">
                        
                        {/* Title & Metadata */}
                        <div>
                            {service.category && (
                                <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100">
                                    {service.category.name}
                                </span>
                            )}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                                {service.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium">
                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-slate-900">{avgRating > 0 ? avgRating : 'New'}</span>
                                    {totalReviews > 0 && <span className="text-slate-500">({totalReviews} reviews)</span>}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <MapPin className="h-4 w-4 text-indigo-600" />
                                    {service.vendor.city || "Remote / Service Area"}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    <Shield className="h-4 w-4 text-emerald-600" />
                                    Secured Booking
                                </div>
                            </div>
                        </div>

                        {/* Media Gallery Grid */}
                        <div className="relative">
                            {allImages.length > 1 ? (
                                <div className="grid grid-cols-12 grid-rows-2 gap-2 h-[350px] sm:h-[450px]">
                                    <div 
                                        className="col-span-12 sm:col-span-8 row-span-2 relative cursor-pointer group bg-slate-100 overflow-hidden rounded-2xl"
                                        onClick={() => setLightboxOpen(true)}
                                    >
                                        <img src={allImages[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                                    </div>
                                    {allImages.slice(1, 3).map((img, idx) => (
                                        <div 
                                            key={idx}
                                            className="hidden sm:block col-span-4 row-span-1 relative cursor-pointer group bg-slate-100 overflow-hidden rounded-2xl"
                                            onClick={() => { setSelectedImage(idx + 1); setLightboxOpen(true); }}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110" />
                                            {idx === 1 && allImages.length > 3 && (
                                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="text-white font-bold tracking-wide">+{allImages.length - 3} Photos</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div 
                                    className="h-[350px] sm:h-[450px] relative cursor-pointer group bg-slate-100 overflow-hidden rounded-2xl"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    <img src={allImages[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                                </div>
                            )}
                        </div>

                        {/* About Service */}
                        <div className="pt-2">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">About This Service</h2>
                            <div className="prose prose-slate prose-indigo max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-p:text-base">
                                <p>{service.description || "No detailed description provided for this service."}</p>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Vendor Profile Block */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Provided By</h2>
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="shrink-0 relative">
                                    {vendorPhoto ? (
                                        <img src={vendorPhoto} alt={vendorName} className="h-20 w-20 rounded-full object-cover shadow-sm ring-4 ring-slate-50" />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold shadow-sm ring-4 ring-slate-50">
                                            {vendorInitial}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{vendorName}</h3>
                                        {service.vendor.verification_badge && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base pr-4">
                                        {service.vendor.description || "Professional service partner within the platform's trusted network."}
                                    </p>
                                    {service.vendor.experience_years && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 font-semibold bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
                                            <Briefcase className="h-4 w-4 text-indigo-500" />
                                            {service.vendor.experience_years} Years Professional Experience
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Reviews Ecosystem */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    Client Feedback
                                </h2>
                            </div>

                            {totalReviews > 0 ? (
                                <div className="space-y-10">
                                    {/* Score Overview */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                                            <div className="text-6xl font-bold text-slate-900 tracking-tighter mb-2">{avgRating}</div>
                                            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full mb-2 border border-amber-100">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-500">{totalReviews} Verified Returns</span>
                                        </div>
                                        
                                        <div className="hidden sm:block w-px h-full bg-slate-200 absolute left-1/3"></div>

                                        <div className="sm:col-span-8 flex flex-col gap-3 w-full max-w-sm mx-auto">
                                            {ratingDist.map(({ star, count, pct }) => (
                                                <div key={star} className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-slate-700 w-2">{star}</span>
                                                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Feed */}
                                    <div className="grid grid-cols-1 gap-5">
                                        {displayedReviews.map((review) => (
                                            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-bold">
                                                            {review.client.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{review.client.name}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                {[...Array(5)].map((_, idx) => (
                                                                    <Star key={idx} className={`h-3.5 w-3.5 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-slate-500 font-medium">
                                                        {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                                    </span>
                                                </div>
                                                {review.comment && <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{review.comment}</p>}
                                            </div>
                                        ))}
                                    </div>

                                    {reviews.length > 3 && (
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => setShowAllReviews(!showAllReviews)}
                                                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                {showAllReviews ? <><ChevronUp className="h-4 w-4" /> Collapse Feed</> : <><ChevronDown className="h-4 w-4" /> Load All {reviews.length} Insights</>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-12 py-16 border border-slate-200 text-center shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                         <MessageSquare className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
                                    <p className="text-slate-500">Book this service and be the first to share your experience with the community.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Booking Widget (Desktop) */}
                    <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-28">
                            <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-900/5 rounded-[2rem] p-8 before:absolute before:inset-0 before:pointer-events-none before:ring-1 before:ring-slate-900/5 before:rounded-[2rem] relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-600" /> Book Assignment
                                </h3>
                                {bookingFormJSX}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ============ MOBILE STICKY BOTTOM BAR & DRAWER ============ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
                <AnimatePresence>
                    {mobileBookingOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm"
                            onClick={() => setMobileBookingOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {mobileBookingOpen && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-50 max-h-[85vh] overflow-y-auto shadow-2xl ring-1 ring-slate-200"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Schedule Service</h3>
                                    <button
                                        onClick={() => setMobileBookingOpen(false)}
                                        className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-slate-600" />
                                    </button>
                                </div>
                                {bookingFormJSX}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!mobileBookingOpen && (
                    <div className="bg-white/90 backdrop-blur-lg px-6 py-4 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-slate-200/50">
                        <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
                            <div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Starting at</p>
                                <p className="text-xl font-bold text-slate-900 tracking-tight">Rs. {Number(service.price).toLocaleString()}</p>
                            </div>
                            {canBook ? (
                                <button
                                    onClick={() => setMobileBookingOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all whitespace-nowrap"
                                >
                                    Book Service
                                </button>
                            ) : (
                                <div className="bg-slate-100 text-slate-600 py-3.5 px-6 rounded-xl font-bold text-sm border border-slate-200">
                                    Sign in to book
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ============ LIGHTBOX ============ */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 md:top-8 md:right-8 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                        
                        <div className="flex-1 w-full flex items-center justify-center max-h-[80vh]">
                            <motion.img
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                src={allImages[selectedImage]}
                                alt={service.title}
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {allImages.length > 1 && (
                            <div className="mt-8 flex gap-3 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-x-auto max-w-full">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                        className={`shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-white scale-105 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ServiceDetailsPage;

