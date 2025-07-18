import React from 'react';
import { X, Palmtree, Shield, Users, Gavel, Car, Home, Heart, AlertTriangle, MessageSquare, Trophy, Settings, HelpCircle } from 'lucide-react';
import { RuleSection } from '../types';

interface SidebarProps {
  sections: RuleSection[];
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const iconMap = {
  Shield,
  Users,
  Gavel,
  Car,
  Home,
  Heart,
  AlertTriangle,
  MessageSquare,
  Trophy,
  Settings,
  HelpCircle,
  Palmtree
};

const Sidebar: React.FC<SidebarProps> = ({ 
  sections, 
  activeSection, 
  setActiveSection, 
  isOpen, 
  setIsOpen 
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-custom-cyan-800/90 via-custom-cyan-700/90 to-custom-cyan-900/90 backdrop-blur-xl border-r border-custom-cyan-400/40 z-40 shadow-2xl shadow-custom-cyan-500/20
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile header */}
        <div className="flex items-center justify-between p-6 border-b border-custom-cyan-400/30 md:hidden bg-gradient-to-r from-custom-orange-500/20 to-custom-orange-400/20 mt-20">
          <div className="flex items-center space-x-3">
            <Palmtree className="h-6 w-6 text-custom-orange-300" />
            <h2 className="text-lg font-bold text-custom-orange-200">Categorie</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-custom-orange-200 hover:text-white hover:bg-custom-cyan-600/50 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3 overflow-y-auto mt-20 md:mt-0">
          <div className="text-xs font-bold text-custom-orange-300 uppercase tracking-wider mb-6 flex items-center space-x-2">
            <Palmtree className="h-4 w-4" />
            <span>Categorie</span>
          </div>

          {sections.map((section) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Shield;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105
                  ${isActive 
                    ? 'bg-gradient-to-r from-custom-orange-500/40 to-custom-orange-400/40 border-2 border-custom-orange-400/60 shadow-lg shadow-custom-orange-500/30' 
                    : 'bg-custom-cyan-700/30 border border-custom-cyan-400/20 hover:bg-custom-cyan-600/40 hover:border-custom-cyan-300/40'
                  }
                `}
              >
                <div className="flex items-center p-4 text-left">
                  <div className={`
                    p-2 rounded-xl mr-4 transition-all duration-200
                    ${isActive 
                      ? 'bg-orange-gradient shadow-lg' 
                      : 'bg-custom-cyan-600/50 group-hover:bg-custom-cyan-500/60'
                    }
                  `}>
                    <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-custom-cyan-200 group-hover:text-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0 mr-3">
                    <span className={`font-semibold block ${isActive ? 'text-white' : 'text-custom-cyan-100 group-hover:text-white'}`}>
                      {section.title}
                    </span>
                    <span className={`text-xs ${isActive ? 'text-custom-orange-200' : 'text-custom-cyan-300'}`}>
                      {section.rules.length} regole
                    </span>
                  </div>
                  <div className={`flex-shrink-0
                    px-3 py-1 rounded-full text-xs font-bold transition-all
                    ${isActive 
                      ? 'bg-custom-orange-500/40 text-custom-orange-100 border border-custom-orange-400/50' 
                      : 'bg-custom-cyan-600/50 text-custom-cyan-200 border border-custom-cyan-400/30 group-hover:bg-custom-cyan-500/60'
                    }
                  `}>
                    {section.rules.length}
                  </div>
                </div>

                {/* Animated background */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-r from-custom-cyan-500/10 to-custom-cyan-400/10
                  ${isActive ? 'opacity-20' : ''}
                `}></div>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;