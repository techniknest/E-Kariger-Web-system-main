import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Loader2,
  MapPin,
  ArrowRight,
  Play,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ChevronRight,
  Star,
} from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import VendorDashboard from "../components/VendorDashboard";
import ReviewModal from "../components/ReviewModal";
import { bookingsApi } from "../services/api";

// ─── Booking Interface ──────────────────────────────────────────
interface Booking {
  id: string;
  service: { id: string; title: string; description: string; price: number };
  vendor: { user: { name: string } };
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  scheduled_date: string;
  total_price: number;
  address: string;
  start_otp?: string;
  final_price?: number;
  is_price_revised?: boolean;
  revision_reason?: string;
  review?: { id: string; rating: number; comment?: string } | null;
}

// ─── Status Badge Component ────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string; icon?: React.ReactNode }> = {
    PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Pending" },
    ACCEPTED: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", label: "Accepted" },
    IN_PROGRESS: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", label: "In Progress", icon: <Play className="h-3 w-3" /> },
    WAITING_APPROVAL: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", label: "Price Revised", icon: <AlertTriangle className="h-3 w-3" /> },
    COMPLETED: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Completed", icon: <CheckCircle className="h-3 w-3" /> },
    REJECTED: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Rejected" },
    CANCELLED: { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", label: "Cancelled", icon: <XCircle className="h-3 w-3" /> },
  };
  const c = config[status] || { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", label: status };
  return (
    <span className={`${c.bg} ${c.text} border px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// ─── Booking Card Component ────────────────────────────────────
const BookingCard = ({ booking, onApprove, onReject, actionLoading, onRate }: {
  booking: Booking;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  actionLoading: boolean;
  onRate?: (booking: Booking) => void;
}) => {
  const displayPrice = booking.is_price_revised ? booking.final_price : booking.total_price;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-5">
      {/* Top Row: Status + Booking ID */}
      <div className="flex items-center justify-between">
        <StatusBadge status={booking.status} />
        <span className="text-[11px] text-slate-400 font-mono font-medium uppercase tracking-widest">Job #{booking.id.slice(0, 8)}</span>
      </div>

      {/* Middle Row: Details */}
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">{booking.service.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Provided by <span className="text-indigo-700">{booking.vendor?.user?.name || "Professional"}</span></p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Date & Time</p>
                <p className="font-semibold">{new Date(booking.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(booking.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Location</p>
                <p className="font-semibold truncate">{booking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Card */}
        <div className="sm:w-32 bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Fee</p>
          <p className="text-lg font-black text-slate-900 leading-none">Rs. {Number(displayPrice).toLocaleString()}</p>
          {booking.is_price_revised && (
            <p className="text-[10px] text-slate-400 line-through font-medium mt-1">Rs. {Number(booking.total_price).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Bottom Row: Actions / Info */}
      <div className="pt-2">
        {booking.status === 'ACCEPTED' && booking.start_otp && (
          <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-inner">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="h-5 w-5 text-indigo-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-indigo-800 font-bold uppercase tracking-wide">Start Code</p>
              <p className="text-[10px] text-indigo-600 font-medium">Share this OTP with the vendor to begin the job</p>
            </div>
            <span className="font-mono text-2xl font-black tracking-[0.3em] text-indigo-800 pr-2">
              {booking.start_otp}
            </span>
          </div>
        )}

        {booking.status === 'WAITING_APPROVAL' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-orange-100">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-orange-900">Price Revision Request</h5>
                    <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                        The vendor has updated the price to <span className="font-bold">Rs. {booking.final_price}</span>. 
                        {booking.revision_reason && <> Reason: <span className="font-medium italic">"{booking.revision_reason}"</span></>}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove?.(booking.id)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                Approve New Price
              </button>
              <button
                onClick={() => onReject?.(booking.id)}
                disabled={actionLoading}
                className="py-2.5 px-6 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
              >
                Cancel Job
              </button>
            </div>
          </div>
        )}

        {booking.status === 'COMPLETED' && (
          <div className="flex items-center justify-between py-1 px-1">
            {booking.review ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 text-xs font-bold uppercase tracking-wide">
                <CheckCircle className="h-4 w-4" />
                Rated {booking.review.rating}/5 stars
              </div>
            ) : (
                <div className="flex items-center gap-4">
                     <p className="text-xs text-slate-500 font-medium italic">Service complete! How was your experience?</p>
                     <button
                        onClick={() => onRate?.(booking)}
                        className="bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
                    >
                        <Star className="h-3.5 w-3.5 fill-white" /> Rate Now
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard Page ────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const isApprovedVendor = user.vendorStatus === "APPROVED";
  const isSuspendedVendor = user.vendorStatus === "SUSPENDED";
  const isPendingVendor = user.vendorStatus === "PENDING";
  const isRejectedVendor = user.vendorStatus === "REJECTED";
  const isClient = user.role === "CLIENT" && (user.vendorStatus === "NONE" || !user.vendorStatus);

  // React Query: fetch client bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery<Booking[]>({
    queryKey: ['clientBookings'],
    queryFn: () => bookingsApi.getClientBookings(),
    enabled: isClient || isPendingVendor || isRejectedVendor,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  // Enforce Canonical URLs
  const location = useLocation();
  useEffect(() => {
    if (isAdmin && !location.pathname.startsWith("/admin")) {
      navigate("/admin", { replace: true });
    } else if ((isApprovedVendor || isSuspendedVendor) && !location.pathname.startsWith("/vendor")) {
      navigate("/vendor/dashboard", { replace: true });
    } else if ((isClient || isPendingVendor || isRejectedVendor) && !location.pathname.startsWith("/client")) {
      navigate("/client/dashboard", { replace: true });
    }
  }, [isAdmin, isApprovedVendor, isClient, isPendingVendor, isRejectedVendor, location.pathname, navigate]);

  // Mutations for price revision approvals
  const approveRevisionMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.approveRevision(id, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientBookings'] });
    },
    onError: () => { alert("Failed to approve"); },
  });

  const rejectRevisionMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.approveRevision(id, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientBookings'] });
    },
    onError: () => { alert("Failed to reject"); },
  });

  const handleApprove = (id: string) => approveRevisionMutation.mutate(id);
  const handleReject = (id: string) => rejectRevisionMutation.mutate(id);

  // Filter bookings to show only active jobs
  const activeStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_APPROVAL'];
  const filteredBookings = bookings.filter(b => activeStatuses.includes(b.status));

  // ─── Admin & Vendor Views (delegated) ─────────────────────────
  if (isAdmin) return <AdminDashboard />;
  if (isApprovedVendor || isSuspendedVendor) return <VendorDashboard />;

  // ─── Client View ──────────────────────────────────────────────
  return (
    <div className="font-sans">
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Client Hub</h1>
            <p className="text-slate-500 text-sm mt-1">Hello <span className="font-bold text-slate-700">{user.name}</span>, here's what's happening today.</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-2.5 text-indigo-700 font-bold text-sm bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all shadow-sm"
          >
            <Home className="h-4 w-4" />
            Find Services
            <ChevronRight className="h-4 w-4 text-indigo-300" />
          </button>
        </div>

        {/* Status Banners */}
        {isPendingVendor && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-100">
                <Clock className="h-6 w-6 text-amber-600 shrink-0" />
            </div>
            <div>
              <h3 className="font-black text-amber-900 text-sm uppercase tracking-wide">Application Pending Review</h3>
              <p className="text-amber-700 text-xs mt-1 font-medium italic">Our on-boarding team is verifying your professional credentials. This typically takes 24 hours.</p>
            </div>
          </div>
        )}

        {isRejectedVendor && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
             <div className="p-3 bg-white rounded-xl shadow-sm border border-red-100">
                <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
             </div>
            <div>
              <h3 className="font-black text-red-900 text-sm uppercase tracking-wide">Application Status: Rejected</h3>
              <p className="text-red-700 text-xs mt-1 font-medium italic">Your application didn't meet our platform standards. Contact support for more details.</p>
            </div>
          </div>
        )}

        {/* Become a Vendor CTA */}
        {isClient && (
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white overflow-hidden relative shadow-2xl">
            {/* Design patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -ml-16 -mb-16"></div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-indigo-500/20">
                    Growth Opportunity
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Turn your Skills into a Business</h3>
                <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
                  Join thousands of local professionals earning through E-Karigar. List your talent, manage your schedule, and get paid securely.
                </p>
              </div>
              <button
                onClick={() => navigate("/become-vendor")}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40 whitespace-nowrap flex items-center gap-3 active:scale-95"
              >
                Launch Professional Profile
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Active Bookings
              </h2>
              {filteredBookings.length > 0 && (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {filteredBookings.length} Total
                  </span>
              )}
          </div>

          {/* Content */}
          {loadingBookings ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 text-indigo-700 animate-spin" />
              <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Updating data...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
               <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 mx-auto border border-slate-100">
                  <Calendar className="h-8 w-8 text-slate-200" />
               </div>
              <p className="text-sm text-slate-500 font-bold mb-1">
                Zero Active Bookings
              </p>
              <p className="text-xs text-slate-400 mb-8 font-medium italic">You haven't booked any services yet.</p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-indigo-700 text-white rounded-xl text-sm font-black hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-100"
              >
                Browse Our Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  actionLoading={approveRevisionMutation.isPending || rejectRevisionMutation.isPending}
                  onRate={(b) => setReviewBooking(b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

export default DashboardPage;