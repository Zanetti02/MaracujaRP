import React, { useState, useEffect } from 'react';
import { Activity, Calendar, User, Filter, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface ActivityLogEntry {
  id: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: any;
  created_at: string;
  user_id?: string;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getActivityLogs(100);
      setLogs(data);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      // Fallback to mock data
      setLogs([
        {
          id: '1',
          action: 'Creata sezione',
          target_type: 'section',
          target_id: '1',
          details: { title: 'Regole Generali' },
          created_at: new Date().toISOString(),
          user_id: 'admin'
        },
        {
          id: '2',
          action: 'Modificata regola',
          target_type: 'rule',
          target_id: '2',
          details: { title: 'Rispetto reciproco' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          user_id: 'admin'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Creata') || action.includes('Aggiunta')) return '➕';
    if (action.includes('Modificata') || action.includes('Aggiornata')) return '✏️';
    if (action.includes('Eliminata') || action.includes('Rimossa')) return '🗑️';
    if (action.includes('Spostata') || action.includes('Riordinata')) return '🔄';
    return '📝';
  };

  const getActionColor = (action: string) => {
    if (action.includes('Creata') || action.includes('Aggiunta')) return 'text-green-600 bg-green-50';
    if (action.includes('Modificata') || action.includes('Aggiornata')) return 'text-blue-600 bg-blue-50';
    if (action.includes('Eliminata') || action.includes('Rimossa')) return 'text-red-600 bg-red-50';
    if (action.includes('Spostata') || action.includes('Riordinata')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'sections') return log.target_type === 'section';
    if (filter === 'rules') return log.target_type === 'rule';
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Log Attività</h2>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Log Attività</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent"
            >
              <option value="all">Tutte le attività</option>
              <option value="sections">Solo sezioni</option>
              <option value="rules">Solo regole</option>
            </select>
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Aggiorna</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Attività Recenti ({filteredLogs.length})
            </h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nessuna attività trovata</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(log.created_at).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">
                        Tipo: <span className="font-medium capitalize">{log.target_type}</span>
                        {log.details?.title && (
                          <span> - "{log.details.title}"</span>
                        )}
                      </p>
                      
                      {log.details && Object.keys(log.details).length > 1 && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>Utente: {log.user_id || 'Sistema'}</span>
                      {log.target_id && (
                        <>
                          <span>•</span>
                          <span>ID: {log.target_id}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;