import React, { useState } from 'react';
import { Download, Upload, Database, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { RuleSection } from '../../types';

interface BackupManagerProps {
  sections: RuleSection[];
}

const BackupManager: React.FC<BackupManagerProps> = ({ sections }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const exportData = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        sections: sections,
        metadata: {
          totalSections: sections.length,
          totalRules: sections.reduce((total, section) => total + section.rules.length, 0),
          exportedBy: 'Admin',
        }
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `maracuja-rp-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Backup esportato con successo!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore durante l\'esportazione del backup' });
    } finally {
      setLoading(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage(null);

      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup structure
      if (!backupData.sections || !Array.isArray(backupData.sections)) {
        throw new Error('Formato backup non valido');
      }

      // Here you would typically send the data to your API
      console.log('Importing backup data:', backupData);

      setMessage({ 
        type: 'success', 
        text: `Backup importato con successo! ${backupData.sections.length} sezioni ripristinate.` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Errore durante l\'importazione del backup' 
      });
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const backupHistory = [
    {
      id: '1',
      date: new Date().toISOString(),
      size: '2.4 MB',
      sections: sections.length,
      rules: sections.reduce((total, section) => total + section.rules.length, 0),
      type: 'manual'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      size: '2.3 MB',
      sections: sections.length - 1,
      rules: sections.reduce((total, section) => total + section.rules.length, 0) - 2,
      type: 'automatic'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestione Backup</h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <Database className="w-5 h-5" />
          <span>Backup & Ripristino</span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export/Import */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Backup Manuale</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Stato Attuale</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Sezioni:</span>
                  <span className="font-semibold ml-2">{sections.length}</span>
                </div>
                <div>
                  <span className="text-blue-600">Regole:</span>
                  <span className="font-semibold ml-2">
                    {sections.reduce((total, section) => total + section.rules.length, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={exportData}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00F4FF] to-[#FF7A00] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{loading ? 'Esportando...' : 'Esporta Backup'}</span>
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#00F4FF] hover:text-[#00F4FF] transition-all disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importa Backup</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Impostazioni Backup</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Backup Automatico</h4>
                <p className="text-sm text-gray-600">Backup giornaliero automatico</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00F4FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F4FF]"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequenza Backup
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent">
                <option value="daily">Giornaliero</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conserva Backup
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent">
                <option value="7">7 giorni</option>
                <option value="30">30 giorni</option>
                <option value="90">90 giorni</option>
                <option value="365">1 anno</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Cronologia Backup</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {backupHistory.map((backup) => (
            <div key={backup.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    backup.type === 'manual' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-800">
                        Backup {backup.type === 'manual' ? 'Manuale' : 'Automatico'}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        backup.type === 'manual' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {backup.type === 'manual' ? 'Manuale' : 'Auto'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(backup.date).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{backup.size}</span>
                      <span>•</span>
                      <span>{backup.sections} sezioni, {backup.rules} regole</span>
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 text-[#00F4FF] hover:bg-[#00F4FF]/10 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Scarica</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackupManager;