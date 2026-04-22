"use client";

import React from 'react';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
