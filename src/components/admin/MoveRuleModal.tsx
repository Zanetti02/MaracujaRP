import React, { useState } from 'react';
import { X, ArrowRight, Shield, Users, Heart, AlertTriangle } from 'lucide-react';
import { Rule, RuleSection } from '../../types';

interface MoveRuleModalProps {
  rule: Rule;
  currentSectionId: string;
  sections: RuleSection[];
  onMove: (toSectionId: string) => void;
  onClose: () => void;
}

const iconMap = {
  Shield,
  Users,
  Heart,
  AlertTriangle,
};

const MoveRuleModal: React.FC<MoveRuleModalProps> = ({
  rule,
  currentSectionId,
  sections,
  onMove,
  onClose
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const currentSection = sections.find(s => s.id === currentSectionId);
  const availableSections = sections.filter(s => s.id !== currentSectionId);

  const handleMove = () => {
    if (selectedSectionId) {
      onMove(selectedSectionId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-custom-cyan-800/90 to-custom-cyan-700/90 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-custom-cyan-400/30">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg border border-green-400/30">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Sposta Regola</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-custom-cyan-200 hover:text-white hover:bg-custom-cyan-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Rule Info */}
          <div className="bg-custom-cyan-700/30 rounded-lg p-4 border border-custom-cyan-400/20">
            <h3 className="text-custom-orange-200 font-medium mb-2">Regola da spostare:</h3>
            <p className="text-white font-semibold">"{rule.title}"</p>
            {currentSection && (
              <p className="text-custom-cyan-200 text-sm mt-1">
                Attualmente in: {currentSection.title}
              </p>
            )}
          </div>

          {/* Section Selection */}
          <div>
            <h3 className="text-custom-cyan-200 font-medium mb-4">Seleziona sezione di destinazione:</h3>
            
            {availableSections.length === 0 ? (
              <div className="text-center py-8 bg-custom-cyan-700/20 rounded-lg border border-custom-cyan-400/20">
                <p className="text-custom-cyan-300">Non ci sono altre sezioni disponibili</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableSections.map((section) => {
                  const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Shield;
                  const isSelected = selectedSectionId === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-custom-orange-400 bg-custom-orange-500/20'
                          : 'border-custom-cyan-400/30 bg-custom-cyan-700/30 hover:border-custom-cyan-300/50 hover:bg-custom-cyan-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-orange-gradient' : 'bg-custom-cyan-600/50'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            isSelected ? 'text-white' : 'text-custom-cyan-200'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            isSelected ? 'text-white' : 'text-custom-cyan-100'
                          }`}>
                            {section.title}
                          </h4>
                          {section.description && (
                            <p className={`text-sm ${
                              isSelected ? 'text-custom-orange-200' : 'text-custom-cyan-300'
                            }`}>
                              {section.description}
                            </p>
                          )}
                          <p className={`text-xs ${
                            isSelected ? 'text-custom-orange-200' : 'text-custom-cyan-300'
                          }`}>
                            {section.rules.length} regole
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-custom-cyan-700/50 text-custom-cyan-200 rounded-lg hover:bg-custom-cyan-600/50 transition-colors border border-custom-cyan-400/30"
            >
              Annulla
            </button>
            <button
              onClick={handleMove}
              disabled={!selectedSectionId}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Sposta Regola</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveRuleModal;