import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            {/* 1. Standard Navbar */}
            <Navbar />

            {/* 2. Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Image (Hidden on Mobile) */}
                <div className="hidden lg:block lg:w-1/2 relative h-full bg-slate-900">
                    <img
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Professional at work"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90"></div>

                    <div className="absolute bottom-20 left-12 right-12 text-white">
                        <blockquote className="space-y-6">
                            <p className="text-2xl font-serif italic leading-relaxed text-blue-100">
                                "Finding reliable work has never been easier. E-Karigar connected me with clients who value quality craftsmanship."
                            </p>
                            <div>
                                <p className="font-bold text-lg">Ahmed Hassan</p>
                                <p className="text-blue-300 text-sm">Master Electrician, Islamabd</p>
                            </div>
                        </blockquote>
                    </div>
                </div>

                {/* Right Column: Form Container */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-white h-full">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
