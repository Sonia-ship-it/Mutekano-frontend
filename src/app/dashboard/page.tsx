"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import {
    Shield, Video, Bell, Battery, Camera, Database,
    Activity, Wifi, ChevronRight, RefreshCw
} from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import api from '@/lib/api';

interface Device {
    id: string;
    label: string;
    name: string | null;
    location: string | null;
    is_active: boolean;
}

interface Capture {
    id: string;
    minio_url: string;
    captured_at: string;
}

const POLL_MS = 2000;

function useLatestCapture(deviceId: string | null) {
    const [capture, setCapture] = useState<Capture | null>(null);
    const [online, setOnline] = useState(false);

    const fetch_ = useCallback(async () => {
        if (!deviceId) return;
        try {
            const { data } = await api.get(`/captures/device/${deviceId}/latest`);
            if (data.success && data.data) {
                setCapture(data.data);
                // consider online if last capture within 30s
                const age = Date.now() - new Date(data.data.captured_at).getTime();
                setOnline(age < 30000);
            }
        } catch { setOnline(false); }
    }, [deviceId]);

    useEffect(() => {
        fetch_();
        const t = setInterval(fetch_, POLL_MS);
        return () => clearInterval(t);
    }, [fetch_]);

    return { capture, online };
}

export default function DashboardPage() {
    const { user: currentUser } = useUser();
    const router = useRouter();
    const [devices, setDevices] = useState<Device[]>([]);
    const [primaryDevice, setPrimaryDevice] = useState<Device | null>(null);
    const { capture: primaryCapture, online: primaryOnline } = useLatestCapture(primaryDevice?.id ?? null);
    const [captureCount, setCaptureCount] = useState(0);

    useEffect(() => {
        api.get('/devices/mine?limit=50').then(({ data }) => {
            if (data.success) {
                const list: Device[] = data.data.items || [];
                setDevices(list);
                if (list.length > 0) {
                    // pick a random device as primary
                    setPrimaryDevice(list[Math.floor(Math.random() * list.length)]);
                }
            }
        });
    }, []);

    // total captures across all devices
    useEffect(() => {
        if (devices.length === 0) return;
        Promise.all(
            devices.map(d => api.get(`/captures/device/${d.id}?limit=1`).then(r => r.data.data?.total || 0).catch(() => 0))
        ).then(counts => setCaptureCount(counts.reduce((a, b) => a + b, 0)));
    }, [devices]);

    const firstName = currentUser?.first_name || 'Urunjiwe';

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-white font-sans pb-12 overflow-x-hidden">
            <TopNavbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 lg:mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-brand-text tracking-tight mb-2">
                            <span className="font-extrabold text-brand-text/80">Muraho, </span>{firstName}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 bg-white/50 w-max px-3 py-1.5 rounded-full border border-brand-text/5">
                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] ${primaryOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-[10px] lg:text-xs font-bold tracking-widest text-brand-text/70 uppercase">
                                {primaryOnline ? 'SISTEMU IRINZWE' : 'NTAMAKURU MASHYA'}
                            </span>
                        </div>
                    </div>

                    <div className="flex p-1 bg-white rounded-full shadow-sm border border-brand-brown/10 self-start md:self-auto w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-full bg-brand-text/5 text-brand-brown font-bold text-xs lg:text-sm active:scale-95 transition-transform">
                            <Shield size={16} />
                            IRAGENZURA
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-full text-brand-text/60 font-bold text-xs lg:text-sm hover:bg-brand-text/5 transition-all active:scale-95">
                            HANZE
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
                    <StatCard icon={<Battery className="text-yellow-500" size={20} />} label="BATERI" value="85%" iconBg="bg-yellow-100" />
                    <StatCard icon={<Camera className="text-brand-brown" size={20} />} label="KAMERA" value={devices.length < 10 ? `0${devices.length}` : String(devices.length)} iconBg="bg-[#f0e6e1]" />
                    <StatCard icon={<Bell className="text-blue-500" size={20} />} label="IBIBAZO BYABAYE" value="02" iconBg="bg-blue-100" />
                    <StatCard icon={<Database className="text-purple-500" size={20} />} label="AMASHUSHO" value={captureCount > 999 ? `${(captureCount / 1000).toFixed(1)}K` : String(captureCount)} iconBg="bg-purple-100" />
                </motion.div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Main live viewer */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="mb-4">
                            <h2 className="text-2xl lg:text-3xl font-black text-brand-brown tracking-tight mb-1">Tekana</h2>
                            <p className="text-brand-text/70 text-xs lg:text-sm font-medium">
                                Kurikirana urugo rwawe aho uri hose iwawe harinzwe. Sisitemu yizewe igufasha kucunga urugo rwawe.
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            onClick={() => router.push('/live')}
                            className="w-full aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] lg:rounded-3xl overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.1)] group cursor-pointer bg-black"
                        >
                            {primaryCapture ? (
                                <img
                                    key={primaryCapture.id}
                                    src={primaryCapture.minio_url}
                                    alt="live"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <RefreshCw size={32} className="text-white/20 animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                            {/* Live badge */}
                            <div className="absolute top-4 left-4 lg:top-6 lg:left-6 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 lg:px-4 lg:py-2 flex items-center gap-2 border border-white/10">
                                <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${primaryOnline ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                                <span className="text-white text-[10px] lg:text-xs font-bold tracking-widest">
                                    {primaryOnline ? 'AKO KANYA' : 'OFFLINE'}
                                </span>
                            </div>

                            {/* Bottom info */}
                            <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 flex items-end justify-between">
                                <div>
                                    <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight mb-0.5">
                                        {primaryDevice?.name || primaryDevice?.label || '...'}
                                    </h3>
                                    <p className="text-white/70 font-medium text-xs lg:text-sm">
                                        {primaryDevice?.location || 'Aho iherereye ntabwo hazwi'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-brown group-hover:bg-brand-brown-dark transition-colors rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Video size={24} fill="currentColor" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">

                        {/* System status */}
                        <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-4 border-white">
                            <h3 className="text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase mb-4 lg:mb-6">IMITERERE YA SISITEMU</h3>
                            <div className="flex flex-col gap-5 lg:gap-6">
                                <StatusRow icon={<Activity size={18} className="text-blue-500" />} label="Ibikorwa" value="BISANZWE" />
                                <StatusRow icon={<Wifi size={18} className={primaryOnline ? 'text-green-500' : 'text-gray-400'} />} label="Umuyoboro" value={primaryOnline ? 'NZIZA' : 'NTIRABONEKA'} />
                                <StatusRow icon={<Shield size={18} className="text-brand-brown" />} label="Umutekano" value="A+" />
                            </div>
                        </div>

                        {/* Other cameras */}
                        <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-4 border-white flex-1">
                            <div className="flex justify-between items-center mb-4 lg:mb-6">
                                <h3 className="text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase">IZINDI CAMERA</h3>
                                <span
                                    onClick={() => router.push('/live')}
                                    className="text-[10px] font-bold text-brand-brown tracking-widest uppercase cursor-pointer hover:underline underline-offset-4"
                                >
                                    ZOSE
                                </span>
                            </div>

                            {devices.length === 0 ? (
                                <p className="text-xs font-bold text-brand-text/30 text-center py-4">Nta camera ihari</p>
                            ) : (
                                <div className="flex flex-col gap-3 lg:gap-4">
                                    {devices.map(device => (
                                        <CameraListCard
                                            key={device.id}
                                            device={device}
                                            isActive={primaryDevice?.id === device.id}
                                            onClick={() => { setPrimaryDevice(device); router.push('/live'); }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}

function CameraListCard({ device, isActive, onClick }: { device: Device; isActive: boolean; onClick: () => void }) {
    const { capture, online } = useLatestCapture(device.id);

    return (
        <div
            onClick={onClick}
            className={`group flex items-center justify-between p-2 -mx-2 rounded-2xl hover:bg-brand-text/5 transition-colors cursor-pointer ${isActive ? 'bg-brand-brown/5' : ''}`}
        >
            <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-16 h-10 lg:w-20 lg:h-12 rounded-xl shadow-sm overflow-hidden relative bg-gray-900 flex-shrink-0">
                    {capture ? (
                        <img src={capture.minio_url} alt={device.name || device.label} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Camera size={14} className="text-white/20" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-brand-text text-xs lg:text-sm mb-0.5 group-hover:text-brand-brown transition-colors truncate max-w-[120px]">
                        {device.name || device.label}
                    </span>
                    <span className={`text-[8px] lg:text-[10px] font-black tracking-widest uppercase ${online ? 'text-green-500' : 'text-red-400'}`}>
                        {online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>
            <ChevronRight size={16} className="text-brand-text/30 group-hover:text-brand-brown transition-colors mr-1 group-hover:translate-x-1" />
        </div>
    );
}

function StatCard({ icon, label, value, iconBg }: { icon: React.ReactNode; label: string; value: string; iconBg: string }) {
    const glowMap: Record<string, string> = {
        'bg-yellow-100': 'rgba(234,179,8,0.18)',
        'bg-[#f0e6e1]': 'rgba(142,82,51,0.18)',
        'bg-blue-100': 'rgba(59,130,246,0.18)',
        'bg-purple-100': 'rgba(168,85,247,0.18)',
    };
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.03, boxShadow: `0 20px 50px ${glowMap[iconBg] || 'rgba(0,0,0,0.08)'}` }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/80 rounded-[1.5rem] lg:rounded-3xl p-4 lg:p-6 border border-gray-100/80 cursor-pointer"
            style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)' }}
        >
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-2xl pointer-events-none" />
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-[1rem] lg:rounded-2xl ${iconBg} flex items-center justify-center mb-3 lg:mb-4`}>
                {icon}
            </div>
            <div className="text-[8px] lg:text-[10px] font-bold text-brand-text/50 tracking-widest uppercase mb-0.5 lg:mb-1">{label}</div>
            <div className="text-2xl lg:text-3xl font-black text-brand-text tracking-tight">{value}</div>
        </motion.div>
    );
}

function StatusRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-text/5 group-hover:bg-brand-text/10 transition-colors">{icon}</div>
                <span className="font-bold text-brand-text text-xs lg:text-sm group-hover:text-brand-brown transition-colors">{label}</span>
            </div>
            <span className="text-[10px] lg:text-xs font-black tracking-widest text-brand-text/80">{value}</span>
        </div>
    );
}
