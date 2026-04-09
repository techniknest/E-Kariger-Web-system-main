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

// ─── Booking Interface ──────────────────────────────────────────
interface Booking {
  id: string;
  service: { id: string; title: string; description: string; price: number };
  vendor: { user: { name: string } };
  status: 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  scheduled_date: string;
  total_price: number;
  address: string;
  review?: { id: string; rating: number; comment?: string } | null;
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
const HistoryCard = ({ booking }: { booking: Booking }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden group">
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

      {/* Price & Rating */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 shrink-0 mt-2 sm:mt-0">
        <div className="text-left sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Amount</p>
            <p className="text-lg font-black text-slate-900">Rs. {booking.total_price}</p>
        </div>
        {booking.status === 'COMPLETED' && booking.review && (
            <div className="mt-2 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                ⭐ {booking.review.rating}/5 Rated
            </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Booking History Page ──────────────────────────────────
const BookingHistoryPage = () => {
    const navigate = useNavigate();

    // React Query: fetch client bookings
    const { data: bookings = [], isLoading } = useQuery<Booking[]>({
        queryKey: ['clientBookingsHistory'],
        queryFn: () => bookingsApi.getClientBookings(),
    });

    // Filter only previous/past bookings
    const pastStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
    const historyBookings = bookings.filter(b => pastStatuses.includes(b.status));

    // Sort by most recent
    historyBookings.sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-700" />
                        Booking History
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Review all your previous service bookings and engagements.</p>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-blue-700 animate-spin mb-4" />
                    <p className="text-sm font-medium text-slate-500">Loading your history...</p>
                </div>
            ) : historyBookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                    <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No past bookings found</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto mb-6">
                        You don't have any completed or past job records yet. Book a service and it will appear here once finished.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-200"
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyBookings.map((booking) => (
                        <HistoryCard key={booking.id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;
