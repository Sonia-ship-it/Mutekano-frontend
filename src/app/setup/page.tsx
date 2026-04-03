"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TextInput, Button } from '@/components/ui/FormElements';

export default function SetupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            router.push('/scan');
        }, 1000);
    };

    return (
        <AuthLayout
            subtitleBlock1="GUKURIKIRANA"
            subtitleBlock2="URUGO"
            subtitleBlock3="AHO URI HOSE."
        >
            <div className="flex flex-col h-full">
                <div className="mb-8 lg:mb-10">
                    <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-2 mt-2 lg:mt-8">Uzuza imyirondoro</h2>
                    <p className="text-brand-text/60 font-medium text-sm lg:text-base">Teganya amazina ya kamera hakurikijwe ibyumba.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col pt-2 border-t border-brand-text/5">
                    <TextInput
                        label="CAMERA"
                        type="text"
                        required
                        placeholder="Camera 1"
                        className="mb-5 lg:mb-6 mt-6 lg:mt-8"
                    />

                    <TextInput
                        label="AHO IRI"
                        type="text"
                        required
                        placeholder="Ikiraro k'inka"
                        className="mb-8 lg:mb-12"
                    />

                    <Button type="submit" disabled={isLoading} rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}>
                        {isLoading ? "KOMEZA..." : "KOMEZA"}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}
