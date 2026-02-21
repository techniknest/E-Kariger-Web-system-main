import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  X,
  Check,
  Loader2,
  Briefcase,
  User,
  Play,
  DollarSign,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { bookingsApi } from "../../services/api";

const JobRequestManager = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // OTP modal state
  const [otpModal, setOtpModal] = useState<string | null>(null); // booking id
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  // Revise price modal state
  const [reviseModal, setReviseModal] = useState<string | null>(null); // booking id
  const [newPrice, setNewPrice] = useState("");
  const [reviseReason, setReviseReason] = useState("");

  // Mock Profile Strength
  const profileStrength = 85;

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getVendorBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await bookingsApi.updateStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartJob = async (bookingId: string) => {
    if (otpValue.length !== 4) {
      setOtpError("OTP must be 4 digits");
      return;
    }
    setActionLoading(bookingId);
    setOtpError("");
    try {
      await bookingsApi.startJob(bookingId, otpValue);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'IN_PROGRESS' } : b));
      setOtpModal(null);
      setOtpValue("");
    } catch (error: any) {
      setOtpError(error?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviseQuote = async (bookingId: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (!reviseReason.trim()) {
      alert("Please provide a reason for the price change");
      return;
    }
    setActionLoading(bookingId);
    try {
      await bookingsApi.reviseQuote(bookingId, price, reviseReason.trim());
      setBookings(bookings.map(b => b.id === bookingId ? {
        ...b,
        status: 'WAITING_APPROVAL',
        final_price: price,
        is_price_revised: true,
        revision_reason: reviseReason.trim(),
      } : b));
      setReviseModal(null);
      setNewPrice("");
      setReviseReason("");
    } catch (error) {
      alert("Failed to submit revised quote");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">PENDING APPROVAL</span>;
      case "ACCEPTED":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">ACCEPTED</span>;
      case "IN_PROGRESS":
        return <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-1"><Play className="h-3 w-3" /> IN PROGRESS</span>;
      case "WAITING_APPROVAL":
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1"><Clock className="h-3 w-3" /> AWAITING CLIENT</span>;
      case "COMPLETED":
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">COMPLETED</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">REJECTED</span>;
      case "CANCELLED":
        return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> CANCELLED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Top Section: Header & Profile Strength */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Header */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Job Requests</h1>
          <p className="text-slate-500 mt-1">Manage incoming jobs and track your ongoing work.</p>
        </div>

        {/* Profile Strength Widget */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[300px]">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 text-slate-100" viewBox="0 0 36 36">
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${profileStrength}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className="text-xs font-bold text-slate-900">{profileStrength}%</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">Profile Strength</h4>
            <p className="text-xs text-slate-500">Complete your profile to get more jobs</p>
          </div>
          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Improve</button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full group">

            {/* Card Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {booking.service.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <User className="h-3.5 w-3.5" />
                {booking.client.name}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 space-y-4">

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Scheduled Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(booking.scheduled_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Problem</p>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {booking.problem_description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-slate-700 line-clamp-1">
                    {booking.address}
                  </p>
                </div>
              </div>

              {/* Price info */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Price</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Rs. {booking.is_price_revised ? booking.final_price : booking.total_price}
                    {booking.is_price_revised && (
                      <span className="text-xs text-slate-400 line-through ml-2">Rs. {booking.total_price}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Waiting badge for vendor */}
              {booking.status === 'WAITING_APPROVAL' && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                  <p className="text-xs text-orange-800 font-medium">Waiting for client to approve revised price</p>
                </div>
              )}

            </div>

            {/* Card Footer (Actions) */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">

              {/* PENDING: Accept / Reject */}
              {booking.status === 'PENDING' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                    disabled={actionLoading === booking.id}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-red-600 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                    disabled={actionLoading === booking.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Accept
                  </button>
                </div>
              )}

              {/* ACCEPTED: Enter OTP to Start + Revise Price */}
              {booking.status === 'ACCEPTED' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setOtpModal(booking.id); setOtpValue(""); setOtpError(""); }}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="h-4 w-4" /> Enter OTP to Start
                  </button>
                  <button
                    onClick={() => { setReviseModal(booking.id); setNewPrice(""); setReviseReason(""); }}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" /> Revise Price
                  </button>
                </div>
              )}

              {/* IN_PROGRESS: Mark as Completed + Revise Price */}
              {booking.status === 'IN_PROGRESS' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                    disabled={actionLoading === booking.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {actionLoading === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => { setReviseModal(booking.id); setNewPrice(""); setReviseReason(""); }}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" /> Revise Price
                  </button>
                </div>
              )}

              {/* WAITING_APPROVAL: disabled */}
              {booking.status === 'WAITING_APPROVAL' && (
                <button disabled className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-sm cursor-not-allowed">
                  Awaiting Client Approval
                </button>
              )}

              {/* COMPLETED / REJECTED / CANCELLED */}
              {(booking.status === 'COMPLETED' || booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                <button disabled className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-sm cursor-not-allowed">
                  {booking.status === 'COMPLETED' ? 'Job Completed' : booking.status === 'REJECTED' ? 'Job Rejected' : 'Job Cancelled'}
                </button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500">No job requests found.</p>
          </div>
        )}
      </div>

      {/* ─── OTP Modal ─────────────────────────────────────────────── */}
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Enter Start Code</h3>
              <button onClick={() => setOtpModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500">Ask the client for their 4-digit Start Code to begin the job.</p>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otpValue[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = otpValue.split('');
                    newOtp[i] = val;
                    setOtpValue(newOtp.join('').slice(0, 4));
                    // Auto-focus next input
                    if (val && i < 3) {
                      const next = e.target.nextElementSibling as HTMLInputElement;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpValue[i] && i > 0) {
                      const prev = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      prev?.focus();
                    }
                  }}
                  className="h-14 w-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              ))}
            </div>
            {otpError && (
              <p className="text-sm text-red-600 text-center font-medium">{otpError}</p>
            )}
            <button
              onClick={() => handleStartJob(otpModal)}
              disabled={actionLoading === otpModal || otpValue.length !== 4}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {actionLoading === otpModal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Start Job
            </button>
          </div>
        </div>
      )}

      {/* ─── Revise Price Modal ────────────────────────────────────── */}
      {reviseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Revise Price</h3>
              <button onClick={() => setReviseModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500">Set a new price and provide a reason. The client will need to approve the change.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">New Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  value={reviseReason}
                  onChange={(e) => setReviseReason(e.target.value)}
                  placeholder="Explain why the price changed..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleReviseQuote(reviseModal)}
              disabled={actionLoading === reviseModal}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {actionLoading === reviseModal ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
              Submit Revised Price
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequestManager;
