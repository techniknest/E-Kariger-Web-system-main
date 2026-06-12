import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, CheckCircle, MapPin, User, Building, Phone, CreditCard, Clock, FileText, AlertCircle, Loader2, ArrowLeft, Star, ShieldCheck, TrendingUp } from "lucide-react";
import api from "../services/api";

const BecomeVendorPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    city: "",
    cnic: "",
    business_phone: "",
    experience_years: "",
    description: "",
    vendor_type: "Individual",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const res = await api.get("/vendors/status");
      if (res.data.hasApplied) {
        setExistingStatus(res.data.status);
      }
    } catch (error) {
      console.error("Error checking vendor status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) newErrors.cnic = "Enter valid CNIC (12345-1234567-1)";
    if (!/^03\d{2}-?\d{7}$/.test(formData.business_phone.replace(/-/g, ''))) newErrors.business_phone = "Enter valid phone number (03XX-XXXXXXX)";
    if (!formData.experience_years || parseInt(formData.experience_years) < 0) newErrors.experience_years = "Enter valid experience";
    if (formData.description.length < 50) newErrors.description = "Bio must be at least 50 chars";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/vendors/apply", {
        ...formData,
        experience_years: parseInt(formData.experience_years),
      });

      // Update local storage
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        user.vendorStatus = "PENDING";
        user.role = "VENDOR";
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("auth-change"));
      }

      setStep(2);
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || "Application failed" });
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Split-Screen Layout wrapper
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-indigo-200">
      {/* LEFT COLUMN - BRANDING (Sticky Lead Magnet) */}
      <div className="lg:w-[45%] xl:w-[40%] bg-indigo-900 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white border-r border-indigo-800 shadow-2xl z-10">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest mb-16 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-100 border border-white/10 backdrop-blur-md">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Professional Network
            </div>
            <h1 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-sm ">
              Turn your expertise into a thriving business.
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed font-medium max-w-md">
              Join thousands of professionals on E-Karigar. Set your own hours, reach more clients, and get paid securely through our marketplace.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8 mt-16">
           {/* Social Proof / Features */}
           <div className="grid gap-6">
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-indigo-800 flex items-center justify-center shrink-0 border border-indigo-700">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white tracking-wide">Guaranteed Payments</h4>
                    <p className="text-sm text-indigo-200 mt-1 font-medium leading-relaxed">Payments are secured before you start working and disbursed instantly upon completion.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-indigo-800 flex items-center justify-center shrink-0 border border-indigo-700">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white tracking-wide">Build Your Reputation</h4>
                    <p className="text-sm text-indigo-200 mt-1 font-medium leading-relaxed">Earn reviews and climb the marketplace ranks to attract premium clients.</p>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-indigo-800/60">
              <p className="text-xs text-indigo-400 font-medium">© {new Date().getFullYear()} E-Karigar Inc. All rights reserved.</p>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN - FORM SECTION */}
      <div className="flex-1 flex flex-col bg-slate-50 relative overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden bg-indigo-900 p-6 flex flex-col items-start gap-4">
           <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
           </Link>
           <h1 className="text-2xl font-black text-white ">Join E-Karigar</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16">
          <div className="max-w-xl w-full">
            {/* 1. EXISTING STATUS STATES */}
            {existingStatus && (
              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 text-center">
                  
                {existingStatus === "PENDING" && (
                  <>
                    <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-amber-100 mb-6">
                      <Clock className="h-10 w-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Review in Progress</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed max-w-sm mx-auto">
                      Our verification team is reviewing your credentials. You'll be notified via email within 24 hours.
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mb-8">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">On-boarding Checklist</h4>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                          <CheckCircle className="h-5 w-5 text-emerald-500" /> Identity verification initiated
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <div className="h-5 w-5 rounded-full border-[3px] border-slate-200 flex items-center justify-center" /> Awaiting manual profile review
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <div className="h-5 w-5 rounded-full border-[3px] border-slate-200 flex items-center justify-center" /> Final account activation
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                {existingStatus === "APPROVED" && (
                  <>
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-emerald-100 mb-6">
                      <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Welcome Aboard!</h2>
                    <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                      Congratulations! Your professional application has been approved. You can now start listing your services.
                    </p>
                  </>
                )}

                {existingStatus === "REJECTED" && (
                  <>
                    <div className="mx-auto w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg shadow-rose-100 mb-6">
                      <AlertCircle className="h-10 w-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Application Declined</h2>
                    <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                      Unfortunately, your current application does not meet our platform requirements.
                    </p>
                  </>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full btn-primary py-4 shadow-xl shadow-indigo-600/20 text-sm tracking-wide"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {/* 2. REGISTRATION FORM OR SUCCESS */}
            {!existingStatus && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-8 lg:p-10">
                {step === 1 ? (
                  <>
                    <div className="mb-8 border-b border-slate-100 pb-8">
                       <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Create your Professional Profile</h2>
                       <p className="text-slate-500 font-medium text-sm">Provide accurate details to expedite the verification process.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Identity Section */}
                      <fieldset className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <legend className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 px-2">1. Business Identity</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Account Type</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 posans-events-none">
                                        {formData.vendor_type === "Individual" ? <User className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                                    </div>
                                    <select
                                        className="input-field pl-10 h-11"
                                        value={formData.vendor_type}
                                        onChange={(e) => setFormData({ ...formData, vendor_type: e.target.value })}
                                    >
                                        <option value="Individual">Individual Professional</option>
                                        <option value="Company">Agency / Business</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Business Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 posans-events-none" />
                                    <input
                                        type="tel"
                                        placeholder="0300-1234567"
                                        className={`input-field pl-10 h-11 ${errors.business_phone ? '!border-rose-300 ring-4 ring-rose-500/10' : ''}`}
                                        value={formData.business_phone}
                                        onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                                    />
                                </div>
                                {errors.business_phone && <p className="text-[10px] text-rose-500 font-bold">{errors.business_phone}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">CNIC Number</label>
                                <div className="relative mt-1">
                                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 posans-events-none" />
                                    <input
                                        type="text"
                                        placeholder="12345-1234567-1"
                                        className={`input-field pl-10 h-11 font-mono ${errors.cnic ? '!border-rose-300 ring-4 ring-rose-500/10' : ''}`}
                                        value={formData.cnic}
                                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                    />
                                </div>
                                {errors.cnic && <p className="text-[10px] text-rose-500 font-bold">{errors.cnic}</p>}
                            </div>
                        </div>
                      </fieldset>

                      {/* Professional Section */}
                      <fieldset className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <legend className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 px-2">2. Operating Capabilities</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Primary Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 posans-events-none" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Lahore"
                                        className={`input-field pl-10 h-11 ${errors.city ? '!border-rose-300 ring-4 ring-rose-500/10' : ''}`}
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                {errors.city && <p className="text-[10px] text-rose-500 font-bold">{errors.city}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Experience (Years)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 posans-events-none" />
                                    <input
                                        type="number"
                                        placeholder="e.g. 5"
                                        className={`input-field pl-10 h-11 ${errors.experience_years ? '!border-rose-300 ring-4 ring-rose-500/10' : ''}`}
                                        value={formData.experience_years}
                                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                    />
                                </div>
                                {errors.experience_years && <p className="text-[10px] text-rose-500 font-bold">{errors.experience_years}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex justify-between">
                                    <span>Professional Summary / Bio</span>
                                    <span className={`text-[9px] ${formData.description.length < 50 ? 'text-slate-400' : 'text-emerald-500'}`}>
                                       {formData.description.length} / 50 min
                                    </span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your skills, operational tools, and turnaround times..."
                                    className={`input-field resize-none py-3 h-auto ${errors.description ? '!border-rose-300 ring-4 ring-rose-500/10' : ''}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                {errors.description && <p className="text-[10px] text-rose-500 font-bold">{errors.description}</p>}
                            </div>
                        </div>
                      </fieldset>

                      {errors.submit && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-xs font-bold flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          {errors.submit}
                        </div>
                      )}

                      <div className="pt-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => navigate("/dashboard")}
                          className="w-full md:w-auto px-6 py-3.5 text-slate-500 text-xs uppercase tracking-widest font-black hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full md:w-auto flex-1 btn-primary py-3.5 text-sm tracking-wide shadow-xl shadow-indigo-600/20"
                        >
                          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-4 w-4" />}
                          Submit Application
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl shadow-emerald-100">
                        <CheckCircle className="h-12 w-12 text-emerald-500" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Application Received!</h2>
                      <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                        Your application as an E-Karigar Professional has been securely transmitted. 
                        We will notify you via email once the manual review is complete.
                      </p>
                      
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="btn-primary w-full py-4 shadow-xl shadow-indigo-600/20 text-sm tracking-wide"
                      >
                        Return to Dashboard
                      </button>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeVendorPage;