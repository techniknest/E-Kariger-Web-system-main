import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../services/api";
import toast from "react-hot-toast";

interface ReviewModalProps {
    bookingId: string;
    serviceName: string;
    vendorName: string;
    onClose: () => void;
}

const ReviewModal = ({ bookingId, serviceName, vendorName, onClose }: ReviewModalProps) => {
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState("");

    const mutation = useMutation({
        mutationFn: () => reviewsApi.create({ bookingId, rating, comment: comment || undefined }),
        onSuccess: () => {
            toast.success("Review submitted! Thank you.");
            queryClient.invalidateQueries({ queryKey: ['clientBookings'] });
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to submit review");
        },
    });

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        mutation.mutate();
    };

    const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Rate this Service</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Service Info */}
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{serviceName}</p>
                        <p className="text-xs text-slate-500">by {vendorName}</p>
                    </div>

                    {/* Star Rating */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoveredStar || rating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-200"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm font-medium text-amber-600">{ratingLabels[rating]}</p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Your review (optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your experience..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition bg-slate-50"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending || rating === 0}
                        className="px-5 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
