import { useEffect, useState } from "react";
import { Users, Briefcase, BarChart3, ShieldAlert, CheckCircle, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

interface Vendor {
  id: string;
  vendor_type: string;
  city: string;
  cnic: string;
  experience_years: number;
  user: {
    name: string;
    phone: string;
  };
  averageRating?: number;
  totalReviews?: number;
}

interface DashboardStats {
  pendingVendors: number;
  approvedVendors: number;
  totalUsers: number;
  totalServices: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [approvedVendors, setApprovedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes, approvedRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/vendors/pending"),
        api.get("/admin/vendors/approved"),
      ]);
      setStats(statsRes.data);
      setPendingVendors(pendingRes.data);
      setApprovedVendors(approvedRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (vendorId: string) => {
    setActionLoading(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`);
      toast.success("Vendor approved successfully");
      fetchData(); // Refetch to update table and stats
    } catch (error) {
      toast.error("Failed to approve vendor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!confirm("Are you sure you want to reject this vendor application?")) return;

    setActionLoading(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/reject`);
      toast.success("Vendor rejected");
      fetchData(); // Refetch to update table and stats
    } catch (error) {
      toast.error("Failed to reject vendor");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-8 min-h-full">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  const hasPending = (stats?.pendingVendors ?? 0) > 0;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-full space-y-8 animate-in fade-in duration-500">

      {/* 1. Main Layout & Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Command Center</h1>
        <p className="text-sm text-slate-500 mt-1">Platform overview and pending actions.</p>
      </div>

      {/* 2. Top Section: KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Active Vendors", value: stats?.approvedVendors || 0, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Services", value: stats?.totalServices || 0, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
          {
            label: "Pending Vendors",
            value: stats?.pendingVendors || 0,
            icon: ShieldAlert,
            color: hasPending ? "text-yellow-600" : "text-slate-500",
            bg: hasPending ? "bg-yellow-50" : "bg-slate-100",
            border: hasPending ? "border border-yellow-200 ring-1 ring-yellow-50" : "border border-gray-200"
          },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl shadow-sm flex items-center gap-4 ${stat.border || 'border border-gray-200'} hover:shadow-md transition-shadow`}>
            {/* Left: Icon */}
            <div className={`p-3 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            {/* Right: Value & Label */}
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content: Vendor Verification Table */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Vendor Approvals</h2>

        {pendingVendors.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
            <p className="text-slate-500 text-sm font-medium">All caught up! No pending applications.</p>
          </div>
        ) : (
          // Table Data
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Name</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">CNIC</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 text-sm">
                      <div className="font-medium text-slate-900">{vendor.user.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{vendor.user.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700 font-mono text-xs">{vendor.cnic}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{vendor.city}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{vendor.experience_years} yrs</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          disabled={actionLoading === vendor.id}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-medium text-xs hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading === vendor.id && <Loader2 className="h-3 w-3 animate-spin" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          disabled={actionLoading === vendor.id}
                          className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium text-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading === vendor.id && <Loader2 className="h-3 w-3 animate-spin" />}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Approved Vendors Table with Ratings */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Approved Vendors</h2>
        {approvedVendors.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <Users className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm font-medium">No approved vendors yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor Name</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                  <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm">
                      <div className="font-medium text-slate-900">{vendor.user.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{vendor.user.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700">{vendor.city || '-'}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{vendor.experience_years || 0} yrs</td>
                    <td className="py-4 px-6 text-sm">
                      {vendor.totalReviews && vendor.totalReviews > 0 ? (
                        <span className={`flex items-center gap-1 font-medium ${(vendor.averageRating || 0) < 3.0 ? 'text-red-600' : 'text-slate-900'
                          }`}>
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {vendor.averageRating}
                          <span className="text-slate-400 font-normal">({vendor.totalReviews})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">No reviews</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;