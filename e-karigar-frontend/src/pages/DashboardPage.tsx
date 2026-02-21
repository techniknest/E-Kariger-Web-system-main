import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Loader2,
  MapPin,
  Star,
  ArrowRight,
  Play,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import VendorDashboard from "../components/VendorDashboard";
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
}

// ─── Status Badge Component ────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string; icon?: React.ReactNode }> = {
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Pending" },
    ACCEPTED: { bg: "bg-blue-50", text: "text-blue-700", label: "Accepted" },
    IN_PROGRESS: { bg: "bg-indigo-50", text: "text-indigo-700", label: "In Progress", icon: <Play className="h-3 w-3" /> },
    WAITING_APPROVAL: { bg: "bg-orange-50", text: "text-orange-700", label: "Price Revised", icon: <AlertTriangle className="h-3 w-3" /> },
    COMPLETED: { bg: "bg-green-50", text: "text-green-700", label: "Completed", icon: <CheckCircle className="h-3 w-3" /> },
    REJECTED: { bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
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

// ─── Booking Card Component ────────────────────────────────────
const BookingCard = ({ booking, onApprove, onReject, actionLoading }: {
  booking: Booking;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  actionLoading: string | null;
}) => {
  const displayPrice = booking.is_price_revised ? booking.final_price : booking.total_price;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Top Row: Status + Booking ID */}
      <div className="flex items-center justify-between">
        <StatusBadge status={booking.status} />
        <span className="text-xs text-slate-400 font-mono">#{booking.id.slice(0, 8)}</span>
      </div>

      {/* Middle Row: Details */}
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          <img
            src={`https://source.unsplash.com/random/200x130/?repair,service&sig=${booking.service.id}`}
            alt={booking.service.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{booking.service.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">By {booking.vendor?.user?.name || "Unknown Vendor"}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {new Date(booking.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              {", "}
              {new Date(booking.scheduled_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span className="truncate max-w-[120px]">{booking.address}</span>
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total</p>
          <p className="text-lg font-bold text-slate-900">Rs. {displayPrice}</p>
          {booking.is_price_revised && (
            <p className="text-[10px] text-slate-400 line-through">Rs. {booking.total_price}</p>
          )}
        </div>
      </div>

      {/* Bottom Row: OTP / Approval / Rate */}
      {booking.status === 'ACCEPTED' && booking.start_otp && (
        <div className="flex items-center gap-3 bg-slate-50 border border-dashed border-slate-300 px-4 py-2.5 rounded-lg">
          <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-slate-600 font-medium">Share with vendor when they arrive</p>
          </div>
          <span className="font-mono text-lg font-bold tracking-widest text-slate-900">
            {booking.start_otp}
          </span>
        </div>
      )}

      {booking.status === 'WAITING_APPROVAL' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2.5">
          <p className="text-xs text-orange-800">
            Vendor updated price to <span className="font-bold">Rs. {booking.final_price}</span>
            {booking.revision_reason && <> — <span className="italic">{booking.revision_reason}</span></>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove?.(booking.id)}
              disabled={actionLoading === booking.id}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(booking.id)}
              disabled={actionLoading === booking.id}
              className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-md text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Reject & Cancel
            </button>
          </div>
        </div>
      )}

      {booking.status === 'COMPLETED' && (
        <button className="text-blue-700 text-sm font-medium hover:underline text-left">
          Rate Service
        </button>
      )}
    </div>
  );
};

// ─── Main Dashboard Page ────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
  const isPendingVendor = user.vendorStatus === "PENDING";
  const isRejectedVendor = user.vendorStatus === "REJECTED";
  const isClient = user.role === "CLIENT" && user.vendorStatus === "NONE";

  const fetchClientBookings = () => {
    setLoadingBookings(true);
    bookingsApi.getClientBookings()
      .then((data) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoadingBookings(false));
  };

  useEffect(() => {
    if (isClient || isPendingVendor || isRejectedVendor) {
      fetchClientBookings();
    }
  }, [isClient, isPendingVendor, isRejectedVendor]);

  // Enforce Canonical URLs
  const location = useLocation();
  useEffect(() => {
    if (isAdmin && !location.pathname.startsWith("/admin")) {
      navigate("/admin", { replace: true });
    } else if (isApprovedVendor && !location.pathname.startsWith("/vendor")) {
      navigate("/vendor/dashboard", { replace: true });
    } else if ((isClient || isPendingVendor || isRejectedVendor) && !location.pathname.startsWith("/client")) {
      navigate("/client/dashboard", { replace: true });
    }
  }, [isAdmin, isApprovedVendor, isClient, isPendingVendor, isRejectedVendor, location.pathname, navigate]);

  // Handlers
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await bookingsApi.approveRevision(id, true);
      fetchClientBookings();
    } catch { alert("Failed to approve"); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await bookingsApi.approveRevision(id, false);
      fetchClientBookings();
    } catch { alert("Failed to reject"); }
    finally { setActionLoading(null); }
  };

  // Filter bookings by tab
  const activeStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_APPROVAL'];
  const pastStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
  const filteredBookings = bookings.filter(b =>
    activeTab === "active" ? activeStatuses.includes(b.status) : pastStatuses.includes(b.status)
  );

  // ─── Admin & Vendor Views (unchanged) ─────────────────────────
  if (isAdmin) return <AdminDashboard />;
  if (isApprovedVendor) return <VendorDashboard />;

  // ─── Client View ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back, <span className="font-medium">{user.name}</span>.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-blue-700 font-medium text-sm border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Browse Services
        </button>
      </div>

      {/* Status Banners */}
      {isPendingVendor && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start gap-3">
          <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-800 text-sm">Seller Application Under Review</h3>
            <p className="text-yellow-700 text-xs mt-0.5">Our team is reviewing your application. This usually takes 24-48 hours.</p>
          </div>
        </div>
      )}

      {isRejectedVendor && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800 text-sm">Application Not Approved</h3>
            <p className="text-red-700 text-xs mt-0.5">Your seller application was not approved. Please contact support.</p>
          </div>
        </div>
      )}

      {/* Become a Vendor CTA */}
      {isClient && (
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/5"></div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5"></div>
            <Briefcase className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/[0.06]" />
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Are you a Skilled Professional?</h3>
              <p className="text-blue-200 text-sm max-w-md">
                Join E-Karigar and grow your income. List your services, find local clients,
                and start earning. It takes just 2 minutes.
              </p>
            </div>
            <button
              onClick={() => navigate("/become-vendor")}
              className="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-lg whitespace-nowrap flex items-center gap-2"
            >
              Become a Vendor
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bookings Section */}
      <div>
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "active"
                ? "text-blue-700"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Active Bookings
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-700 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "past"
                ? "text-blue-700"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Past Jobs
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-700 rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {loadingBookings ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 text-blue-700 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              {activeTab === "active" ? "No active bookings" : "No past jobs"}
            </p>
            {activeTab === "active" && (
              <button
                onClick={() => navigate("/")}
                className="mt-3 px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
              >
                Browse Services
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={handleApprove}
                onReject={handleReject}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;