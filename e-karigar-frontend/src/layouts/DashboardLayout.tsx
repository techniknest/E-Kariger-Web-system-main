import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Briefcase,
    FileCheck,
    UserCircle,
    Home,
    Calendar,
} from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: any;
}

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = user?.role === "ADMIN";
    const isVendor = user?.role === "VENDOR" || user?.vendorStatus === "APPROVED";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const adminLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Vendor Verification", icon: FileCheck, path: "/dashboard/verification" },
        { name: "Users", icon: Users, path: "/dashboard/users" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
        { name: "Return to Home", icon: Home, path: "/" },
    ];

    const vendorLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Job Requests", icon: Briefcase, path: "/dashboard/jobs" },
        { name: "My Profile", icon: UserCircle, path: "/dashboard/profile" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
        { name: "Return to Home", icon: Home, path: "/" },
    ];

    const clientLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/client/dashboard" },
        { name: "My Bookings", icon: Calendar, path: "/client/bookings" },
        { name: "Settings", icon: Settings, path: "/client/settings" },
        { name: "Return to Home", icon: Home, path: "/" },
    ];

    const links = isAdmin ? adminLinks : (isVendor ? vendorLinks : clientLinks);

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 
                    transform transition-transform duration-200 ease-in-out flex flex-col
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-slate-900">E-KARIGAR</span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"}
                                `}
                            >
                                <link.icon className={`h-[18px] w-[18px] ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile (Bottom) */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="h-9 w-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header Bar */}
                <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-slate-500 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg relative">
                            <Bell className="h-[18px] w-[18px]" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
