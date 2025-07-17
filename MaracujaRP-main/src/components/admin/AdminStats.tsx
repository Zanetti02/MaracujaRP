import React from 'react';
import { RuleSection } from '../../types';
import { FileText, Users, Palmtree, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface AdminStatsProps {
  sections: RuleSection[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ sections }) => {
  const totalRules = sections.reduce((total, section) => total + section.rules.length, 0);
  
  const sectionStats = sections.map(section => ({
    ...section,
    ruleCount: section.rules.length,
    percentage: (section.rules.length / totalRules) * 100
  }));

  const iconMap = {
    Shield: Palmtree,
    Users,
    Heart: Palmtree,
    AlertTriangle,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Amministratore</h2>
        <p className="text-teal-200">Panoramica generale del regolamento tropicale</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Regole Totali</p>
              <p className="text-2xl font-bold text-white">{totalRules}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-lg shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-300 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Aggiornato di recente</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Sezioni Attive</p>
              <p className="text-2xl font-bold text-white">{sections.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg shadow-lg">
              <Palmtree className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-300 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Sempre disponibili</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Media per Sezione</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalRules / sections.length)}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-orange-300 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Bilanciato</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Ultima Modifica</p>
              <p className="text-2xl font-bold text-white">Oggi</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-pink-300 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>Aggiornamento recente</span>
          </div>
        </div>
      </div>

      {/* Sections Overview */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribuzione Regole per Sezione</h3>
        <div className="space-y-4">
          {sectionStats.map((section) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Palmtree;
            
            return (
              <div key={section.id} className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-lg">
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{section.title}</span>
                    <span className="text-teal-200 text-sm">{section.ruleCount} regole</span>
                  </div>
                  <div className="w-full bg-teal-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${section.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-teal-200 text-sm font-medium">
                  {section.percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Azioni Rapide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-teal-700/50 hover:bg-teal-600/50 rounded-lg transition-colors text-left border border-teal-400/20">
            <FileText className="h-6 w-6 text-orange-300 mb-2" />
            <h4 className="text-white font-medium mb-1">Aggiungi Regola</h4>
            <p className="text-teal-200 text-sm">Crea una nuova regola</p>
          </button>
          
          <button className="p-4 bg-teal-700/50 hover:bg-teal-600/50 rounded-lg transition-colors text-left border border-teal-400/20">
            <Palmtree className="h-6 w-6 text-amber-300 mb-2" />
            <h4 className="text-white font-medium mb-1">Backup Regole</h4>
            <p className="text-teal-200 text-sm">Esporta il regolamento</p>
          </button>
          
          <button className="p-4 bg-teal-700/50 hover:bg-teal-600/50 rounded-lg transition-colors text-left border border-teal-400/20">
            <Users className="h-6 w-6 text-green-300 mb-2" />
            <h4 className="text-white font-medium mb-1">Log Modifiche</h4>
            <p className="text-teal-200 text-sm">Visualizza cronologia</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;