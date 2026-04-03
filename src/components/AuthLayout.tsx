"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: React.ReactNode;
    subtitleBlock1?: string;
    subtitleBlock2?: string;
    subtitleBlock3?: string;
}

export default function AuthLayout({
    children,
    subtitleBlock1 = "GUKURIKIRANA",
    subtitleBlock2 = "URUGO",
    subtitleBlock3 = "AHO URI HOSE"
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop")' }}
            >
                <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Left Side: Branding and Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col text-center lg:text-left justify-center px-4 lg:pl-12 xl:pl-24"
                >
                    <div className="mb-8 lg:mb-12">
                        <h1 className="text-2xl lg:text-3xl font-bold text-brand-text mb-6 lg:mb-8 tracking-tighter">
                            MUTEKANO
                        </h1>

                        <div className="flex flex-col leading-none mb-6">
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-black text-brand-brown tracking-tighter leading-[0.85] lg:leading-[0.8]">
                                {subtitleBlock1}
                            </span>
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-black text-white drop-shadow-sm tracking-tighter leading-[0.9]">
                                {subtitleBlock2}
                            </span>
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem] font-black text-white/50 tracking-tighter leading-[0.85] lg:leading-[0.8] mix-blend-overlay">
                                {subtitleBlock3}
                            </span>
                        </div>

                        <p className="text-brand-text/80 text-base sm:text-lg lg:text-xl max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                            Sisitemu yo gukurikirana ubuhinzi n'ubworozi ikoresha ikoranabuhanga rigezweho rya AI n'ibikoresho bya ESP32-CAM.
                        </p>
                    </div>

                    {/* Stats - Hidden on very small screens, responsive block on others */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="hidden sm:flex gap-8 lg:gap-12 mt-4 lg:mt-8 justify-center lg:justify-start"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase mb-1">Igihe</span>
                            <span className="text-2xl lg:text-3xl font-black text-white drop-shadow-sm">24/7</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase mb-1">Umutekano</span>
                            <span className="text-2xl lg:text-3xl font-black text-white drop-shadow-sm">100%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase mb-1">Ikoranabuhanga</span>
                            <span className="text-2xl lg:text-3xl font-black text-white drop-shadow-sm">AI+</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                    className="flex justify-center lg:justify-end px-4 lg:pr-12 xl:pr-24"
                >
                    <div className="glass-panel w-full max-w-md p-8 md:p-10 lg:p-14 relative overflow-hidden" style={{ borderRadius: '2.5rem' }}>
                        {/* Glossy top edge highlight for glass effect */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                        {children}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
