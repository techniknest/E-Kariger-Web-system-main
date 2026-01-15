import { Link, useNavigate, useLocation } from "react-router-dom";
import { Hammer, LogOut, LayoutDashboard, Home, Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user from local storage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const isLoggedIn = !!user;
  const isClient = user?.role === "CLIENT";
  const isVendor = user?.role === "VENDOR" || user?.vendorStatus === "APPROVED";
  const isPendingVendor = user?.vendorStatus === "PENDING";
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBecomeSellerClick = () => {
    if (!isLoggedIn) {
      // Redirect to login, then to become-vendor
      navigate("/login?redirect=/become-vendor");
    } else {
      navigate("/become-vendor");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
            <Hammer className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
            E-Karigar
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Home Link - Always visible */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${location.pathname === "/"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {/* --- GUEST MODE --- */}
          {!isLoggedIn && (
            <>
              <button
                onClick={handleBecomeSellerClick}
                className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Become a Seller
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Join Now
              </Link>
            </>
          )}

          {/* --- CLIENT MODE --- */}
          {isLoggedIn && isClient && !isPendingVendor && !isVendor && (
            <>
              <button
                onClick={handleBecomeSellerClick}
                className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Become a Seller
              </button>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {/* --- PENDING VENDOR MODE --- */}
          {isLoggedIn && isPendingVendor && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                <span className="animate-pulse">⏳</span>
                Application Pending
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {/* --- APPROVED VENDOR MODE --- */}
          {isLoggedIn && isVendor && !isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                Vendor Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {/* --- ADMIN MODE --- */}
          {isLoggedIn && isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBecomeSellerClick();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
              >
                <Briefcase className="h-5 w-5" />
                Become a Seller
              </button>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 mx-4 py-3 bg-blue-600 text-white font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Now
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <div className="px-4 py-2 text-sm text-gray-500">
                Signed in as <span className="font-medium text-gray-800">{user?.name}</span>
              </div>

              {isClient && !isPendingVendor && !isVendor && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleBecomeSellerClick();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                >
                  <Briefcase className="h-5 w-5" />
                  Become a Seller
                </button>
              )}

              {isPendingVendor && (
                <div className="mx-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                  ⏳ Your seller application is under review
                </div>
              )}

              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                {isVendor ? "Vendor Dashboard" : isAdmin ? "Admin Panel" : "My Dashboard"}
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
