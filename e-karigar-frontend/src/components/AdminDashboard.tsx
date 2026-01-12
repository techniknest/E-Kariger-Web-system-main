import { useEffect, useState } from "react";
import { Check, X, Shield, Users, Loader2, Briefcase, BarChart3, Phone, CreditCard, Clock } from "lucide-react";
import api from "../services/api";

interface Vendor {
  id: string;
  vendor_type: string;
  city: string;
  cnic: string;
  business_phone: string;
  experience_years: number;
  description: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

interface DashboardStats {
  pendingVendors: number;
  approvedVendors: number;
  totalUsers: number;
  totalServices: number;
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  // Fetch Pending Vendors and Stats
  const fetchData = async () => {
    try {
      const [vendorsRes, statsRes] = await Promise.all([
        api.get("/admin/vendors/pending"),
        api.get("/admin/stats"),
      ]);
      setVendors(vendorsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve Handler
  const handleApprove = async (vendorId: string) => {
    if (!confirm("Are you sure you want to approve this vendor?")) return;

    setActionLoading(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`);
      setVendors(vendors.filter((v) => v.id !== vendorId));
      if (stats) {
        setStats({
          ...stats,
          pendingVendors: stats.pendingVendors - 1,
          approvedVendors: stats.approvedVendors + 1,
        });
      }
    } catch (error) {
      alert("Failed to approve vendor.");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Handler
  const handleReject = async (vendorId: string) => {
    if (!confirm("Are you sure you want to reject this vendor?")) return;

    setActionLoading(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/reject`);
      setVendors(vendors.filter((v) => v.id !== vendorId));
      if (stats) {
        setStats({
          ...stats,
          pendingVendors: stats.pendingVendors - 1,
        });
      }
    } catch (error) {
      alert("Failed to reject vendor.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingVendors || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Vendors</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.approvedVendors || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalServices || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Pending Vendor Requests</h3>
          <span className="text-sm text-gray-500">{vendors.length} pending</span>
        </div>

        {vendors.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600 text-lg font-medium">All caught up!</p>
            <p className="text-gray-500">No pending vendor requests at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-6 hover:bg-gray-50 transition">
                {/* Main Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {vendor.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{vendor.user.name}</h4>
                      <p className="text-sm text-gray-500">{vendor.user.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {vendor.vendor_type}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {vendor.city}
                        </span>
                        {vendor.experience_years && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            {vendor.experience_years} yrs exp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedVendor(expandedVendor === vendor.id ? null : vendor.id)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition"
                    >
                      {expandedVendor === vendor.id ? "Hide Details" : "View Details"}
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === vendor.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(vendor.id)}
                      disabled={actionLoading === vendor.id}
                      className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedVendor === vendor.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">CNIC:</span>
                      <span className="font-medium text-gray-900">{vendor.cnic || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Business Phone:</span>
                      <span className="font-medium text-gray-900">{vendor.business_phone || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Applied:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(vendor.created_at).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Bio:</p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {vendor.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;