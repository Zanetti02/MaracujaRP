import React from 'react';
import { LogOut, User } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminHeaderProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentAdmin, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00F4FF] to-[#FF7A00] bg-clip-text text-transparent">
            MaracujaRP Admin
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-5 h-5" />
            <span className="font-medium">{currentAdmin.username}</span>
            <span className="text-sm text-gray-500 capitalize">({currentAdmin.role})</span>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;