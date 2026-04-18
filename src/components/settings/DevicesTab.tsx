"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus, Monitor, Trash2, Pencil, Power,
    CheckCircle2, XCircle, Loader2, Camera, MapPin, Tag, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextInput, Button } from '@/components/ui/FormElements';
import api from '@/lib/api';

interface Device {
    id: string;
    label: string;
    name: string | null;
    location: string | null;
    is_active: boolean;
    claimed_by: string | null;
    claimed_at: string | null;
    created_at: string;
}

export default function DevicesTab() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState<{ show: boolean, device: Device | null }>({ show: false, device: null });

    // Claiming Form
    const [claimLabel, setClaimLabel] = useState("");
    const [claimName, setClaimName] = useState("");
    const [claimLocation, setClaimLocation] = useState("");

    // Editing Form
    const [editName, setEditName] = useState("");
    const [editLocation, setEditLocation] = useState("");

    const [msg, setMsg] = useState({ text: '', type: '' });

    const fetchMyDevices = async () => {
        try {
            const { data } = await api.get('/devices/mine?limit=50');
            if (data.success) setDevices(data.data.items || []);
        } catch (err) {
            console.error("Error fetching my devices:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDevices();
    }, []);

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!claimLabel) return;

        setActionLoading('claiming');
        setMsg({ text: '', type: '' });

        try {
            const { data } = await api.post(`/devices/${claimLabel}/claim`);

            if (data.success) {
                const deviceId = data.data.id;
                if (claimName || claimLocation) {
                    await api.patch(`/devices/${deviceId}`, { name: claimName, location: claimLocation });
                }
                setMsg({ text: 'Igikoresho cyanditswe neza!', type: 'success' });
                setClaimLabel(""); setClaimName(""); setClaimLocation("");
                fetchMyDevices();
                setTimeout(() => setShowClaimModal(false), 1500);
            } else {
                setMsg({ text: data.message || 'Kwandikisha iki gikoresho byanze', type: 'error' });
            }
        } catch (err) {
            setMsg({ text: 'Habaye ikibazo mu kwandikisha igikoresho', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const device = showEditModal.device;
        if (!device) return;

        setActionLoading(`update-${device.id}`);

        try {
            const { data } = await api.patch(`/devices/${device.id}`, { name: editName, location: editLocation });
            if (data.success) {
                fetchMyDevices();
                setShowEditModal({ show: false, device: null });
            } else {
                alert(data.message || 'Kuvugurura byanze');
            }
        } catch (err) {
            alert('Habaye ikibazo');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-brand-brown tracking-tight">Camera na Sisitemu Zawe</h2>
                    <p className="text-brand-text/60 font-medium text-sm">Genzura kandi Uhitemo izina ry'ibikoresho ufite.</p>
                </div>
                <button
                    onClick={() => setShowClaimModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-brand-brown/10 active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} />
                    IGIKORESHO GISHYA
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 italic text-gray-400">
                    <Loader2 className="animate-spin mb-4 text-brand-brown" size={32} />
                    Tegereza gato...
                </div>
            ) : devices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-10 text-center">
                    <div className="w-16 h-16 bg-brand-brown/10 rounded-2xl flex items-center justify-center mb-6 text-brand-brown">
                        <Camera size={32} />
                    </div>
                    <h3 className="text-xl font-black text-brand-brown mb-2 tracking-tight">Nta Camera ufite kugeza ubu</h3>
                    <p className="text-brand-text/60 font-medium text-sm max-w-sm mb-8 leading-relaxed">
                        Kugira ngo utangire gukurikirana umutekano mu rugo cyangwa mu mworozi, ushobora kwandikisha igikoresho unyuze kuri buto yo hejuru.
                    </p>
                    <button
                        onClick={() => setShowClaimModal(true)}
                        className="text-brand-brown font-black text-xs underline underline-offset-4 decoration-brand-brown/30 hover:decoration-brand-brown transition-all"
                    >
                        Koresha Kode y'igikoresho cyawe
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {devices.map((device) => (
                        <div key={device.id} className="bg-white rounded-3xl p-6 border border-brand-brown/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowEditModal({ show: true, device });
                                        setEditName(device.name || "");
                                        setEditLocation(device.location || "");
                                    }}
                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-brand-brown hover:bg-brand-brown/5 transition-all"
                                >
                                    <Pencil size={14} />
                                </button>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${device.is_active ? 'bg-green-50 text-green-600 shadow-green-500/5' : 'bg-red-50 text-red-500 shadow-red-500/5'}`}>
                                    <Camera size={24} />
                                </div>

                                <div className="flex-1 min-w-0 pr-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-brand-brown mb-0.5 truncate">{device.name || device.label}</h4>
                                        <div className={`w-1.5 h-1.5 rounded-full ${device.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin size={12} className="text-brand-text/30" />
                                        <span className="text-xs font-bold text-brand-text/50 truncate italic">
                                            {device.location || 'Aho iherereye ntabwo hazwi'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black tracking-widest text-brand-text/30 uppercase leading-none mb-1">CODE</span>
                                            <span className="text-[10px] font-bold text-brand-text leading-none">{device.label}</span>
                                        </div>
                                        <div className="h-6 w-[1px] bg-brand-text/5"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black tracking-widest text-brand-text/30 uppercase leading-none mb-1">IMIMERERE</span>
                                            <span className={`text-[10px] font-black leading-none ${device.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                                {device.is_active ? 'YIFUNGUYE' : 'YAFUNZWE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Claim Modal */}
            <AnimatePresence>
                {showClaimModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowClaimModal(false)} className="absolute inset-0 bg-brand-brown-dark/20 backdrop-blur-sm"></motion.div>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl overflow-hidden border border-brand-brown/10">
                            <h3 className="text-3xl font-black text-brand-brown tracking-tight mb-2">Huza igikoresho</h3>
                            <p className="text-brand-text/60 font-medium text-sm mb-8 leading-relaxed">
                                Injiza kode y'igikoresho cyawe wadanditsweho kugira ngo utangire gukurikirana urugo rwawe.
                            </p>
                            <form onSubmit={handleClaim} className="space-y-4">
                                {msg.text && (
                                    <div className={`p-4 rounded-xl text-xs font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {msg.text}
                                    </div>
                                )}
                                <TextInput
                                    label="Kode y'igikoresho (Label)"
                                    required
                                    placeholder="Urugero: CAM_001_FARM"
                                    value={claimLabel}
                                    onChange={e => setClaimLabel(e.target.value)}
                                />
                                <TextInput
                                    label="Izina rya Camera"
                                    placeholder="Urugero: Irembo rya ruguru"
                                    value={claimName}
                                    onChange={e => setClaimName(e.target.value)}
                                />
                                <TextInput
                                    label="Aho herereye"
                                    placeholder="Urugero: Ikiraro k'inka [Aho hantu]"
                                    value={claimLocation}
                                    onChange={e => setClaimLocation(e.target.value)}
                                />
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowClaimModal(false)}
                                        className="flex-1 py-4 rounded-2xl font-black text-xs text-brand-text/60 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        REKA
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={actionLoading === 'claiming'}
                                        className="flex-1 py-4 flex-none"
                                    >
                                        {actionLoading === 'claiming' ? <Loader2 className="animate-spin inline mr-2" /> : <Smartphone className="inline mr-2" size={16} />}
                                        KWANDIKISHA
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal.show && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal({ show: false, device: null })} className="absolute inset-0 bg-brand-brown-dark/20 backdrop-blur-sm"></motion.div>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl overflow-hidden border border-brand-brown/10">
                            <h3 className="text-3xl font-black text-brand-brown tracking-tight mb-2">Vugurura kuri Camera</h3>
                            <p className="text-brand-text/60 font-medium text-sm mb-8 leading-relaxed">
                                Hindura izina n'aho iki gikoresho giherereye mu rugo rwawe.
                            </p>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <TextInput
                                    label="Izina rya Camera"
                                    required
                                    placeholder="Urugero: Irembo rya ruguru"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                />
                                <TextInput
                                    label="Aho herereye"
                                    placeholder="Urugero: Ikiraro k'inka"
                                    value={editLocation}
                                    onChange={e => setEditLocation(e.target.value)}
                                />
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal({ show: false, device: null })}
                                        className="flex-1 py-4 rounded-2xl font-black text-xs text-brand-text/60 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        REKA
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={actionLoading?.startsWith('update-')}
                                        className="flex-1 py-4 flex-none"
                                    >
                                        {actionLoading?.startsWith('update-') ? <Loader2 className="animate-spin inline mr-2" /> : <Loader2 className="hidden" />}
                                        KUBIKA
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
