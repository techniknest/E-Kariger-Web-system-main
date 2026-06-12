import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  UserCheck,
  Ban,
  Loader2,
  Search,
  ArrowLeft,
  Briefcase,
  ChevronRight,
  Users,
  TrendingUp,
  Phone,
  Grid3X3,
  List,
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
  business_phone: string;
  user: User;
  averageRating?: number;
  totalReviews?: number;
  completedJobsCount?: number;
}

const ViewVendorsPage = () => {
  const [activeTab, setActiveTab] = useState<"active" | "suspended">("active");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    fetchVendors();
  }, [activeTab]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "active"
          ? "/admin/vendors/approved"
          : "/admin/vendors/suspended";
      const res = await api.get(endpoint);
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
      toast.error("Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        <Star
          className={`h-3.5 w-3.5 ${
            rating > 0 ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
        <span className="text-sm font-bold text-slate-900">
          {rating > 0 ? rating.toFixed(1) : "—"}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/vendors"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-bold uppercase tracking-wider mb-3 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Hub
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Vendor Directory
            </h1>
          </div>
          <p className="text-sm text-slate-500 ml-[52px]">
            Browse and manage all professional partner accounts
          </p>
        </div>

        {/* Stats strip */}
        {!loading && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center shadow-sm">
              <p className="text-xl font-black text-slate-900">{vendors.length}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeTab === "active" ? "Active" : "Suspended"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Controls Bar ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="search-vendors"
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
            placeholder="Search by name, email or city…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            id="tab-active-vendors"
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "active"
                ? "bg-white text-green-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" /> Active
          </button>
          <button
            id="tab-suspended-vendors"
            onClick={() => setActiveTab("suspended")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "suspended"
                ? "bg-white text-red-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Ban className="h-3.5 w-3.5" /> Suspended
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Table view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">
            {activeTab === "active" ? "Active Partners" : "Suspended Accounts"}
          </h2>
          {!loading && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                activeTab === "active"
                  ? "text-green-700 bg-green-50 border-green-100"
                  : "text-red-600 bg-red-50 border-red-100"
              }`}
            >
              {filteredVendors.length}{" "}
              {searchQuery ? "results" : activeTab === "active" ? "active" : "suspended"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-400">
              Loading directory…
            </p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Briefcase className="h-12 w-12 text-slate-200" />
            <p className="text-slate-600 font-bold text-base">
              {searchQuery ? `No results for "${searchQuery}"` : "No vendors here"}
            </p>
            <p className="text-slate-400 text-sm">
              {searchQuery
                ? "Try adjusting your search"
                : activeTab === "active"
                ? "No active vendors yet"
                : "No suspended accounts"}
            </p>
          </div>
        ) : viewMode === "table" ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Vendor
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Location
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Specialty
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Jobs
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Rating
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
                      className={`group transition-colors ${
                        activeTab === "active"
                          ? "hover:bg-green-50/30"
                          : "hover:bg-red-50/20"
                      }`}
                    >
                      {/* Vendor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${
                              activeTab === "suspended"
                                ? "bg-gradient-to-br from-red-400 to-rose-500 text-white"
                                : "bg-gradient-to-br from-green-400 to-teal-500 text-white"
                            }`}
                          >
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
                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {vendor.city}
                        </div>
                      </td>
                      {/* Specialty */}
                      <td className="px-6 py-4">
                        {vendor.vendor_type ? (
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {vendor.vendor_type}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      {/* Jobs */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">
                            {vendor.completedJobsCount || 0}
                          </span>
                        </div>
                      </td>
                      {/* Rating */}
                      <td className="px-6 py-4">
                        {renderStars(vendor.averageRating)}
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/vendors/${vendor.id}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-lg border transition-all ${
                            activeTab === "active"
                              ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                              : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          Manage
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-11 w-11 rounded-full flex items-center justify-center font-black text-base shadow-sm shrink-0 ${
                          activeTab === "suspended"
                            ? "bg-gradient-to-br from-red-400 to-rose-500 text-white"
                            : "bg-gradient-to-br from-green-400 to-teal-500 text-white"
                        }`}
                      >
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
                      Manage
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 ml-14">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {vendor.city}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />{" "}
                      {vendor.completedJobsCount || 0} jobs
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                      {vendor.averageRating?.toFixed(1) || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Grid View */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`relative border rounded-2xl p-5 hover:shadow-md transition-all duration-200 ${
                  activeTab === "active"
                    ? "border-slate-200 hover:border-green-200"
                    : "border-slate-200 hover:border-red-200"
                } bg-white`}
              >
                {activeTab === "suspended" && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Suspended
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${
                      activeTab === "suspended"
                        ? "bg-gradient-to-br from-red-400 to-rose-500 text-white"
                        : "bg-gradient-to-br from-green-400 to-teal-500 text-white"
                    }`}
                  >
                    {vendor.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {vendor.user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {vendor.user.email}
                    </p>
                    {vendor.vendor_type && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {vendor.vendor_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-base font-black text-slate-900">
                      {vendor.completedJobsCount || 0}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Jobs
                    </p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <p className="text-base font-black text-slate-900">
                      {vendor.averageRating?.toFixed(1) || "—"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Rating
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-slate-900 truncate text-xs leading-tight pt-0.5">
                      {vendor.city}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      City
                    </p>
                  </div>
                </div>

                <Link
                  to={`/admin/vendors/${vendor.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 text-xs font-black bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200  rounded-xl transition-all"
                >
                  Manage Profile <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && filteredVendors.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredVendors.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">{vendors.length}</span>{" "}
              vendors
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewVendorsPage;
