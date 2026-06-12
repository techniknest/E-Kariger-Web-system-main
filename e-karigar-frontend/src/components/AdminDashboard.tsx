import { useEffect, useState } from "react";
import { Users, Briefcase, BarChart3, ShieldAlert, CheckCircle, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";



interface DashboardStats {
  pendingVendors: number;
  approvedVendors: number;
  totalUsers: number;
  totalServices: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data);
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
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-indigo-700", bg: "bg-indigo-50" },
          { label: "Active Vendors", value: stats?.approvedVendors || 0, icon: Briefcase, color: "text-green-600", bg: "bg-green-50" },
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



    </div>
  );
};

export default AdminDashboard;