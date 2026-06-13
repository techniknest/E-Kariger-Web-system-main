import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutGrid,
    Users,
    Settings2,
    LogOut,
    Menu,
    X,
    Bell,
    Briefcase,
    ShieldCheck,
    User,
    Home,
    History,
    TrendingUp,
    ChevronRight,
    Search,
    Sparkles
} from "lucide-react";

import NotificationsDropdown from "../components/NotificationsDropdown";

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
        { name: "Overview", icon: LayoutGrid, path: "/admin/dashboard", category: "MAIN", colorClass: "text-indigo-400" },
        { name: "Vendors", icon: ShieldCheck, path: "/admin/vendors", category: "MANAGEMENT", colorClass: "text-violet-400" },
        { name: "Users", icon: Users, path: "/admin/users", category: "MANAGEMENT", colorClass: "text-blue-400" },
        { name: "Settings", icon: Settings2, path: "/admin/settings", category: "SYSTEM", colorClass: "text-slate-400" },
        { name: "Exit to Home", icon: Home, path: "/", category: "SYSTEM", colorClass: "text-slate-500" },
    ];

    const vendorLinks = [
        { name: "Dashboard", icon: LayoutGrid, path: "/vendor/dashboard", category: "MAIN", colorClass: "text-indigo-400" },
        { name: "Active Assignments", icon: Briefcase, path: "/vendor/jobs", category: "JOBS", colorClass: "text-violet-400" },
        { name: "Revenue Stats", icon: TrendingUp, path: "/vendor/earnings", category: "FINANCE", colorClass: "text-emerald-400" },
        { name: "Business Profile", icon: User, path: "/profile", category: "ACCOUNT", colorClass: "text-amber-400" },
        { name: "Exit to Home", icon: Home, path: "/", category: "ACCOUNT", colorClass: "text-slate-500" },
    ];

    const clientLinks = [
        { name: "My Dashboard", icon: LayoutGrid, path: "/client/dashboard", category: "MAIN", colorClass: "text-indigo-400" },
        { name: "Past Bookings", icon: History, path: "/client/history", category: "RECORDS", colorClass: "text-violet-400" },
        { name: "Preferences", icon: Settings2, path: "/client/settings", category: "ACCOUNT", colorClass: "text-slate-400" },
        { name: "Exit to Home", icon: Home, path: "/", category: "ACCOUNT", colorClass: "text-slate-500" },
    ];

    const rawLinks = isAdmin ? adminLinks : (isVendor ? vendorLinks : clientLinks);
    const categories = Array.from(new Set(rawLinks.map(l => l.category)));

    return (
        <div className="min-h-screen bg-slate-50 flex selection:bg-indigo-100 font-sans">
            
            {/* ─── Mobile Sidebar Overlay ────────────────────────────────────── */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 z-[60] lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ─── Sidebar ───────────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-[70] w-[280px] bg-[#0B1120] text-slate-300
                    border-r border-slate-800 shadow-2xl lg:shadow-none
                    transform transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Brand / Logo */}
                <div className="h-20 flex items-center justify-between px-8 shrink-0 bg-[#0B1120]/50 backdrop-blur-xl border-b border-white/5 relative z-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase">
                            -Karigar
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white lg:hidden transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto no-scrollbar relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                    {categories.map((cat) => (
                        <div key={cat} className="space-y-3">
                            <h3 className="px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                {cat}
                            </h3>
                            <div className="space-y-1">
                                {rawLinks.filter(l => l.category === cat).map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="relative block group"
                                        >
                                            <div
                                                className={`
                                                    relative flex items-center gap-3.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300
                                                    ${isActive
                                                        ? "text-white bg-white/5 shadow-sm ring-1 ring-white/10"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"}
                                                `}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeDarkPill"
                                                        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-r-full"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <link.icon className={`h-5 w-5 shrink-0 transition-colors z-10 ${isActive ? link.colorClass : "group-hover:" + link.colorClass}`} />
                                                <span className="z-10 truncate tracking-wide">{link.name}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Section (Bottom) */}
                <div className="p-4 shrink-0 bg-[#0F172A] border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative">
                            {user?.profile_photo ? (
                                <img 
                                    src={user.profile_photo} 
                                    alt={user.name} 
                                    className="h-10 w-10 border border-slate-700/50 rounded-xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="h-10 w-10 border border-slate-700/50 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-800 flex items-center justify-center text-indigo-200 text-sm font-black shadow-lg">
                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs text-slate-400 font-bold hover:bg-red-500/10 hover:text-red-400 hover:ring-1 hover:ring-red-500/20 rounded-xl transition-all duration-200"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ──────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                
                {/* Simplified Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
                    <button
                        onClick={toggleSidebar}
                        className="p-2.5 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl lg:hidden transition-all shadow-sm active:scale-95 border border-slate-200"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex-1 flex justify-center lg:justify-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Command Center</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationsDropdown />
                        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
                        <div className="flex items-center gap-3 pl-2 transition-all cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm ring-2 ring-white transition-transform group-hover:scale-110 overflow-hidden">
                                {user?.profile_photo ? (
                                    <img src={user.profile_photo} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0)
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50">
                    <div className="max-w-7xl mx-auto p-4 lg:p-10 animate-in fade-in duration-700 slide-in-from-bottom-2">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
