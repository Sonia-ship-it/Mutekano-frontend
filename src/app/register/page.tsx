"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, Phone } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TextInput, Button } from '@/components/ui/FormElements';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullNames: '',
        email: '',
        phoneNumber: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        // Split full names into first and last name
        const names = formData.fullNames.trim().split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || firstName; // Fallback to first name if no last name

        try {
            const { data } = await api.post('/auth/register', {
                first_name: firstName,
                last_name: lastName,
                email: formData.email,
                phone_number: formData.phoneNumber,
                password: formData.password,
                role: "CLIENT"
            });

            if (data.success) {
                router.push('/login');
            } else {
                throw new Error("Habaye ikibazo mugufungura konti. Ongera ugerageze.");
            }

        } catch (error: any) {
            setErrorMsg(error.message || "Kwiyandikisha byanze. Kanda wiyandikishe bundi bushya.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            subtitleBlock1="KURIKIRANA"
            subtitleBlock2="URUGO"
            subtitleBlock3="AHO URI HOSE"
            formMaxWidth="600px"
        >
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-1">Fungura konti</h2>
                    <p className="text-brand-text/60 font-medium text-sm lg:text-base">Iyandikishe maze ufungure konti.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col pt-2 border-t border-brand-text/5">
                    {errorMsg && (
                        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
                            {errorMsg}
                        </div>
                    )}
                    <TextInput
                        name="fullNames"
                        label="Amazina"
                        type="text"
                        required
                        placeholder="Izina ryawe ryuzuye"
                        icon={User}
                        value={formData.fullNames}
                        onChange={handleChange}
                        className="mb-3 mt-3"
                    />

                    <TextInput
                        name="email"
                        label="Imeri"
                        type="email"
                        required
                        placeholder="izina@urubuga.rw"
                        icon={Mail}
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-3"
                    />

                    <TextInput
                        name="phoneNumber"
                        label="Nomero ya telefone"
                        type="tel"
                        required
                        placeholder="07..."
                        icon={Phone}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mb-3"
                    />

                    <TextInput
                        name="password"
                        label="Ijambo ry'ibanga"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="........"
                        icon={Lock}
                        rightIcon={
                            <div onClick={() => setShowPassword(!showPassword)} className="p-1 cursor-pointer">
                                {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                            </div>
                        }
                        value={formData.password}
                        onChange={handleChange}
                        className="mb-5"
                    />

                    <Button type="submit" disabled={isLoading} rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}>
                        {isLoading ? "IYANDIKISHE..." : "INJIRA MURI KONTI?"}
                    </Button>

                    {/* <div className="my-4 border-t border-brand-text/10 w-full relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/0 px-2 text-[10px] text-brand-text/30 font-bold">CYANGWA</span>
                    </div>

                    <Button variant="google" type="button" rightIcon={
                        <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full ml-2">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        </div>
                    }>
                        KOMEZA NA GOOGLE
                    </Button> */}

                    <div className="mt-4 text-center text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase">
                        USANZWE UFITE KONTI? <Link href="/login" className="text-brand-brown hover:underline underline-offset-4">INJIRA</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

