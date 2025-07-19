import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import { RuleSection, AdminUser } from './types';
import { sectionsAPI } from './lib/api';

function App() {
  const [sections, setSections] = useState<RuleSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sectionsData = await sectionsAPI.getSections();
      
      setSections(sectionsData);
      
      // Set first section as active if none selected
      if (sectionsData.length > 0 && !activeSection) {
        setActiveSection(sectionsData[0].id);
      }
    } catch (err) {
      console.error('Errore nel caricamento dei dati:', err);
      setError('Impossibile caricare i dati. Verifica la connessione a Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mock admin login function
  const handleAdminClick = () => {
    // Simple mock authentication
    const mockAdmin: AdminUser = {
      id: 'admin-1',
      username: 'Developer',
      role: 'admin',
      lastLogin: new Date()
    };
    setCurrentAdmin(mockAdmin);
    setIsAdminMode(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-custom-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento paradiso tropicale...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-custom-gradient flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-red-300 mb-2">Errore di Connessione</h2>
            <p className="text-red-200">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-orange-gradient text-white rounded-xl hover:bg-orange-gradient-reverse transition-all shadow-lg"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (isAdminMode && currentAdmin) {
    return (
      <AdminDashboard 
        sections={sections}
        setSections={setSections}
        currentAdmin={currentAdmin}
        onLogout={() => {
          setIsAdminMode(false);
          setCurrentAdmin(null);
        }}
        onRefresh={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-custom-gradient text-white">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSidebarOpen={setIsSidebarOpen}
        onAdminClick={handleAdminClick}
      />
      
      <div className="flex">
        <Sidebar 
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <MainContent 
          sections={sections}
          activeSection={activeSection}
          searchTerm={searchTerm}
        />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;