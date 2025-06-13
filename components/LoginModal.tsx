import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useUser } from '../contexts/UserContext';
import { UserRole } from '../types';

// Icons for buttons
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetActionDescription?: string; // e.g., "To create a project..."
  onOwnerLoginSuccess?: () => void; // Callback specifically after owner login
  onInvestorLoginSuccess?: () => void; // Callback specifically after investor login
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  targetActionDescription,
  onOwnerLoginSuccess,
  onInvestorLoginSuccess
}) => {
  const { loginAsOwner, loginAsInvestor } = useUser();

  const handleOwnerLogin = () => {
    loginAsOwner();
    onClose();
    if (onOwnerLoginSuccess) {
      onOwnerLoginSuccess();
    }
  };

  const handleInvestorLogin = () => {
    loginAsInvestor();
    onClose();
     if (onInvestorLoginSuccess) {
      onInvestorLoginSuccess();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ログインまたはアカウント作成" size="md">
      <div className="space-y-6 text-center">
        {targetActionDescription && (
          <p className="text-slate-700">{targetActionDescription}</p>
        )}
        <p className="text-sm text-slate-600">
          NextLabの全機能を利用するにはログインが必要です。
          デモのため、以下から役割を選択してログインしてください。
        </p>
        
        <div className="flex flex-col space-y-3 pt-2">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleOwnerLogin}
            leftIcon={<AcademicCapIcon />}
            className="w-full" // Removed !text-white as button variant handles text color
          >
            研究者としてログイン
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleInvestorLogin}
            leftIcon={<UserCircleIcon />}
            className="w-full" // Removed !text-white
          >
            支援者としてログイン
          </Button>
        </div>
        <p className="text-xs text-slate-500 pt-2">
          このプラットフォームはデモンストレーション用です。実際の認証情報や資金のやり取りは行われません。
        </p>
      </div>
    </Modal>
  );
};