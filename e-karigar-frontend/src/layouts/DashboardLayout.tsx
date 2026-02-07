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
    UserCircle
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
    ];

    const vendorLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Job Requests", icon: Briefcase, path: "/dashboard/jobs" },
        { name: "My Profile", icon: UserCircle, path: "/dashboard/profile" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    ];

    const clientLinks = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "My Bookings", icon: Briefcase, path: "/dashboard/bookings" },
        { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    ];

    const links = isAdmin ? adminLinks : (isVendor ? vendorLinks : clientLinks);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-200">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                            <Briefcase className="h-6 w-6" />
                            <span>E-Karigar</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive
                                            ? "bg-indigo-50 text-indigo-600 font-medium"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                                >
                                    <link.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary & Logout */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
