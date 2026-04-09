import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import toast from "react-hot-toast";
import { bookingsApi } from "../../services/api";

type TabFilter = "all" | "pending" | "active" | "completed";

const JobRequestManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  // OTP modal state
  const [otpModal, setOtpModal] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  // Revise price modal state
  const [reviseModal, setReviseModal] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [reviseReason, setReviseReason] = useState("");

  // ─── Data Queries (react-query with auto-polling) ──────────────
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ["vendorBookings"],
    queryFn: () => bookingsApi.getVendorBookings(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  // ─── Mutations ─────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingsApi.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      toast.success(`Booking ${variables.status.toLowerCase()}!`);
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const startJobMutation = useMutation({
    mutationFn: ({ id, otp }: { id: string; otp: string }) => bookingsApi.startJob(id, otp),
    onSuccess: () => {
      toast.success("Job started successfully!");
      setOtpModal(null);
      setOtpValue("");
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
    },
    onError: (error: any) => {
      setOtpError(error?.response?.data?.message || "Invalid OTP. Please try again.");
    },
  });

  const reviseMutation = useMutation({
    mutationFn: ({ id, price, reason }: { id: string; price: number; reason: string }) =>
      bookingsApi.reviseQuote(id, price, reason),
    onSuccess: () => {
      toast.success("Price revision sent to client!");
      setReviseModal(null);
      setNewPrice("");
      setReviseReason("");
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
    },
    onError: () => toast.error("Failed to revise price"),
  });

  // ─── Handlers ──────────────────────────────────────────────────
  const handleStatusUpdate = (id: string, status: string) => statusMutation.mutate({ id, status });

  const handleStartJob = (bookingId: string) => {
    if (otpValue.length !== 4) {
      setOtpError("OTP must be 4 digits");
      return;
    }
    setOtpError("");
    startJobMutation.mutate({ id: bookingId, otp: otpValue });
  };

  const handleReviseQuote = (bookingId: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!reviseReason.trim()) {
      toast.error("Please provide a reason for the price change");
      return;
    }
    reviseMutation.mutate({ id: bookingId, price, reason: reviseReason.trim() });
  };

  // ─── Tab Filtering ─────────────────────────────────────────────
  const filterBookings = () => {
    switch (activeTab) {
      case "pending":
        return bookings.filter((b) => b.status === "PENDING");
      case "active":
        return bookings.filter((b) => ["ACCEPTED", "IN_PROGRESS", "WAITING_APPROVAL"].includes(b.status));
      case "completed":
        return bookings.filter((b) => ["COMPLETED", "REJECTED", "CANCELLED"].includes(b.status));
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings();
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const activeCount = bookings.filter((b) => ["ACCEPTED", "IN_PROGRESS", "WAITING_APPROVAL"].includes(b.status)).length;
  const completedCount = bookings.filter((b) => ["COMPLETED", "REJECTED", "CANCELLED"].includes(b.status)).length;

  // ─── Status Badge ──────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string; icon?: React.ReactNode }> = {
      PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Pending" },
      ACCEPTED: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Accepted" },
      IN_PROGRESS: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "In Progress", icon: <Play className="h-3 w-3" /> },
      WAITING_APPROVAL: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", label: "Awaiting Client", icon: <Clock className="h-3 w-3" /> },
      COMPLETED: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Completed", icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Rejected" },
      CANCELLED: { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", label: "Cancelled", icon: <XCircle className="h-3 w-3" /> },
    };
    const c = config[status] || { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", label: status };
    return (
      <span className={`${c.bg} ${c.text} border px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wide`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  // ─── Loading ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-blue-700 animate-spin" />
      </div>
    );
  }

  // ─── Tab Config ────────────────────────────────────────────────
  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All Jobs", count: bookings.length },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "active", label: "Active", count: activeCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className="space-y-5">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Jobs</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage incoming requests and track ongoing work.</p>
      </div>

      {/* ─── Tab Filters ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold ${activeTab === tab.key ? "text-blue-700" : "text-slate-400"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Job Cards Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-sm transition-all">
            {/* Card Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <Briefcase className="h-4 w-4 text-blue-700" />
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{booking.service.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <User className="h-3 w-3" />
                {booking.client.name}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 space-y-3">
              <div className="flex items-start gap-2.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Schedule</p>
                  <p className="text-xs font-medium text-slate-800">
                    {new Date(booking.scheduled_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}
                    {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Problem</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{booking.problem_description}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-xs text-slate-600 line-clamp-1">{booking.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Price</p>
                  <p className="text-xs font-semibold text-slate-800">
                    Rs. {booking.is_price_revised ? booking.final_price : booking.total_price}
                    {booking.is_price_revised && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">Rs. {booking.total_price}</span>
                    )}
                  </p>
                </div>
              </div>

              {booking.status === "WAITING_APPROVAL" && (
                <div className="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                  <p className="text-[10px] text-orange-800 font-medium">Waiting for client to approve revised price</p>
                </div>
              )}
            </div>

            {/* Card Footer (Actions) */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
              {booking.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "REJECTED")}
                    disabled={statusMutation.isPending}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-red-600 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                    disabled={statusMutation.isPending}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {statusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Accept
                  </button>
                </div>
              )}

              {booking.status === "ACCEPTED" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setOtpModal(booking.id); setOtpValue(""); setOtpError(""); }}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5" /> Enter OTP to Start
                  </button>
                  <button
                    onClick={() => { setReviseModal(booking.id); setNewPrice(""); setReviseReason(""); }}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="h-3.5 w-3.5" /> Revise
                  </button>
                </div>
              )}

              {booking.status === "IN_PROGRESS" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                    disabled={statusMutation.isPending}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {statusMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Mark Completed
                  </button>
                  <button
                    onClick={() => { setReviseModal(booking.id); setNewPrice(""); setReviseReason(""); }}
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="h-3.5 w-3.5" /> Revise
                  </button>
                </div>
              )}

              {booking.status === "WAITING_APPROVAL" && (
                <button disabled className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs cursor-not-allowed">
                  Awaiting Client Approval
                </button>
              )}

              {(booking.status === "COMPLETED" || booking.status === "REJECTED" || booking.status === "CANCELLED") && (
                <button disabled className="w-full py-2 px-3 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs cursor-not-allowed">
                  {booking.status === "COMPLETED" ? "Job Completed" : booking.status === "REJECTED" ? "Job Rejected" : "Job Cancelled"}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
            <Briefcase className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500 font-medium">No jobs found.</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === "pending" ? "No pending requests at the moment." : "Try a different filter."}
            </p>
          </div>
        )}
      </div>

      {/* ─── OTP Modal ───────────────────────────────────────────── */}
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Enter Start Code</h3>
              <button onClick={() => setOtpModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Ask the client for their 4-digit Start Code to begin the job.</p>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otpValue[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const newOtp = otpValue.split("");
                    newOtp[i] = val;
                    setOtpValue(newOtp.join("").slice(0, 4));
                    if (val && i < 3) {
                      const next = e.target.nextElementSibling as HTMLInputElement;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otpValue[i] && i > 0) {
                      const prev = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      prev?.focus();
                    }
                  }}
                  className="h-12 w-12 text-center text-xl font-bold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              ))}
            </div>
            {otpError && <p className="text-xs text-red-600 text-center font-medium">{otpError}</p>}
            <button
              onClick={() => handleStartJob(otpModal)}
              disabled={startJobMutation.isPending || otpValue.length !== 4}
              className="w-full py-2.5 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {startJobMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Start Job
            </button>
          </div>
        </div>
      )}

      {/* ─── Revise Price Modal ───────────────────────────────────── */}
      {reviseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Revise Price</h3>
              <button onClick={() => setReviseModal(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Set a new price and provide a reason. The client will need to approve.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">New Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
                <textarea
                  value={reviseReason}
                  onChange={(e) => setReviseReason(e.target.value)}
                  placeholder="Explain why the price changed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleReviseQuote(reviseModal)}
              disabled={reviseMutation.isPending}
              className="w-full py-2.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {reviseMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DollarSign className="h-3.5 w-3.5" />}
              Submit Revised Price
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequestManager;
