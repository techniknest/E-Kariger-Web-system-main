import { useState } from "react";
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
    User
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AnnouncementBar from "../components/AnnouncementBar";
import FeaturedServices from "../components/FeaturedServices";

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/services?query=${searchQuery}&location=${location}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <AnnouncementBar />
            <Navbar />

            {/* 1. Hero Section: "The Trust Builder" */}
            <section className="relative h-[calc(100vh-6.5rem)] flex flex-col overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1581578731117-104f2a8d4618?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Professional Worker"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto px-6 text-center w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="w-full"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Expert Services, <br />
                            <span className="text-blue-400">Right at Your Doorstep.</span>
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Instant access to verified electricians, plumbers, and technicians. Quality work you can trust.
                        </p>

                        {/* Search Component */}
                        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl flex flex-col md:flex-row shadow-2xl gap-2 mb-8 md:mb-0">
                            <div className="flex-1 flex items-center bg-white/10 rounded-lg px-4 h-12 border border-white/10">
                                <Search className="text-gray-300 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Service or Keyword"
                                    className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full ml-3 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 flex items-center bg-white/10 rounded-lg px-4 h-12 border border-white/10">
                                <MapPin className="text-gray-300 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full ml-3 text-sm font-medium"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-blue-700 hover:bg-blue-600 text-white font-medium text-sm h-12 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 uppercase tracking-wide"
                            >
                                Find a Pro
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { icon: Shield, title: "Verified Pros", desc: "Background Checked" },
                            { icon: CheckCircle, title: "Secure Payment", desc: "Pay After Service" },
                            { icon: Clock, title: "24/7 Support", desc: "Always Available" },
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-100">
                                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 shrink-0">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold tracking-tight text-slate-900">{index === 0 ? "500+" : index === 1 ? "100%" : "24/7"}</h3>
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* 2. Category Grid: "Visual Discovery" */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">What help do you need today?</h2>
                        <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
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
                                className="group bg-slate-50 border border-slate-100 rounded-xl p-6 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-100"
                                onClick={() => navigate(`/services?category=${cat.label}`)}
                            >
                                <div className="w-8 h-8 mx-auto mb-4 text-blue-700 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <cat.icon className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 tracking-tight">{cat.label}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 3. "How It Works" Section: "The 3-Step Process" */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">How E-Karigar Works</h2>
                        <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">Get your job done in three simple steps. We make it easy, fast, and secure.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                        {[
                            { step: "01", title: "Search", desc: "Choose from 50+ services and find the right expert.", icon: Search },
                            { step: "02", title: "Book", desc: "Select a convenient time slot and book instantly.", icon: Clock },
                            { step: "03", title: "Relax", desc: "Our verified expert arrives at your doorstep.", icon: User },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative"
                            >
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md rotate-3">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <div className="absolute top-4 right-6 text-2xl font-bold text-slate-100 select-none">
                                    {step.step}
                                </div>
                                <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Featured Services (Real Data) */}
            <FeaturedServices />

            {/* 5. Vendor Call-to-Action (CTA): "Supply Growth" */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">Are you a skilled professional?</h2>
                            <p className="text-blue-100 text-base leading-relaxed mb-8 font-light">
                                Join E-Karigar today and connect with thousands of customers looking for your expertise. Grow your business on your terms.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link to="/register?type=vendor" className="bg-white text-slate-900 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-lg uppercase tracking-wide">
                                    Become a Vendor
                                </Link>
                                <Link to="/about" className="px-6 py-2.5 text-white text-sm font-medium hover:text-blue-200 transition-colors uppercase tracking-wide">
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 hidden lg:block">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 max-w-sm rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        $
                                    </div>
                                    <div>
                                        <div className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Monthly Average</div>
                                        <div className="text-xl font-bold text-white tracking-tight">Rs. 85,000+</div>
                                    </div>
                                </div>
                                <p className="text-blue-200 text-xs italic leading-relaxed">
                                    "Since joining E-Karigar, my plumbing business has doubled. The payments are secure and fast!"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-white font-bold text-xl mb-2">E-KARIGAR</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Master craftsmanship on demand</p>
                    </div>
                    <div className="text-xs font-medium">
                        © 2026 E-KARIGAR INC. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
