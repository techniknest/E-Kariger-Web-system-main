import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, reviewsApi } from "../../services/api";
import {
  ChevronLeft,
  Calendar,
  Briefcase,
  Star,
  TrendingUp,
  MapPin,
  Phone,
  CreditCard,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Clock,
  Loader2,
  Trash2,
  Ban,
  Mail,
  ShieldCheck,
  Activity,
  ExternalLink,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const VendorDetailsAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Queries
  const {
    data: vendor,
    isLoading: vendorLoading,
    error: vendorError,
  } = useQuery({
    queryKey: ["adminVendorDetails", id],
    queryFn: () => adminApi.getVendorDetails(id!),
    enabled: !!id,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["adminVendorBookings", id],
    queryFn: () => adminApi.getVendorBookingsAdmin(id!),
    enabled: !!id,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["adminVendorReviews", id],
    queryFn: () => reviewsApi.getVendorReviews(id!),
    enabled: !!id,
  });

  // Mutations
  const suspendMutation = useMutation({
    mutationFn: () => adminApi.suspendVendor(id!),
    onSuccess: () => {
      toast.success("Vendor suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["adminVendorDetails", id] });
    },
    onError: () => toast.error("Failed to suspend vendor"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectVendor(id!),
    onSuccess: () => {
      toast.success("Application rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminVendorDetails", id] });
    },
    onError: () => toast.error("Failed to reject vendor"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi.deleteVendor(id!),
    onSuccess: () => {
      toast.success("Vendor deleted successfully");
      navigate("/admin/vendors");
    },
    onError: () => toast.error("Failed to delete vendor"),
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      adminApi.approveVendor?.(id!) || Promise.resolve(),
    onSuccess: () => {
      toast.success("Vendor approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminVendorDetails", id] });
    },
    onError: () => toast.error("Failed to approve vendor"),
  });

  const handleApprove = () => approveMutation.mutate();
  const handleSuspend = () => suspendMutation.mutate();
  const handleReject = () => rejectMutation.mutate();
  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteConfirm(false);
  };

  /* ── Status helpers ─────────────────────────────────────── */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Active",
          badge:
            "bg-green-100 text-green-700 border-green-200",
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          label: "Pending Review",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          badge: "bg-red-100 text-red-700 border-red-200",
          dot: "bg-red-500",
        };
      case "SUSPENDED":
        return {
          label: "Suspended",
          badge:
            "bg-orange-100 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
        };
      default:
        return {
          label: status,
          badge: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const getBookingStatusConfig = (status: string) => {
    const map: Record<
      string,
      { bg: string; text: string; label: string; icon?: React.ReactNode }
    > = {
      PENDING: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        label: "Pending",
      },
      ACCEPTED: {
        bg: "bg-indigo-50 border-indigo-200",
        text: "text-indigo-700",
        label: "Accepted",
      },
      IN_PROGRESS: {
        bg: "bg-indigo-50 border-indigo-200",
        text: "text-indigo-700",
        label: "In Progress",
        icon: <Play className="h-3 w-3" />,
      },
      WAITING_APPROVAL: {
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-700",
        label: "Price Revised",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      COMPLETED: {
        bg: "bg-green-50 border-green-200",
        text: "text-green-700",
        label: "Completed",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      REJECTED: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        label: "Rejected",
      },
      CANCELLED: {
        bg: "bg-slate-100 border-slate-200",
        text: "text-slate-600",
        label: "Cancelled",
        icon: <XCircle className="h-3 w-3" />,
      },
    };
    const c = map[status] || {
      bg: "bg-slate-100 border-slate-200",
      text: "text-slate-600",
      label: status,
    };
    return (
      <span
        className={`${c.bg} ${c.text} border px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wide`}
      >
        {c.icon}
        {c.label}
      </span>
    );
  };

  /* ── Loading / Error states ─────────────────────────────── */
  if (vendorLoading || bookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-400">
          Loading vendor profile…
        </p>
      </div>
    );
  }

  if (vendorError || !vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-slate-700 font-bold">Failed to load vendor</p>
        <p className="text-sm text-slate-400">
          This vendor may have been deleted.
        </p>
        <Link
          to="/admin/vendors"
          className="mt-2 text-sm font-bold text-indigo-600 hover:underline"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(vendor.approval_status);
  const completedCount = bookings.filter(
    (b: any) => b.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider group"
      >
        <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* ── Hero Profile Card ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-7 md:p-8 shadow-2xl">
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-indigo-600/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Identity */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                {vendor.user.name.charAt(0).toUpperCase()}
              </div>
              {/* Status dot */}
              <div
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 ${statusConfig.dot}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {vendor.user.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusConfig.badge}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                  />
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Mail className="h-3.5 w-3.5" />
                  {vendor.user.email}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Phone className="h-3.5 w-3.5" />
                  {vendor.user.phone || vendor.business_phone || "N/A"}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  {vendor.city || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {vendor.approval_status === "PENDING" && (
              <>
                <button
                  id="btn-approve-vendor"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-60"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Approve
                </button>
                <button
                  id="btn-reject-vendor"
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all border border-white/20 disabled:opacity-60"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Reject
                </button>
              </>
            )}

            {vendor.approval_status === "APPROVED" && (
              <button
                id="btn-suspend-vendor"
                onClick={handleSuspend}
                disabled={suspendMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-900/20 disabled:opacity-60"
              >
                {suspendMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                Suspend
              </button>
            )}

            {vendor.approval_status === "SUSPENDED" && (
              <button
                id="btn-reactivate-vendor"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-900/20 disabled:opacity-60"
              >
                {approveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Reactivate
              </button>
            )}

            <button
              id="btn-delete-vendor"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all border border-white/20 disabled:opacity-60"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ───────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Delete Vendor Account?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                This will permanently delete{" "}
                <strong className="text-slate-700">{vendor.user.name}</strong>'s
                account and all associated services. This action{" "}
                <strong className="text-red-600">cannot be undone</strong>.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-200 disabled:opacity-60"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Lifetime Revenue",
            value: `Rs. ${vendor.totalRevenue?.toLocaleString() || "0"}`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
            sub: "Total earnings",
          },
          {
            label: "Completed Jobs",
            value: vendor.completedBookingsCount || 0,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            sub: `${completedCount} in records`,
          },
          {
            label: "Avg. Rating",
            value:
              vendor.averageRating > 0
                ? `${vendor.averageRating.toFixed(1)} ★`
                : "No reviews",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
            sub: "Customer score",
          },
          {
            label: "Member Since",
            value: new Date(vendor.created_at).getFullYear(),
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
            sub: new Date(vendor.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-white border ${kpi.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                {kpi.label}
              </p>
              <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color} shrink-0`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {kpi.value}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main 2-col Layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Details */}
        <div className="space-y-5">
          {/* Identity Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Profile Details
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value:
                    vendor.user.phone ||
                    vendor.business_phone ||
                    "Not provided",
                },
                {
                  icon: MapPin,
                  label: "City",
                  value: vendor.city || "Not provided",
                },
                {
                  icon: CreditCard,
                  label: "CNIC",
                  value: vendor.cnic || "Not provided",
                  mono: true,
                },
                {
                  icon: History,
                  label: "Experience",
                  value: vendor.experience_years
                    ? `${vendor.experience_years} Years`
                    : "Not specified",
                },
                {
                  icon: Briefcase,
                  label: "Specialty",
                  value: vendor.vendor_type || "Not specified",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="p-1.5 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                    <item.icon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-medium text-slate-900 mt-0.5 ${
                        item.mono ? "font-mono tracking-wide" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions Card */}
          {vendor.approval_status === "PENDING" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Awaiting Decision
                  </p>
                  <p className="text-xs text-amber-600">
                    Review this application
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-60"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Approve Vendor
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-60"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Reject Application
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Activity Snapshot
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-500 font-semibold">
                    Completion Rate
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    {bookings.length > 0
                      ? `${Math.round(
                          (completedCount / bookings.length) * 100
                        )}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{
                      width:
                        bookings.length > 0
                          ? `${Math.round(
                              (completedCount / bookings.length) * 100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-slate-900">
                    {bookings.length}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Total
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-green-700">
                    {completedCount}
                  </p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wide">
                    Done
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking History */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Booking History
                </h3>
              </div>
              <span className="text-xs font-black text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                {bookings.length} total
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Briefcase className="h-12 w-12 text-slate-200" />
                <p className="text-slate-600 font-bold">No bookings yet</p>
                <p className="text-xs text-slate-400">
                  This vendor hasn't received any bookings.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Client
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Service
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map((booking: any) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{booking.id.substring(0, 6)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold text-slate-900">
                            {booking.client?.name || "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-slate-600 line-clamp-1 max-w-[140px] block">
                            {booking.service?.title || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="h-3 w-3 text-slate-300 shrink-0" />
                            {new Date(
                              booking.scheduled_date
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {getBookingStatusConfig(booking.status)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-xs font-black text-slate-900">
                            Rs.{" "}
                            {(booking.is_price_revised
                              ? booking.final_price
                              : booking.total_price
                            )?.toLocaleString() || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Client Reviews
                </h3>
              </div>
              <span className="text-xs font-black text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                {reviews.length} total
              </span>
            </div>

            {reviewsLoading ? (
               <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Star className="h-12 w-12 text-slate-200" />
                <p className="text-slate-600 font-bold">No reviews yet</p>
                <p className="text-xs text-slate-400">
                  This vendor hasn't received any reviews.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((review: any) => (
                  <div key={review.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {review.client?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.client?.name || "Unknown Client"}</p>
                          <p className="text-[10px] text-slate-400">
                             {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-600 mt-3 italic pl-10 border-l-2 border-slate-100 ml-4">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsAdmin;
