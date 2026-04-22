"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { Calendar, Filter, Search, Download, Trash2, Clock, Camera, Loader2, ImageOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import TopNavbar from '@/components/layout/TopNavbar';
import api from '@/lib/api';

interface Device {
    id: string;
    label: string;
    name: string | null;
    location: string | null;
}

interface Capture {
    id: string;
    device_id: string;
    filename: string;
    minio_url: string;
    captured_at: string;
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 0) return `Uyu munsi, ${time}`;
    if (days === 1) return `Ejo, ${time}`;
    return `${d.toLocaleDateString()} ${time}`;
}

export default function HistoryPage() {
    const { t } = useLanguage();
    const [devices, setDevices] = useState<Device[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string>('all');
    const [captures, setCaptures] = useState<Capture[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Load user devices
    useEffect(() => {
        api.get('/devices/mine?limit=50').then(({ data }) => {
            if (data.success) setDevices(data.data.items || []);
        });
    }, []);

    const fetchCaptures = useCallback(async () => {
        setLoading(true);
        try {
            const deviceIds = activeDeviceId === 'all'
                ? devices.map(d => d.id)
                : [activeDeviceId];

            if (deviceIds.length === 0) { setCaptures([]); setLoading(false); return; }

            const params = new URLSearchParams({ page: String(page), limit: '18' });
            if (dateFrom) params.append('date_from', new Date(dateFrom).toISOString());
            if (dateTo) params.append('date_to', new Date(dateTo + 'T23:59:59').toISOString());

            // Fetch from all selected devices in parallel
            const results = await Promise.all(
                deviceIds.map(id => api.get(`/captures/device/${id}?${params}`).then(r => r.data).catch(() => null))
            );

            const all: Capture[] = results
                .filter(Boolean)
                .flatMap(r => r.data?.items || []);

            // Sort by newest first
            all.sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime());

            setCaptures(all);
            // Use first result's pages for pagination when single device
            if (activeDeviceId !== 'all' && results[0]) {
                setTotalPages(results[0].data?.pages || 1);
            }
        } finally {
            setLoading(false);
        }
    }, [activeDeviceId, devices, page, dateFrom, dateTo]);

    useEffect(() => {
        if (devices.length > 0) fetchCaptures();
    }, [fetchCaptures, devices]);

    const handleDelete = async (capture: Capture, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(t('hist_delete_confirm'))) return;
        try {
            await api.delete(`/captures/${capture.id}`);
            setCaptures(prev => prev.filter(c => c.id !== capture.id));
        } catch { }
    };

    const filtered = captures.filter(c =>
        search === '' || c.filename.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(c.captured_at).toLowerCase().includes(search.toLowerCase())
    );

    const deviceName = (id: string) => {
        const d = devices.find(d => d.id === id);
        return d?.name || d?.label || id;
    };

    return (
        <div className="min-h-screen bg-[#fcf9f8] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-12 overflow-x-hidden">
            <TopNavbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight mb-2">{t('hist_title')}</h1>
                        <p className="text-brand-text/70 dark:text-gray-400 font-bold text-sm">{t('hist_desc')}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40" size={18} />
                            <input
                                type="text"
                                placeholder={t('hist_search')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full md:w-64 pl-12 pr-4 py-3 rounded-full bg-white dark:bg-[#151515] border-2 border-white dark:border-[#151515] shadow-sm focus:outline-none focus:border-brand-brown/30 text-sm font-medium transition-all text-brand-text dark:text-gray-200"
                            />
                        </div>

                        {/* Date filter toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDateFilter(v => !v)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs transition-all ${dateFrom || dateTo ? 'bg-brand-brown text-white' : 'bg-white dark:bg-[#151515] border border-brand-text/5 dark:border-[#333] text-brand-text dark:text-gray-200 shadow-sm hover:border-brand-brown/30'}`}
                            >
                                <Calendar size={16} />
                                {t('hist_date')}
                            </button>
                            {showDateFilter && (
                                <div className="absolute right-0 top-14 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-brand-text/5 dark:border-[#333] p-4 z-20 flex flex-col gap-3 w-64">
                                    <div>
                                        <label className="text-[10px] font-black text-brand-text/50 dark:text-gray-400 tracking-widest uppercase mb-1 block">{t('hist_from')}</label>
                                        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl border border-brand-text/10 dark:border-[#333] bg-white dark:bg-[#151515] text-brand-text dark:text-gray-200 text-sm font-bold outline-none focus:border-brand-brown/40" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-brand-text/50 dark:text-gray-400 tracking-widest uppercase mb-1 block">{t('hist_to')}</label>
                                        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-xl border border-brand-text/10 dark:border-[#333] bg-white dark:bg-[#151515] text-brand-text dark:text-gray-200 text-sm font-bold outline-none focus:border-brand-brown/40" />
                                    </div>
                                    {(dateFrom || dateTo) && (
                                        <button onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); }} className="text-xs font-black text-red-500 hover:underline">{t('hist_clear')}</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Device filter chips */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-3 no-scrollbar">
                    <button
                        onClick={() => { setActiveDeviceId('all'); setPage(1); }}
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${activeDeviceId === 'all' ? 'bg-brand-brown text-white shadow-md' : 'bg-white dark:bg-[#151515] text-brand-text/60 dark:text-gray-400 hover:bg-brand-text/5 dark:hover:bg-white/5 shadow-sm'}`}
                    >
                        {t('hist_all')}
                    </button>
                    {devices.map(device => (
                        <button
                            key={device.id}
                            onClick={() => { setActiveDeviceId(device.id); setPage(1); }}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${activeDeviceId === device.id ? 'bg-brand-brown text-white shadow-md' : 'bg-white dark:bg-[#151515] text-brand-text/60 dark:text-gray-400 hover:bg-brand-text/5 dark:hover:bg-white/5 shadow-sm'}`}
                        >
                            {device.name || device.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="animate-spin text-brand-brown" size={40} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-text/30 dark:text-gray-600">
                        <ImageOff size={48} className="mb-4" />
                        <p className="font-black text-sm">{t('hist_empty')}</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {filtered.map(capture => (
                            <motion.div
                                key={capture.id}
                                variants={itemVariants}
                                className="group flex flex-col bg-white dark:bg-[#151515] rounded-[2rem] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-none border-4 border-white dark:border-[#151515] hover:border-brand-text/5 dark:hover:border-[#333] transition-all cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative mb-4 bg-gray-100">
                                    <img
                                        src={capture.minio_url}
                                        alt="capture"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                        onError={e => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    {/* Timestamp badge */}
                                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {new Date(capture.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-2 pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-brand-text dark:text-gray-200 truncate pr-2">
                                            {formatDate(capture.captured_at)}
                                        </h3>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <a
                                                href={capture.minio_url}
                                                download
                                                onClick={e => e.stopPropagation()}
                                                className="text-brand-text/30 dark:text-gray-500 hover:text-brand-brown transition-colors"
                                            >
                                                <Download size={18} />
                                            </a>
                                            <button
                                                onClick={e => handleDelete(capture, e)}
                                                className="text-brand-text/30 dark:text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-brand-text/50 dark:text-gray-400">
                                        <Camera size={12} />
                                        {deviceName(capture.device_id)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && activeDeviceId !== 'all' && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-6 py-3 rounded-full bg-white dark:bg-[#151515] border border-brand-text/10 dark:border-[#333] font-black text-xs text-brand-text dark:text-gray-200 disabled:opacity-30 hover:border-brand-brown/30 transition-all"
                        >
                            {t('hist_prev')}
                        </button>
                        <span className="text-xs font-black text-brand-text/50 dark:text-gray-400">{page} / {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-3 rounded-full bg-white dark:bg-[#151515] border border-brand-text/10 dark:border-[#333] font-black text-xs text-brand-text dark:text-gray-200 disabled:opacity-30 hover:border-brand-brown/30 transition-all"
                        >
                            {t('hist_next')}
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
