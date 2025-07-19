import React from 'react';
import { Search, Waves, Palmtree } from 'lucide-react';
import { RuleSection } from '../types';
import RuleCard from './RuleCard';

interface MainContentProps {
  sections: RuleSection[];
  activeSection: string;
  searchTerm: string;
}

const MainContent: React.FC<MainContentProps> = ({ sections, activeSection, searchTerm }) => {
  // If no active section is set, use the first section
  const currentActiveSection = activeSection || (sections.length > 0 ? sections[0].id : '');
  
  // Se c'è un termine di ricerca, mostra i risultati filtrati
  if (searchTerm) {
    const filteredSections = sections.map(section => ({
      ...section,
      rules: section.rules.filter(rule =>
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.rules.length > 0);

    if (filteredSections.length === 0) {
      return (
        <main className="flex-1 md:ml-64 p-6 pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16 bg-gradient-to-br from-custom-cyan-800/30 to-custom-cyan-700/30 backdrop-blur-sm rounded-3xl border border-custom-cyan-400/30 shadow-xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Waves className="h-20 w-20 text-custom-cyan-300/20 animate-pulse" />
                </div>
                <Search className="h-16 w-16 text-custom-orange-300 mx-auto relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-custom-orange-200 mb-3">
                Nessun risultato trovato
              </h3>
              <p className="text-custom-cyan-200 text-lg mb-6">
                Prova a modificare la tua ricerca.
              </p>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-gradient-to-r from-custom-orange-500/20 to-custom-orange-400/20 backdrop-blur-sm rounded-2xl p-6 border border-custom-orange-400/30">
            <h2 className="text-3xl font-bold text-white mb-3">
              🔍 Risultati per "{searchTerm}"
            </h2>
            <p className="text-custom-cyan-200 text-lg">
              {sections.reduce((total, section) => total + section.rules.length, 0)} regole tropicali trovate
            </p>
          </div>

          <div className="space-y-12">
            {filteredSections.map((section) => 
              section.rules.length > 0 && (
                <div key={section.id} className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-custom-orange-400/30">
                    <div className="w-8 h-8 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg">
                      <Palmtree className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-custom-orange-200">
                      {section.title}
                    </h3>
                    <div className="bg-custom-orange-500/20 px-3 py-1 rounded-full border border-custom-orange-400/30">
                      <span className="text-custom-orange-200 text-sm font-medium">
                        {section.rules.length} regole
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {section.rules.map((rule, index) => (
                      <RuleCard 
                        key={rule.id} 
                        rule={rule} 
                        index={index + 1}
                        searchTerm={searchTerm}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  // Trova la sezione attiva
  const currentSection = sections.find(section => section.id === currentActiveSection);

  if (!currentSection) {
    return (
      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-custom-orange-200">
              Sezione non trovata
            </h3>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 md:ml-64 p-6 pt-24 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10 bg-gradient-to-r from-custom-orange-500/20 to-custom-orange-400/20 backdrop-blur-sm rounded-3xl p-8 border border-custom-orange-400/30 shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Palmtree className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentSection.title}
              </h2>
              <div className="flex items-center space-x-3">
                <p className="text-custom-cyan-200 text-lg">
                  {currentSection.rules.length} regole tropicali
                </p>
                <div className="w-2 h-2 bg-custom-orange-400 rounded-full animate-pulse"></div>
                <span className="text-custom-orange-300 text-sm">Aggiornato</span>
              </div>
            </div>
          </div>
          
          {currentSection.description && (
            <p className="text-custom-cyan-100 text-lg leading-relaxed">
              {currentSection.description}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {currentSection.rules.map((rule, index) => (
            <RuleCard 
              key={rule.id} 
              rule={rule} 
              index={index + 1}
            />
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-custom-orange-500/20 via-custom-orange-400/20 to-custom-orange-300/20 rounded-3xl border border-custom-orange-400/40 backdrop-blur-sm shadow-xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Palmtree className="h-8 w-8 text-custom-orange-300" />
              <h3 className="text-2xl font-bold text-custom-orange-200">
                Hai domande su queste regole?
              </h3>
              <Palmtree className="h-8 w-8 text-custom-orange-300" />
            </div>
            <p className="text-custom-cyan-200 text-lg mb-6">
              Se hai dubbi o necessiti di chiarimenti sul regolamento tropicale, il nostro team è sempre pronto ad aiutarti! 🌺
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;