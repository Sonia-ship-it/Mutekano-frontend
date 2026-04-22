"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    subtitleBlock1?: string;
    subtitleBlock2?: string;
    subtitleBlock3?: string;
    formMaxWidth?: string;
}

export default function AuthLayout({
    children,
    subtitleBlock1 = "GUKURIKIRANA",
    subtitleBlock2 = "URUGO",
    subtitleBlock3 = "AHO URI HOSE",
    formMaxWidth = "560px"
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Image with slight blur for depth */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
                style={{
                    backgroundImage: 'url("/photo.png")',
                    filter: 'blur(3px) brightness(1.05)'
                }}
            >
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/40 to-white/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Main Content Container — flex with justify-between for maximum spacing */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-10 lg:py-0 gap-10 lg:gap-0">

                {/* Left Side: Branding and Text */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col text-center lg:text-left justify-center lg:max-w-[45%] xl:max-w-[38%]"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="flex items-center gap-4 mb-4 justify-center lg:justify-start"
                    >
                        <img src="/mu_1.png" alt="Mutekano Logo" className="h-14 w-auto object-contain" />
                        <span className="text-xl lg:text-3xl font-black text-brand-text tracking-tight">MUTEKANO</span>
                    </motion.div>

                    {/* Giant typography block */}
                    <div className="flex flex-col leading-none mb-6 lg:mb-8">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-brand-brown tracking-tighter leading-[0.85]">
                            {subtitleBlock1}
                        </span>
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-white tracking-tighter leading-[0.9]" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
                            {subtitleBlock2}
                        </span>
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-white/40 tracking-tighter leading-[0.85] mix-blend-overlay">
                            {subtitleBlock3}
                        </span>
                    </div>

                    <p className="text-brand-text/70 text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0 font-medium leading-relaxed mb-8 lg:mb-10">
                        Rinda umutungo wawe ukoresheje Ikoranabuhanga Rigezweho kandi Ryizewe .
                    </p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="hidden sm:flex gap-6 lg:gap-10 justify-center lg:justify-start"
                    >
                        {[
                            { label: "Igihe", value: "24/7" },
                            { label: "Umutekano", value: "100%" },
                            { label: "Ikoranabuhanga", value: "AI+" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center lg:items-start">
                                <span className="text-[9px] lg:text-[10px] font-bold text-brand-text/50 tracking-[0.2em] uppercase mb-1">{stat.label}</span>
                                <span className="text-2xl lg:text-3xl font-black text-brand-brown/90">{stat.value}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Side: Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                    className="flex justify-center lg:justify-end w-full lg:w-auto lg:shrink-0"
                >
                    <div
                        className="w-full relative overflow-hidden"
                        style={{
                            maxWidth: formMaxWidth,
                            borderRadius: '2.5rem',
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.9)',
                            paddingTop: 'clamp(2rem, 3.5vw, 3rem)',
                            paddingBottom: 'clamp(2rem, 3.5vw, 3rem)',
                            paddingLeft: 'clamp(2rem, 4vw, 3.5rem)',
                            paddingRight: 'clamp(2rem, 4vw, 3.5rem)',
                        }}
                    >
                        {/* Glossy top edge highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent"></div>
                        {/* Subtle inner glow */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-brand-brown/5 rounded-full blur-3xl pointer-events-none"></div>
                        {children}
                    </div>
                </motion.div>

            </div>

            {/* Bottom attribution bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-5 hidden lg:flex items-center justify-between text-[10px] font-bold tracking-widest text-brand-text/30 uppercase">
                <span>© 2026 Mutekano</span>
                <span>Powered by ESP32-CAM + AI</span>
            </div>
        </div>
    );
}
