"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, Wifi, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

const POLL_INTERVAL = 2000;

function useLiveCapture(deviceId: string | null) {
    const [capture, setCapture] = useState<Capture | null>(null);
    const [error, setError] = useState(false);
    const [fps, setFps] = useState(0);
    const lastTime = React.useRef<number>(Date.now());

    const fetchLatest = useCallback(async () => {
        if (!deviceId) return;
        try {
            const { data } = await api.get(`/captures/device/${deviceId}/latest`);
            if (data.success && data.data) {
                setCapture(data.data);
                setError(false);
                const now = Date.now();
                setFps(Math.round(1000 / (now - lastTime.current)));
                lastTime.current = now;
            }
        } catch {
            setError(true);
        }
    }, [deviceId]);

    useEffect(() => {
        fetchLatest();
        const interval = setInterval(fetchLatest, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchLatest]);

    return { capture, error };
}

export default function LivePage() {
    const router = useRouter();
    const [devices, setDevices] = useState<Device[]>([]);
    const [activeDevice, setActiveDevice] = useState<Device | null>(null);
    const { capture, error } = useLiveCapture(activeDevice?.id ?? null);
    const [time, setTime] = useState('');

    useEffect(() => {
        api.get('/devices/mine?limit=50').then(({ data }) => {
            if (data.success) {
                const list: Device[] = data.data.items || [];
                setDevices(list);
                if (list.length > 0) setActiveDevice(list[0]);
            }
        });
    }, []);

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString());
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-12 h-12 bg-brand-brown hover:bg-brand-brown-dark rounded-2xl flex items-center justify-center text-white shadow-md transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-black text-brand-brown tracking-tight">
                                    {activeDevice?.name || activeDevice?.label || 'Hitamo Camera'}
                                </h1>
                                {activeDevice && !error && (
                                    <div className="bg-[#fdf0e9] text-brand-brown text-[9px] font-black uppercase px-3 py-1 rounded-full border border-brand-brown/20 tracking-widest flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        LIVE
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-50 text-red-500 text-[9px] font-black uppercase px-3 py-1 rounded-full border border-red-200 tracking-widest flex items-center gap-1.5">
                                        <AlertCircle size={10} />
                                        OFFLINE
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-brand-text/60 uppercase mt-1">
                                {activeDevice?.location || 'Aho iherereye ntabwo hazwi'} • {time}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-black/5 rounded-2xl px-4 py-2 flex items-center gap-2">
                            <Wifi size={14} className="text-brand-brown" />
                            <span className="text-xs font-black text-brand-text">
                                {capture ? new Date(capture.captured_at).toLocaleTimeString() : '--:--:--'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main viewer */}
                <motion.div variants={itemVariants} className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black">
                    {capture ? (
                        <img
                            key={capture.id}
                            src={capture.minio_url}
                            alt="Live feed"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/40">
                            {error
                                ? <><AlertCircle size={48} /><p className="font-black text-sm">Camera irahagaritse cyangwa nta frame ihari</p></>
                                : <><RefreshCw size={48} className="animate-spin" /><p className="font-black text-sm">Gutegereza frame...</p></>
                            }
                        </div>
                    )}

                    {/* Overlays */}
                    {capture && (
                        <>
                            <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2">
                                <div className="bg-red-600/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-red-500 shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-white text-[10px] font-black tracking-widest">REC</span>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 hidden sm:flex">
                                    <span className="text-white/80 text-[10px] font-bold tracking-widest">{time}</span>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 md:top-8 md:right-8 hidden sm:flex flex-col gap-2">
                                <div className="bg-black/40 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-3 border border-white/5">
                                    <Camera size={16} className="text-brand-brown" />
                                    <div className="flex flex-col text-white">
                                        <span className="text-xs font-black">{activeDevice?.name || activeDevice?.label}</span>
                                        <span className="text-[8px] font-black tracking-widest text-white/50 uppercase">CAMERA</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Device film strip */}
                {devices.length > 0 && (
                    <motion.div variants={containerVariants} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
                        {devices.map((device) => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                isActive={activeDevice?.id === device.id}
                                onClick={() => setActiveDevice(device)}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.main>
        </div>
    );
}

function DeviceCard({ device, isActive, onClick }: { device: Device; isActive: boolean; onClick: () => void }) {
    const [capture, setCapture] = useState<Capture | null>(null);

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const { data } = await api.get(`/captures/device/${device.id}/latest`);
                if (data.success) setCapture(data.data);
            } catch {}
        };
        fetch_();
        const t = setInterval(fetch_, POLL_INTERVAL);
        return () => clearInterval(t);
    }, [device.id]);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg transition-all ${isActive ? 'ring-4 ring-brand-brown ring-offset-2' : ''}`}
        >
            {capture ? (
                <img key={capture.id} src={capture.minio_url} alt={device.name || device.label} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <Camera size={24} className="text-white/20" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-white text-[10px] font-black tracking-widest uppercase truncate">
                    {device.name || device.label}
                </span>
                {isActive && <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse flex-shrink-0" />}
            </div>
        </motion.div>
    );
}
