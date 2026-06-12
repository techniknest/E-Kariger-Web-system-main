import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  ArrowRight,
  Loader2,
  UserCheck,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  Zap,
} from "lucide-react";
import api from "../services/api";

const VendorManagementPage = () => {
  const [stats, setStats] = useState({ pending: 0, active: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pendingRes, approvedRes, suspendedRes] = await Promise.all([
        api.get("/admin/vendors/pending"),
        api.get("/admin/vendors/approved"),
        api.get("/admin/vendors/suspended"),
      ]);
      setStats({
        pending: pendingRes.data.length,
        active: approvedRes.data.length,
        suspended: suspendedRes.data.length,
      });
    } catch (error) {
      console.error("Failed to fetch vendor stats", error);
    } finally {
      setLoading(false);
    }
  };

  const total = stats.active + stats.suspended + stats.pending;
  const healthScore =
    total > 0 ? Math.round((stats.active / total) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-10 shadow-2xl">
        {/* decorative orbs */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
              <Zap className="h-3 w-3 fill-indigo-300" />
              Administration Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Vendor Management
            </h1>
            <p className="text-slate-400 mt-2 max-w-lg text-sm leading-relaxed">
              Your centralized command center for vendor relations — review
              applications, manage professionals, and monitor platform health.
            </p>
          </div>

          {/* Health Score Ring */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 shrink-0">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={healthScore >= 75 ? "#22c55e" : healthScore >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="3"
                  strokeDasharray={`${healthScore} ${100 - healthScore}`}
                  strokeLinecap="round"
                  strokeDashoffset="0"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                {loading ? "—" : `${healthScore}%`}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Platform Health
              </p>
              <p className="text-white font-bold text-sm mt-0.5">
                {healthScore >= 75
                  ? "Excellent"
                  : healthScore >= 50
                  ? "Moderate"
                  : "Needs Attention"}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {stats.active} active vendors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Partners",
            value: loading ? "—" : stats.active,
            icon: UserCheck,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
            trend: "+2 this week",
            trendUp: true,
          },
          {
            label: "Pending Review",
            value: loading ? "—" : stats.pending,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
            trend: stats.pending > 0 ? "Action needed" : "All clear",
            trendUp: stats.pending === 0,
          },
          {
            label: "Suspended",
            value: loading ? "—" : stats.suspended,
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-50",
            border: "border-red-100",
            trend: "Under review",
            trendUp: false,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-white border ${kpi.border} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl shrink-0`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                {kpi.label}
              </p>
              <p className="text-2xl font-black text-slate-900 leading-tight">
                {kpi.value}
              </p>
              <p
                className={`text-[11px] font-semibold mt-0.5 ${
                  kpi.trendUp ? "text-green-600" : "text-slate-400"
                }`}
              >
                {kpi.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section Cards ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-slate-400 mt-3 font-medium">
            Loading platform data…
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Vendor Verifications */}
          <Link
            to="/admin/vendors/verifications"
            id="nav-vendor-verifications"
            className="group relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-t-3xl" />

            {/* ping if pending */}
            {stats.pending > 0 && (
              <span className="absolute top-5 right-5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            )}

            <div className="flex items-start gap-5 mb-6">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  New Applications
                </span>
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {stats.pending}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              Vendor Verifications
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Review new vendor applications, check credentials, and onboard
              qualified professionals to the platform.
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {stats.pending > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
                    {stats.pending} awaiting
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                    All clear
                  </span>
                )}
              </div>
              <span className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Review <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* Card: View Vendors */}
          <Link
            to="/admin/vendors/directory"
            id="nav-vendor-directory"
            className="group relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-3xl" />

            <div className="flex items-start gap-5 mb-6">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300 shadow-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  All Partners
                </span>
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {stats.active + stats.suspended}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
              Vendor Directory
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Browse and manage all active and suspended vendor accounts.
              Access detailed profiles, job history, and take administrative
              actions.
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  {stats.active} Active
                </span>
                {stats.suspended > 0 && (
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    {stats.suspended} Suspended
                  </span>
                )}
              </div>
              <span className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Browse <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ── Quick Activity Panel ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Platform Overview
            </h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Live Data
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">
                Active Rate
              </span>
              <span className="text-xs font-bold text-green-600">
                {loading ? "—" : `${healthScore}%`}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                style={{ width: loading ? "0%" : `${healthScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">
                Suspended Rate
              </span>
              <span className="text-xs font-bold text-orange-600">
                {loading || total === 0
                  ? "—"
                  : `${Math.round((stats.suspended / total) * 100)}%`}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700"
                style={{
                  width:
                    loading || total === 0
                      ? "0%"
                      : `${Math.round((stats.suspended / total) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">
                Pending Queue
              </span>
              <span className="text-xs font-bold text-amber-600">
                {loading || total === 0
                  ? "—"
                  : `${Math.round((stats.pending / total) * 100)}%`}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700"
                style={{
                  width:
                    loading || total === 0
                      ? "0%"
                      : `${Math.round((stats.pending / total) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagementPage;
