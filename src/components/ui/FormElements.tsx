import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    rightIcon?: React.ReactNode;
    rightLabel?: React.ReactNode;
}

export function TextInput({ label, icon: Icon, rightIcon, rightLabel, className = "", ...props }: InputProps) {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-bold text-brand-text/60 tracking-widest uppercase">
                    {label}
                </label>
                {rightLabel && (
                    <div className="text-[10px] font-bold text-brand-brown tracking-widest uppercase cursor-pointer">
                        {rightLabel}
                    </div>
                )}
            </div>
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-6 text-brand-text/40">
                        <Icon size={18} strokeWidth={2} />
                    </div>
                )}
                <input
                    className={`w-full bg-white border border-brand-text/10 rounded-full py-4 px-6 text-brand-text text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown ${Icon ? 'pl-14' : ''} ${rightIcon ? 'pr-14' : ''}`}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-6 text-brand-text/40 flex items-center justify-center cursor-pointer">
                        {rightIcon}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'google' | 'outline';
    rightIcon?: React.ReactNode;
}

export function Button({ children, variant = 'primary', rightIcon, className = "", ...props }: ButtonProps) {
    const baseClasses = "w-full rounded-full py-4 px-6 font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-[0.98]";

    const variants = {
        primary: "bg-brand-brown text-white hover:bg-brand-brown-dark shadow-[0_10px_20px_rgba(142,82,51,0.3)]",
        google: "bg-white text-brand-text/80 border border-brand-text/10 hover:bg-gray-50",
        outline: "bg-transparent text-brand-brown border-2 border-brand-brown hover:bg-brand-brown/5",
    };

    return (
        <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
            {children}
            {rightIcon && (
                <span className="flex items-center justify-center">
                    {rightIcon}
                </span>
            )}
        </button>
    );
}
