import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, Trash2, Package, TrendingUp, Users, Home, Loader2, Edit2, Archive, Clock } from "lucide-react";
import api from "../services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Mode State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: "", description: "", price: "" });

  // Fetch My Services
  const fetchServices = async () => {
    try {
      const res = await api.get("/services/my");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle Create or Update Service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingServiceId) {
        // UPDATE Existing Service
        await api.patch(`/services/${editingServiceId}`, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        // CREATE New Service
        await api.post("/services", {
          ...formData,
          price: parseFloat(formData.price),
        });
      }

      setShowForm(false);
      setEditingServiceId(null);
      setFormData({ title: "", description: "", price: "" });
      fetchServices();
    } catch (err) {
      alert(editingServiceId ? "Failed to update service" : "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price.toString()
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete Click
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      alert("Failed to delete service");
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setShowForm(false);
    setEditingServiceId(null);
    setFormData({ title: "", description: "", price: "" });
  }

  // Calculate stats
  // For demo purposes, we're mocking earnings/orders until backend supports it
  const totalEarnings = services.length * 1500;
  const totalOrders = services.length * 5;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-slate-600 font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quick Navigation */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition font-medium"
        >
          <Home className="h-4 w-4" />
          Browse Marketplace
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Active Services", value: services.length, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Total Earnings", value: `Rs. ${totalEarnings}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Completed Orders", value: totalOrders, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Services</h3>
            <p className="text-sm text-slate-500">Manage your service listings</p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setEditingServiceId(null);
                setFormData({ title: "", description: "", price: "" });
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add New Service
            </button>
          )}
        </div>

        {/* Add/Edit Service Form */}
        {showForm && (
          <div className="p-8 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                {editingServiceId ? <Edit2 className="h-5 w-5 text-indigo-500" /> : <Plus className="h-5 w-5 text-indigo-500" />}
                {editingServiceId ? "Edit Service Details" : "Create a New Service"}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white"
                      placeholder="e.g., AC Repair & Servicing"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Starting Price (Rs)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-slate-400 text-sm">Rs.</span>
                      <input
                        type="number"
                        className="w-full p-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition bg-white"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition bg-white"
                    rows={4}
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2.5 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingServiceId ? "Update Service" : "Publish Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service List */}
        {services.length === 0 && !showForm ? (
          <div className="p-16 text-center">
            <div className="bg-slate-100 p-6 rounded-full inline-block mb-6">
              <Archive className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-slate-900 text-xl font-bold mb-2">No Services Yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Create your first service to start receiving bookings from local customers.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg font-bold"
            >
              Add Your First Service
            </button>
          </div>
        ) : !showForm && (
          <div className="divide-y divide-slate-100">
            {services.map((service) => (
              <div key={service.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{service.title}</h4>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${service.is_active
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                      >
                        {service.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3 max-w-2xl">{service.description}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-900">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        Rs. {service.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Created {new Date(service.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-4 py-2 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-lg transition text-sm font-medium flex items-center gap-2"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;