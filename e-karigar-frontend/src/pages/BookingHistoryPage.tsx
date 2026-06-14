import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
    Calendar, 
    CheckCircle, 
    XCircle, 
    Loader2, 
    MapPin, 
    Clock
} from "lucide-react";
import { bookingsApi } from "../services/api";
import ReviewModal from "../components/ReviewModal";
import { useState } from "react";
import { Star } from "lucide-react";

// ─── Booking Interface ──────────────────────────────────────────
export interface Booking {
  id: string;
  service: { id: string; title: string; description: string; price: number };
  vendor: { user: { name: string } };
  status: 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  scheduled_date: string;
  total_price: number;
  address: string;
  review?: { id: string; rating: number; comment?: string } | null;
  is_price_revised?: boolean;
  final_price?: number;
}

// ─── Status Badge Component ────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string; icon?: React.ReactNode }> = {
    COMPLETED: { bg: "bg-green-50", text: "text-green-700", label: "Completed", icon: <CheckCircle className="h-3 w-3" /> },
    REJECTED: { bg: "bg-red-50", text: "text-red-700", label: "Rejected", icon: <XCircle className="h-3 w-3" /> },
    CANCELLED: { bg: "bg-slate-100", text: "text-slate-600", label: "Cancelled", icon: <XCircle className="h-3 w-3" /> },
  };
  const c = config[status] || { bg: "bg-slate-100", text: "text-slate-600", label: status };
  return (
    <span className={`${c.bg} ${c.text} px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// ─── History Card Component ────────────────────────────────────
const HistoryCard = ({ booking, onRate }: { booking: Booking; onRate?: (b: Booking) => void }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden group">
      {/* Decorative side bar for status */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'COMPLETED' ? 'bg-green-500' : booking.status === 'REJECTED' ? 'bg-red-500' : 'bg-slate-300'}`}></div>

      {/* Info */}
      <div className="flex-1 min-w-0 pl-2">
        <div className="flex items-start justify-between mb-2">
            <div>
                <h4 className="text-base font-bold text-slate-900 truncate">{booking.service.title}</h4>
                <p className="text-sm text-slate-500 mt-0.5 font-medium">Provided by <span className="text-slate-800">{booking.vendor?.user?.name || "Unknown Provider"}</span></p>
            </div>
            <StatusBadge status={booking.status} />
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Calendar className="h-4 w-4 text-slate-400" />
            {new Date(booking.scheduled_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Clock className="h-4 w-4 text-slate-400" />
            {new Date(booking.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="truncate max-w-[200px]">{booking.address}</span>
          </span>
        </div>
      </div>

      {/* Action Column: Price & Rating */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 shrink-0 mt-2 sm:mt-0 min-w-[140px]">
        <div className="text-left sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Amount</p>
            <p className="text-lg font-black text-slate-900">
                Rs. {booking.is_price_revised ? booking.final_price : booking.total_price}
            </p>
            {booking.is_price_revised && (
                <p className="text-xs text-slate-400 line-through mt-0.5">
                    Rs. {booking.total_price}
                </p>
            )}
        </div>
        
        {booking.status === 'COMPLETED' && booking.review && (
            <div className="mt-3 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-amber-100">
                ⭐ {booking.review.rating}/5 Rated
            </div>
        )}
        {booking.status === 'COMPLETED' && !booking.review && (
            <button
                onClick={() => onRate?.(booking)}
                className="mt-3 bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
            >
                <Star className="h-3.5 w-3.5 fill-white" /> Rate Service
            </button>
        )}
      </div>
    </div>
  );
};

type FilterType = "ALL" | "COMPLETED" | "CANCELLED";

// ─── Main Booking History Page ──────────────────────────────────
const BookingHistoryPage = () => {
    const navigate = useNavigate();
    const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
    const [filter, setFilter] = useState<FilterType>("ALL");

    const { data: bookings = [], isLoading } = useQuery<Booking[]>({
        queryKey: ['clientBookings'],
        queryFn: () => bookingsApi.getClientBookings(),
    });

    // Filter only previous/past bookings
    const pastStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
    let historyBookings = bookings.filter(b => pastStatuses.includes(b.status));

    // Apply pill filter
    if (filter === "COMPLETED") {
        historyBookings = historyBookings.filter(b => b.status === "COMPLETED");
    } else if (filter === "CANCELLED") {
        historyBookings = historyBookings.filter(b => b.status === "REJECTED" || b.status === "CANCELLED");
    }

    // Sort by most recent
    historyBookings.sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-indigo-700" />
                        Booking History Ledger
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Review all your past job records and post-job actions.</p>
                </div>

                {/* Pill Toggles */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {(["ALL", "COMPLETED", "CANCELLED"] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                filter === type 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            }`}
                        >
                            {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-indigo-700 animate-spin mb-4" />
                    <p className="text-sm font-medium text-slate-500">Loading your ledger...</p>
                </div>
            ) : historyBookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No records found</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mb-6">
                        {filter === "ALL" 
                            ? "You don't have any completed or past job records yet." 
                            : `You don't have any ${filter.toLowerCase()} job records.`}
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2.5 bg-indigo-700 text-white rounded-xl text-sm font-bold hover:bg-indigo-800 transition shadow-sm"
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyBookings.map((booking) => (
                        <HistoryCard key={booking.id} booking={booking} onRate={(b) => setReviewBooking(b)} />
                    ))}
                </div>
            )}

            {reviewBooking && (
                <ReviewModal
                    bookingId={reviewBooking.id}
                    serviceName={reviewBooking.service.title}
                    vendorName={reviewBooking.vendor?.user?.name || 'Professional'}
                    onClose={() => setReviewBooking(null)}
                />
            )}
        </div>
    );
};

export default BookingHistoryPage;
