import React, { useState } from 'react';
import { Database, Download, Upload, RefreshCw, Calendar, HardDrive, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { RuleSection } from '../../types';

interface BackupManagerProps {
  sections: RuleSection[];
}

interface Backup {
  id: string;
  name: string;
  date: Date;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
  description: string;
}

const BackupManager: React.FC<BackupManagerProps> = ({ sections }) => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupName, setBackupName] = useState('');

  // Mock backup data
  const [backups] = useState<Backup[]>([
    {
      id: '1',
      name: 'Backup Automatico Giornaliero',
      date: new Date(),
      size: '2.4 MB',
      type: 'auto',
      status: 'completed',
      description: 'Backup automatico delle regole e configurazioni'
    },
    {
      id: '2',
      name: 'Backup Pre-Aggiornamento',
      date: new Date(Date.now() - 86400000),
      size: '2.3 MB',
      type: 'manual',
      status: 'completed',
      description: 'Backup manuale prima dell\'aggiornamento delle regole'
    },
    {
      id: '3',
      name: 'Backup Settimanale',
      date: new Date(Date.now() - 604800000),
      size: '2.1 MB',
      type: 'auto',
      status: 'completed',
      description: 'Backup automatico settimanale completo'
    },
    {
      id: '4',
      name: 'Backup Emergenza',
      date: new Date(Date.now() - 1209600000),
      size: '1.9 MB',
      type: 'manual',
      status: 'failed',
      description: 'Backup di emergenza - fallito per errore di rete'
    }
  ]);

  const createManualBackup = async () => {
    if (!backupName.trim()) return;
    
    setIsCreatingBackup(true);
    
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would create an actual backup
    const backupData = {
      timestamp: new Date().toISOString(),
      sections: sections,
      metadata: {
        name: backupName,
        type: 'manual',
        totalRules: sections.reduce((total, section) => total + section.rules.length, 0)
      }
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maracuja-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setIsCreatingBackup(false);
    setBackupName('');
  };

  const downloadBackup = (backup: Backup) => {
    // Simulate download
    console.log('Downloading backup:', backup.name);
  };

  const restoreBackup = (backup: Backup) => {
    if (confirm(`Sei sicuro di voler ripristinare il backup "${backup.name}"? Questa azione sovrascriverà i dati attuali.`)) {
      console.log('Restoring backup:', backup.name);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-300" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-300" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-300 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-teal-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completato', color: 'bg-green-500/20 text-green-300 border-green-400/30' },
      failed: { label: 'Fallito', color: 'bg-red-500/20 text-red-300 border-red-400/30' },
      in_progress: { label: 'In Corso', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        type === 'auto' 
          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
          : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
      }`}>
        {type === 'auto' ? 'Automatico' : 'Manuale'}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestione Backup</h2>
          <p className="text-teal-200">Crea e gestisci i backup del sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Backup Totali</p>
              <p className="text-2xl font-bold text-white">{backups.length}</p>
            </div>
            <Database className="h-8 w-8 text-teal-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-green-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Completati</p>
              <p className="text-2xl font-bold text-white">{backups.filter(b => b.status === 'completed').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-800/50 to-cyan-800/50 backdrop-blur-sm rounded-xl border border-blue-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Spazio Utilizzato</p>
              <p className="text-2xl font-bold text-white">9.7 MB</p>
            </div>
            <HardDrive className="h-8 w-8 text-blue-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-800/50 to-amber-800/50 backdrop-blur-sm rounded-xl border border-orange-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Ultimo Backup</p>
              <p className="text-2xl font-bold text-white">Oggi</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-300" />
          </div>
        </div>
      </div>

      {/* Create Manual Backup */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Crea Backup Manuale</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              className="w-full px-4 py-3 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nome del backup (es. Backup pre-aggiornamento)"
              disabled={isCreatingBackup}
            />
          </div>
          <button
            onClick={createManualBackup}
            disabled={!backupName.trim() || isCreatingBackup}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingBackup ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <Database className="h-5 w-5" />
                <span>Crea Backup</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 p-4 bg-teal-700/30 rounded-lg border border-teal-400/20">
          <h4 className="text-orange-200 font-medium mb-2">Contenuto del Backup:</h4>
          <ul className="text-teal-200 text-sm space-y-1">
            <li>• {sections.reduce((total, section) => total + section.rules.length, 0)} regole totali</li>
            <li>• {sections.length} sezioni</li>
            <li>• Configurazioni sistema</li>
            <li>• Metadati e timestamp</li>
          </ul>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 overflow-hidden">
        <div className="p-6 border-b border-teal-400/30">
          <h3 className="text-xl font-bold text-white">Cronologia Backup</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-700/50 border-b border-teal-400/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Dimensione</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-400/20">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-teal-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{backup.name}</div>
                      <div className="text-xs text-teal-300">{backup.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-teal-300" />
                      <div>
                        <div className="text-sm text-white">
                          {backup.date.toLocaleDateString('it-IT')}
                        </div>
                        <div className="text-xs text-teal-300">
                          {backup.date.toLocaleTimeString('it-IT')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(backup.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      {getStatusBadge(backup.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadBackup(backup)}
                        className="text-teal-300 hover:text-blue-300 transition-colors"
                        title="Scarica backup"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {backup.status === 'completed' && (
                        <button
                          onClick={() => restoreBackup(backup)}
                          className="text-teal-300 hover:text-orange-300 transition-colors"
                          title="Ripristina backup"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;