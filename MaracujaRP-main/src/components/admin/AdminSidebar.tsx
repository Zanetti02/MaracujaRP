import React from 'react';
import { BarChart3, FileText, Shield, Users, Heart, AlertTriangle, Settings, Activity, Database, UserCheck } from 'lucide-react';
import { RuleSection } from '../../types';

interface AdminSidebarProps {
  activeView: 'stats' | 'rules' | 'users' | 'settings' | 'logs' | 'backup';
  setActiveView: (view: 'stats' | 'rules' | 'users' | 'settings' | 'logs' | 'backup') => void;
  sections: RuleSection[];
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const iconMap = {
  Shield,
  Users,
  Heart,
  AlertTriangle,
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  setActiveView,
  sections,
  selectedSection,
  setSelectedSection
}) => {
  const navigationItems = [
    { id: 'stats', label: 'Dashboard', icon: BarChart3, description: 'Panoramica generale' },
    { id: 'rules', label: 'Gestione Regole', icon: FileText, description: 'Crea e modifica regole' },
    { id: 'account', label: 'Account', icon: UserCheck, description: 'Gestione account' },
    { id: 'logs', label: 'Log Attività', icon: Activity, description: 'Cronologia azioni' },
    { id: 'backup', label: 'Backup', icon: Database, description: 'Salvataggio dati' },
    { id: 'settings', label: 'Impostazioni', icon: Settings, description: 'Configurazione sistema' },
  ];

  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-teal-800/90 via-emerald-800/90 to-teal-900/90 backdrop-blur-xl border-r border-teal-400/40 overflow-y-auto shadow-2xl shadow-teal-500/20">
      <nav className="p-6 space-y-8">
        {/* Main Navigation */}
        <div>
          <div className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Pannello Admin</span>
          </div>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/40 to-amber-500/40 border-2 border-orange-400/60 shadow-lg shadow-orange-500/30'
                      : 'bg-teal-700/30 border border-teal-400/20 hover:bg-teal-600/40 hover:border-teal-300/40'
                  }`}
                >
                  <div className="flex items-center p-4 text-left relative z-10">
                    <div className={`p-2 rounded-lg mr-4 transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg' 
                        : 'bg-teal-600/50 group-hover:bg-teal-500/60'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-teal-200 group-hover:text-white'}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-semibold block ${isActive ? 'text-white' : 'text-teal-100 group-hover:text-white'}`}>
                        {item.label}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-orange-200' : 'text-teal-300'}`}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 ${isActive ? 'opacity-20' : ''}`}></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections (only show when in rules view) */}
        {activeView === 'rules' && (
          <div>
            <div className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Sezioni Regole</span>
            </div>
            <div className="space-y-2">
              {sections.map((section) => {
                const IconComponent = iconMap[section.icon as keyof typeof iconMap];
                const isActive = selectedSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-teal-700/60 text-white border-2 border-teal-400/60 shadow-lg'
                        : 'bg-teal-700/20 text-teal-200 hover:text-white hover:bg-teal-700/40 border border-teal-400/20'
                    }`}
                  >
                    <div className="flex items-center p-3 text-left relative z-10">
                      <IconComponent className={`h-4 w-4 mr-3 ${isActive ? 'text-white' : 'text-teal-300'}`} />
                      <span className="text-sm font-medium truncate flex-1">{section.title}</span>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        isActive ? 'bg-teal-600/50 text-teal-200' : 'bg-teal-700/50 text-teal-300'
                      }`}>
                        {section.rules.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-teal-700/40 to-emerald-700/40 rounded-xl p-4 border border-teal-400/30">
          <h4 className="text-orange-200 font-semibold mb-3 text-sm">Statistiche Rapide</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-teal-200 text-xs">Regole Totali</span>
              <span className="text-white font-bold text-sm">
                {sections.reduce((total, section) => total + section.rules.length, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-teal-200 text-xs">Sezioni Attive</span>
              <span className="text-white font-bold text-sm">{sections.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-teal-200 text-xs">Ultimo Update</span>
              <span className="text-green-300 font-bold text-xs">Oggi</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;