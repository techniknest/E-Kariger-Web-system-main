import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Briefcase, Clock, ShieldCheck, Save, Loader2, AlertCircle, CreditCard, Wrench } from "lucide-react";
import { authApi, vendorsApi } from "../services/api";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

interface ProfileFormData {
    name: string;
    phone: string;
    city?: string;
    business_phone?: string;
    experience_years?: number;
    description?: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [vendorProfile, setVendorProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors } 
    } = useForm<ProfileFormData>({
        mode: "onBlur"
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userData = await authApi.getMe();
            setUser(userData);
            
            let vData = null;
            if (userData.vendorStatus === "APPROVED" || userData.vendorStatus === "PENDING" || userData.vendorStatus === "REJECTED") {
                try {
                    vData = await vendorsApi.getProfile();
                    setVendorProfile(vData);
                } catch (e) {
                    console.error("No vendor profile found or failed to fetch");
                }
            }

            // Populate form
            reset({
                name: userData.name || "",
                phone: userData.phone || "",
                city: vData?.city || "",
                business_phone: vData?.business_phone || "",
                experience_years: vData?.experience_years || 0,
                description: vData?.description || "",
            });
            
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setSaving(true);
        try {
            // 1. Update Basic Profile
            await authApi.updateProfile({
                name: data.name,
                phone: data.phone,
            });

            // 2. Update Vendor Profile if exists
            if (vendorProfile) {
                await vendorsApi.updateProfile({
                    city: data.city,
                    business_phone: data.business_phone,
                    experience_years: Number(data.experience_years),
                    description: data.description,
                });
            }

            toast.success("Profile updated successfully!");
            // Update local storage user object if needed
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...storedUser, name: data.name };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("auth-change"));
            
            // Refresh data
            await fetchProfileData(); 
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            const msg = error.response?.data?.message;
            if (Array.isArray(msg)) {
                toast.error(msg[0]); // NestJS validation array formatting
            } else {
                toast.error(typeof msg === 'string' ? msg : "Failed to update profile. Please check all fields.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter',_sans-serif]">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-3xl mx-auto space-y-8">
                    <header>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Update your profile and manage your personal details.</p>
                    </header>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
                        {/* Basic Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Information</h2>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                {...register("name", { 
                                                    required: "Full name is required",
                                                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                                                })}
                                                placeholder="Enter your full name"
                                                className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium`}
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Email Address</label>
                                        <div className="relative opacity-60">
                                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed font-medium text-slate-600"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 ml-1 italic font-medium">Email cannot be changed.</p>
                                    </div>

                                    <div className="space-y-1.5 flex flex-col justify-start">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                {...register("phone", {
                                                    pattern: { value: /^[0-9+\s()-]{10,15}$/, message: "Please enter a valid phone number" }
                                                })}
                                                placeholder="+92 3XX XXXXXXX"
                                                className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border ${errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium`}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Account Role</label>
                                        <div className="relative opacity-60">
                                            <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={user?.role || ""}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed font-medium text-slate-600 uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Professional Section (Only for Vendors) */}
                        {vendorProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Professional Info</h2>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        vendorProfile.approval_status === "APPROVED" ? "bg-green-50 text-green-700 border border-green-100" :
                                        vendorProfile.approval_status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-red-50 text-red-700 border border-red-100"
                                    }`}>
                                        {vendorProfile.approval_status}
                                    </span>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    {...register("city", { required: "City is required for active vendors" })}
                                                    placeholder="e.g. Islamabad"
                                                    className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border ${errors.city ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium`}
                                                />
                                            </div>
                                            {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.city.message}</p>}
                                        </div>

                                        <div className="space-y-1.5 flex flex-col justify-start">
                                            <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Business Phone <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    {...register("business_phone", { 
                                                        required: "Business phone is required",
                                                        pattern: { value: /^[0-9+\s()-]{10,15}$/, message: "Please enter a valid phone number" }
                                                    })}
                                                    placeholder="Public contact number"
                                                    className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border ${errors.business_phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium`}
                                                />
                                            </div>
                                            {errors.business_phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.business_phone.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Experience (Years) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="number"
                                                    {...register("experience_years", { 
                                                        required: "Experience is required",
                                                        min: { value: 0, message: "Experience cannot be negative" },
                                                        valueAsNumber: true,
                                                    })}
                                                    className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border ${errors.experience_years ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium`}
                                                />
                                            </div>
                                            {errors.experience_years && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.experience_years.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Business Type</label>
                                            <div className="relative opacity-60">
                                                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={vendorProfile.vendor_type || "INDIVIDUAL"}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed font-medium text-slate-600 uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 flex flex-col justify-start">
                                            <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">CNIC Number</label>
                                            <div className="relative opacity-60">
                                                <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={vendorProfile.cnic || ""}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed font-medium text-slate-600 tracking-wider"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 ml-1 italic font-medium">CNIC is verified and locked.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 text-left flex flex-col justify-start">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5 uppercase tracking-wide">Business Description <span className="text-red-500">*</span></label>
                                        <textarea
                                            {...register("description", { 
                                                required: "Description is required",
                                                minLength: { value: 10, message: "Description must be at least 10 characters long" }
                                            })}
                                            rows={4}
                                            placeholder="Tell us about your services and expertise..."
                                            className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.description ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-lg focus:ring-2 focus:border-blue-700 outline-none transition-all text-slate-800 font-medium resize-none text-sm`}
                                        />
                                        {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.description.message}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Services Section (Only for Vendors) */}
                        {vendorProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-blue-700" />
                                        My Offered Services
                                    </h2>
                                </div>
                                <div className="p-6 text-left bg-slate-50/50">
                                    {!vendorProfile.services || vendorProfile.services.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-slate-500 font-medium">You haven't listed any services yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {vendorProfile.services.map((service: any) => (
                                                <div key={service.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{service.title}</h3>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                                                    </div>
                                                    <p className="text-blue-700 font-black text-sm mt-3 bg-blue-50 w-fit px-2 py-1 rounded">Rs. {service.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-10 rounded-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? "Saving Changes..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
