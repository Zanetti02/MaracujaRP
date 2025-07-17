import React, { useState } from 'react';
import { User, Lock, Save, Eye, EyeOff, Shield, Key } from 'lucide-react';
import { AdminUser } from '../../types';

interface AccountManagementProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ currentAdmin, onLogout }) => {
  const [username, setUsername] = useState(currentAdmin.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveChanges = async () => {
    setMessage(null);
    setIsLoading(true);

    // Validazione
    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Il nome utente è obbligatorio' });
      setIsLoading(false);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non coincidono' });
      setIsLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      setIsLoading(false);
      return;
    }

    // Simulazione salvataggio
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In un'app reale, qui faresti la chiamata API per aggiornare i dati
    console.log('Aggiornamento account:', {
      username: username.trim(),
      passwordChanged: !!newPassword
    });

    setMessage({ type: 'success', text: 'Account aggiornato con successo!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Gestione Account</h2>
        <p className="text-teal-200">Modifica le credenziali del tuo account amministratore</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">
              {currentAdmin.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{currentAdmin.username}</h3>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-300" />
              <span className="text-red-300 font-medium">Developer Access</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-teal-700/30 rounded-lg p-4 border border-teal-400/20">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-teal-300" />
              <span className="text-teal-200 text-sm font-medium">Ruolo</span>
            </div>
            <span className="text-white font-semibold">Super Administrator</span>
          </div>

          <div className="bg-teal-700/30 rounded-lg p-4 border border-teal-400/20">
            <div className="flex items-center space-x-2 mb-2">
              <Key className="h-4 w-4 text-teal-300" />
              <span className="text-teal-200 text-sm font-medium">Ultimo Accesso</span>
            </div>
            <span className="text-white font-semibold">
              {currentAdmin.lastLogin.toLocaleDateString('it-IT')} alle {currentAdmin.lastLogin.toLocaleTimeString('it-IT')}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Modifica Credenziali</h3>
        </div>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-teal-200 mb-2">
              Nome Utente
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Inserisci nuovo nome utente"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-teal-200 mb-2">
              Password Attuale (per confermare le modifiche)
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Inserisci password attuale"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-teal-200 mb-2">
              Nuova Password (lascia vuoto per non modificare)
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Inserisci nuova password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-white"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {newPassword && (
            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">
                Conferma Nuova Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Conferma nuova password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                : 'bg-red-500/20 border-red-400/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salva Modifiche</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-orange-800/30 to-red-800/30 backdrop-blur-sm rounded-xl border border-orange-400/30 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-orange-300" />
          <h3 className="text-lg font-bold text-orange-200">Avviso di Sicurezza</h3>
        </div>
        <div className="space-y-2 text-orange-200">
          <p>• Mantieni sempre le tue credenziali al sicuro</p>
          <p>• Usa una password forte e unica</p>
          <p>• Non condividere mai le credenziali di amministratore</p>
          <p>• Effettua logout quando non utilizzi il sistema</p>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;