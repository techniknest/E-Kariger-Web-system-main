import { useEffect, useState } from "react";
import { Plus, DollarSign, Tag, Trash2 } from "lucide-react";
import api from "../services/api";

const VendorDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", price: "" });

  // 1. Fetch My Services
  const fetchServices = async () => {
    try {
      const res = await api.get("/services/my");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Handle Create Service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/services", {
        ...formData,
        price: parseFloat(formData.price) // Convert string to number
      });
      alert("Service Created!");
      setShowForm(false);
      setFormData({ title: "", description: "", price: "" });
      fetchServices(); // Refresh list
    } catch (err) {
      alert("Failed to create service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Services</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      {/* --- Add Service Form --- */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold mb-4">Create a Service</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Title</label>
              <input 
                type="text" 
                className="mt-1 w-full p-2 border rounded" 
                placeholder="e.g., AC Repair"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                className="mt-1 w-full p-2 border rounded" 
                placeholder="Describe what you do..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Starting Price (Rs)</label>
              <input 
                type="number" 
                className="mt-1 w-full p-2 border rounded" 
                placeholder="0"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Service</button>
            </div>
          </form>
        </div>
      )}

      {/* --- Service List --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 && !showForm && (
          <p className="text-gray-500 col-span-3 text-center py-10">You haven't added any services yet.</p>
        )}
        {services.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Active
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
            <div className="flex items-center text-gray-700 font-medium">
              <DollarSign className="h-4 w-4 mr-1 text-gray-400" /> 
              Rs. {service.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;