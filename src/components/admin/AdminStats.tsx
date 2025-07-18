import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, FolderOpen, Activity, TrendingUp } from 'lucide-react';
import { RuleSection } from '../../types';
import { adminAPI } from '../../lib/api';

interface AdminStatsProps {
  sections: RuleSection[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ sections }) => {
  const [stats, setStats] = useState({
    totalSections: 0,
    totalRules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to local data
        setStats({
          totalSections: sections.length,
          totalRules: sections.reduce((total, section) => total + section.rules.length, 0),
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [sections]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Sezioni Totali',
      value: stats.totalSections,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Regole Totali',
      value: stats.totalRules,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Media Regole/Sezione',
      value: stats.totalSections > 0 ? Math.round(stats.totalRules / stats.totalSections) : 0,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Sistema Attivo',
      value: '100%',
      icon: Activity,
      color: 'from-[#00F4FF] to-[#FF7A00]',
      bgColor: 'bg-gradient-to-br from-[#00F4FF]/10 to-[#FF7A00]/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Sistema Operativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribuzione Sezioni</h3>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    index % 4 === 0 ? 'from-blue-400 to-blue-600' :
                    index % 4 === 1 ? 'from-green-400 to-green-600' :
                    index % 4 === 2 ? 'from-purple-400 to-purple-600' :
                    'from-orange-400 to-orange-600'
                  }`}></div>
                  <span className="font-medium text-gray-700">{section.title}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {section.rules.length} regole
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Azioni Rapide</h3>
          <div className="space-y-3">
            <button className="w-full p-4 text-left bg-gradient-to-r from-[#00F4FF]/10 to-[#FF7A00]/10 rounded-lg hover:from-[#00F4FF]/20 hover:to-[#FF7A00]/20 transition-all">
              <div className="font-medium text-gray-800">Crea Nuova Sezione</div>
              <div className="text-sm text-gray-600">Aggiungi una nuova categoria di regole</div>
            </button>
            <button className="w-full p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
              <div className="font-medium text-gray-800">Gestisci Regole</div>
              <div className="text-sm text-gray-600">Modifica o aggiungi nuove regole</div>
            </button>
            <button className="w-full p-4 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-all">
              <div className="font-medium text-gray-800">Backup Sistema</div>
              <div className="text-sm text-gray-600">Esporta tutte le regole e sezioni</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;