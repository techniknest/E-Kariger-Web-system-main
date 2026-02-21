import { motion } from "framer-motion";
import { Shield, Users, Zap, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import AnnouncementBar from "../components/AnnouncementBar";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();

    // Animation variants
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

    return (
        <div className="min-h-screen font-sans">
            <AnnouncementBar />
            <Navbar />

            {/* 1. Hero Section: "The Mission" */}
            <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    <p className="text-blue-700 text-sm font-bold tracking-widest uppercase">Our Mission</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                        Revolutionizing the way Pakistan gets work done.
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We are bridging the gap between skilled professionals and households, creating opportunities and ensuring quality craftsmanship for everyone.
                    </p>
                </motion.div>
            </section>

            {/* 2. "Our Story" Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Team working together"
                                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                            />
                        </motion.div>

                        {/* TV Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2 space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-slate-900">Empowering the Local Economy.</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    For too long, finding a reliable electrician, plumber, or carpenter was a hassle filled with uncertainty. Prices were unclear, quality was inconsistent, and skilled workers struggled to find steady clients.
                                </p>
                                <p>
                                    E-Karigar changes that by building a digital infrastructure that connects talent with demand. We verify every professional, standardize rates, and ensure that every job is done right.
                                </p>
                            </div>
                            <blockquote className="border-l-4 border-blue-700 pl-4 py-2 italic text-slate-700 font-medium">
                                "Technology should serve the hands that build our homes."
                            </blockquote>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Core Values Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">What We Stand For</h2>
                        <p className="mt-4 text-slate-600">The principles that guide every decision we make.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: Shield, title: "Trust & Safety", desc: "Every vendor is vetted and verified." },
                            { icon: CheckCircle, title: "Quality First", desc: "We don't compromise on standards." },
                            { icon: Zap, title: "Efficiency", desc: "Fast booking, quick service delivery." },
                            { icon: Users, title: "Community", desc: "Supporting local skilled workers." },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                    <item.icon className="h-6 w-6 text-blue-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. The "Impact" Stats Strip */}
            <section className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                        {[
                            { number: "15,000+", label: "Jobs Created" },
                            { number: "50+", label: "Cities Covered" },
                            { number: "4.8/5", label: "Average Rating" },
                            { number: "24/7", label: "Customer Support" },
                        ].map((stat, index) => (
                            <div key={index} className="pt-4 lg:pt-0 px-4">
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-blue-200 text-sm uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Team Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Meet the Minds</h2>
                        <p className="mt-4 text-slate-600">The team working behind the scenes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            { name: "Sarah Ahmed", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                            { name: "Ali Raza", role: "CTO", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                            { name: "Zainab Khan", role: "Head of Operations", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-blue-50 shadow-md"
                                />
                                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                                <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Final CTA */}
            <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-20 px-4 sm:px-6 lg:px-8 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to experience better service?</h2>
                    <p className="text-blue-100 text-lg">Join thousands of satisfied customers and skilled professionals today.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate("/services")}
                            className="px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto shadow-lg"
                        >
                            Book a Service
                        </button>
                        <button
                            onClick={() => navigate("/become-vendor")}
                            className="px-8 py-3.5 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors w-full sm:w-auto"
                        >
                            Join as Vendor
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;
