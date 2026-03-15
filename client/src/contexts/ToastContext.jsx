import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const bgColor = (type) => {
        if (type === 'success') return 'bg-green-500';
        if (type === 'error') return 'bg-red-500';
        return 'bg-blue-500';
    };

    const icon = (type) => {
        if (type === 'success') return '✓';
        if (type === 'error') return '✕';
        return 'ℹ';
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div id="toast-container" className="fixed top-20 right-4 z-50 flex flex-col gap-2">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${bgColor(t.type)} text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-2`}>
                        <span>{icon(t.type)}</span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
