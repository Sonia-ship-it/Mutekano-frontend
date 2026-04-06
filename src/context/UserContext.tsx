"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    error: string | null;
    refreshUser: () => Promise<void>;
    logout: () => void;
    updateUser: (newData: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            setLoading(false);
            setUser(null);
            return;
        }

        // Only set loading to true if we don't have a user or cached data yet
        if (!user && !localStorage.getItem('cached_user_profile')) {
            setLoading(true);
        }

        try {
            const res = await fetch(`http://147.79.101.43:8000/users/me?t=${Date.now()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-cache'
            });
            const data = await res.json();
            if (data.success && data.data) {
                setUser(data.data);
                localStorage.setItem('cached_user_profile', JSON.stringify(data.data));
            } else {
                setError(data.message || 'Failed to fetch user');
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
            setError('Network error fetching user');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Try to load from cache immediately for zero-flicker experience
        const cached = localStorage.getItem('cached_user_profile');
        if (cached) {
            try {
                setUser(JSON.parse(cached));
                setLoading(false); // We have cached data, so we're technically not "loading" placeholders
            } catch (e) {
                console.error("Failed to parse cached user", e);
            }
        }

        fetchUser();
    }, [fetchUser]);

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
        <UserContext.Provider value={{ user, loading, error, refreshUser: fetchUser, logout, updateUser }}>
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
