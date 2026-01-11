import { useEffect, useState } from "react";
import { Check, X, Shield, Users, Loader2 } from "lucide-react";
import api from "../services/api";

interface Vendor {
  id: string;
  vendor_type: string;
  city: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pending Vendors
  const fetchPendingVendors = async () => {
    try {
      const response = await api.get("/admin/vendors/pending");
      setVendors(response.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  // 2. Approve Handler
  const handleApprove = async (vendorId: string) => {
    if (!confirm("Are you sure you want to approve this vendor?")) return;

    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`);
      alert("Vendor Approved Successfully!");
      // Refresh the list
      setVendors(vendors.filter((v) => v.id !== vendorId));
    } catch (error) {
      alert("Failed to approve vendor.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Shield className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-semibold text-gray-900">{vendors.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">--</p>
          </div>
        </div>
      </div>

      {/* Approval List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pending Vendor Requests</h3>
        </div>
        
        {vendors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending requests. All caught up! 🎉</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-sm font-medium text-gray-900">{vendor.user.name}</div>
                        <div className="text-sm text-gray-500">{vendor.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {vendor.vendor_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.user.email}</div>
                    <div className="text-sm text-gray-500">{vendor.user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md mr-2"
                    >
                      Approve
                    </button>
                    <button className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;