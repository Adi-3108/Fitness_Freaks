import React from 'react';

interface DialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'info' | 'welcome';
}

export default function Dialog({ isOpen, message, onClose, type = 'info' }: DialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#27ae60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'welcome':
        return (
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#ebeb4b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'bounceIn 0.5s ease-out'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 9H9.01" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 9H15.01" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#3498db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: '#111111',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(235, 235, 75, 0.3)',
        border: '1px solid #ebeb4b',
        padding: '32px 40px',
        minWidth: 340,
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        animation: 'slideUp 0.3s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(235, 235, 75, 0.1)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(235, 235, 75, 0.1)',
          zIndex: 0
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {getIcon()}
          <p style={{ 
            color: '#ebeb4b', 
            fontSize: '18px', 
            textAlign: 'center',
            lineHeight: 1.5,
            margin: 0
          }}>
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: 8,
            background: '#ebeb4b',
            color: 'black',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1,
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(235, 235, 75, 0.3)'
            }
          }}
        >
          OK
        </button>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(235, 235, 75, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
} 