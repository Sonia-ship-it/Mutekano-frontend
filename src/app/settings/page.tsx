"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    LogOut, Shield, Moon, Bell, Clock, Camera, Wifi, RefreshCw, ChevronRight, Settings as SettingsIcon, User, Save, Loader2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';
import { TextInput, Button } from '@/components/ui/FormElements';
import { useUser } from '@/context/UserContext';
import DevicesTab from '@/components/settings/DevicesTab';

export default function SettingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        const tab = searchParams?.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const rightPaneVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
    };

    const { user: profile, loading: isFetching, refreshUser, logout, updateUser } = useUser();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });

    // File upload state for profile picture
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                phone_number: profile.phone_number || ''
            });
            if (profile.profile_image) {
                setPreviewUrl(profile.profile_image.startsWith('http') ? profile.profile_image : `http://147.79.101.43:8000${profile.profile_image.startsWith('/') ? '' : '/'}${profile.profile_image}`);
            }
        }
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMsg({ text: '', type: '' });
        const token = localStorage.getItem('access_token');

        try {
            // Keep query parameters for legacy backend support
            const params = new URLSearchParams();
            if (formData.first_name) params.append('first_name', formData.first_name);
            if (formData.last_name) params.append('last_name', formData.last_name);
            if (formData.phone_number) params.append('phone_number', formData.phone_number);

            const fd = new FormData();
            // Also put in FormData for modern multipart handling
            if (formData.first_name) fd.append('first_name', formData.first_name);
            if (formData.last_name) fd.append('last_name', formData.last_name);
            if (formData.phone_number) fd.append('phone_number', formData.phone_number);

            if (selectedFile) {
                // Key 'file' is usually default in NestJS FileInterceptors
                fd.append('file', selectedFile);
                // Some backends specifically use the field name 'profile_image'
                fd.append('profile_image', selectedFile);
            }

            const res = await fetch(`http://147.79.101.43:8000/users/me?${params.toString()}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: fd
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.success && data.data) {
                setMsg({ text: 'Umwirondoro wavuguruwe neza!', type: 'success' });
                setSelectedFile(null);

                // Immediately update the global user state with response data
                updateUser(data.data);

                // Still refresh to be 100% sure we're in sync with the server's state later
                await refreshUser();
            } else {
                setMsg({ text: data.message || 'Kuvugurura umwirondoro byanze', type: 'error' });
            }
        } catch (err: any) {
            console.error("Profile update error:", err);
            setMsg({ text: err.message || 'Habaye ikibazo mu kubika, ongera ugerageze', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
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
                        onClick={handleLogout}
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
                        {/* KONTI YANJYE */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">KONTI YANJYE</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={User}
                                    title="Umwirondoro"
                                    value="PROFILE"
                                    isActive={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                />
                            </div>
                        </div>

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
                        className="lg:col-span-2 h-full min-h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white flex flex-col p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f5ebe6] rounded-full blur-[100px] opacity-60 z-0"></div>

                        <div className="relative z-10 w-full h-full flex flex-col">
                            {!activeTab ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-brown mb-8 border border-brand-text/5">
                                        <SettingsIcon size={40} className="animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-4">Hitamo Igenamiterere</h2>
                                    <p className="text-brand-text/60 font-medium text-sm leading-relaxed">
                                        Hitamo ikintu ushaka guhindura mu rutonde ruri ibumoso kugira ngo ubone ibisobanuro birambuye.
                                    </p>
                                </div>
                            ) : activeTab === 'profile' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <div className="w-20 h-20 bg-brand-brown-dark rounded-full flex items-center justify-center text-white overflow-hidden border-4 border-white shadow-md relative">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Profile preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile?.first_name || 'U'}&background=random`; }}
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-black">{profile?.first_name?.[0] || 'U'}</span>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera size={20} className="text-white" />
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-brand-brown tracking-tight">Umwirondoro Wawe</h2>
                                            <p className="text-brand-text/60 font-medium text-sm">Guhindura imyirondoro n'ifoto yawe bwite.</p>
                                        </div>
                                    </div>

                                    {isFetching ? (
                                        <div className="flex justify-center p-10">
                                            <Loader2 className="animate-spin text-brand-brown" size={32} />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSaveProfile} className="space-y-5 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative z-20">
                                            {msg.text && (
                                                <div className={`p-4 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {msg.text}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <TextInput
                                                    label="Izina rya mbere"
                                                    type="text"
                                                    placeholder="Urugero: Kamanzi"
                                                    value={formData.first_name}
                                                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                                />
                                                <TextInput
                                                    label="Izina rya kabiri"
                                                    type="text"
                                                    placeholder="Urugero: Eric"
                                                    value={formData.last_name}
                                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                                />
                                            </div>

                                            <TextInput
                                                label="Imeri (Email)"
                                                type="email"
                                                disabled
                                                value={profile?.email || ''}
                                                placeholder="Imeri ntishobora guhindurwa hano"
                                                className="opacity-70"
                                            />

                                            <TextInput
                                                label="Nomero ya telefone"
                                                type="tel"
                                                placeholder="07..."
                                                value={formData.phone_number}
                                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                            />

                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" disabled={isSaving} className="px-8 flex-none w-max">
                                                    {isSaving ? <Loader2 size={18} className="animate-spin inline mr-2" /> : <Save size={18} className="inline mr-2" />}
                                                    {isSaving ? 'Birabikwa...' : 'Bika Impinduka'}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            ) : activeTab === 'cameras' ? (
                                <DevicesTab />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <h2 className="text-xl font-black text-brand-brown tracking-tight mb-2 uppercase">Igenamiterere: {activeTab}</h2>
                                    <p className="text-brand-text/60 font-medium text-sm">Aha hazajya igenamiterere rijyanye na {activeTab}.</p>
                                </div>
                            )}
                        </div>
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
