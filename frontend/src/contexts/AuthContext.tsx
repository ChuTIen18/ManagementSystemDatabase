import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { tokenStore } from '../utils/tokenStore';

interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'staff' | 'pos' | 'manager';
    position: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in (either in-memory token or refresh cookie)
    useEffect(() => {
        // Attempt to fetch current user. If access token is present in-memory, requests will include it.
        // If only a refresh cookie is present, server-side refresh will issue a new access token and the request will retry.
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await authAPI.getMe();
            const userData = response.data.data;
            setUser(userData);
            // store role & name for compatibility with components that read localStorage
            localStorage.setItem('role', userData.role);
            localStorage.setItem('fullName', userData.full_name || userData.fullName || '');
            // If access token returned by refresh flow, tokenStore should already be set by interceptor
            const currentToken = tokenStore.getToken();
            if (!currentToken && response.data?.data?.accessToken) {
                tokenStore.setToken(response.data.data.accessToken);
            }
            setError(null);
        } catch (err: any) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('fullName');
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(email, password);
            const { accessToken, user: userData } = response.data.data;

            // keep access token in memory only
            if (accessToken) tokenStore.setToken(accessToken);
            // backend also sets refresh token cookie; store role/name for compatibility
            localStorage.setItem('role', userData.role);
            localStorage.setItem('fullName', userData.full_name || userData.fullName || '');
            setUser(userData);
        } catch (err: any) {
            const errorMsg = err.response?.data?.error?.message || err.message;
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            authAPI.logout();
        } catch (e) {
            // ignore
        }
        tokenStore.clear();
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
