import { useState } from "react";
import { X, Calendar, MapPin, AlertCircle, Loader } from "lucide-react";
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

            alert("Booking confirmed successfully!");
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
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-900">Book {service.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Select Date & Time
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <input
                                type="datetime-local"
                                required
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Location / Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="House #123, Street 4, City..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Problem Description
                        </label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Describe the issue briefly..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                            value={formData.problemDescription}
                            onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-indigo-900 font-medium">Total Price</span>
                        <span className="text-2xl font-bold text-indigo-700">Rs. {service.price}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Confirm Booking"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
