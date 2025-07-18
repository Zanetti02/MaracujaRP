import React, { useState } from 'react';
import { User, Shield, Key, Save, AlertCircle } from 'lucide-react';
import { AdminUser } from '../../types';

interface AccountManagementProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ currentAdmin, onLogout }) => {
  const [formData, setFormData] = useState({
    username: currentAdmin.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate passwords
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Le password non coincidono');
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        throw new Error('La password deve essere di almeno 8 caratteri');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Profilo aggiornato con successo!' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Errore durante l\'aggiornamento' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestione Account</h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <Shield className="w-5 h-5" />
          <span className="capitalize">{currentAdmin.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#00F4FF] to-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{currentAdmin.username}</h3>
              <p className="text-gray-600 capitalize">{currentAdmin.role}</p>
              <p className="text-sm text-gray-500 mt-2">
                Ultimo accesso: {new Date(currentAdmin.lastLogin || '').toLocaleDateString('it-IT')}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stato Account</span>
                  <span className="text-green-600 font-medium">Attivo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Permessi</span>
                  <span className="text-blue-600 font-medium">Completi</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sessione</span>
                  <span className="text-gray-600">Sicura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Impostazioni Account</h3>

            {message && (
              <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <AlertCircle className="w-5 h-5" />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent"
                  required
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Cambia Password</span>
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Attuale
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuova Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent"
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conferma Nuova Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F4FF] focus:border-transparent"
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00F4FF] to-[#FF7A00] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Salvando...' : 'Salva Modifiche'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;