"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    profile_image?: string;
    role?: string;
    [key: string]: any;
}

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
    updateUser: (newData: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

    const fetchUser = useCallback(async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            setLoading(false);
            setUser(null);
            return;
        }

        if (!user && !localStorage.getItem('cached_user_profile')) {
            setLoading(true);
        }

        try {
            const { data } = await api.get(`/users/me?t=${Date.now()}`);
            if (data.success && data.data) {
                setUser(data.data);
                localStorage.setItem('cached_user_profile', JSON.stringify(data.data));
            }
        } catch (err) {
            // silently ignore — api.ts interceptor already cleared tokens on 401
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (AUTH_PAGES.includes(pathname)) {
            setLoading(false);
            return;
        }

        const cached = localStorage.getItem('cached_user_profile');
        if (cached) {
            try {
                setUser(JSON.parse(cached));
                setLoading(false);
            } catch (e) { }
        }

        fetchUser();
    }, [fetchUser, pathname]);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('cached_user_profile');
        setUser(null);
        window.location.href = '/login';
    }, []);

    const updateUser = useCallback((newData: UserProfile) => {
        setUser(newData);
        localStorage.setItem('cached_user_profile', JSON.stringify(newData));
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser: fetchUser, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
