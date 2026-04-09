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
        <Loader2 className="h-6 w-6 text-blue-700 animate-spin" />
        <span className="ml-2 text-slate-500 text-sm font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900">Vendor Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Welcome back, <span className="font-medium text-slate-700">{user.name}</span>.
        </p>
      </div>

      {/* ─── Stats Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Services", value: services.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Earnings", value: `Rs. ${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Bookings", value: bookings.length, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "My Rating", value: ratingData?.averageRating ? `${ratingData.averageRating.toFixed(1)} ⭐` : "N/A", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Quick Actions ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setEditingServiceId(null);
            setFormData({ title: "", description: "", price: "", imageFile: null });
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 bg-blue-700 text-white px-5 py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-sm font-medium text-sm"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </button>
        <button
          onClick={() => navigate("/vendor/jobs")}
          className="flex items-center gap-3 bg-white text-slate-700 px-5 py-3.5 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 font-medium text-sm"
        >
          <Briefcase className="h-4 w-4 text-slate-400" />
          View My Jobs
          {pendingJobs > 0 && (
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingJobs} new
            </span>
          )}
        </button>
        <button
          onClick={() => navigate("/vendor/earnings")}
          className="flex items-center gap-3 bg-white text-slate-700 px-5 py-3.5 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 font-medium text-sm"
        >
          <TrendingUp className="h-4 w-4 text-slate-400" />
          View Earnings
          <ArrowRight className="h-3.5 w-3.5 ml-auto text-slate-400" />
        </button>
      </div>

      {/* ─── Active Jobs Banner ───────────────────────────────────── */}
      {activeJobs > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
          <Briefcase className="h-4 w-4 text-blue-700 shrink-0" />
          <p className="text-sm text-blue-800">
            You have <span className="font-bold">{activeJobs} active job{activeJobs > 1 ? "s" : ""}</span> in progress.
          </p>
          <button
            onClick={() => navigate("/vendor/jobs")}
            className="ml-auto text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            View →
          </button>
        </div>
      )}

      {/* ─── My Services Section ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Services</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {services.length} service{services.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          {!showForm && services.length > 0 && (
            <button
              onClick={() => {
                setEditingServiceId(null);
                setFormData({ title: "", description: "", price: "", imageFile: null });
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-xs font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Service
            </button>
          )}
        </div>

        {/* Add/Edit Service Form */}
        {showForm && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="max-w-2xl mx-auto">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                {editingServiceId ? <Edit2 className="h-4 w-4 text-blue-600" /> : <Plus className="h-4 w-4 text-blue-600" />}
                {editingServiceId ? "Edit Service" : "Create a New Service"}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Service Title</label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
                      placeholder="e.g., AC Repair & Servicing"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Starting Price (Rs)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Rs.</span>
                      <input
                        type="number"
                        className="w-full p-2.5 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
                        placeholder="500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                  <textarea
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition bg-white"
                    rows={3}
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Service Image (Max 1MB)</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 1024 * 1024) {
                          toast.error("File size must be less than 1MB");
                          e.target.value = "";
                          return;
                        }
                        setFormData({ ...formData, imageFile: file });
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5 text-xs font-medium"
                  >
                    {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {editingServiceId ? "Update Service" : "Publish Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service List */}
        {services.length === 0 && !showForm ? (
          <div className="p-12 text-center">
            <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
              <Archive className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 text-sm font-bold mb-1">No Services Yet</h3>
            <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
              Create your first service to start receiving bookings from local customers.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-sm text-xs font-bold"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          !showForm && (
            <div className="divide-y divide-slate-100">
              {services.map((service) => (
                <div key={service.id} className="p-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                          {service.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                            service.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {service.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-1 mb-2 max-w-xl">{service.description}</p>
                      <div className="flex items-center gap-5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-slate-800 font-semibold">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          Rs. {service.price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(service.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-lg transition text-xs font-medium flex items-center gap-1.5"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-xs font-medium flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
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
