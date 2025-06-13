import React, { ReactNode, useEffect } from 'react';

// SVG Icon
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const modalPanelStyle = `
    bg-slate-100/80 backdrop-blur-xl backdrop-saturate-150 
    border border-slate-900/10 
    shadow-2xl shadow-slate-900/10 
    rounded-[24px] 
    p-6 relative w-full ${sizeClasses[size]} 
    transform transition-all duration-300 ease-out scale-95 animate-modal-appear 
    text-slate-800
  `;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-out" 
      onClick={onClose} 
    >
      <div
        className={modalPanelStyle.replace(/\s\s+/g, ' ').trim()}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-900/10"
          aria-label="モーダルを閉じる"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="text-xl font-semibold text-[#0A6CFF] mb-4 border-b border-slate-900/10 pb-3">{title}</h2>
        )}
        <div className="text-slate-700">{children}</div>
      </div>
      <style>
        {`
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-modal-appear {
            animation: modal-appear 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};