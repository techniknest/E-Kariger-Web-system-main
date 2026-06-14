import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  AlertCircle,
  Home,
  Loader2,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import VendorDashboard from "../components/VendorDashboard";
import ReviewModal from "../components/ReviewModal";
import BookingCard, { type Booking } from "../components/client/BookingCard";
import { bookingsApi } from "../services/api";

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

  // Determine if there are high-priority alerts
  const hasWaitingApproval = filteredBookings.some(b => b.status === 'WAITING_APPROVAL');

  // ─── Admin & Vendor Views (delegated) ─────────────────────────
  if (isAdmin) return <AdminDashboard />;
  if (isApprovedVendor || isSuspendedVendor) return <VendorDashboard />;

  // ─── Client View ──────────────────────────────────────────────
  return (
    <div className="font-sans">
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Top Alert Strip */}
        {hasWaitingApproval && (
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-bold text-amber-900">
                Action Required: A professional has requested a price revision.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              High Priority
            </span>
          </div>
        )}

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

        {/* Active Bookings Section */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Active Jobs
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
            <div className="flex flex-col gap-4">
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

        {/* Become a Vendor CTA */}
        {isClient && (
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white overflow-hidden relative shadow-2xl mt-8">
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