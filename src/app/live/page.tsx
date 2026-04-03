"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
    ArrowLeft, Share, Settings, Camera, Mic, TriangleAlert,
    Battery, Wifi, Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';

export default function LivePage() {
    const router = useRouter();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-white font-sans pb-12 overflow-x-hidden">
            <TopNavbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-[1500px] mx-auto px-4 md:px-8 pt-6 md:pt-10"
            >
                {/* Header toolbar */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-12 h-12 bg-brand-brown hover:bg-brand-brown-dark rounded-2xl flex items-center justify-center text-white shadow-md transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-black text-brand-brown tracking-tight">Irembo Rikuru</h1>
                                <div className="bg-[#fdf0e9] text-brand-brown text-[9px] md:text-[10px] font-black uppercase px-2 py-1 md:px-3 rounded-full border border-brand-brown/20 tracking-widest flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-brand-brown rounded-full animate-pulse"></div>
                                    LIVE
                                </div>
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-brand-text/60 uppercase mt-1">
                                BITANGA AMASHUSHO AKO KANYA • 4K ULTRA HD • 60 FPS
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Avatars */}
                        <div className="flex -space-x-2 mr-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-green-200 z-30">
                                <img src="https://ui-avatars.com/api/?name=User+One&background=random" alt="U1" className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-200 z-20">
                                <img src="https://ui-avatars.com/api/?name=User+Two&background=random" alt="U2" className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-yellow-200 z-10">
                                <img src="https://ui-avatars.com/api/?name=User+Three&background=random" alt="U3" className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>

                        <button className="w-12 h-12 bg-[#faebd7] hover:bg-[#ffe4c4] text-brand-brown rounded-2xl flex items-center justify-center shadow-sm transition-colors">
                            <Share size={20} />
                        </button>
                        <button className="w-12 h-12 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-2xl flex items-center justify-center shadow-sm transition-colors">
                            <Settings size={20} />
                        </button>
                    </div>
                </motion.div>

                {/* Huge Live Player Card */}
                <motion.div variants={itemVariants} className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")' }}
                    ></div>
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Top Left Indicators */}
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2 md:gap-3">
                        <div className="bg-red-600/90 backdrop-blur-md rounded-full px-3 py-1.5 md:px-5 md:py-2.5 flex items-center gap-2 md:gap-3 border border-red-500 shadow-lg">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white animate-pulse"></div>
                            <span className="text-white text-[10px] md:text-xs font-black tracking-widest">REC 00:24:12</span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 md:px-5 md:py-2.5 flex items-center shadow-lg w-max hidden sm:flex">
                            <span className="text-white/80 text-[10px] font-bold tracking-widest">08:23:26 UTC+2</span>
                        </div>
                    </div>

                    {/* Right Metrics */}
                    <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col gap-2 md:gap-3 hidden sm:flex">
                        <div className="bg-black/30 backdrop-blur-md rounded-xl md:rounded-[1.5rem] px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-4 shadow-lg border border-white/5">
                            <Battery className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
                            <div className="flex flex-col text-white">
                                <span className="text-xs md:text-sm font-black">85%</span>
                                <span className="text-[8px] font-black tracking-widest text-white/50 uppercase hidden md:inline">POWER</span>
                            </div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md rounded-xl md:rounded-[1.5rem] px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 md:gap-4 shadow-lg border border-white/5">
                            <Wifi className="text-brand-brown w-4 h-4 md:w-5 md:h-5" />
                            <div className="flex flex-col text-white">
                                <span className="text-xs md:text-sm font-black">48ms</span>
                                <span className="text-[8px] font-black tracking-widest text-white/50 uppercase hidden md:inline">PING</span>
                            </div>
                        </div>
                    </div>

                    {/* Center Action Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6">
                        <button className="w-14 h-14 md:w-16 md:h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <TriangleAlert size={24} />
                        </button>
                        <button className="w-20 h-20 md:w-24 md:h-24 bg-brand-brown hover:bg-brand-brown-dark rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/10 relative overflow-hidden group/btn">
                            <div className="absolute inset-0 bg-white/20 mix-blend-overlay scale-0 group-hover/btn:scale-150 transition-transform duration-500 rounded-full"></div>
                            <Camera size={32} />
                        </button>
                        <button className="w-14 h-14 md:w-16 md:h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <Mic size={24} />
                        </button>
                    </div>
                </motion.div>

                {/* Film Strip Below */}
                <motion.div variants={containerVariants} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-20">
                    <FilmStripCard
                        name="CAMERA 1"
                        isActive
                        image="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop"
                    />
                    <FilmStripCard
                        name="CAMERA 2"
                        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"
                    />
                    <FilmStripCard
                        name="CAMERA 3"
                        image="https://images.unsplash.com/photo-1456578051410-6c5df3afdf35?q=80&w=1969&auto=format&fit=crop"
                    />
                    <FilmStripCard
                        name="CAMERA 4"
                        image="https://images.unsplash.com/photo-1520696956247-f5dc94cb751f?q=80&w=2070&auto=format&fit=crop"
                        isBW
                    />
                </motion.div>

            </motion.main>
        </div>
    );
}

function FilmStripCard({ name, isActive = false, image, isBW = false }: { name: string, isActive?: boolean, image: string, isBW?: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg transition-all ${isActive ? 'ring-4 ring-brand-brown ring-offset-2' : ''}`}
        >
            <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110 ${isBW ? 'grayscale opacity-70' : ''}`}
                style={{ backgroundImage: `url("${image}")` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-white text-[10px] font-black tracking-widest uppercase">{name}</span>
                {isActive && <div className="w-2.5 h-2.5 bg-brand-brown rounded-full shadow-[0_0_8px_rgba(142,82,51,0.8)]"></div>}
            </div>
        </motion.div>
    );
}
