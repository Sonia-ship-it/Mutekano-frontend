"use client";

import React from 'react';
import AdminTopNavbar from '@/components/layout/AdminTopNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#fffafa]">
            <AdminTopNavbar />
            <main className="w-full h-[calc(100vh-80px)] overflow-hidden">
                {children}
            </main>
        </div>
    );
}
