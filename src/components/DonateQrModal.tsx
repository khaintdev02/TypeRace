import React, { useState } from 'react';
import { X, Coffee, ExternalLink, Copy, Check } from 'lucide-react';

interface DonateQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateQrModal: React.FC<DonateQrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('1017409146');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 10, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)',
          borderRadius: '24px',
          padding: '1.75rem',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#f59e0b',
          fontSize: '0.8rem',
          fontWeight: 800,
          marginBottom: '0.75rem'
        }}>
          <Coffee size={15} />
          Ủng Hộ Cốc Cà Phê ☕
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.35rem', color: '#fff' }}>
          Mã QR Chuyển Tiền
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: '1.2rem', lineHeight: 1.45 }}>
          Quét mã VietQR bằng app ngân hàng hoặc MoMo để ủng hộ nhà phát triển <strong style={{ color: '#00f0ff' }}>Haki Spirit</strong>
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#ffffff',
          padding: '0.6rem',
          borderRadius: '16px',
          display: 'inline-block',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)',
          marginBottom: '1rem',
          maxWidth: '280px',
          width: '100%'
        }}>
          <img
            src="/qr-donate.jpg"
            alt="Mã QR chuyển tiền Vietcombank NGUYEN THE KHAI"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Banking Info Box */}
        <div style={{
          background: 'rgba(10, 16, 28, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Ngân hàng:</span>
            <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>Vietcombank</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Chủ tài khoản:</span>
            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>NGUYEN THE KHAI</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Số tài khoản:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <strong style={{ fontSize: '0.9rem', color: '#f59e0b', letterSpacing: '0.04em' }}>1017409146</strong>
              <button
                type="button"
                onClick={handleCopyAccount}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#f59e0b',
                  borderRadius: '6px',
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 600
                }}
                title="Sao chép số tài khoản"
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Creator Facebook Action */}
        <a
          href="https://www.facebook.com/haki.spiritx2"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.88rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            borderRadius: '12px',
            width: '100%'
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook: Haki Spirit <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
