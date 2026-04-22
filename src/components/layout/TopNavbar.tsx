import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Grid, Video, Clock, Settings, Bell, Menu, X, User as UserIcon } from 'lucide-react';
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

function timeAgo(iso: string, t: (key: string) => string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return t('time_just_now');
    if (m < 60) return t('time_mins_ago').replace('{n}', String(m));
    const h = Math.floor(m / 60);
    if (h < 24) return t('time_hours_ago').replace('{n}', String(h));
    return t('time_days_ago').replace('{n}', String(Math.floor(h / 24)));
}

export default function TopNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user: currentUser, logout } = useUser();
    const { t } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const navItems = [
        { name: t('nav_dashboard'), path: '/dashboard', icon: Grid },
        { name: t('nav_live'), path: '/live', icon: Video },
        { name: t('nav_history'), path: '/history', icon: Clock },
        { name: t('nav_settings'), path: '/settings', icon: Settings },
    ];

    const fetchAlerts = useCallback(async () => {
        try {
            const [alertsRes, countRes] = await Promise.all([
                api.get('/alerts/?limit=10&unread_only=false'),
                api.get('/alerts/unread-count'),
            ]);
            if (alertsRes.data.success) setAlerts(alertsRes.data.data.items || []);
            if (countRes.data.success) setUnreadCount(countRes.data.data || 0);
        } catch { }
    }, []);

    useEffect(() => {
        fetchAlerts();
        const t = setInterval(fetchAlerts, 15000); // poll every 15s
        return () => clearInterval(t);
    }, [fetchAlerts]);

    const handleMarkRead = async (alertId: string) => {
        await api.patch(`/alerts/${alertId}/read`).catch(() => { });
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        await api.patch('/alerts/read-all').catch(() => { });
        setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
        setUnreadCount(0);
    };

    const fullName = currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : '...';
    const avatarName = currentUser ? `${currentUser.first_name || 'U'} ${currentUser.last_name || ''}` : 'U';
    const avatarUrl = currentUser?.profile_image
        ? (currentUser.profile_image.startsWith('http') ? currentUser.profile_image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/', '') || ''}/${currentUser.profile_image}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`;

    return (
        <>
            <nav className="bg-brand-brown w-full h-[72px] flex items-center justify-between px-4 md:px-8 text-white sticky top-0 z-50 shadow-md">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className=" p-1 md:p-1.5 rounded-xl transition-transform group-hover:scale-105">
                        <img src="/mu.png" alt="Logo" className="h-16 w-auto" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight">Mutekano</span>
                </Link>

                <div className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div className={`relative rounded-full px-6 py-2.5 flex items-center gap-2 transition-colors cursor-pointer ${isActive ? 'bg-black/10 border border-white/10' : 'hover:bg-white/5 text-white/70'}`}>
                                    <Icon size={18} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/40 rounded-t-full" />}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {/* Alerts bell */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsNotificationOpen(v => !v); if (!isNotificationOpen) fetchAlerts(); }}
                            className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white/80 hover:bg-black/20 transition-colors relative"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-black text-white flex items-center justify-center px-1 border-2 border-brand-brown">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotificationOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-brand-text/5 text-brand-text"
                                >
                                    <div className="p-4 bg-brand-text/5 border-b border-brand-text/5 flex justify-between items-center">
                                        <h3 className="font-black text-brand-brown tracking-tight">{t('nav_alerts_title')}</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-brand-brown hover:underline">
                                                {t('nav_alerts_read_all')}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col max-h-96 overflow-y-auto">
                                        {alerts.length === 0 ? (
                                            <div className="p-8 text-center text-brand-text/30 font-bold text-sm">
                                                {t('nav_alerts_no_news')}
                                            </div>
                                        ) : alerts.map(alert => (
                                            <div
                                                key={alert.id}
                                                onClick={() => handleMarkRead(alert.id)}
                                                className={`p-3 border-b border-brand-text/5 hover:bg-brand-text/5 transition-colors cursor-pointer flex gap-3 ${!alert.is_read ? 'bg-red-50/50' : ''}`}
                                            >
                                                <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <img src={alert.minio_url} alt="alert" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="font-bold text-sm text-brand-text leading-tight">
                                                            👤 {alert.person_count} {t('nav_alerts_person_found')}
                                                        </span>
                                                        {!alert.is_read && <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1 animate-pulse" />}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-brand-brown">{alert.device_name || alert.device_label}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-brand-text/40 font-bold">{timeAgo(alert.created_at, t)}</span>
                                                        <span className="text-[10px] text-brand-text/30">•</span>
                                                        <span className="text-[10px] text-brand-text/40 font-bold">{Math.round(alert.confidence * 100)}% accurate</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        onClick={() => { setIsNotificationOpen(false); router.push('/alerts'); }}
                                        className="p-3 bg-brand-text/5 hover:bg-brand-text/10 text-center cursor-pointer transition-colors"
                                    >
                                        <span className="text-xs font-bold text-brand-brown">{t('nav_alerts_view_all')}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/settings?tab=profile" className="flex items-center gap-3 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-sm font-bold">{fullName}</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-brand-brown-dark shadow-inner">
                            <img src={avatarUrl} alt="User" className="w-full h-full object-cover" onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`; }} />
                        </div>
                    </Link>
                </div>

                <div className="lg:hidden flex items-center gap-3">
                    {/* Mobile bell */}
                    <button onClick={() => router.push('/alerts')} className="relative">
                        <Bell size={20} className="text-white/80" />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">{unreadCount}</span>}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden bg-brand-brown shadow-lg border-t border-white/10"
                >
                    <div className="flex flex-col p-4 space-y-2 text-white">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${isActive ? 'bg-black/10' : 'hover:bg-black/5 text-white/80'}`}>
                                        <Icon size={18} />
                                        <span className="text-sm font-bold">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <button className="w-full hover:bg-black/5 rounded-xl px-4 py-3 flex items-center gap-3 text-white/80" onClick={logout}>
                                <span className="text-sm font-bold">{t('nav_logout')}</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}
