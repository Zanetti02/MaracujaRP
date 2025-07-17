import React, { useState, useEffect } from 'react';
import { Search, Menu, Palmtree, Settings, Sun, Waves } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSidebarOpen: (open: boolean) => void;
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, setSidebarOpen, onAdminClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down & past threshold
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-yellow-500/30 
      backdrop-blur-xl border-b border-orange-400/40 shadow-lg shadow-orange-500/20
    `}>
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-orange-200 hover:text-white hover:bg-orange-500/40 transition-all duration-200 hover:scale-105"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-2 md:ml-0 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-xl shadow-xl">
                  <Palmtree className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-200 to-amber-200 bg-clip-text text-transparent">
                  Maracuja Roleplay
                </h1>
                <div className="flex items-center space-x-2">
                  <Waves className="h-3 w-3 text-teal-300" />
                  <p className="text-sm text-orange-200/80">Regolamento del Server</p>
                  <Sun className="h-3 w-3 text-amber-300 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-orange-300 group-focus-within:text-amber-300 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-orange-400/40 rounded-2xl bg-emerald-800/60 backdrop-blur-sm text-white placeholder-orange-200/70 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-300 transition-all duration-200 hover:bg-emerald-800/70"
                placeholder=" Cerca nelle regole..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Status & Admin */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-emerald-700/40 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-400/30">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="relative p-3 rounded-xl text-orange-200 hover:text-white hover:bg-orange-500/40 transition-all duration-200 hover:scale-105 group"
                title="Admin Panel"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Settings className="h-5 w-5 relative z-10" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;