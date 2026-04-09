import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, CheckCircle, MapPin, User, Building, Phone, CreditCard, Clock, FileText, AlertCircle } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

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

  // Check if user already has a vendor application
  useEffect(() => {
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
    checkVendorStatus();
  }, []);

  // Validate CNIC format: 12345-1234567-1
  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  // Validate Phone format: 03XX-XXXXXXX
  const validatePhone = (phone: string) => {
    const phoneRegex = /^03\d{2}-?\d{7}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: Record<string, string> = {};

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!validateCNIC(formData.cnic)) {
      newErrors.cnic = "Enter valid CNIC (format: 12345-1234567-1)";
    }

    if (!validatePhone(formData.business_phone)) {
      newErrors.business_phone = "Enter valid phone number (e.g., 0300-1234567)";
    }

    if (!formData.experience_years || parseInt(formData.experience_years) < 0) {
      newErrors.experience_years = "Enter valid experience years";
    }

    if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.post("/vendors/apply", {
        ...formData,
        experience_years: parseInt(formData.experience_years),
      });

      // Update local storage with pending status
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
      const message = error.response?.data?.message || "Something went wrong.";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show status if already applied
  if (existingStatus) {
    return (
        <div className="min-h-screen bg-slate-50 font-['Inter',_sans-serif]">
            <Navbar />
            <div className="max-w-xl mx-auto px-4 py-16">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-center">
                    <div className="p-8">
                        {existingStatus === "PENDING" && (
                            <>
                                <div className="mx-auto h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-5 border border-amber-100">
                                    <Clock className="h-7 w-7 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Application Under Review</h2>
                                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                                    Your professional application is currently being reviewed by our team.
                                </p>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
                                    <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">What happens next?</h4>
                                    <p className="text-slate-600 text-sm">
                                        We will verify your details within 24 hours. Once approved,
                                        you'll be able to create service listings and accept jobs.
                                    </p>
                                </div>
                            </>
                        )}

                        {existingStatus === "APPROVED" && (
                            <>
                                <div className="mx-auto h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
                                    <CheckCircle className="h-7 w-7 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">You're Approved!</h2>
                                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                                    Your professional account is active. Head to your dashboard to manage services.
                                </p>
                            </>
                        )}

                        {existingStatus === "REJECTED" && (
                            <>
                                <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-100">
                                    <AlertCircle className="h-7 w-7 text-red-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Application Declined</h2>
                                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                                    Unfortunately, your application was not approved. Please contact support.
                                </p>
                            </>
                        )}

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mt-6 px-6 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition-all shadow-md shadow-blue-200"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Become an E-Karigar Seller
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Join our community of skilled professionals and grow your business.
            Complete the form below to apply.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {/* STEP 1: Application Form */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-8 border-b pb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Professional Details</h2>
                  <p className="text-sm text-gray-500">All fields are required for verification</p>
                </div>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City of Operation
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.city ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="e.g. Lahore"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  {/* Vendor Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      I am a(n)
                    </label>
                    <div className="relative">
                      {formData.vendor_type === "Individual" ? (
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      ) : (
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      )}
                      <select
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                        value={formData.vendor_type}
                        onChange={(e) => setFormData({ ...formData, vendor_type: e.target.value })}
                      >
                        <option value="Individual">Individual (Freelancer)</option>
                        <option value="Company">Company / Agency</option>
                      </select>
                    </div>
                  </div>

                  {/* CNIC */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CNIC Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.cnic ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="12345-1234567-1"
                        value={formData.cnic}
                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      />
                    </div>
                    {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>}
                    <p className="text-xs text-gray-500 mt-1">Required for identity verification</p>
                  </div>

                  {/* Business Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.business_phone ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="0300-1234567"
                        value={formData.business_phone}
                        onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                      />
                    </div>
                    {errors.business_phone && <p className="text-red-500 text-xs mt-1">{errors.business_phone}</p>}
                    <p className="text-xs text-gray-500 mt-1">Clients will use this to contact you</p>
                  </div>

                  {/* Experience Years */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        max="50"
                        className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.experience_years ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        placeholder="e.g. 5"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                      />
                    </div>
                    {errors.experience_years && <p className="text-red-500 text-xs mt-1">{errors.experience_years}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Professional Bio & Skills
                  </label>
                  <textarea
                    required
                    rows={5}
                    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    placeholder="Tell clients about your experience, skills, and why they should hire you. Describe the services you offer and your expertise..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                    <p className={`text-xs ml-auto ${formData.description.length < 50 ? "text-red-500" : "text-green-600"}`}>
                      {formData.description.length}/50 characters minimum
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 border-t">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full sm:w-auto px-6 py-3 text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-70"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* STEP 2: Success Message */}
          {step === 2 && (
            <div className="text-center py-10 font-['Inter',_sans-serif]">
              <div className="mx-auto h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Application Received!</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                Thank you for applying. Our team will review your profile and notify you once approved.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8 max-w-md mx-auto text-left">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-3">What happens next?</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Your status will show as Pending</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> We will verify your credentials</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> You will be notified upon approval</li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition-all shadow-md shadow-blue-200"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeVendorPage;