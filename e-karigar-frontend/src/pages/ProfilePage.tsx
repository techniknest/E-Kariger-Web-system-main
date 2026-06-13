import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Briefcase, Clock, ShieldCheck, Save, Loader2, AlertCircle, CreditCard, Wrench, Camera, X } from "lucide-react";
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
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

            if (userData.profile_photo) {
                setPreviewUrl(userData.profile_photo);
            }
            
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
            const updateResult = await authApi.updateProfile({
                name: data.name,
                phone: data.phone,
                profilePhoto: photoFile || undefined,
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
            const updatedUser = { 
                ...storedUser, 
                name: data.name,
                profile_photo: updateResult.profile_photo || storedUser.profile_photo
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("auth-change"));
            
            setPhotoFile(null); // Clear pending file
            
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

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File too large. Max 2MB");
                return;
            }
            setPhotoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPreviewUrl(user?.profile_photo || null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-indigo-700 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: Profile Summary (Sidebar) */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-700"></div>
                            <div className="px-6 pb-6 -mt-12">
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center relative bg-white">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-12 w-12 text-slate-300" />
                                            )}
                                            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                <Camera className="h-6 w-6 mb-1" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                            </label>
                                        </div>
                                        {photoFile && (
                                            <button 
                                                type="button"
                                                onClick={removePhoto}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10 border-2 border-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 text-center">
                                        <h2 className="text-xl font-black text-slate-900 leading-tight">{user?.name}</h2>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {user?.role}
                                            </span>
                                            {vendorProfile && (
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    vendorProfile.approval_status === "APPROVED" ? "bg-green-50 text-green-700 border-green-100" :
                                                    vendorProfile.approval_status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-red-50 text-red-700 border-red-100"
                                                }`}>
                                                    {vendorProfile.approval_status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-semibold text-slate-700 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                                            <p className="text-sm font-semibold text-slate-700">Active Account</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="bg-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Pro Tip
                            </h3>
                            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                                Keep your profile updated to build trust with {user?.role === 'VENDOR' ? 'clients' : 'vendors'}. A complete profile increases your chances of successful bookings by 40%.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form Details */}
                    <div className="flex-1 w-full space-y-8">
                        <header className="hidden lg:block">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Manage your personal and professional information.</p>
                        </header>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Details</h2>
                                </div>
                                
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Display Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    {...register("name", { 
                                                        required: "Full name is required",
                                                        minLength: { value: 3, message: "Name must be at least 3 characters" }
                                                    })}
                                                    placeholder="Your name"
                                                    className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:ring-indigo-100'} rounded-xl focus:bg-white focus:ring-4 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold`}
                                                />
                                            </div>
                                            {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    {...register("phone", {
                                                        pattern: { value: /^[0-9+\s()-]{10,15}$/, message: "Invalid phone number" }
                                                    })}
                                                    placeholder="+92 XXX XXXXXXX"
                                                    className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border ${errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:ring-indigo-100'} rounded-xl focus:bg-white focus:ring-4 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold`}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Professional Information Section (Vendors) */}
                            {vendorProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Business Information</h2>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">City / Location</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <input
                                                        type="text"
                                                        {...register("city", { required: "City is required" })}
                                                        placeholder="e.g. Lahore"
                                                        className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border ${errors.city ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:ring-indigo-100'} rounded-xl focus:bg-white focus:ring-4 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Business Contact</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <input
                                                        type="text"
                                                        {...register("business_phone")}
                                                        placeholder="Public business phone"
                                                        className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Years of Experience</label>
                                                <div className="relative group">
                                                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <input
                                                        type="number"
                                                        {...register("experience_years")}
                                                        className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Verification Status</label>
                                                <div className="relative opacity-60">
                                                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={vendorProfile.cnic ? "Verified Identity" : "Pending Verification"}
                                                        disabled
                                                        className="w-full pl-11 pr-4 py-3 text-sm bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed font-bold text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">About your Business</label>
                                            <textarea
                                                {...register("description")}
                                                rows={4}
                                                placeholder="Describe your expertise and services..."
                                                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-slate-800 font-bold resize-none"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Services List (Vendors) */}
                            {vendorProfile && vendorProfile.services && vendorProfile.services.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Services</h2>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/30">
                                        {vendorProfile.services.map((service: any) => (
                                            <div key={service.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-black text-slate-900 text-sm group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{service.title}</h3>
                                                    <Wrench className="h-3.5 w-3.5 text-slate-300" />
                                                </div>
                                                <p className="text-indigo-700 font-black text-xs bg-indigo-50 w-fit px-2 py-1 rounded-lg">Rs. {service.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Form Actions */}
                            <div className="pt-4 flex items-center justify-between">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Last Sync: {new Date().toLocaleTimeString()}
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {saving ? "Processing..." : "Commit Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
