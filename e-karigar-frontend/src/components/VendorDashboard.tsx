import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  DollarSign,
  Trash2,
  Package,
  TrendingUp,
  Users,
  Loader2,
  Edit2,
  Archive,
  Clock,
  Star,
  Briefcase,
  ArrowRight,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";
import api, { bookingsApi, reviewsApi } from "../services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  is_active: boolean;
  created_at: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "Vendor" };

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ title: string; description: string; price: string; imageFile: File | null }>({
    title: "",
    description: "",
    price: "",
    imageFile: null,
  });

  // ─── Data Queries ──────────────────────────────────────────────
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["vendorServices"],
    queryFn: () => api.get("/services/my").then((res) => res.data),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<any[]>({
    queryKey: ["vendorBookings"],
    queryFn: () => bookingsApi.getVendorBookings(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const { data: ratingData } = useQuery<{ averageRating: number; totalReviews: number }>({
    queryKey: ["vendorRating"],
    queryFn: () => reviewsApi.getMyRating(),
  });

  const loading = servicesLoading || bookingsLoading;

  // ─── Stats ─────────────────────────────────────────────────────
  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.total_price), 0);
  const pendingJobs = bookings.filter((b) => b.status === "PENDING").length;
  const activeJobs = bookings.filter((b) => ["ACCEPTED", "IN_PROGRESS"].includes(b.status)).length;

  // ─── Service CRUD ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingServiceId) {
        await api.patch(`/services/${editingServiceId}`, data, config);
        toast.success("Service updated!");
      } else {
        await api.post("/services", data, config);
        toast.success("Service published!");
      }
      setShowForm(false);
      setEditingServiceId(null);
      setFormData({ title: "", description: "", price: "", imageFile: null });
      queryClient.invalidateQueries({ queryKey: ["vendorServices"] });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save service";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      imageFile: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["vendorServices"] });
    },
    onError: () => {
      toast.error("Failed to delete service");
    },
  });

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    deleteMutation.mutate(id);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingServiceId(null);
    setFormData({ title: "", description: "", price: "", imageFile: null });
  };

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 text-indigo-700 animate-spin" />
        <span className="ml-2 text-slate-500 text-sm font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* ─── Header & Suspension Alert ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">
              Manage your services, track earnings, and review your professional reputation.
            </p>
          </div>
          {user.vendorStatus === 'SUSPENDED' && (
             <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold uppercase tracking-widest shadow-sm">
                <Ban className="h-4 w-4" /> Account Suspended
             </div>
          )}
      </div>

      {user.vendorStatus === 'SUSPENDED' && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-[80px] opacity-10"></div>
          <div className="p-3 bg-white rounded-xl shadow-sm border border-red-100 shrink-0 relative z-10">
            <Ban className="h-6 w-6 text-red-600" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-red-900 text-base uppercase tracking-wide">Professional Profile Suspended</h3>
            <p className="text-red-700 text-sm mt-2 font-medium leading-relaxed max-w-3xl">
              Your services are currently hidden from the platform and you cannot accept new bookings. Please contact the administrative support team to review your account details and resolve this issue.
            </p>
          </div>
        </div>
      )}

      {/* ─── Liquid Glass Stats Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Active Services", value: services.length, icon: Package, color: "text-indigo-600", border: 'ring-indigo-100', bg: "bg-indigo-50", fill: "bg-gradient-to-br from-white to-indigo-50/30" },
          { label: "Total Revenue", value: `Rs. ${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", border: 'ring-emerald-100', bg: "bg-emerald-50", fill: "bg-gradient-to-br from-white to-emerald-50/30" },
          { label: "Assignments", value: bookings.length, icon: Users, color: "text-violet-600", border: 'ring-violet-100', bg: "bg-violet-50", fill: "bg-gradient-to-br from-white to-violet-50/30" },
          { label: "Client Rating", value: ratingData?.averageRating ? `${ratingData.averageRating.toFixed(1)}/5.0` : "N/A", icon: Star, color: "text-amber-600", border: 'ring-amber-100', bg: "bg-amber-50", fill: "bg-gradient-to-br from-white to-amber-50/30" },
        ].map((stat, idx) => (
          <div key={idx} className={`relative p-6 rounded-[2rem] ring-1 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${stat.fill} ${stat.border} overflow-hidden group`}>
            {/* Soft decorative background element */}
            <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-100 ${stat.bg}`}></div>
            
            <div className="flex flex-col gap-4 relative z-10">
                <div className={`self-start p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-white/50 shadow-sm`}>
                    <stat.icon className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">{stat.label}</h4>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Active Operations / Actions ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Actions (Col-Span 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
                onClick={() => {
                    if (user.vendorStatus === 'SUSPENDED') {
                    toast.error("Suspended vendors cannot list new services.");
                    return;
                    }
                    setEditingServiceId(null);
                    setFormData({ title: "", description: "", price: "", imageFile: null });
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={user.vendorStatus === 'SUSPENDED'}
                className={`relative overflow-hidden group flex flex-col justify-between p-6 rounded-3xl transition-all shadow-sm ring-1 ring-black/5 min-h-[140px] text-left
                    ${user.vendorStatus === 'SUSPENDED' 
                        ? 'bg-slate-50 cursor-not-allowed opacity-70' 
                        : 'bg-indigo-600 text-white hover:shadow-lg shadow-indigo-600/20 active:scale-[0.98]'}`}
            >
                {user.vendorStatus !== 'SUSPENDED' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
                )}
                <div className={`p-2.5 rounded-xl self-start ${user.vendorStatus === 'SUSPENDED' ? 'bg-slate-200 text-slate-400' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                    <Plus className="h-5 w-5" />
                </div>
                <div>
                    <h4 className={`text-base font-bold mb-1 ${user.vendorStatus === 'SUSPENDED' ? 'text-slate-500' : 'text-white'}`}>Publish Service</h4>
                    <p className={`text-[11px] font-medium ${user.vendorStatus === 'SUSPENDED' ? 'text-slate-400' : 'text-indigo-100'}`}>Create a new listing</p>
                </div>
            </button>

            <button onClick={() => navigate("/vendor/jobs")} className="flex flex-col justify-between p-6 rounded-3xl bg-white hover:bg-slate-50 ring-1 ring-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98] min-h-[140px] text-left group">
                <div className="flex items-center justify-between w-full">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    {pendingJobs > 0 && (
                        <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                        {pendingJobs} New
                        </span>
                    )}
                </div>
                <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">Assignment Log</h4>
                    <p className="text-[11px] font-medium text-slate-500">Track client requests</p>
                </div>
            </button>

            <button onClick={() => navigate("/vendor/earnings")} className="flex flex-col justify-between p-6 rounded-3xl bg-white hover:bg-slate-50 ring-1 ring-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98] min-h-[140px] text-left group">
                <div className="flex items-center justify-between w-full">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>
                <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">Financial Report</h4>
                    <p className="text-[11px] font-medium text-slate-500">View payout history</p>
                </div>
            </button>
        </div>

        {/* Active Banner (Col-Span 4) */}
        <div className="lg:col-span-4">
           {activeJobs > 0 ? (
               <div className="h-full bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-center ring-1 ring-indigo-900/50 shadow-xl shadow-indigo-900/10">
                   <div className="absolute -right-4 -bottom-4 opacity-10">
                       <Briefcase className="w-40 h-40" />
                   </div>
                   <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            In Progress
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-2">{activeJobs} Job{activeJobs !== 1 && 's'}</h3>
                        <p className="text-indigo-200 text-sm font-medium leading-relaxed mb-6">
                            You currently have active assignments pending completion.
                        </p>
                        <button onClick={() => navigate("/vendor/jobs")} className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                            Manage Workspace <ArrowRight className="h-4 w-4" />
                        </button>
                   </div>
               </div>
           ) : (
                <div className="h-full bg-slate-100 rounded-[2rem] p-6 text-center flex flex-col items-center justify-center border border-slate-200 border-dashed">
                    <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-slate-200">
                        <Briefcase className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No Active Jobs</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium px-4">Your schedule is completely clear for the day.</p>
                </div>
           )}
        </div>
      </div>

      {/* ─── Service Form Panel ──────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden transform animate-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {editingServiceId ? <Edit2 className="h-5 w-5 text-indigo-600" /> : <Plus className="h-5 w-5 text-indigo-600" />}
                        {editingServiceId ? "Modify Service Matrix" : "Deploy New Listing"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Configure network-facing details for this service offering.</p>
                </div>
                <button onClick={cancelEdit} className="p-2 bg-white ring-1 ring-slate-200 rounded-lg text-slate-400 hover:text-slate-600 shadow-sm transition-all hover:bg-slate-50">
                    <Ban className="h-4 w-4" />
                </button>
            </div>
            <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Identity Title</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., HVAC Maintenance & Repair"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Base Pricing Metric (Rs)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="Base service rate (e.g., 500)"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Description</label>
                        <textarea
                            className="input-field min-h-[120px] resize-y"
                            placeholder="Detail exactly what this service guarantees..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Visual Asset (Optional, Max 1MB)</label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-3 file:px-6
                                      file:rounded-xl file:border-0
                                      file:text-xs file:font-black file:uppercase file:tracking-wide
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100 transition-all cursor-pointer bg-slate-50 border border-slate-200 rounded-xl"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024) {
                                                toast.error("File size limits exceeded (Max 1MB).");
                                                e.target.value = "";
                                                return;
                                            }
                                            setFormData({ ...formData, imageFile: file });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button type="button" onClick={cancelEdit} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {editingServiceId ? "Sync Metadata" : "Broadcast Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* ─── Service Grid Portfolio ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 border-l-4 border-indigo-600 pl-3">
                Service Catalog
            </h2>
            {!showForm && services.length > 0 && (
                <button
                    onClick={() => {
                        if (user.vendorStatus === 'SUSPENDED') return toast.error("Account suspended.");
                        setEditingServiceId(null);
                        setFormData({ title: "", description: "", price: "", imageFile: null });
                        setShowForm(true);
                    }}
                    className="flex flex-row items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                    <Plus className="h-3.5 w-3.5" /> Add Listing
                </button>
            )}
        </div>

        {services.length === 0 && !showForm ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] p-16 text-center shadow-sm">
                <div className="bg-indigo-50 p-6 rounded-3xl inline-flex mb-6 ring-1 ring-indigo-100/50">
                    <Package className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Empty Catalog Layer</h3>
                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto font-medium">
                    Deploy your first service listing to the network so clients can begin dispatching assignments.
                </p>
                <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
                    Initialize First Service
                </button>
            </div>
        ) : (
            !showForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                            {/* Service Image Header */}
                            <div className="h-40 bg-slate-100 relative overflow-hidden ring-1 ring-black/5 ring-inset">
                                {service.images && service.images.length > 0 ? (
                                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                        <Package className="h-10 w-10 mb-2 opacity-50" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">No Visual</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border backdrop-blur-md ${
                                        service.is_active 
                                          ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/30" 
                                          : "bg-slate-900/40 text-slate-300 border-slate-500/50"
                                    }`}>
                                        {service.is_active ? "Live" : "Offline"}
                                    </span>
                                    <div className="bg-white/95 backdrop-blur shadow-sm text-slate-900 px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1">
                                       <span className="text-[10px] text-slate-500 font-bold uppercase">Rs.</span> {service.price}
                                    </div>
                                </div>
                            </div>

                            {/* Service Details Body */}
                            <div className="p-5 sm:p-6 flex-1 flex flex-col bg-white">
                                <h4 className="font-bold text-lg text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {service.title}
                                </h4>
                                <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 bg-slate-50 rounded-xl p-3 ring-1 ring-slate-100/50 leading-relaxed overflow-hidden">
                                    {service.description || "No description provided."}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200 hover:text-slate-900 rounded-xl transition-all text-xs font-bold shadow-sm"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" /> Configure
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2.5 bg-white text-red-500 hover:bg-red-50 hover:text-red-700 ring-1 ring-red-100 hover:ring-red-200 rounded-xl transition-all shadow-sm"
                                        title="Delete Framework"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        )}
      </div>

    </div>
  );
};

export default VendorDashboard;
