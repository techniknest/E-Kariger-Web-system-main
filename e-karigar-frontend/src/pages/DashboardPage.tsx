import { useNavigate } from "react-router-dom";
import { Briefcase, ExternalLink, Calendar, Clock, CheckCircle, AlertCircle, Home } from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import VendorDashboard from "../components/VendorDashboard";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // Get user from local storage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    navigate("/login");
    return null;
  }

  // Determine user state
  const isAdmin = user.role === "ADMIN";
  const isApprovedVendor = user.vendorStatus === "APPROVED";
  const isPendingVendor = user.vendorStatus === "PENDING";
  const isRejectedVendor = user.vendorStatus === "REJECTED";
  const isClient = user.role === "CLIENT" && user.vendorStatus === "NONE";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isAdmin ? "Admin Panel" : isApprovedVendor ? "Vendor Dashboard" : "My Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, <span className="font-semibold">{user.name}</span>
              </p>
            </div>
            
            {/* Quick action for clients */}
            {(isClient || isPendingVendor) && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
              >
                <Home className="h-4 w-4" />
                Browse Services
              </button>
            )}
          </div>
        </div>

        {/* --- STATUS BANNERS --- */}
        
        {/* Pending Vendor Banner */}
        {isPendingVendor && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800 text-lg mb-1">
                  Your Seller Application is Under Review
                </h3>
                <p className="text-yellow-700">
                  Our team is reviewing your application. This usually takes 24-48 hours. 
                  You'll be notified once approved, and then you can start adding services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rejected Vendor Banner */}
        {isRejectedVendor && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 text-lg mb-1">
                  Application Not Approved
                </h3>
                <p className="text-red-700">
                  Unfortunately, your seller application was not approved. 
                  Please contact our support team for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- ADMIN VIEW --- */}
        {isAdmin && <AdminDashboard />}

        {/* --- APPROVED VENDOR VIEW --- */}
        {isApprovedVendor && <VendorDashboard />}

        {/* --- CLIENT VIEW (Including Pending/Rejected - they browse like clients) --- */}
        {(isClient || isPendingVendor || isRejectedVendor) && (
          <div className="space-y-8">
            {/* "Become a Seller" CTA - Only show if not applied yet */}
            {isClient && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm hidden sm:block">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Are you a Skilled Professional?</h3>
                      <p className="text-blue-100 max-w-lg">
                        Join E-Karigar as a vendor to list your services, find local clients, 
                        and grow your income. It takes just 2 minutes to apply.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/become-vendor")}
                    className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg whitespace-nowrap w-full md:w-auto text-center"
                  >
                    Become a Seller →
                  </button>
                </div>
              </div>
            )}

            {/* Approved Vendor Success Banner (if just approved) */}
            {isApprovedVendor && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-800 text-lg mb-1">
                      Congratulations! You're Now a Seller
                    </h3>
                    <p className="text-green-700">
                      Your seller application has been approved. You can now add services and start accepting bookings!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  My Active Bookings
                </h3>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No Bookings Yet</h4>
                <p className="text-gray-500 max-w-sm mb-6">
                  You haven't booked any services yet. Browse our marketplace to find skilled professionals.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  Find a Karigar
                </button>
              </div>
            </div>

            {/* Recent Activity / Notifications (Placeholder) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
              </div>
              <div className="p-6 text-center text-gray-500">
                <p>No recent activity to show.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;