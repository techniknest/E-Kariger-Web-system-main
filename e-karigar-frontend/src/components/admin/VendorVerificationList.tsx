import { useEffect, useState } from "react";
import {
    Check,
    X,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Loader2,
    MapPin,
    Phone,
    Calendar,
    FileText,
    Shield,
    Briefcase
} from "lucide-react";
import api from "../../services/api";

// --- Types ---
interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    is_active: boolean;
}

interface User {
    name: string;
    email: string;
    phone: string;
}

interface Vendor {
    id: string;
    vendor_type: string;
    city: string;
    cnic: string;
    cnic_image_url?: string; // Assuming this field exists or will exist
    business_phone: string;
    experience_years: number;
    description: string;
    created_at: string;
    vendorStatus: 'PENDING' | 'APPROVED' | 'REJECTED'; // Explicit status field if available, else inferred
    user: User;
    services?: Service[];
}

// --- Components ---

const VendorDetailsModal = ({
    vendor,
    onClose,
    onApprove,
    onReject,
    actionLoading
}: {
    vendor: Vendor;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    actionLoading: boolean;
}) => {
    if (!vendor) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Vendor Application Details</h3>
                        <p className="text-sm text-slate-500">Review candidate information</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Header Profile */}
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                            {vendor.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{vendor.user.name}</h2>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Briefcase className="h-4 w-4" />
                                <span>{vendor.vendor_type}</span>
                                <span className="text-slate-300">|</span>
                                <MapPin className="h-4 w-4" />
                                <span>{vendor.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>Applied: {new Date(vendor.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Business Description</h4>
                        <div className="p-4 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                            {vendor.description || "No description provided."}
                        </div>
                    </div>

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</h5>
                            <p className="font-medium text-slate-900">{vendor.user.email}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</h5>
                            <p className="font-medium text-slate-900">{vendor.business_phone}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">CNIC Number</h5>
                            <p className="font-medium text-slate-900">{vendor.cnic}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Experience</h5>
                            <p className="font-medium text-slate-900">{vendor.experience_years} Years</p>
                        </div>
                    </div>

                    {/* CNIC Image */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">CNIC / ID Document</h4>
                        <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-100 h-48 flex items-center justify-center">
                            {vendor.cnic_image_url ? (
                                <img
                                    src={vendor.cnic_image_url}
                                    alt="CNIC Document"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <FileText className="h-10 w-10 mb-2" />
                                    <span>No Document Uploaded</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Modal Footer (Sticky Actions) */}
                <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onReject(vendor.id)}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
                        Reject Application
                    </button>
                    <button
                        onClick={() => onApprove(vendor.id)}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                    >
                        {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                        Approve Vendor
                    </button>
                </div>
            </div>
        </div>
    );
};

const VendorVerificationList = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, [activeTab]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            let endpoint = "/admin/vendors/pending";
            if (activeTab === 'verified') endpoint = "/admin/vendors/approved";
            if (activeTab === 'rejected') endpoint = "/admin/vendors/rejected";

            // Note: If /rejected endpoint doesn't exist yet, we might need to handle 404 or filter manually
            // For now assuming standard REST conventions based on existing code

            const response = await api.get(endpoint).catch(err => {
                console.warn(`Failed to fetch ${activeTab} vendors`, err);
                return { data: [] }; // Return empty array on failure 
            });

            setVendors(response.data || []);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setActionLoading(true);
        try {
            await api.patch(`/admin/vendors/${id}/approve`);
            setVendors(vendors.filter(v => v.id !== id));
            setSelectedVendor(null);
        } catch (error) {
            alert("Failed to approve vendor");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(true);
        try {
            await api.patch(`/admin/vendors/${id}/reject`);
            setVendors(vendors.filter(v => v.id !== id));
            setSelectedVendor(null);
        } catch (error) {
            alert("Failed to reject vendor");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendor Verification</h1>
                    <p className="text-slate-500">Manage and review vendor applications</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {(['pending', 'verified', 'rejected'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${activeTab === tab
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'}
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-500">Loading vendors...</p>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Shield className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No {activeTab} vendors</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                            There are currently no vendors in the {activeTab} category.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4 font-semibold">Vendor</th>
                                    <th className="px-6 py-4 font-semibold">Business Type</th>
                                    <th className="px-6 py-4 font-semibold">Location</th>
                                    <th className="px-6 py-4 font-semibold">Date Applied</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {vendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {vendor.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{vendor.user.name}</p>
                                                    <p className="text-xs text-slate-500">{vendor.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {vendor.vendor_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {vendor.city}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {new Date(vendor.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedVendor(vendor)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedVendor && (
                <VendorDetailsModal
                    vendor={selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                />
            )}
        </div>
    );
};

export default VendorVerificationList;
