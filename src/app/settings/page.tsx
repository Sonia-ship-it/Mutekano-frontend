"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    LogOut, Shield, Moon, Bell, Clock, Camera, Wifi, RefreshCw, ChevronRight, Settings as SettingsIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const rightPaneVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f8] font-sans pb-12 overflow-x-hidden">
            <TopNavbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight mb-2">Igenamiterere</h1>
                        <p className="text-brand-text/70 font-bold text-sm">Genzura uko sisitemu yawe ikoreshwa.</p>
                    </div>

                    <button
                        onClick={() => router.push('/login')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-bold text-sm transition-colors self-start md:self-auto shadow-sm"
                    >
                        <LogOut size={18} />
                        Sohoka muri Sisitemu
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Sidebar Menu */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="lg:col-span-1 flex flex-col gap-8"
                    >
                        {/* SISITEMU Group */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">SISITEMU</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={Shield}
                                    title="Uburyo bwo kurinda"
                                    value="BIRINZWE"
                                    isActive={activeTab === 'security'}
                                    onClick={() => setActiveTab('security')}
                                />
                                <SettingsMenuCard
                                    icon={Moon}
                                    title="Imiterere y'amabara"
                                    value="DARK"
                                    isActive={activeTab === 'theme'}
                                    onClick={() => setActiveTab('theme')}
                                />
                                <SettingsMenuCard
                                    icon={Bell}
                                    title="Integuza"
                                    value="BIRAKORA"
                                    isActive={activeTab === 'notifications'}
                                    onClick={() => setActiveTab('notifications')}
                                />
                                <SettingsMenuCard
                                    icon={Clock}
                                    title="Ububiko"
                                    value="82%"
                                    isActive={activeTab === 'storage'}
                                    onClick={() => setActiveTab('storage')}
                                />
                            </div>
                        </div>

                        {/* IBIKORESHO Group */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">IBIKORESHO</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={Camera}
                                    title="Gucunga Camera"
                                    isActive={activeTab === 'cameras'}
                                    onClick={() => setActiveTab('cameras')}
                                />
                                <SettingsMenuCard
                                    icon={Wifi}
                                    title="Umuyoboro wa Wi-Fi"
                                    value="FARM_GUEST"
                                    isActive={activeTab === 'network'}
                                    onClick={() => setActiveTab('network')}
                                />
                                <SettingsMenuCard
                                    icon={RefreshCw}
                                    title="Porogaramu ya sisitemu"
                                    value="V2.4.1"
                                    isActive={activeTab === 'update'}
                                    onClick={() => setActiveTab('update')}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Main Content Pane */}
                    <motion.div
                        variants={rightPaneVariants}
                        initial="hidden"
                        animate="show"
                        className="lg:col-span-2 h-full min-h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f5ebe6] rounded-full blur-[100px] opacity-60 z-0"></div>

                        {!activeTab ? (
                            <div className="relative z-10 flex flex-col items-center max-w-sm">
                                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-brown mb-8 border border-brand-text/5">
                                    <SettingsIcon size={40} className="animate-[spin_10s_linear_infinite]" />
                                </div>
                                <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-4">Hitamo Igenamiterere</h2>
                                <p className="text-brand-text/60 font-medium text-sm leading-relaxed">
                                    Hitamo ikintu ushaka guhindura mu rutonde ruri ibumoso kugira ngo ubone ibisobanuro birambuye.
                                </p>
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-brand-brown/10 rounded-2xl flex items-center justify-center text-brand-brown mb-6">
                                    <SettingsIcon size={32} />
                                </div>
                                <h2 className="text-xl font-black text-brand-brown tracking-tight mb-2 uppercase">Setting: {activeTab}</h2>
                                <p className="text-brand-text/60 font-medium text-sm">Preview mode for {activeTab}. Configuration form would go here.</p>
                                <button className="mt-8 px-6 py-2.5 bg-brand-brown text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-brand-brown-dark transition-colors" onClick={() => setActiveTab(null)}>
                                    Funga
                                </button>
                            </div>
                        )}

                    </motion.div>

                </div>
            </main>
        </div>
    );
}

function SettingsMenuCard({
    icon: Icon, title, value, isActive, onClick
}: {
    icon: any, title: string, value?: string, isActive: boolean, onClick: () => void
}) {
    return (
        <motion.button
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full bg-white rounded-2xl p-4 md:p-5 flex items-center justify-between transition-all ${isActive
                ? 'shadow-[0_10px_25px_rgba(142,82,51,0.15)] border-2 border-brand-brown'
                : 'shadow-[0_5px_15px_rgba(0,0,0,0.03)] border-2 border-transparent hover:border-brand-brown/20'
                }`}
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className={isActive ? 'text-brand-brown' : 'text-brand-text/50'} strokeWidth={isActive ? 2.5 : 2} />
                <div className="flex flex-col items-start gap-0.5">
                    <span className={`font-bold text-sm ${isActive ? 'text-brand-brown' : 'text-brand-text'}`}>{title}</span>
                    {value && (
                        <span className="text-[9px] font-black tracking-widest text-brand-text/60 uppercase">{value}</span>
                    )}
                </div>
            </div>
            <ChevronRight size={18} className={isActive ? 'text-brand-brown' : 'text-brand-text/30'} />
        </motion.button>
    );
}
