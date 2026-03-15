import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('vstay_token');
        if (token) {
            api.getMe()
                .then(res => setCurrentUser(res.data))
                .catch(() => {
                    localStorage.removeItem('vstay_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.login({ email, password });
        localStorage.setItem('vstay_token', res.data.token);
        setCurrentUser(res.data.user);
        return res.data.user;
    };

    const signup = async (data) => {
        const res = await api.signup(data);
        localStorage.setItem('vstay_token', res.data.token);
        setCurrentUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem('vstay_token');
        setCurrentUser(null);
        showToast('Logged out successfully', 'info');
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
