"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, X, AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "EMEZA",
    cancelText = "REKA",
    type = 'danger',
    isLoading = false
}: ConfirmationModalProps) {

    const colors = {
        danger: {
            bg: 'bg-red-50',
            icon: 'bg-red-500',
            text: 'text-red-600',
            btn: 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: 'bg-amber-500',
            text: 'text-amber-600',
            btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
        },
        info: {
            bg: 'bg-blue-50',
            icon: 'bg-blue-500',
            text: 'text-blue-600',
            btn: 'bg-brand-brown hover:bg-brand-brown-dark shadow-brand-brown/20'
        }
    };

    const currentColors = colors[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    ></motion.div>

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Upper Decoration */}
                        <div className={`absolute top-0 left-0 right-0 h-2 ${currentColors.icon}`}></div>

                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className={`w-20 h-20 ${currentColors.bg} rounded-3xl flex items-center justify-center mb-6 relative group`}>
                                <div className={`absolute inset-0 ${currentColors.icon} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}></div>
                                {type === 'danger' && <Trash2 className="text-red-500" size={32} />}
                                {type === 'warning' && <AlertTriangle className="text-amber-500" size={32} />}
                                {type === 'info' && <Info className="text-blue-500" size={32} />}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-brand-text tracking-tight mb-2">
                                {title}
                            </h3>

                            <p className="text-brand-text/60 font-medium text-sm leading-relaxed mb-10 max-w-xs">
                                {message}
                            </p>

                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-4 rounded-2xl font-black text-xs text-brand-text/60 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>

                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xs text-white transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${currentColors.btn} disabled:opacity-50`}
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : null}
                                    {confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
