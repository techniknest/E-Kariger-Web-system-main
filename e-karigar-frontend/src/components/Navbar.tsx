import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, MapPin, Globe, ChevronDown, Menu, Hammer, LogOut, UserCircle, Gauge } from "lucide-react";
import { pakistanCities } from "../data/pakistanCities";

interface NavbarProps {
    simple?: boolean;
}

const Navbar = ({ simple = false }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [locationName, setLocationName] = useState("Locating...");
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const locationRef = useRef<HTMLDivElement>(null);

    // Initial Load: Check localStorage first, then auto-detect
    useEffect(() => {
        const savedLocation = localStorage.getItem("userLocation");
        if (savedLocation) {
            setLocationName(savedLocation);
        } else {
            detectLocation();
        }
    }, []);

    // Check auth state on mount and update on event
    const checkAuth = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("auth-change", checkAuth);

        // Click outside handler for dropdowns
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setIsLocationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const detectLocation = () => {
        setLocationName("Locating...");
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const address = data.address;
                    const city = address.city || address.town || address.village || address.county || "Unknown Location";
                    setLocationName(city);
                    localStorage.setItem("userLocation", city);
                } catch (error) {
                    console.error("Error fetching location name:", error);
                    setLocationName("Location Unavailable");
                }
            }, (error) => {
                console.error("Geolocation Error:", error);
                setLocationName("Location Unavailable");
            });
        } else {
            setLocationName("Location Unavailable");
        }
    };

    const handleLocationSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            setIsSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Error searching location:", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const selectCity = (city: string) => {
        setLocationName(city);
        localStorage.setItem("userLocation", city);
        setIsLocationOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.dispatchEvent(new Event("auth-change")); // Notify other components
        navigate("/login");
    };

    // Navigation Links Data
    const navLinks = [
        { name: "HOME", path: "/" },
        { name: "ABOUT", path: "/about" },
        { name: "SERVICES", path: "/services" },
        { name: "VENDOR REGISTRATION", path: "/become-vendor", hasDropdown: true },
        { name: "HOW IT WORKS", path: "/how-it-works" },
    ];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log("Searching...");
        }
    }

    // Determine Dashboard Link based on role
    const getDashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "ADMIN") return "/dashboard"; // Admin dashboard
        if (user.role === "VENDOR") return "/vendor/dashboard";
        return "/client/dashboard";
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">

                    {/* Section A: Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100 group-hover:bg-blue-100 transition-colors">
                            <Hammer className="h-6 w-6 text-blue-700" />
                        </div>

                    </Link>

                    {/* Section B: Navigation Links (Center) - Hidden on Mobile & if simple is true */}
                    {!simple && (
                        <nav className="hidden md:flex items-center gap-8 h-full">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 text-xs font-medium uppercase tracking-wide h-full border-b-2 transition-all duration-200 ${isActive
                                            ? "border-blue-700 text-blue-700 pb-1"
                                            : "border-transparent text-slate-600 hover:text-blue-700 hover:border-blue-300"
                                        }`
                                    }
                                >
                                    {link.name}
                                    {link.hasDropdown && <ChevronDown className="h-3 w-3 mt-0.5" />}
                                </NavLink>
                            ))}
                        </nav>
                    )}

                    {/* Section C: Utilities (Right) - Hidden on Mobile & if simple is true */}
                    {!simple && (
                        <div className="hidden md:flex items-center gap-6">

                            {/* Search Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 text-slate-700 font-medium"
                                    onKeyDown={handleSearch}
                                />
                            </div>

                            {/* Location & Language */}
                            <div className="flex items-center gap-4 text-slate-500">
                                <div className="relative" ref={locationRef}>
                                    <button
                                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                                        className="flex items-center gap-1 hover:text-blue-700 cursor-pointer transition-colors"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase tracking-wide max-w-[100px] truncate" title={locationName}>{locationName}</span>
                                        <ChevronDown className={`h-3 w-3 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Location Dropdown */}
                                    {isLocationOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 z-[60]">
                                            {/* Current Location Button */}
                                            <button
                                                onClick={() => {
                                                    detectLocation();
                                                    setIsLocationOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium mb-2"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                Use my current location
                                            </button>

                                            {/* Search Input */}
                                            <div className="relative mb-2">
                                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search city..."
                                                    value={searchQuery}
                                                    onChange={handleLocationSearch}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Search Results / Popular Cities */}
                                            <div className="max-h-60 overflow-y-auto">
                                                {isSearching ? (
                                                    <div className="p-4 text-center text-xs text-gray-500">Searching...</div>
                                                ) : searchResults.length > 0 ? (
                                                    <div className="space-y-1">
                                                        <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Results</p>
                                                        {searchResults.map((result: any, index: number) => {
                                                            const cityName = result.address?.city || result.address?.town || result.address?.village || result.name;
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => selectCity(cityName)}
                                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg transition-colors truncate"
                                                                >
                                                                    {result.display_name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select City</p>
                                                        {pakistanCities.map((city) => (
                                                            <button
                                                                key={city}
                                                                onClick={() => selectCity(city)}
                                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-lg transition-colors"
                                                            >
                                                                {city}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="flex items-center gap-1 hover:text-blue-700 cursor-pointer transition-colors">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-xs font-medium uppercase tracking-wide">EN</span>
                                </div>
                            </div>

                            {/* Auth Section: Sign In OR User Menu */}
                            {!user ? (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium uppercase tracking-wide px-6 py-2.5 rounded-lg shadow-md shadow-blue-200 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2 z-[60]">
                                            <div className="px-4 py-3 border-b border-slate-50">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>

                                            <div className="p-1">
                                                <Link
                                                    to={getDashboardLink()}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <Gauge className="h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/dashboard/profile"
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <UserCircle className="h-4 w-4" />
                                                    My Profile
                                                </Link>
                                            </div>

                                            <div className="border-t border-slate-50 p-1 mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Button - Hidden if simple is true */}
                    {!simple && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {!simple && isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-16 shadow-xl animate-in slide-in-from-top-2 z-40">
                    <div className="p-4 space-y-4">
                        {/* Mobile Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <nav className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-sm font-bold uppercase flex justify-between items-center transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                                        }`
                                    }
                                >
                                    {link.name}
                                    {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            {!user ? (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg uppercase text-sm shadow-lg shadow-blue-200"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 px-2 py-2">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={getDashboardLink()}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-lg uppercase text-sm flex items-center justify-center gap-2"
                                    >
                                        <Gauge className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-lg uppercase text-sm flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
