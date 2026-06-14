import { motion } from "framer-motion";
import { Shield, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import AnnouncementBar from "../components/AnnouncementBar";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
            <AnnouncementBar />
            <Navbar />

            {/* 1. Hero Section: "The Mission" */}
            <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden text-center bg-white">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-100 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shadow-sm mb-6 text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        Our Mission
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6 ">
                        Revolutionizing the way <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Pakistan gets work done.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                        We are bridging the gap between skilled professionals and households, creating opportunities and ensuring quality craftsmanship for everyone, everywhere.
                    </p>
                </motion.div>
            </section>

            {/* 2. "Our Story" Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-6 -left-6 w-72 h-72 bg-indigo-100 rounded-full blur-2xl opacity-60"></div>
                                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-green-100 rounded-full blur-2xl opacity-60"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Team working together"
                                    className="rounded-[2.5rem] shadow-2xl relative z-10 w-full object-cover aspect-[4/3] border border-slate-200/50"
                                />
                                <div className="absolute bottom-10 -right-10 glass p-6 rounded-3xl z-20 shadow-xl hidden md:block max-w-[250px] rotate-3 hover:rotate-0 transition-transform">
                                     <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Impact</div>
                                     <div className="text-3xl font-bold text-slate-900 ">5000+</div>
                                     <div className="text-sm font-medium text-slate-600">Local pros hired monthly</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full lg:w-1/2"
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Empowering the Local Economy.</h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                                <p>
                                    For too long, finding a reliable electrician, plumber, or carpenter was a hassle filled with uncertainty. Prices were unclear, quality was inconsistent, and skilled workers struggled to find steady clients.
                                </p>
                                <p>
                                    E-Karigar changes that by building a robust digital infrastructure that seamlessly connects talent with demand. We verify every professional, standardize rates, and ensure that every job is done right.
                                </p>
                            </div>
                            <blockquote className="mt-8 border-l-4 border-indigo-500 pl-6 py-2">
                                <p className="text-xl italic text-slate-800 font-semibold leading-relaxed">
                                    "Technology should serve the hands that build our homes."
                                </p>
                            </blockquote>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Core Values Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 ">What We Stand For</h2>
                        <p className="mt-4 text-slate-500 font-medium">The principles that guide every decision we make.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: Shield, title: "Trust & Safety", desc: "Every vendor undergoes a comprehensive vetting and verification process." },
                            { icon: CheckCircle, title: "Quality First", desc: "We maintain a strict standard of excellence; we don't compromise on quality." },
                            { icon: Zap, title: "Efficiency", desc: "Our platform ensures lightning-fast bookings and reliable service delivery." },
                            { icon: Users, title: "Community", desc: "We are deeply committed to empowering local skilled workers." },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 hover:bg-white group"
                            >
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors shadow-sm">
                                    <item.icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. The "Impact" Stats Strip */}
            <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                        {[
                            { number: "15,000+", label: "Jobs Created" },
                            { number: "50+", label: "Cities Covered" },
                            { number: "4.8/5", label: "Average Rating" },
                            { number: "24/7", label: "Customer Support" },
                        ].map((stat, index) => (
                            <div key={index} className="pt-8 lg:pt-0 px-4">
                                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 ">{stat.number}</div>
                                <div className="text-indigo-300 text-xs uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Team Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 ">Meet the Minds</h2>
                        <p className="mt-4 text-slate-500 font-medium">The leadership team working to redefine local services. <br /> Powered by <span className="font-bold text-indigo-600">TechnikNest pvt Ltd</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            { name: "Sarah Ahmed", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                            { name: "Ahsan Naseer", role: "CTO", img: "/ahsan_naseer.jpg" },
                            { name: "Zainab Khan", role: "Head of Operations", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-indigo-100 transition-colors">
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{member.name}</h3>
                                <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider mt-1">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Final CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-white border-t border-slate-200">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-indigo-600/20"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 ">Ready to experience better service?</h2>
                        <p className="text-indigo-100 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of satisfied customers and skilled professionals who have already transformed their workflow with E-Karigar.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate("/services")}
                                className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold hover:bg-slate-50 hover:shadow-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                Book a Service <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => navigate("/become-vendor")}
                                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white transition-all w-full sm:w-auto"
                            >
                                Join as Vendor
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
            
            {/* Footer */}
            <footer className="bg-slate-50 text-slate-500 py-12 px-6 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-slate-900 font-bold text-xl mb-1 tracking-tight ">E-KARIGAR</p>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Master craftsmanship on demand</p>
                    </div>
                    <div className="text-sm font-semibold">
                        © 2026 E-KARIGAR INC. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
