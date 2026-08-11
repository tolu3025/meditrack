import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(14, 165, 233, 0.2)',
        borderTop: '3px solid #0EA5E9',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
