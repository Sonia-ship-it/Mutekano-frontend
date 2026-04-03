"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/FormElements';

export default function ScanPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleScan = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <AuthLayout
            subtitleBlock1="GUKURIKIRANA"
            subtitleBlock2="UBUHINZI"
            subtitleBlock3="N'UBWOROZI."
        >
            <div className="flex flex-col h-full items-center text-center">
                <div className="mb-4 lg:mb-8 w-full">
                    <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-2 mt-2 lg:mt-4">Sikana Code</h2>
                    <p className="text-brand-text/60 font-medium text-sm lg:text-base">Sikana code iri kuri camera yawe.</p>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full py-4 lg:py-8 border-y border-brand-text/5 my-4">
                    <motion.div
                        animate={{
                            boxShadow: ["0px 0px 0px rgba(142,82,51,0)", "0px 0px 40px rgba(142,82,51,0.2)", "0px 0px 0px rgba(142,82,51,0)"]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="relative w-40 h-40 lg:w-48 lg:h-48 flex items-center justify-center text-brand-brown"
                    >
                        {/* Scanner line animation */}
                        <motion.div
                            animate={{ top: ["10%", "90%", "10%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute left-4 right-4 h-0.5 bg-brand-brown/50 shadow-[0_0_8px_rgba(142,82,51,0.8)] z-10"
                        ></motion.div>

                        {/* Mock QR Code frame */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-brown rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-brown rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-brown rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-brown rounded-br-lg"></div>

                        <QrCode size={100} strokeWidth={1} className="opacity-80" />

                        {/* Dots inside to mock QR */}
                        <div className="absolute top-6 left-6 w-5 h-5 lg:top-8 lg:left-8 lg:w-6 lg:h-6 bg-brand-brown rounded-sm"></div>
                        <div className="absolute top-6 right-6 w-5 h-5 lg:top-8 lg:right-8 lg:w-6 lg:h-6 bg-brand-brown rounded-sm"></div>
                        <div className="absolute bottom-6 left-6 w-5 h-5 lg:bottom-8 lg:left-8 lg:w-6 lg:h-6 bg-brand-brown rounded-sm"></div>
                    </motion.div>
                </div>

                <div className="w-full mt-4">
                    <Button type="button" onClick={handleScan} disabled={isLoading} rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}>
                        {isLoading ? "GUSIKANA..." : "KOMEZA"}
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
