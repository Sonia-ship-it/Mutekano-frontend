"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Grid, Video, Clock, Settings, Search, Bell, Menu, X
} from 'lucide-react';

export default function TopNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const cachedUser = localStorage.getItem('cached_user_profile');
        if (cachedUser) {
            try {
                setCurrentUser(JSON.parse(cachedUser));
            } catch (e) { }
        }

        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            try {
                const res = await fetch('http://147.79.101.43:8000/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setCurrentUser(data.data);
                    localStorage.setItem('cached_user_profile', JSON.stringify(data.data));
                }
            } catch (err) {
                console.error("Failed to fetch user in nav", err);
            }
        };
        fetchUser();
    }, []);

    const notifications = [
        { id: 1, title: "Umuntu ku irembo rikuru", time: "Minota 5 ishize", type: "alert" },
        { id: 2, title: "Bateri ya camera iri hasi (15%)", time: "Isaha 1 ishize", type: "warning" },
        { id: 3, title: "Sisitemu yavuguruwe neza", time: "Ejo, 14:30", type: "success" }
    ];

    const navItems = [
        { name: 'Imbonera', path: '/dashboard', icon: Grid },
        { name: 'Ako kanya', path: '/live', icon: Video },
        { name: 'Amashusho', path: '/history', icon: Clock },
        { name: 'Igenamiterere', path: '/settings', icon: Settings },
    ];

    const fullName = currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : '...';
    const avatarName = currentUser ? `${currentUser.first_name || 'U'} ${currentUser.last_name || ''}` : 'U';
    const rolePlan = currentUser?.role === 'ADMIN' ? '✨ ADMIN PLAN' : '✨ PRO PLAN';

    return (
        <>
            <nav className="bg-brand-brown w-full h-[72px] flex items-center justify-between px-4 md:px-8 text-white sticky top-0 z-50 shadow-md">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                        <Shield size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight">Mutekano</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div className={`relative rounded-full px-6 py-2.5 flex items-center gap-2 transition-colors cursor-pointer ${isActive ? 'bg-black/10 border border-white/10' : 'hover:bg-white/5 text-white/70'}`}>
                                    <Icon size={18} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && (
                                        <motion.div layoutId="nav-indicator" className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/40 rounded-t-full"></motion.div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Profile & Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white/80 hover:bg-black/20 transition-colors">
                        <Search size={18} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white/80 hover:bg-black/20 transition-colors relative group"
                        >
                            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#a6603a]"></span>
                        </button>

                        <AnimatePresence>
                            {isNotificationOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-brand-text/5 text-brand-text"
                                >
                                    <div className="p-4 bg-brand-text/5 border-b border-brand-text/5 flex justify-between items-center">
                                        <h3 className="font-black text-brand-brown tracking-tight">Ibibazo Byabaye (Integuza)</h3>
                                        <span className="text-[10px] font-bold bg-brand-brown text-white px-2 py-0.5 rounded-full">{notifications.length} bishya</span>
                                    </div>
                                    <div className="flex flex-col max-h-80 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 border-b border-brand-text/5 hover:bg-brand-text/5 transition-colors cursor-pointer flex flex-col gap-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="font-bold text-sm leading-tight text-brand-text">{notif.title}</span>
                                                    {notif.type === 'alert' && <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0 animate-pulse"></div>}
                                                    {notif.type === 'warning' && <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 shrink-0"></div>}
                                                    {notif.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0"></div>}
                                                </div>
                                                <span className="text-xs font-bold text-brand-text/50">{notif.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-brand-text/5 hover:bg-brand-text/10 text-center cursor-pointer transition-colors">
                                        <span className="text-xs font-bold text-brand-brown">Reba ibindi byose</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/settings?tab=profile" className="flex items-center gap-3 ml-4 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold">{fullName}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-brand-brown-dark shadow-inner">
                            <img
                                src={currentUser?.profile_image ? (currentUser.profile_image.startsWith('http') ? currentUser.profile_image : `http://147.79.101.43:8000${currentUser.profile_image.startsWith('/') ? '' : '/'}${currentUser.profile_image}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`}
                                alt="User"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`; }}
                            />
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                    <Link href="/settings?tab=profile" className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 bg-brand-brown-dark md:hidden">
                        <img
                            src={currentUser?.profile_image ? (currentUser.profile_image.startsWith('http') ? currentUser.profile_image : `http://147.79.101.43:8000${currentUser.profile_image.startsWith('/') ? '' : '/'}${currentUser.profile_image}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`}
                            alt="User"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`; }}
                        />
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
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
                            <button className="w-full hover:bg-black/5 rounded-xl px-4 py-3 flex items-center gap-3 text-white/80" onClick={() => {
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                router.push('/login');
                            }}>
                                <span className="text-sm font-bold">Sohoka</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}
