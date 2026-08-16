import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534', icon: '#22C55E' },
    error:   { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', icon: '#EF4444' },
    info:    { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF', icon: '#3B82F6' },
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        zIndex: 9999, pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = colors[t.type] || colors.info;
          const Icon = icons[t.type] || Info;
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1.5px solid ${c.border}`,
              borderRadius: 14, padding: '0.9rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              minWidth: 280, maxWidth: 380,
              animation: 'slideIn 0.25s ease-out',
              pointerEvents: 'all',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <Icon size={18} color={c.icon} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: c.text, lineHeight: 1.4 }}>
                {t.message}
              </span>
              <button onClick={() => removeToast(t.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: c.icon, padding: 0, flexShrink: 0,
                display: 'flex', alignItems: 'center',
              }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
