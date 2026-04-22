import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import {
    Shield, Search, Bell, Menu, X, Users, Settings, Monitor
} from 'lucide-react';

export default function AdminTopNavbar() {
    const pathname = usePathname();
    const { user: currentUser } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Abakoresha', path: '/admin/users', icon: Users },
        { name: 'Ibikoresho', path: '/admin/devices', icon: Monitor },
        { name: 'Igenamiterere', path: '/admin/settings', icon: Settings },
    ];

    const fullName = currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : '...';
    const avatarName = currentUser ? `${currentUser.first_name || 'U'} ${currentUser.last_name || ''}` : 'U';

    return (
        <>
            <nav className="bg-gradient-to-r from-[#a65f3c] via-[#a86544] to-[#8c4b2c] w-full h-[80px] flex items-center justify-between px-6 md:px-10 text-white sticky top-0 z-50">
                {/* Logo */}
                <Link href="/admin/users" className="flex items-center gap-3 group">
                    <div className=" p-1 md:p-1.5 rounded-xl transition-transform group-hover:scale-105">
                        <img src="/mu.png" alt="Logo" className="h-16 w-auto" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight">Mutekano</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div className={`relative rounded-2xl px-6 py-2.5 flex items-center gap-2 transition-colors cursor-pointer ${isActive ? 'bg-black/10' : 'hover:bg-white/5 text-white/60'}`}>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && (
                                        <motion.div layoutId="nav-indicator" className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#f97316] rounded-t-full"></motion.div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Profile & Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center text-white hover:bg-black/20 transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center text-white hover:bg-black/20 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full"></span>
                    </button>

                    <Link href="/admin/settings?tab=profile" className="flex items-center gap-3 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold">{fullName}</span>
                        </div>
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/20 bg-[#5c2b14] shadow-inner">
                            <img
                                src={currentUser?.profile_image ? (currentUser.profile_image.startsWith('http') ? currentUser.profile_image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1/', '') || ''}${currentUser.profile_image.startsWith('/') ? '' : '/'}${currentUser.profile_image}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`}
                                alt={fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=8c4b2c&color=ffffff`; }}
                            />
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-[#8c4b2c] shadow-lg border-t border-white/10 absolute w-full z-40">
                    <div className="flex flex-col p-4 space-y-2 text-white">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.path);
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
                    </div>
                </div>
            )}
        </>
    );
}
