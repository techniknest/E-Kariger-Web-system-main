import { useState } from "react";
import { X, Calendar, MapPin, AlertCircle, Loader2, FileText, CheckCircle } from "lucide-react";
import { bookingsApi } from "../services/api";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
    service: any;
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal = ({ service, isOpen, onClose }: BookingModalProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        scheduledDate: "",
        address: "",
        problemDescription: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await bookingsApi.create({
                serviceId: service.id,
                scheduledDate: new Date(formData.scheduledDate).toISOString(),
                address: formData.address,
                problemDescription: formData.problemDescription,
                totalPrice: Number(service.price)
            });

            // Show success message or redirect
            // For now, simple alert and close
            onClose();
            navigate("/client-dashboard"); // Redirect to Client Dashboard
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to create booking";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Confirm Booking</h3>
                        <p className="text-sm text-slate-500">Service: {service.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Date & Time */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                Select Date & Time
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                Service Location
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="House #, Street, Area..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                What's the issue?
                            </label>
                            <div className="relative group">
                                <div className="absolute top-3 left-3 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Briefly describe the problem..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
                                    value={formData.problemDescription}
                                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Total Price Highlight */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between mt-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-500">Estimated Total</span>
                            <span className="text-xs text-slate-400">Payment after service</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-extrabold text-slate-900">
                                Rs. {service.price}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5" />
                                Confirm Booking
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-2">
                        By confirming, you agree to our Terms of Service.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
