import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import { RuleSection, Rule, AdminUser } from './types';
import { sectionsAPI } from './lib/api';

function App() {
  const [sections, setSections] = useState<RuleSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sectionsData = await sectionsAPI.getSections();
      
      setSections(sectionsData);
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
      <div className="min-h-screen bg-custom-gradient text-white">
        <AdminDashboard 
          sections={sections}
          setSections={setSections}
          currentAdmin={currentAdmin}
          onLogout={() => {
            setIsAdminMode(false);
            setCurrentAdmin(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-gradient text-white">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdminLogin={(admin) => {
          setCurrentAdmin(admin);
          setIsAdminMode(true);
        }}
      />
      
      <div className="flex">
        <Sidebar 
          sections={sections}
          selectedSection={selectedSection}
          onSectionSelect={setSelectedSection}
        />
        
        <MainContent 
          sections={sections}
          selectedSection={selectedSection}
          searchTerm={searchTerm}
        />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;