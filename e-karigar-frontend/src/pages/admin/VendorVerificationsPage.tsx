import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Eye,
  Loader2,
  Search,
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Vendor {
  id: string;
  vendor_type: string;
  city: string;
  experience_years: number;
  created_at: string;
  user: User;
}

const VendorVerificationsPage = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/vendors/pending");
      setPendingVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch pending vendors", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = pendingVendors.filter(
    (v) =>
      v.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const daysAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <Link
            to="/admin/vendors"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider mb-3 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Hub
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Vendor Verifications
            </h1>
          </div>
          <p className="text-sm text-slate-500 ml-[52px]">
            Review and approve pending professional applications
          </p>
        </div>

        {/* Count Badge */}
        {!loading && (
          <div className="shrink-0 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm text-center min-w-[110px]">
            <p className="text-3xl font-black text-slate-900 leading-tight">
              {filteredVendors.length}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              {searchQuery ? "Results" : "Pending"}
            </p>
          </div>
        )}
      </div>

      {/* ── Search + Filter Bar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="search-verifications"
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
            placeholder="Search by name, email or city…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors px-3"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">
            Applications Queue
          </h2>
          {!loading && pendingVendors.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
              {pendingVendors.length} awaiting review
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              Scanning applications…
            </p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            {searchQuery ? (
              <>
                <Search className="h-10 w-10 text-slate-200" />
                <p className="text-slate-500 text-sm font-medium">
                  No results for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-300" />
                <p className="text-slate-700 font-bold text-base">
                  All caught up!
                </p>
                <p className="text-slate-400 text-sm">
                  No pending vendor applications at this time.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Applicant
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Specialty
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Experience
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Location
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Applied
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="group hover:bg-indigo-50/30 transition-colors"
                    >
                      {/* Applicant */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-sm shrink-0">
                            {vendor.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 leading-tight">
                              {vendor.user.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {vendor.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Specialty */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                          <Briefcase className="h-3 w-3" />
                          {vendor.vendor_type || "General"}
                        </span>
                      </td>
                      {/* Experience */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-700">
                          {vendor.experience_years}{" "}
                          <span className="text-slate-400 font-normal">
                            yr{vendor.experience_years !== 1 ? "s" : ""}
                          </span>
                        </span>
                      </td>
                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {vendor.city}
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                          <span>{daysAgo(vendor.created_at)}</span>
                        </div>
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/vendors/${vendor.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded-lg transition-all group-hover:shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm shrink-0">
                        {vendor.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {vendor.user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {vendor.user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/vendors/${vendor.id}`}
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" /> Review
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 ml-14">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {vendor.city}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />{" "}
                      {vendor.experience_years} yrs
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {daysAgo(vendor.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        {!loading && filteredVendors.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40">
            <p className="text-xs text-slate-400 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredVendors.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {pendingVendors.length}
              </span>{" "}
              applications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorVerificationsPage;
