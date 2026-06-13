import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    Shield,
    Clock,
    CheckCircle,
    Wrench,
    Zap,
    Droplet,
    Hammer,
    Paintbrush,
    Wind,
    User,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AnnouncementBar from "../components/AnnouncementBar";
import FeaturedServices from "../components/FeaturedServices";

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    setUser(JSON.parse(userStr));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        checkAuth();
        window.addEventListener("auth-change", checkAuth);
        return () => window.removeEventListener("auth-change", checkAuth);
    }, []);

    const handleSearch = () => {
        navigate(`/services?query=${searchQuery}&location=${location}`);
    };

    const getPartnerLink = () => {
        if (!user) return "/register?type=vendor";
        if (user.role === "VENDOR") return "/vendor/dashboard";
        return "/become-vendor";
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <AnnouncementBar />
            <Navbar />

            {/* 1. Hero Section: Premium Marketplace Grade */}
            <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center border-b border-slate-200">
                {/* Subtle refined background grid & glows */}
                <div className="absolute top-0 right-0 -m-32 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full posans-events-none"></div>
                <div className="absolute bottom-0 left-0 -m-32 w-[600px] h-[600px] bg-slate-400/10 blur-[100px] rounded-full posans-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] posans-events-none"></div>
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 hover:border-slate-300 transition-colors cursor-default"
                    >
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">The Premium Professional Network</span>
                    </motion.div>

                    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl w-full">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                            Master craftsmanship, <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500">on demand.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            Connect with verified electricians, plumbers, and technicians. Experience seamless bookings, secure payments, and guaranteed quality.
                        </p>

                        {/* Search Card: Glassmorphic Elegance */}
                        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-2.5 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row gap-2.5 mb-12 relative z-20 hover:shadow-2xl hover:shadow-indigo-900/5 transition-shadow duration-300">
                            <div className="flex-1 flex items-center bg-slate-50/50 rounded-xl px-4 h-14 border border-slate-200/60 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                                <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="What do you need help with?"
                                    className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 w-full ml-3 font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 flex items-center bg-slate-50/50 rounded-xl px-4 h-14 border border-slate-200/60 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                                <MapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Your Location"
                                    className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 w-full ml-3 font-medium"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-14 px-8 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.2)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)] flex items-center gap-2 flex-shrink-0"
                            >
                                Search Pros <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="relative z-10 w-full px-6 flex justify-center mt-4"
                >
                    <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-slate-500">
                        <div className="flex items-center gap-2.5">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-semibold tracking-wide">Fully Verified Profiles</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                           <CheckCircle className="w-5 h-5 text-indigo-600" />
                           <span className="text-sm font-semibold tracking-wide">Quality Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                           <Clock className="w-5 h-5 text-indigo-600" />
                           <span className="text-sm font-semibold tracking-wide">Instant Availability</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Category Grid */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-14 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Explore Categories</h2>
                            <p className="text-slate-500 mt-3 font-medium leading-relaxed">Discover top-rated professionals across multiple specialties. Carefully vetted and ready for your next project.</p>
                        </div>
                        <Link to="/services" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5 group bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg">
                            Browse All <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"/>
                        </Link>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    >
                         {[
                            { label: "Plumbing", icon: Droplet },
                            { label: "Electrical", icon: Zap },
                            { label: "Cleaning", icon: Wind },
                            { label: "Carpentry", icon: Hammer },
                            { label: "Painting", icon: Paintbrush },
                            { label: "AC Repair", icon: Wrench },
                        ].map((cat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="group border border-slate-200 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5 bg-white"
                                onClick={() => navigate(`/services?category=${cat.label}`)}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 text-slate-400 flex items-center justify-center bg-slate-50 rounded-xl transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{cat.label}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 3. Featured Services */}
            <FeaturedServices />

            {/* 4. "How It Works" - SaaS Split */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full posans-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-sm font-bold text-indigo-400 tracking-widest uppercase mb-3">Seamless Process</h2>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">How E-Karigar Works</h3>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                                Getting your projects completed shouldn't be a hassle. Our streamlined platform ensures a perfect match every time in just three steps.
                            </p>
                            <Link to="/services" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3 rounded-lg transition-all backdrop-blur-sm">
                                Start Your Project
                            </Link>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-6">
                            {[
                                { step: "01", title: "Discover & Compare", desc: "Browse through a curated list of verified professionals. Evaluate ratings, portfolios, and reviews side-by-side.", icon: Search },
                                { step: "02", title: "Book Instantly", desc: "Select an available time slot that works for you, agree on upfront pricing, and lock in your professional.", icon: Clock },
                                { step: "03", title: "Mission Accomplished", desc: "Our expert arrives prepared and resolves your issue. Securely finalize payments only when the job is done right.", icon: User },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 flex gap-6 hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="w-14 h-14 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-800 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md">{step.step}</span>
                                            <h4 className="text-lg font-bold tracking-tight text-slate-100">{step.title}</h4>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed text-sm font-medium">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Vendor CTA - Clean Geometric SaaS */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-slate-800">
                        {/* Architectural Gradients */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-900/40 via-transparent to-transparent posans-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 blur-[80px] rounded-full posans-events-none"></div>

                        <div className="relative z-10 max-w-xl text-center lg:text-left">
                            <span className="inline-block py-1 px-3 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-500/30">
                                For Service Providers
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">Scale your service business.</h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                Connect with your ideal clientele, manage bookings effortlessly, and grow your revenue securely. Join the elite network today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to={getPartnerLink()} className="bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-500 transition-all flex justify-center items-center gap-2">
                                    Become a Partner <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link to="/about" className="px-8 py-3.5 text-white font-semibold hover:bg-white/5 transition-colors border border-slate-700 hover:border-slate-600 rounded-xl flex justify-center items-center">
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 hidden lg:flex items-center justify-center mr-8 lg:mr-16">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full lg:w-80 shadow-2xl relative">
                                <div className="absolute -right-4 -top-4 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <Zap className="w-5 h-5" fill="currentColor" />
                                </div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Platform Metrics</div>
                                <div className="text-3xl font-bold text-white tracking-tight mb-6">4.9/5 <span className="text-sm font-medium text-slate-500">Avg. Rating</span></div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Bookings Growth</span>
                                            <span className="text-indigo-400 font-bold">+120%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Payment Safety</span>
                                            <span className="text-emerald-400 font-bold">100%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-slate-500 py-12 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-slate-900 font-bold text-xl mb-1 tracking-tight">E-KARIGAR</p>
                        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Master craftsmanship on demand</p>
                    </div>
                    <div className="text-sm font-medium">
                        © 2026 E-KARIGAR INC. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

