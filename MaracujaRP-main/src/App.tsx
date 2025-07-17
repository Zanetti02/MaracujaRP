import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/admin/LoginModal';
import { RuleSection, AdminUser } from './types';
import { rulesAPI } from './lib/api';

function App() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [sections, setSections] = useState<RuleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setError(null);
      const data = await rulesAPI.getSections();
      setSections(data);
      
      if (data.length > 0 && !activeSection) {
        setActiveSection(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Errore nel caricamento delle sezioni. Verifica la connessione a Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sections.map(section => ({
    ...section,
    rules: section.rules.filter(rule =>
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.rules.length > 0 || searchTerm === '');

  const handleLogin = (username: string, password: string): boolean => {
    // Login con credenziali Developer nascoste
    if (username === 'Developer' && password === 'Developer123') {
      const admin: AdminUser = {
        id: '1',
        username: 'Developer',
        role: 'super_admin',
        lastLogin: new Date()
      };
      setCurrentAdmin(admin);
      setIsAdminMode(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setIsAdminMode(false);
    setActiveSection(sections.length > 0 ? sections[0].id : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento paradiso tropicale...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-red-300 mb-2">Errore di Connessione</h2>
            <p className="text-red-200">{error}</p>
          </div>
          <button
            onClick={fetchSections}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (isAdminMode && currentAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
        <AdminDashboard 
          sections={sections}
          setSections={setSections}
          currentAdmin={currentAdmin}
          onLogout={handleLogout}
          onRefresh={fetchSections}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSidebarOpen={setSidebarOpen}
        onAdminClick={() => setShowLoginModal(true)}
      />
      
      <div className="flex">
        <Sidebar 
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <MainContent 
          sections={filteredSections}
          activeSection={activeSection}
          searchTerm={searchTerm}
        />
      </div>
      
      <Footer />

      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}

export default App;