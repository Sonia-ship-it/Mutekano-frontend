"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';

export default function ScanPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'scanning' | 'claiming' | 'error'>('scanning');
    const [errorMsg, setErrorMsg] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanningRef = useRef(false);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            scanFrame();
        } catch {
            setErrorMsg('Ntabwo kamera yawe yemewe. Emeza ko waremesheje kamera.');
            setStatus('error');
        }
    };

    const scanFrame = async () => {
        // Dynamically import jsQR to avoid SSR issues
        const jsQR = (await import('jsqr')).default;

        const tick = () => {
            if (scanningRef.current) return;
            const video = videoRef.current;
            if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
                requestAnimationFrame(tick);
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(video, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                scanningRef.current = true;
                handleQRData(code.data);
            } else {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    };

    const handleQRData = async (raw: string) => {
        setStatus('claiming');
        stopCamera();
        try {
            // QR contains JSON: {"device_id":"...","api_key":"..."}
            const { device_id, api_key } = JSON.parse(raw);
            if (!device_id || !api_key) throw new Error('Invalid QR');

            // Save api_key to localStorage so setup page can show it to user
            localStorage.setItem('pending_device_api_key', api_key);

            const { data } = await api.post(`/devices/${device_id}/claim`);
            if (!data.success) throw new Error(data.message || 'Claim failed');

            router.push(`/setup?device_id=${device_id}`);
        } catch (e: any) {
            setErrorMsg(e.message || 'QR code ntabwo izi. Gerageza indi.');
            setStatus('error');
        }
    };

    return (
        <AuthLayout subtitleBlock1="GUKURIKIRANA" subtitleBlock2="UBUHINZI" subtitleBlock3="N'UBWOROZI.">
            <div className="flex flex-col h-full items-center text-center">
                <div className="mb-4 lg:mb-8 w-full">
                    <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-2 mt-2 lg:mt-4">
                        Sikana Code
                    </h2>
                    <p className="text-brand-text/60 font-medium text-sm lg:text-base">
                        Shyira kamera yawe imbere ya QR code iri ku rupapuro rwawe.
                    </p>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full py-4 lg:py-8 border-y border-brand-text/5 my-4">
                    {status === 'error' ? (
                        <div className="flex flex-col items-center gap-4 text-red-500">
                            <AlertCircle size={48} />
                            <p className="text-sm font-bold max-w-xs">{errorMsg}</p>
                            <button
                                onClick={() => { setStatus('scanning'); scanningRef.current = false; startCamera(); }}
                                className="px-6 py-3 bg-brand-brown text-white rounded-2xl font-black text-xs"
                            >
                                ONGERA UGERAGEZE
                            </button>
                        </div>
                    ) : status === 'claiming' ? (
                        <div className="flex flex-col items-center gap-4 text-brand-brown">
                            <Loader2 size={48} className="animate-spin" />
                            <p className="text-sm font-bold">Tegereza gato...</p>
                        </div>
                    ) : (
                        <div className="relative w-56 h-56 lg:w-64 lg:h-64 overflow-hidden rounded-2xl bg-black">
                            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                            {/* Scanner overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-brand-brown rounded-tl-lg" />
                                <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-brand-brown rounded-tr-lg" />
                                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-brand-brown rounded-bl-lg" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-brand-brown rounded-br-lg" />
                                <motion.div
                                    animate={{ top: ['10%', '90%', '10%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                    className="absolute left-4 right-4 h-0.5 bg-brand-brown/70 shadow-[0_0_8px_rgba(142,82,51,0.8)]"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}
