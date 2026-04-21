"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, Plus, Monitor, Power, Pencil, Trash2,
    Loader2, Camera, Shield, CheckCircle2, XCircle, QrCode, Copy, CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import QRCode from 'qrcode';
import api from '@/lib/api';

interface Device {
    id: string;
    label: string;
    name: string | null;
    location: string | null;
    api_key: string;
    is_active: boolean;
    owner_id: string;
    claimed_by: string | null;
    claimed_at: string | null;
    created_at: string;
    updated_at: string;
}

export default function AdminDevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDeviceLabel, setNewDeviceLabel] = useState("");
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [createdDevice, setCreatedDevice] = useState<{ id: string; api_key: string; label: string } | null>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | 'toggle' | null;
        device: Device | null;
    }>({ isOpen: false, type: null, device: null });

    const fetchDevices = async () => {
        try {
            const { data } = await api.get('/devices/?limit=100');
            if (data.success) {
                setDevices(data.data?.items || []);
            }
        } catch (err) {
            console.error("Error fetching devices:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleAddDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeviceLabel) return;
        setActionLoading('adding');
        try {
            const { data } = await api.post('/devices/', { label: newDeviceLabel });
            if (data.success) {
                setNewDeviceLabel("");
                setShowAddModal(false);
                setCreatedDevice({ id: data.data.id, api_key: data.data.api_key, label: data.data.label });
                fetchDevices();
            } else {
                setMsg({ text: data.message || 'Kwandika igikoresho byanze', type: 'error' });
            }
        } catch (error: any) {
            setMsg({ text: error.message || 'Habaye ikibazo, ongera ugerageze', type: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleStatus = async (device: Device) => {
        const action = device.is_active ? 'deactivate' : 'activate';
        setActionLoading(device.id);
        try {
            await api.patch(`/devices/${device.id}/${action}`);
            fetchDevices();
        } catch (error: any) {
            alert(error.message || 'Habaye ikibazo');
        } finally {
            setActionLoading(null);
            setConfirmModal({ isOpen: false, type: null, device: null });
        }
    };

    const handleDeleteDevice = async (device: Device) => {
        setActionLoading(`delete-${device.id}`);
        try {
            await api.delete(`/devices/${device.id}`);
            fetchDevices();
        } catch (error: any) {
            alert(error.message || 'Habaye ikibazo');
        } finally {
            setActionLoading(null);
            setConfirmModal({ isOpen: false, type: null, device: null });
        }
    };

    const filteredDevices = devices.filter(d =>
        d.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.name && d.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full overflow-y-auto px-6 md:px-12 pt-10 pb-20 bg-[#fffafa]">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-[#A0522D] tracking-tighter uppercase mb-2">
                        IBIKORESHO
                    </h1>
                    <p className="text-[#8a5b48] font-bold text-sm tracking-wide">Cunga camera na sisitemu zose ziri mu muvuduko.</p>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Shakisha igikoresho..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-[#e8dcd6] bg-white text-sm font-bold text-gray-800 placeholder-gray-400 outline-none focus:border-[#A0522D]/40 transition-colors shadow-sm"
                        />
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#A0522D] hover:bg-[#8b4513] text-white px-6 py-3.5 rounded-full font-black text-sm flex items-center gap-2 shadow-lg shadow-[#A0522D]/20 transition-all active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        INYONGERA
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 w-full xl:w-[95%]">
                <StatCard icon={<Monitor size={20} />} label="ZOSE" value={devices.length} color="yellow" />
                <StatCard icon={<CheckCircle2 size={20} />} label="IZIKORA" value={devices.filter(d => d.is_active).length} color="green" />
                <StatCard icon={<XCircle size={20} />} label="IZIDAKORA" value={devices.filter(d => !d.is_active).length} color="red" />
                <StatCard icon={<Shield size={20} />} label="IZAFASHWE" value={devices.filter(d => d.claimed_by).length} color="blue" />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] p-4 w-full xl:w-[95%] border border-[#f5ebe6]">
                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#f5ebe6]">
                                <th className="px-6 py-5 text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase">ID / LABEL</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase">IZINA / AHO HEREREYE</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase">STATUS</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase">NYIRAYO</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase text-right">IBIKORWA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-bold text-gray-400">
                                        <Loader2 className="animate-spin mx-auto mb-4 text-[#A0522D]" size={40} />
                                        Tegereza gato...
                                    </td>
                                </tr>
                            ) : filteredDevices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center font-bold text-gray-400">Nta gikoresho cyabonetse.</td>
                                </tr>
                            ) : (
                                filteredDevices.map((device, idx) => {
                                    const isOdd = idx % 2 === 0;
                                    const isMyAction = actionLoading === device.id || actionLoading === `delete-${device.id}`;

                                    return (
                                        <tr key={device.id} className={`${isOdd ? 'bg-[#fcf5f3]' : ''} hover:bg-[#fff9f7] transition-colors rounded-2xl`}>
                                            <td className="px-6 py-5 rounded-l-2xl">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[#1d1d1b] text-sm">{device.label}</span>
                                                    <span className="text-[10px] text-black/40 font-bold uppercase tracking-tighter truncate w-32">{device.id}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#1d1d1b]">{device.name || 'Nta zina'}</span>
                                                    <span className="text-xs text-[#8a5b48] font-medium">{device.location || 'Aho iherereye ntabwo hazwi'}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${device.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${device.is_active ? 'text-green-600' : 'text-red-500'}`}>
                                                        {device.is_active ? 'Arakora' : 'Yahagaritswe'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                {device.claimed_by ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-[#A0522D] mb-0.5">YAFASHWE</span>
                                                        <span className="text-[9px] font-bold text-gray-400 tracking-tighter truncate w-32">{device.claimed_by}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-300">IBEREYE AHO</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-5 text-right rounded-r-2xl">
                                                <div className="flex items-center justify-end gap-4">
                                                    {isMyAction ? (
                                                        <Loader2 className="animate-spin text-[#A0522D]" size={20} />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirmModal({ isOpen: true, type: 'toggle', device })}
                                                                className={`p-2 rounded-xl transition-all ${device.is_active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-500 hover:bg-green-100'}`}
                                                                title={device.is_active ? 'Deactivate' : 'Activate'}
                                                            >
                                                                <Power size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmModal({ isOpen: true, type: 'delete', device })}
                                                                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Device Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-[#A0522D]"></div>

                            <h3 className="text-3xl font-black text-[#A0522D] tracking-tight mb-2">Andika Igikoresho</h3>
                            <p className="text-gray-500 font-medium text-sm mb-8">Ongeramo igikoresho gishya muri sisitemu kugira ngo abakoresha babone uko bagifata.</p>

                            <form onSubmit={handleAddDevice} className="space-y-6">
                                {msg.text && (
                                    <div className={`p-4 rounded-2xl text-xs font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {msg.text}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#8a5b48] tracking-widest uppercase ml-4">LABEL / ID Y'IGIKORESHO</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        required
                                        placeholder="Urugero: CAM_001_FARM"
                                        value={newDeviceLabel}
                                        onChange={(e) => setNewDeviceLabel(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-[#f5ebe6] focus:border-[#A0522D]/40 outline-none font-bold text-gray-800 placeholder-gray-300 transition-colors"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-black text-xs text-[#8a5b48] bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        REKA
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading === 'adding'}
                                        className="flex-1 px-6 py-4 rounded-2xl font-black text-xs text-white bg-[#A0522D] shadow-lg shadow-[#A0522D]/20 hover:bg-[#8b4513] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === 'adding' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} strokeWidth={3} />}
                                        KUBIKA
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: null, device: null })}
                onConfirm={() => {
                    if (confirmModal.device) {
                        if (confirmModal.type === 'delete') handleDeleteDevice(confirmModal.device);
                        else if (confirmModal.type === 'toggle') handleToggleStatus(confirmModal.device);
                    }
                }}
                isLoading={!!actionLoading}
                title={confirmModal.type === 'delete' ? "Gusiba Igikoresho" : (confirmModal.device?.is_active ? "Guhagarika Igikoresho" : "Gufungura Igikoresho")}
                message={confirmModal.type === 'delete'
                    ? `Ushaka gusiba burundu igikoresho "${confirmModal.device?.label}"? Ibi ntibishobora gusubirwamo.`
                    : `Ushaka koko ${confirmModal.device?.is_active ? 'guhagarika' : 'gufungura'} iki gikoresho?`}
                type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
                confirmText={confirmModal.type === 'delete' ? 'SIBA' : (confirmModal.device?.is_active ? 'HAGARIKA' : 'FUNGURA')}
            />

            {/* QR Code Modal — shown after device creation */}
            <AnimatePresence>
                {createdDevice && (
                    <QRModal
                        device={createdDevice}
                        onClose={() => setCreatedDevice(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
    const colorClasses: any = {
        yellow: "bg-yellow-50 text-yellow-500 shadow-yellow-500/10",
        green: "bg-green-50 text-green-500 shadow-green-500/10",
        red: "bg-red-50 text-red-500 shadow-red-500/10",
        blue: "bg-blue-50 text-blue-500 shadow-blue-500/10"
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-white transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[color]} shadow-lg`}>
                {icon}
            </div>
            <div className="text-[10px] font-black text-[#8a5b48]/60 tracking-widest uppercase mb-1">
                {label}
            </div>
            <div className="text-4xl font-black text-[#1d1d1b]">
                {value < 10 && value > 0 ? `0${value}` : value}
            </div>
        </div>
    );
}

function QRModal({ device, onClose }: { device: { id: string; api_key: string; label: string }; onClose: () => void }) {
    const [qrDataUrl, setQrDataUrl] = React.useState('');
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        const payload = JSON.stringify({ device_id: device.id, api_key: device.api_key });
        QRCode.toDataURL(payload, { width: 256, margin: 2 }).then(setQrDataUrl);
    }, [device]);

    const handleCopy = () => {
        navigator.clipboard.writeText(device.api_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center">
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#A0522D] rounded-t-[2.5rem]" />
                <h3 className="text-2xl font-black text-[#A0522D] tracking-tight mb-1 mt-2">Igikoresho Cyanditswe!</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">Tanga iki rupapuro rwa QR code umukiriya wawe.</p>

                <div className="bg-gray-50 rounded-2xl p-4 inline-block mb-4">
                    {qrDataUrl
                        ? <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                        : <div className="w-48 h-48 flex items-center justify-center"><Loader2 className="animate-spin text-[#A0522D]" size={32} /></div>
                    }
                </div>

                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">{device.label}</p>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                    <code className="flex-1 text-xs font-bold text-amber-900 break-all text-left">{device.api_key}</code>
                    <button onClick={handleCopy} className="p-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors flex-shrink-0">
                        {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                <button
                    onClick={() => { if (qrDataUrl) { const a = document.createElement('a'); a.href = qrDataUrl; a.download = `${device.label}-qr.png`; a.click(); } }}
                    className="w-full py-3 rounded-2xl bg-[#A0522D] text-white font-black text-xs hover:bg-[#8b4513] transition-colors mb-3"
                >
                    PAKURURA QR CODE
                </button>
                <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gray-50 text-gray-500 font-black text-xs hover:bg-gray-100 transition-colors">
                    FUNGA
                </button>
            </motion.div>
        </div>
    );
}
