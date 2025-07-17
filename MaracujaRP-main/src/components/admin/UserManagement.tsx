import React, { useState } from 'react';
import { UserCheck, UserX, Shield, Crown, Eye, Search, Filter, Plus, Mail, Calendar, Activity } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'member' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: Date;
  lastActive: Date;
  warnings: number;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'TropicalAdmin',
      email: 'admin@maracuja.rp',
      role: 'super_admin',
      status: 'active',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date(),
      warnings: 0
    },
    {
      id: '2',
      username: 'PalmTreeMod',
      email: 'mod@maracuja.rp',
      role: 'moderator',
      status: 'active',
      joinDate: new Date('2024-02-20'),
      lastActive: new Date(Date.now() - 3600000),
      warnings: 0
    },
    {
      id: '3',
      username: 'BeachPlayer',
      email: 'player@example.com',
      role: 'member',
      status: 'active',
      joinDate: new Date('2024-03-10'),
      lastActive: new Date(Date.now() - 86400000),
      warnings: 1
    },
    {
      id: '4',
      username: 'SuspendedUser',
      email: 'suspended@example.com',
      role: 'member',
      status: 'suspended',
      joinDate: new Date('2024-01-05'),
      lastActive: new Date(Date.now() - 604800000),
      warnings: 3
    }
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-red-300" />;
      case 'admin': return <Shield className="h-4 w-4 text-orange-300" />;
      case 'moderator': return <UserCheck className="h-4 w-4 text-blue-300" />;
      default: return <UserCheck className="h-4 w-4 text-teal-300" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { label: 'Super Admin', color: 'from-red-500 to-pink-500' },
      admin: { label: 'Admin', color: 'from-orange-500 to-amber-500' },
      moderator: { label: 'Moderator', color: 'from-blue-500 to-cyan-500' },
      member: { label: 'Membro', color: 'from-teal-500 to-emerald-500' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.member;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-white`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Attivo', color: 'bg-green-500/20 text-green-300 border-green-400/30' },
      suspended: { label: 'Sospeso', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' },
      banned: { label: 'Bannato', color: 'bg-red-500/20 text-red-300 border-red-400/30' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestione Utenti</h2>
          <p className="text-teal-200">Amministra i membri della comunità tropicale</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg">
          <Plus className="h-5 w-5" />
          <span>Invita Utente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-sm font-medium">Utenti Totali</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-teal-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-green-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Utenti Attivi</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-800/50 to-amber-800/50 backdrop-blur-sm rounded-xl border border-orange-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Staff</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => ['admin', 'super_admin', 'moderator'].includes(u.role)).length}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-800/50 to-pink-800/50 backdrop-blur-sm rounded-xl border border-red-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-medium">Sospesi/Bannati</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => ['suspended', 'banned'].includes(u.status)).length}</p>
            </div>
            <UserX className="h-8 w-8 text-red-300" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-300" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Cerca utenti..."
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Tutti i ruoli</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="member">Membri</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Tutti gli stati</option>
              <option value="active">Attivi</option>
              <option value="suspended">Sospesi</option>
              <option value="banned">Bannati</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-teal-700/50 border-b border-teal-400/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Utente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Ruolo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Registrato</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Ultimo Accesso</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Warning</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-200 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-400/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-teal-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-sm text-teal-300">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                    {user.joinDate.toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-200">
                    {user.lastActive.toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.warnings === 0 ? 'bg-green-500/20 text-green-300' :
                      user.warnings <= 2 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {user.warnings}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-teal-300 hover:text-blue-300 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-teal-300 hover:text-orange-300 transition-colors">
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="text-teal-300 hover:text-red-300 transition-colors">
                        <UserX className="h-4 w-4" />
                      </button>
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

export default UserManagement;