"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, User, Camera, Clock, Loader2 } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import api from '@/lib/api';

interface Alert {
    id: string;
    device_name: string | null;
    device_label: string;
    minio_url: string;
    person_count: number;
    confidence: number;
    is_read: boolean;
    created_at: string;
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Ubu ngubu';
    if (m < 60) return `Minota ${m} ishize`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Isaha ${h} ishize`;
    return new Date(iso).toLocaleString();
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (unreadOnly) params.append('unread_only', 'true');
            const [res, countRes] = await Promise.all([
                api.get(`/alerts/?${params}`),
                api.get('/alerts/unread-count'),
            ]);
            if (res.data.success) {
                setAlerts(res.data.data.items || []);
                setTotalPages(res.data.data.pages || 1);
            }
            if (countRes.data.success) setUnreadCount(countRes.data.data || 0);
        } finally {
            setLoading(false);
        }
    }, [page, unreadOnly]);

    useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

    const handleMarkRead = async (alertId: string) => {
        await api.patch(`/alerts/${alertId}/read`).catch(() => {});
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        await api.patch('/alerts/read-all').catch(() => {});
        setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
        setUnreadCount(0);
    };

    return (
        <div className="min-h-screen bg-[#fcf9f8] font-sans pb-12">
            <TopNavbar />

            <main className="max-w-[900px] mx-auto px-4 sm:px-6 pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-brand-brown tracking-tight">Amatangazo</h1>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                                    {unreadCount} bishya
                                </span>
                            )}
                        </div>
                        <p className="text-brand-text/60 font-medium text-sm">Abantu babonetse n'ama camera yawe.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setUnreadOnly(v => !v); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-xs font-black transition-all ${unreadOnly ? 'bg-brand-brown text-white' : 'bg-white text-brand-text/60 border border-brand-text/10'}`}
                        >
                            Bitasomwe gusa
                        </button>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black bg-white text-brand-brown border border-brand-brown/20 hover:bg-brand-brown/5 transition-all"
                            >
                                <CheckCheck size={14} />
                                Soma zose
                            </button>
                        )}
                    </div>
                </div>

                {/* Alerts list */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="animate-spin text-brand-brown" size={40} />
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-brand-text/30">
                        <Bell size={48} className="mb-4" />
                        <p className="font-black text-sm">Nta matangazo ahari</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {alerts.map((alert, i) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => !alert.is_read && handleMarkRead(alert.id)}
                                className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                                    !alert.is_read
                                        ? 'bg-red-50 border-red-100'
                                        : 'bg-white border-gray-100'
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                    <img src={alert.minio_url} alt="alert" className="w-full h-full object-cover" />
                                    {!alert.is_read && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <User size={14} className="text-red-500" />
                                            </div>
                                            <span className="font-black text-brand-text">
                                                {alert.person_count} umuntu wabonetse
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-brand-text/40 flex-shrink-0">
                                            {timeAgo(alert.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-text/50">
                                            <Camera size={12} />
                                            {alert.device_name || alert.device_label}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-text/50">
                                            <Clock size={12} />
                                            {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[11px] font-black text-green-600">
                                            {Math.round(alert.confidence * 100)}% accurate
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-6 py-3 rounded-full bg-white border border-brand-text/10 font-black text-xs disabled:opacity-30 hover:border-brand-brown/30 transition-all">
                            ← IBANZA
                        </button>
                        <span className="text-xs font-black text-brand-text/50">{page} / {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-6 py-3 rounded-full bg-white border border-brand-text/10 font-black text-xs disabled:opacity-30 hover:border-brand-brown/30 transition-all">
                            IKURIKIRA →
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
