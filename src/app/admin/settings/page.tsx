"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Moon, Bell, Clock, Camera, Wifi, RotateCcw, ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
    };

    return (
        <div className="h-full flex overflow-hidden">
            {/* Left Sidebar Menu */}
            <div className="w-[380px] lg:w-[450px] h-full overflow-y-auto px-6 lg:px-12 pt-10 pb-20 no-scrollbar">

                <div className="mb-10">
                    <h1 className="text-4xl lg:text-[2.8rem] font-black text-[#A0522D] tracking-tight leading-none mb-2">
                        Igenamiterere
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Genzura uko sisitemu yawe ikoreshwa.</p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* SYSTEM CATEGORY */}
                    <div>
                        <h3 className="text-[10px] font-black text-[#A0522D]/60 tracking-widest uppercase mb-4">SISITEMU</h3>
                        <div className="flex flex-col gap-3">
                            <MenuPill
                                icon={<Shield size={20} strokeWidth={2.5} />}
                                title="Uburyo bwo kurinda"
                                subtitle="BIRINZWE"
                                isActive={activeTab === 'kurinda'}
                                onClick={() => setActiveTab('kurinda')}
                            />
                            <MenuPill
                                icon={<Moon size={20} strokeWidth={2.5} />}
                                title="Imiterere y'amabara"
                                subtitle="DARK"
                                isActive={activeTab === 'amabara'}
                                onClick={() => setActiveTab('amabara')}
                            />
                            <MenuPill
                                icon={<Bell size={20} strokeWidth={2.5} />}
                                title="Integuza"
                                subtitle="BIRAKORA"
                                isActive={activeTab === 'integuza'}
                                onClick={() => setActiveTab('integuza')}
                            />
                            <MenuPill
                                icon={<Clock size={20} strokeWidth={2.5} />}
                                title="Ububiko"
                                subtitle="82%"
                                isActive={activeTab === 'ububiko'}
                                onClick={() => setActiveTab('ububiko')}
                            />
                        </div>
                    </div>

                    {/* DEVICES CATEGORY */}
                    <div>
                        <h3 className="text-[10px] font-black text-[#A0522D]/60 tracking-widest uppercase mb-4">IBIKORESHO</h3>
                        <div className="flex flex-col gap-3">
                            <MenuPill
                                icon={<Camera size={20} strokeWidth={2.5} />}
                                title="Gucunga Camera"
                                /* no subtitle in image for this one */
                                isActive={activeTab === 'camera'}
                                onClick={() => setActiveTab('camera')}
                            />
                            <MenuPill
                                icon={<Wifi size={20} strokeWidth={2.5} />}
                                title="Umuyoboro wa Wi-Fi"
                                subtitle="FARM_GUEST"
                                isActive={activeTab === 'wifi'}
                                onClick={() => setActiveTab('wifi')}
                            />
                            <MenuPill
                                icon={<RotateCcw size={20} strokeWidth={2.5} />}
                                title="Porogaramu ya sisitemu"
                                subtitle="V2.4.1"
                                isActive={activeTab === 'sisitemu'}
                                onClick={() => setActiveTab('sisitemu')}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Main Content Area */}
            <div className="flex-1 h-full pl-0 pr-6 lg:pr-12 pt-6 pb-12 flex flex-col relative overflow-y-auto">

                {/* Logout Button Absolute Top Right within area */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-[#FEE9E4] hover:bg-[#fadcd5] text-[#A0522D] font-bold text-sm px-6 py-3 rounded-full transition-colors"
                    >
                        <LogOut size={16} strokeWidth={2.5} className="mr-1 rotate-180" />
                        Sohoka muri Sisitemu
                    </button>
                </div>

                {/* The big white canvas */}
                <div className="flex-1 bg-white rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center p-12 text-center h-full min-h-[500px]">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-[0_10px_30px_rgb(0,0,0,0.06)] flex items-center justify-center mb-8 text-[#A0522D]">
                        <SettingsIcon size={36} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-[#A0522D] mb-3">
                        Hitamo Igenamiterere
                    </h2>
                    <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
                        Hitamo ikintu ushaka guhindura mu rutonde ruri ibumoso
                        kugira ngo ubone ibisobanuro birambuye.
                    </p>
                </div>

            </div>
        </div>
    );
}

function MenuPill({ icon, title, subtitle, isActive, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, isActive?: boolean, onClick: () => void }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-white transition-all shadow-sm
                ${isActive ? 'shadow-[0_10px_30px_rgb(160,82,45,0.15)] ring-2 ring-[#a0522d]/20' : 'hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)]'}
            `}
        >
            <div className="flex items-center gap-4">
                <div className="text-[#a0522d]/70 flex items-center justify-center">
                    {icon}
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-[#1d1d1b] text-[15px]">{title}</span>
                    {subtitle && (
                        <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" strokeWidth={2.5} />
        </motion.div>
    );
}
