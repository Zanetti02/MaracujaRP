import React from 'react';
import { RuleSection } from '../types';
import RuleCard from './RuleCard';
import { Search, Palmtree, Waves } from 'lucide-react';

interface MainContentProps {
  sections: RuleSection[];
  activeSection: string;
  searchTerm: string;
}

const MainContent: React.FC<MainContentProps> = ({ sections, activeSection, searchTerm }) => {
  const currentSection = sections.find(section => section.id === activeSection);

  if (searchTerm && sections.every(section => section.rules.length === 0)) {
    return (
      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16 bg-gradient-to-br from-teal-800/30 to-emerald-800/30 backdrop-blur-sm rounded-3xl border border-teal-400/30 shadow-xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <Waves className="h-20 w-20 text-teal-300/20 animate-pulse" />
              </div>
              <Search className="h-16 w-16 text-orange-300 mx-auto relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-orange-200 mb-3">
              Nessun risultato trovato
            </h3>
            <p className="text-teal-200 text-lg mb-6">
              Prova a modificare la tua ricerca.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (searchTerm) {
    return (
      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30">
            <h2 className="text-3xl font-bold text-white mb-3">
              🔍 Risultati per "{searchTerm}"
            </h2>
            <p className="text-teal-200 text-lg">
              {sections.reduce((total, section) => total + section.rules.length, 0)} regole tropicali trovate
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              section.rules.length > 0 && (
                <div key={section.id} className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-orange-400/30">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Palmtree className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-orange-200">
                      {section.title}
                    </h3>
                    <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30">
                      <span className="text-orange-200 text-sm font-medium">
                        {section.rules.length} regole
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    {section.rules.map((rule) => (
                      <RuleCard key={rule.id} rule={rule} searchTerm={searchTerm} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!currentSection) {
    return (
      <main className="flex-1 md:ml-64 p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-orange-200">
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
        <div className="mb-10 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm rounded-3xl p-8 border border-orange-400/30 shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Palmtree className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-white mb-2 text-center">
                {currentSection.title}
              </h2>
              <div className="flex items-center space-x-3">
                <p className="text-teal-200 text-lg">
                  {currentSection.rules.length} regole tropicali
                </p>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-300 text-sm">Aggiornato</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {currentSection.rules.map((rule, index) => (
            <RuleCard 
              key={rule.id} 
              rule={rule} 
              index={index + 1}
              searchTerm={searchTerm}
            />
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl border border-orange-400/40 backdrop-blur-sm shadow-xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Palmtree className="h-8 w-8 text-orange-300" />
              <h3 className="text-2xl font-bold text-orange-200">
                Hai domande su queste regole?
              </h3>
              <Palmtree className="h-8 w-8 text-orange-300" />
            </div>
            <p className="text-teal-200 text-lg mb-6">
              Se hai dubbi o necessiti di chiarimenti sul regolamento tropicale, il nostro team è sempre pronto ad aiutarti! 🌺
            </p>
          </div>
          <div className="flex justify-center">
            <a 
              href="https://discord.com/channels/1258732999214632982/1333937942141337721"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm border border-indigo-400/50 rounded-2xl px-8 py-4 hover:from-indigo-500/40 hover:to-purple-500/40 transition-all cursor-pointer shadow-lg hover:shadow-xl"
            >
              <span className="text-indigo-200 font-medium text-lg">💬 Discord Supporto</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;