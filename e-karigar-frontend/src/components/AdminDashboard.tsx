import { useEffect, useState } from "react";
import { Check, X, Shield, Users, Loader2, Briefcase, BarChart3, Phone, CreditCard, Clock, Trash2, Package, Search } from "lucide-react";
import api from "../services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  is_active: boolean;
}

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
  services?: Service[];
}

interface DashboardStats {
  pendingVendors: number;
  approvedVendors: number;
  totalUsers: number;
  totalServices: number;
}

const AdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [approvedVendors, setApprovedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  // Fetch Data
  const fetchData = async () => {
    try {
      const [pendingRes, approvedRes, statsRes] = await Promise.all([
        api.get("/admin/vendors/pending"),
        api.get("/admin/vendors/approved"),
        api.get("/admin/stats"),
      ]);
      setPendingVendors(pendingRes.data);
      setApprovedVendors(approvedRes.data);
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
      fetchData();
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
      setPendingVendors(pendingVendors.filter((v) => v.id !== vendorId));
      if (stats) setStats({ ...stats, pendingVendors: stats.pendingVendors - 1 });
    } catch (error) {
      alert("Failed to reject vendor.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Vendor Handler
  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to delete this vendor? This will remove all their data.")) return;

    setActionLoading(vendorId);
    try {
      await api.delete(`/admin/vendors/${vendorId}`);
      setApprovedVendors(approvedVendors.filter(v => v.id !== vendorId));
      if (stats) setStats({ ...stats, approvedVendors: stats.approvedVendors - 1 });
    } catch (error) {
      alert("Failed to delete vendor.");
    } finally {
      setActionLoading(null);
    }
  }

  // Delete Service Handler
  const handleDeleteService = async (serviceId: string, vendorId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/admin/services/${serviceId}`);
      setApprovedVendors(approvedVendors.map(v => {
        if (v.id === vendorId && v.services) {
          return {
            ...v,
            services: v.services.filter(s => s.id !== serviceId)
          };
        }
        return v;
      }));
    } catch (error) {
      alert("Failed to delete service.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-slate-600 font-medium">Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Pending Approvals", value: stats?.pendingVendors, icon: Shield, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Active Vendors", value: stats?.approvedVendors, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Total Services", value: stats?.totalServices, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value || 0}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'pending'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
            }`}
        >
          Pending Approvals <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{pendingVendors.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'approved'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
            }`}
        >
          Approved Vendors <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{approvedVendors.length}</span>
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {/* PENDING VENDORS TAB */}
        {activeTab === 'pending' && (
          <div>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Pending Requests</h3>
              <div className="text-sm text-slate-500">Action required for new applications</div>
            </div>

            {pendingVendors.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-emerald-50 p-4 rounded-full mb-4">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-slate-900 text-lg font-medium">All caught up!</p>
                <p className="text-slate-500">No pending vendor requests at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingVendors.map((vendor) => (
                  <div key={vendor.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                          {vendor.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg">{vendor.user.name}</h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">PENDING</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">{vendor.user.email}</p>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                              {vendor.vendor_type}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                              {vendor.city}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                              {new Date(vendor.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedVendor(expandedVendor === vendor.id ? null : vendor.id)}
                          className="px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg text-sm font-medium transition-all"
                        >
                          {expandedVendor === vendor.id ? "Hide Details" : "View Details"}
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          disabled={actionLoading === vendor.id}
                          className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          disabled={actionLoading === vendor.id}
                          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm hover:shadow transition-all text-sm font-medium disabled:opacity-50"
                        >
                          {actionLoading === vendor.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Approve
                        </button>
                      </div>
                    </div>

                    {expandedVendor === vendor.id && (
                      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-slate-800 text-sm">Contact Information</h5>
                          <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Business Phone:</span>
                            <span className="font-medium text-slate-900">{vendor.business_phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">CNIC:</span>
                            <span className="font-medium text-slate-900">{vendor.cnic || "N/A"}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-semibold text-slate-800 text-sm">Professional Bio</h5>
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed">
                            {vendor.description || "No description provided."}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPROVED VENDORS TAB */}
        {activeTab === 'approved' && (
          <div>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Approved Vendors Registry</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            {approvedVendors.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No approved vendors found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {approvedVendors.map((vendor) => (
                  <div key={vendor.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                          {vendor.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg hover:text-indigo-600 transition-colors cursor-pointer">{vendor.user.name}</h4>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wide rounded-full border border-emerald-200">VERIFIED</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-1">{vendor.user.email}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{vendor.city}</span>
                            <span>•</span>
                            <span>{vendor.business_phone}</span>
                            <span>•</span>
                            <span>{vendor.services?.length || 0} Services Listed</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedVendor(expandedVendor === vendor.id ? null : vendor.id)}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-sm font-medium transition-all shadow-sm"
                        >
                          {expandedVendor === vendor.id ? "Close Manager" : "Manage Services"}
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          disabled={actionLoading === vendor.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Vendor Account"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {expandedVendor === vendor.id && (
                      <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                        <h5 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <Package className="h-4 w-4 text-indigo-500" />
                          Services offered by {vendor.user.name}
                        </h5>

                        {(!vendor.services || vendor.services.length === 0) ? (
                          <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                            <p className="text-sm">No services listed by this vendor yet.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.services.map(service => (
                              <div key={service.id} className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all flex justify-between items-start">
                                <div>
                                  <h6 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{service.title}</h6>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{service.description}</p>
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">Rs. {service.price}</span>
                                    {service.is_active ? (
                                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                                    ) : (
                                      <span className="w-2 h-2 rounded-full bg-slate-300" title="Inactive"></span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteService(service.id, vendor.id)}
                                  className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Service"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;