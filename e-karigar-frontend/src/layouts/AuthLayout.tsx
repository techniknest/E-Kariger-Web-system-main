import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans">
            {/* 1. Standard Navbar */}
            <Navbar />

            {/* 2. Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Image (Hidden on Mobile) */}
                <div className="hidden lg:block lg:w-[45%] relative h-full bg-slate-900 border-r border-slate-200/20">
                    {/* Glowing effect top-left */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    
                    <img
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Professional at work"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

                    <div className="absolute bottom-20 left-12 right-12 text-white">
                        <blockquote className="space-y-8">
                            <svg className="w-10 h-10 text-indigo-400 opacity-60" fill="currentColor" viewBox="0 0 32 32">
                                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h4V8h-4zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h4V8h-4z"/>
                            </svg>
                            <p className="text-3xl font-bold leading-tight text-white tracking-tight ">
                                "Finding reliable work has never been easier. E-Karigar connected me with clients who value quality craftsmanship."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-100 font-bold text-lg">
                                    AH
                                </div>
                                <div>
                                    <p className="font-bold text-lg leading-tight tracking-tight">Ahmed Hassan</p>
                                    <p className="text-indigo-300 text-sm font-medium">Master Electrician, Islamabad</p>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>

                {/* Right Column: Form Container */}
                <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-slate-50 h-full overflow-y-auto">
                     {/* Background Pattern */}
                     <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
                     
                    <div className="w-full max-w-sm relative z-10 glass p-8 sm:p-10 rounded-[2rem]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
