"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, Copy, CheckCheck } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TextInput, Button } from '@/components/ui/FormElements';
import api from '@/lib/api';

function SetupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deviceId = searchParams.get('device_id');

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const key = localStorage.getItem('pending_device_api_key');
        if (key) setApiKey(key);
        if (!deviceId) router.push('/scan');
    }, [deviceId, router]);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deviceId) return;
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.patch(`/devices/${deviceId}`, { name, location });
            if (!data.success) throw new Error(data.message);
            localStorage.removeItem('pending_device_api_key');
            router.push('/dashboard');
        } catch (e: any) {
            setError(e.message || 'Habaye ikibazo, ongera ugerageze');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 lg:mb-8">
                <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-2 mt-2 lg:mt-8">
                    Uzuza imyirondoro
                </h2>
                <p className="text-brand-text/60 font-medium text-sm lg:text-base">
                    Teganya amazina ya kamera hakurikijwe ibyumba.
                </p>
            </div>

            {/* API Key display — user needs this for the captive portal */}
            {apiKey && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-700 tracking-widest uppercase mb-2">
                        API KEY Y'IGIKORESHO — Yandike kuri WiFi portal
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-bold text-amber-900 break-all">{apiKey}</code>
                        <button onClick={handleCopy} className="p-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors flex-shrink-0">
                            {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col pt-2 border-t border-brand-text/5">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{error}</div>
                )}
                <TextInput
                    label="CAMERA"
                    type="text"
                    required
                    placeholder="Camera 1"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mb-5 lg:mb-6 mt-6 lg:mt-8"
                />
                <TextInput
                    label="AHO IRI"
                    type="text"
                    required
                    placeholder="Ikiraro k'inka"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="mb-8 lg:mb-12"
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                >
                    {isLoading ? 'KOMEZA...' : 'KOMEZA'}
                </Button>
            </form>
        </div>
    );
}

export default function SetupPage() {
    return (
        <AuthLayout subtitleBlock1="GUKURIKIRANA" subtitleBlock2="URUGO" subtitleBlock3="AHO URI HOSE.">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-brand-brown" size={32} /></div>}>
                <SetupForm />
            </Suspense>
        </AuthLayout>
    );
}
