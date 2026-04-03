"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { TextInput, Button } from '@/components/ui/FormElements';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <AuthLayout
            subtitleBlock1="HINDURA"
            subtitleBlock2="IJAMBO"
            subtitleBlock3="RY'IBANGA."
            formMaxWidth="600px"
        >
            <div className="flex flex-col h-full">
                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8 lg:mb-10">
                                <h2 className="text-3xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight leading-none mb-2">
                                    Wibagiwe?
                                </h2>
                                <p className="text-brand-text/60 font-medium text-sm lg:text-base">
                                    Andika imeri yawe tuguohereze uburyo bwo guhindura ijambo ry&apos;ibanga.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col pt-2 border-t border-brand-text/5">
                                <TextInput
                                    label="Imeri"
                                    type="email"
                                    required
                                    placeholder="izina@urubuga.rw"
                                    icon={Mail}
                                    className="mb-6 lg:mb-8 mt-4 lg:mt-6"
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                                >
                                    {isLoading ? "KOHEREZA..." : "OHEREZA LINK"}
                                </Button>
                            </form>

                            <div className="mt-8 lg:mt-10 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-[10px] lg:text-xs font-bold text-brand-text/60 tracking-widest uppercase hover:text-brand-brown transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    SUBIRA KWINJIRA
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: "backOut" }}
                            className="flex flex-col items-center text-center py-6 lg:py-10"
                        >
                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 lg:mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                >
                                    <CheckCircle size={40} className="text-green-500 lg:w-12 lg:h-12" />
                                </motion.div>
                            </div>

                            <h2 className="text-2xl lg:text-3xl font-black text-brand-brown tracking-tight mb-3">
                                Yoherejwe!
                            </h2>
                            <p className="text-brand-text/60 font-medium text-sm lg:text-base max-w-xs mb-8 lg:mb-10">
                                Reba imeri yawe kugirango ubone link yo guhindura ijambo ry&apos;ibanga.
                            </p>

                            <Link href="/login" className="w-full">
                                <Button type="button" rightIcon={<ArrowRight size={18} />}>
                                    SUBIRA KWINJIRA
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
