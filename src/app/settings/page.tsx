"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    LogOut, Shield, Moon, Bell, Clock, Camera, Wifi, RefreshCw, ChevronRight, Settings as SettingsIcon, User, Save, Loader2, Globe, Info, CheckCircle2, AlertCircle, HardDrive, LifeBuoy, Mail, Phone, ArrowLeft
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';
import { TextInput, Button } from '@/components/ui/FormElements';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import DevicesTab from '@/components/settings/DevicesTab';
import api from '@/lib/api';

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
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
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
                const base = process.env.NEXT_PUBLIC_API_URL;
                setPreviewUrl(profile.profile_image.startsWith('http') ? profile.profile_image : `${base}${profile.profile_image.startsWith('/') ? '' : '/'}${profile.profile_image}`);
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

        try {
            const fd = new FormData();
            if (formData.first_name) fd.append('first_name', formData.first_name);
            if (formData.last_name) fd.append('last_name', formData.last_name);
            if (formData.phone_number) fd.append('phone_number', formData.phone_number);
            if (selectedFile) {
                fd.append('file', selectedFile);
                fd.append('profile_image', selectedFile);
            }

            const params = new URLSearchParams();
            if (formData.first_name) params.append('first_name', formData.first_name);
            if (formData.last_name) params.append('last_name', formData.last_name);
            if (formData.phone_number) params.append('phone_number', formData.phone_number);

            const { data } = await api.patch(`/users/me?${params.toString()}`, fd);

            if (data.success && data.data) {
                setMsg({ text: 'Umwirondoro wavuguruwe neza!', type: 'success' });
                setSelectedFile(null);
                updateUser(data.data);
                await refreshUser();
            } else {
                setMsg({ text: data.message || 'Kuvugurura umwirondoro byanze', type: 'error' });
            }
        } catch (err: any) {
            console.error("Profile update error:", err);
            setMsg({ text: err.response?.data?.message || err.message || 'Habaye ikibazo mu kubika, ongera ugerageze', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-[#fcf9f8] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-12 overflow-x-hidden">
            <TopNavbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight mb-2">{t('set_title')}</h1>
                        <p className="text-brand-text/70 dark:text-gray-400 font-bold text-sm">{t('set_desc')}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-sm transition-colors self-start md:self-auto shadow-sm"
                    >
                        <LogOut size={18} />
                        {t('set_logout')}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Sidebar Menu */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className={`lg:col-span-1 flex flex-col gap-8 ${activeTab ? 'hidden lg:flex' : 'flex'}`}
                    >
                        {/* KONTI YANJYE */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">{t('set_my_account')}</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={User}
                                    title={t('set_profile')}
                                    isActive={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                />
                            </div>
                        </div>

                        {/* SISITEMU Group */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">{t('set_system')}</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={Moon}
                                    title={t('set_theme')}
                                    isActive={activeTab === 'theme'}
                                    onClick={() => setActiveTab('theme')}
                                />
                                <SettingsMenuCard
                                    icon={Bell}
                                    title={t('set_notifications')}
                                    isActive={activeTab === 'notifications'}
                                    onClick={() => setActiveTab('notifications')}
                                />
                                <SettingsMenuCard
                                    icon={Globe}
                                    title={t('set_language')}
                                    isActive={activeTab === 'language'}
                                    onClick={() => setActiveTab('language')}
                                />
                            </div>
                        </div>

                        {/* IBIKORESHO Group */}
                        <div>
                            <h3 className="text-[10px] lg:text-xs font-black text-brand-brown tracking-widest uppercase mb-4 pl-2 lg:pl-0">{t('set_devices')}</h3>
                            <div className="flex flex-col gap-3">
                                <SettingsMenuCard
                                    icon={Camera}
                                    title={t('set_manage_cams')}
                                    isActive={activeTab === 'cameras'}
                                    onClick={() => setActiveTab('cameras')}
                                />
                                <SettingsMenuCard
                                    icon={Info}
                                    title={t('set_sys_info')}
                                    isActive={activeTab === 'system-info'}
                                    onClick={() => setActiveTab('system-info')}
                                />
                                <SettingsMenuCard
                                    icon={LifeBuoy}
                                    title={t('set_support')}
                                    isActive={activeTab === 'support'}
                                    onClick={() => setActiveTab('support')}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Main Content Pane */}
                    <motion.div
                        variants={rightPaneVariants}
                        initial="hidden"
                        animate="show"
                        className={`lg:col-span-2 h-full min-h-[600px] bg-white dark:bg-[#151515] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border-4 border-white dark:border-[#151515] flex flex-col p-8 md:p-12 relative overflow-hidden transition-colors duration-300 ${!activeTab ? 'hidden lg:flex' : 'flex'}`}
                    >
                        {/* Mobile Back Button */}
                        {activeTab && (
                            <button
                                onClick={() => setActiveTab(null)}
                                className="lg:hidden flex items-center gap-2 text-brand-brown font-bold mb-8 group"
                            >
                                <div className="w-8 h-8 bg-brand-brown/5 rounded-full flex items-center justify-center group-hover:bg-brand-brown/10 transition-colors">
                                    <ArrowLeft size={18} />
                                </div>
                                <span>{t('set_back')}</span>
                            </button>
                        )}

                        {/* Subtle background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f5ebe6] dark:bg-brand-brown/10 rounded-full blur-[100px] opacity-60 z-0 transition-colors duration-300"></div>

                        <div className="relative z-10 w-full h-full flex flex-col">
                            {!activeTab ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                    <div className="w-24 h-24 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl flex items-center justify-center text-brand-brown mb-8 border border-brand-text/5 dark:border-[#333]">
                                        <SettingsIcon size={40} className="animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-4">{t('set_select_opt')}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm leading-relaxed">
                                        {t('set_select_opt_desc')}
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
                                            <h2 className="text-2xl font-black text-brand-brown tracking-tight">{t('set_profile_title')}</h2>
                                            <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm">{t('set_profile_desc')}</p>
                                        </div>
                                    </div>

                                    {isFetching ? (
                                        <div className="flex justify-center p-10">
                                            <Loader2 className="animate-spin text-brand-brown" size={32} />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSaveProfile} className="space-y-5 bg-white dark:bg-[#1e1e1e] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm relative z-20 transition-colors">
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
                                                    {isSaving ? t('set_saving') : t('set_save')}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            ) : activeTab === 'theme' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-2">{t('set_theme')}</h2>
                                    <p className="text-brand-text/60 font-medium text-sm mb-8">Hitamo uburyo ushaka ko sisitemu igaragara.</p>

                                    <div className="space-y-4">
                                        <div onClick={() => setTheme('light')} className={`flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border shadow-sm cursor-pointer transition-colors ${theme === 'light' ? 'border-brand-brown' : 'border-gray-100 dark:border-[#333]'}`}>
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_theme_light')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_theme_light_desc')}</p>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'light' ? 'bg-brand-brown' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'light' ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                        <div onClick={() => setTheme('dark')} className={`flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border shadow-sm cursor-pointer transition-colors ${theme === 'dark' ? 'border-brand-brown' : 'border-gray-100 dark:border-[#333]'}`}>
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_theme_dark')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_theme_dark_desc')}</p>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-brand-brown' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'notifications' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-2">{t('set_notifications')}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm mb-8">{t('set_notif_desc')}</p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_notif_email')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_notif_email_desc')}</p>
                                            </div>
                                            <div className="w-12 h-6 bg-brand-brown rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_notif_sys')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_notif_sys_desc')}</p>
                                            </div>
                                            <div className="w-12 h-6 bg-brand-brown rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'language' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-2">{t('set_language')}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm mb-8">{t('set_lang_desc')}</p>

                                    <div className="space-y-3">
                                        <div onClick={() => setLanguage('rw')} className={`flex items-center justify-between p-5 bg-white dark:bg-[#1e1e1e] rounded-2xl border-2 shadow-sm cursor-pointer transition-colors ${language === 'rw' ? 'border-brand-brown' : 'border-transparent hover:border-gray-200 dark:hover:border-[#333] opacity-70'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-brand-brown/10 rounded-full flex items-center justify-center text-brand-brown font-black">RW</div>
                                                <span className={`font-bold ${language === 'rw' ? 'text-brand-brown' : 'text-brand-text dark:text-gray-300'}`}>Kinyarwanda</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-4 ${language === 'rw' ? 'border-brand-brown bg-white dark:bg-[#1e1e1e]' : 'border-gray-300 dark:border-gray-600 bg-transparent'} transition-colors`}></div>
                                        </div>
                                        <div onClick={() => setLanguage('en')} className={`flex items-center justify-between p-5 bg-white dark:bg-[#1e1e1e] rounded-2xl border-2 shadow-sm cursor-pointer transition-colors ${language === 'en' ? 'border-brand-brown' : 'border-transparent hover:border-gray-200 dark:hover:border-[#333] opacity-70'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-black">EN</div>
                                                <span className={`font-bold ${language === 'en' ? 'text-brand-brown' : 'text-brand-text dark:text-gray-300'}`}>English</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-4 ${language === 'en' ? 'border-brand-brown bg-white dark:bg-[#1e1e1e]' : 'border-gray-300 dark:border-gray-600 bg-transparent'} transition-colors`}></div>
                                        </div>
                                        <div onClick={() => setLanguage('fr')} className={`flex items-center justify-between p-5 bg-white dark:bg-[#1e1e1e] rounded-2xl border-2 shadow-sm cursor-pointer transition-colors ${language === 'fr' ? 'border-brand-brown' : 'border-transparent hover:border-gray-200 dark:hover:border-[#333] opacity-70'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-black">FR</div>
                                                <span className={`font-bold ${language === 'fr' ? 'text-brand-brown' : 'text-brand-text dark:text-gray-300'}`}>Français</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-4 ${language === 'fr' ? 'border-brand-brown bg-white dark:bg-[#1e1e1e]' : 'border-gray-300 dark:border-gray-600 bg-transparent'} transition-colors`}></div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'cameras' ? (
                                <DevicesTab />
                            ) : activeTab === 'system-info' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-2">{t('set_sys_info')}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm mb-8">{t('set_info_desc')}</p>

                                    <div className="space-y-4">
                                        {/* 1. System Status */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_info_sys')}</h4>
                                                <p className="text-xs text-green-600 font-bold">{t('set_info_sys_good')}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-green-600 uppercase">ACTIVE</span>
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>

                                        {/* 2. Camera Status */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_info_cam')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_info_cam_good')}</p>
                                            </div>
                                            <div className="w-12 h-6 bg-brand-brown rounded-full relative">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* 3. Connection Status */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown">{t('set_info_net')}</h4>
                                                <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_info_net_good')}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Wifi size={18} className="text-blue-500" />
                                                <span className="text-[10px] font-black text-blue-600">ONLINE</span>
                                            </div>
                                        </div>


                                        {/* 5. Storage Status */}
                                        <div className="p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-brand-brown">{t('set_info_storage')}</h4>
                                                    <p className="text-xs text-brand-text/60 dark:text-gray-400">{t('set_info_storage_val')}</p>
                                                </div>
                                                <span className="text-sm font-black text-brand-brown">82%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="w-[82%] h-full bg-brand-brown rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-green-50/30 rounded-3xl border-2 border-dashed border-green-500/20 italic text-center">
                                        <p className="text-sm text-green-700/70 font-medium">{t('set_info_footer')}</p>
                                    </div>
                                </div>
                            ) : activeTab === 'support' ? (
                                <div className="w-full max-w-xl mx-auto">
                                    <h2 className="text-2xl font-black text-brand-brown tracking-tight mb-2">{t('set_support')}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm mb-8">{t('set_support_desc')}</p>

                                    <div className="space-y-4">
                                        {/* Phone Contact 1 */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown underline decoration-brand-brown/20 uppercase text-[10px] tracking-widest mb-1">{t('set_phone')} 1</h4>
                                                <p className="text-sm font-bold text-brand-brown">+250 795 300 840</p>
                                            </div>
                                            <a href="tel:+250795300840" className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm hover:bg-green-100 transition-colors">
                                                <Phone size={18} />
                                            </a>
                                        </div>

                                        {/* Phone Contact 2 */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown underline decoration-brand-brown/20 uppercase text-[10px] tracking-widest mb-1">{t('set_phone')} 2</h4>
                                                <p className="text-sm font-bold text-brand-brown">+250 791 726 280</p>
                                            </div>
                                            <a href="tel:+250791726280" className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm hover:bg-green-100 transition-colors">
                                                <Phone size={18} />
                                            </a>
                                        </div>

                                        {/* Email 1 */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown underline decoration-brand-brown/20 uppercase text-[10px] tracking-widest mb-1">{t('set_support_founder1')}</h4>
                                                <p className="text-sm font-bold text-brand-brown">sibomanaedouard974@gmail.com</p>
                                            </div>
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                                <Mail size={18} />
                                            </div>
                                        </div>

                                        {/* Email 2 */}
                                        <div className="flex items-center justify-between p-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-[#333] shadow-sm transition-colors">
                                            <div>
                                                <h4 className="font-bold text-brand-brown underline decoration-brand-brown/20 uppercase text-[10px] tracking-widest mb-1">{t('set_support_founder2')}</h4>
                                                <p className="text-sm font-bold text-brand-brown">uwasesonia43@gmail.com</p>
                                            </div>
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                                <Mail size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <h2 className="text-xl font-black text-brand-brown tracking-tight mb-2 uppercase">Igenamiterere: {activeTab}</h2>
                                    <p className="text-brand-text/60 dark:text-gray-400 font-medium text-sm">Aha hazajya igenamiterere rijyanye na {activeTab}.</p>
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
            className={`w-full bg-white dark:bg-[#151515] rounded-2xl p-4 md:p-5 flex items-center justify-between transition-all ${isActive
                ? 'shadow-[0_10px_25px_rgba(142,82,51,0.15)] dark:shadow-none border-2 border-brand-brown dark:bg-[#1e1e1e]'
                : 'shadow-[0_5px_15px_rgba(0,0,0,0.03)] dark:shadow-none border-2 border-transparent hover:border-brand-brown/20 hover:dark:bg-[#1e1e1e]'
                }`}
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className={isActive ? 'text-brand-brown' : 'text-brand-text/50 dark:text-gray-500'} strokeWidth={isActive ? 2.5 : 2} />
                <div className="flex flex-col items-start gap-0.5">
                    <span className={`font-bold text-sm ${isActive ? 'text-brand-brown' : 'text-brand-text dark:text-gray-200'}`}>{title}</span>
                    {value && (
                        <span className="text-[9px] font-black tracking-widest text-brand-text/60 dark:text-gray-500 uppercase">{value}</span>
                    )}
                </div>
            </div>
            <ChevronRight size={18} className={isActive ? 'text-brand-brown' : 'text-brand-text/30 dark:text-gray-600'} />
        </motion.button>
    );
}
