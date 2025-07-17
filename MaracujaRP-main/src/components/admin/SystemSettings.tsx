import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Shield, Bell, Palette, Globe, Database, Lock } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Maracuja Roleplay',
    siteDescription: 'Regolamento Ufficiale della Comunità Tropicale',
    maintenanceMode: false,
    registrationOpen: true,
    emailNotifications: true,
    discordIntegration: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maxWarnings: 3,
    sessionTimeout: 30,
    theme: 'tropical',
    language: 'it'
  });

  const handleSave = () => {
    // Simulate save
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      siteName: 'Maracuja Roleplay',
      siteDescription: 'Regolamento Ufficiale della Comunità Tropicale',
      maintenanceMode: false,
      registrationOpen: true,
      emailNotifications: true,
      discordIntegration: true,
      autoBackup: true,
      backupFrequency: 'daily',
      maxWarnings: 3,
      sessionTimeout: 30,
      theme: 'tropical',
      language: 'it'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Impostazioni Sistema</h2>
          <p className="text-teal-200">Configura le impostazioni della piattaforma</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-700/50 text-teal-200 rounded-lg hover:bg-teal-600/50 transition-colors border border-teal-400/30"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
          >
            <Save className="h-5 w-5" />
            <span>Salva Modifiche</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Impostazioni Generali</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Nome Sito</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Descrizione</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Lingua</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Tema</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="tropical">Tropicale</option>
                <option value="ocean">Oceano</option>
                <option value="sunset">Tramonto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Sicurezza</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Timeout Sessione (minuti)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Massimo Warning</label>
              <input
                type="number"
                value={settings.maxWarnings}
                onChange={(e) => setSettings({...settings, maxWarnings: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-teal-200">Modalità Manutenzione</span>
              <button
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-orange-500' : 'bg-teal-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-teal-200">Registrazioni Aperte</span>
              <button
                onClick={() => setSettings({...settings, registrationOpen: !settings.registrationOpen})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.registrationOpen ? 'bg-green-500' : 'bg-teal-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.registrationOpen ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Notifiche</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-teal-200">Notifiche Email</span>
              <button
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-green-500' : 'bg-teal-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-teal-200">Integrazione Discord</span>
              <button
                onClick={() => setSettings({...settings, discordIntegration: !settings.discordIntegration})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.discordIntegration ? 'bg-green-500' : 'bg-teal-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.discordIntegration ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-gradient-to-r from-teal-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-teal-400/30 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Backup</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-teal-200">Backup Automatico</span>
              <button
                onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoBackup ? 'bg-green-500' : 'bg-teal-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-200 mb-2">Frequenza Backup</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                className="w-full px-3 py-2 bg-teal-700/50 border border-teal-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={!settings.autoBackup}
              >
                <option value="hourly">Ogni ora</option>
                <option value="daily">Giornaliero</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;