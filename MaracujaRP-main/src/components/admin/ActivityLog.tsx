import React, { useState } from 'react';
import { Activity, Filter, Download, Eye, User, FileText, Settings, Shield, Calendar, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  target: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'admin' | 'system';
  ip?: string;
}

const ActivityLog: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('7');

  // Mock data
  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      user: 'TropicalAdmin',
      action: 'Creata nuova regola',
      target: 'Regolamento Generale',
      details: 'Aggiunta regola "Rispetto reciproco"',
      type: 'create',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      user: 'PalmTreeMod',
      action: 'Modificata regola',
      target: 'Comportamento',
      details: 'Aggiornato contenuto regola "Fair Play"',
      type: 'update',
      ip: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      user: 'BeachPlayer',
      action: 'Login effettuato',
      target: 'Sistema',
      details: 'Accesso al sito web',
      type: 'login',
      ip: '192.168.1.102'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 86400000),
      user: 'Sistema',
      action: 'Backup automatico',
      target: 'Database',
      details: 'Backup giornaliero completato con successo',
      type: 'system'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 172800000),
      user: 'TropicalAdmin',
      action: 'Eliminata regola',
      target: 'Sanzioni',
      details: 'Rimossa regola obsoleta',
      type: 'delete',
      ip: '192.168.1.100'
    }
  ]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return <FileText className="h-4 w-4 text-green-300" />;
      case 'update': return <Settings className="h-4 w-4 text-blue-300" />;
      case 'delete': return <Shield className="h-4 w-4 text-red-300" />;
      case 'login': return <User className="h-4 w-4 text-teal-300" />;
      case 'admin': return <Shield className="h-4 w-4 text-orange-300" />;
      case 'system': return <Activity className="h-4 w-4 text-purple-300" />;
      default: return <Activity className="h-4 w-4 text-teal-300" />;
    }
  };

  const getActionBadge = (type: string) => {
    const typeConfig = {
      create: { label: 'Creazione', color: 'bg-green-500/20 text-green-300 border-green-400/30' },
      update: { label: 'Modifica', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
      delete: { label: 'Eliminazione', color: 'bg-red-500/20 text-red-300 border-red-400/30' },
      login: { label: 'Login', color: 'bg-teal-500/20 text-teal-300 border-teal-400/30' },
      admin: { label: 'Admin', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30' },
      system: { label: 'Sistema', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.system;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesUser = filterUser === '' || log.user.toLowerCase().includes(filterUser.toLowerCase());
    const matchesDate = dateRange === 'all' || 
      (Date.now() - log.timestamp.getTime()) <= (parseInt(dateRange) * 24 * 60 * 60 * 1000);
    
    return matchesType && matchesUser && matchesDate;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Target', 'Details', 'Type', 'IP'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.user,
        log.action,
        log.target,
        log.details,
        log.type,
        log.ip || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Log Attività</h2>
          <p className="text-teal-200">Cronologia delle azioni del sistema</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
        >
          <Download className="h-5 w-5" />
          <span>Esporta Log</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {['create', 'update', 'delete', 'login', 'admin', 'system'].map((type) => (
          <div key={type} className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-xs font-medium uppercase">{type}</p>
                <p className="text-xl font-bold text-white">
                  {logs.filter(log => log.type === type).length}
                </p>
              </div>
              {getActionIcon(type)}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Filtra per utente..."
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">Tutti i tipi</option>
            <option value="create">Creazioni</option>
            <option value="update">Modifiche</option>
            <option value="delete">Eliminazioni</option>
            <option value="login">Login</option>
            <option value="admin">Admin</option>
            <option value="system">Sistema</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="1">Ultimo giorno</option>
            <option value="7">Ultima settimana</option>
            <option value="30">Ultimo mese</option>
            <option value="90">Ultimi 3 mesi</option>
            <option value="all">Tutto</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-700/50 border-b border-teal-400/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Utente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Azione</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">IP</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Dettagli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-400/20">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-teal-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-teal-300" />
                      <div>
                        <div className="text-sm text-white">
                          {log.timestamp.toLocaleDateString('it-IT')}
                        </div>
                        <div className="text-xs text-teal-300">
                          {log.timestamp.toLocaleTimeString('it-IT')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {log.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-white">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.type)}
                      <span className="text-sm text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                    {log.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActionBadge(log.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-300 font-mono">
                    {log.ip || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-teal-200 max-w-xs truncate">
                    {log.details}
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

export default ActivityLog;