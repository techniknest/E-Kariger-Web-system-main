import { Link, useNavigate, useLocation } from "react-router-dom";
import { Hammer, LogOut, LayoutDashboard, Home, Briefcase, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user from local storage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const isLoggedIn = !!user;
  const isClient = user?.role === "CLIENT";
  const isVendor = user?.role === "VENDOR" || user?.vendorStatus === "APPROVED";
  const isPendingVendor = user?.vendorStatus === "PENDING";
  const isAdmin = user?.role === "ADMIN";

  const isHome = location.pathname === "/";
  // Text color logic: White if on Home AND not scrolled. Dark otherwise.
  const isDarkBg = isHome && !scrolled && !mobileMenuOpen;

  const textColor = isDarkBg ? "text-white" : "text-slate-900";
  const navLinkColor = isDarkBg ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-indigo-600";
  const logoBg = isDarkBg ? "bg-white/20 text-white backdrop-blur-sm" : "bg-indigo-600 text-white shadow-indigo-200";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 ${logoBg} group-hover:scale-105`}>
              <Hammer className="h-6 w-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${textColor}`}>
              E-Karigar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${navLinkColor} ${location.pathname === "/" && isDarkBg ? "text-white font-semibold" : ""}`}
            >
              Home
            </Link>

            {!isLoggedIn && (
              <>
                <button onClick={() => navigate("/become-vendor")} className={`text-sm font-medium transition-colors ${navLinkColor}`}>
                  Become a Seller
                </button>
                <div className={`h-6 w-px mx-2 ${isDarkBg ? "bg-white/20" : "bg-slate-200"}`}></div>
                <Link to="/login" className={`text-sm font-medium transition-colors ${navLinkColor}`}>
                  Log In
                </Link>
                <Link to="/register" className={`px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg text-sm ${isDarkBg ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                  Join Now
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                {/* Client Actions */}
                {isClient && !isPendingVendor && !isVendor && (
                  <button onClick={() => navigate("/become-vendor")} className={`text-sm font-medium transition-colors ${navLinkColor}`}>
                    Become a Seller
                  </button>
                )}

                {/* Dashboard Link */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium text-sm ${isDarkBg ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                {/* Logout */}
                <button onClick={handleLogout} className={`transition-colors ${isDarkBg ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-red-500"}`}>
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition ${isDarkBg ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-4 duration-200 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 space-y-4 shadow-xl">
          <Link to="/" className="block py-2 text-slate-600 font-medium hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/become-vendor" className="block py-2 text-slate-600 font-medium hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Become a Seller</Link>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" className="btn-secondary text-center flex justify-center" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary text-center flex justify-center" onClick={() => setMobileMenuOpen(false)}>Join Now</Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block py-2 text-indigo-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Go to Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-500 font-medium">
                Log Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
