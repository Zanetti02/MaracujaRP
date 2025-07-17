import React, { useState } from 'react';
import { RuleSection, Rule } from '../../types';
import { Plus, Edit, Trash2, Move, Search, GripVertical, ArrowRight } from 'lucide-react';
import RuleModal from './RuleModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import MoveRuleModal from './MoveRuleModal';

interface RulesManagerProps {
  sections: RuleSection[];
  selectedSection: string;
  onAddRule: (sectionId: string, rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (sectionId: string, ruleId: string, rule: Partial<Rule>) => void;
  onDeleteRule: (sectionId: string, ruleId: string) => void;
  onMoveRule: (fromSectionId: string, toSectionId: string, ruleId: string) => void;
  onReorderRules: (sectionId: string, ruleIds: string[]) => void;
}

const RulesManager: React.FC<RulesManagerProps> = ({
  sections,
  selectedSection,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onMoveRule,
  onReorderRules
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deletingRule, setDeletingRule] = useState<{ sectionId: string; rule: Rule } | null>(null);
  const [movingRule, setMovingRule] = useState<{ sectionId: string; rule: Rule } | null>(null);
  const [draggedRule, setDraggedRule] = useState<string | null>(null);

  const currentSection = sections.find(s => s.id === selectedSection);
  
  const filteredRules = currentSection?.rules.filter(rule =>
    rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddRule = () => {
    setEditingRule(null);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  const handleDeleteRule = (rule: Rule) => {
    setDeletingRule({ sectionId: selectedSection, rule });
    setShowDeleteModal(true);
  };

  const handleMoveRule = (rule: Rule) => {
    setMovingRule({ sectionId: selectedSection, rule });
    setShowMoveModal(true);
  };

  const handleSaveRule = (ruleData: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingRule) {
      onUpdateRule(selectedSection, editingRule.id, ruleData);
    } else {
      onAddRule(selectedSection, ruleData);
    }
    setShowRuleModal(false);
    setEditingRule(null);
  };

  const confirmDelete = () => {
    if (deletingRule) {
      onDeleteRule(deletingRule.sectionId, deletingRule.rule.id);
      setShowDeleteModal(false);
      setDeletingRule(null);
    }
  };

  const confirmMove = (toSectionId: string) => {
    if (movingRule) {
      onMoveRule(movingRule.sectionId, toSectionId, movingRule.rule.id);
      setShowMoveModal(false);
      setMovingRule(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, ruleId: string) => {
    setDraggedRule(ruleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetRuleId: string) => {
    e.preventDefault();
    
    if (!draggedRule || draggedRule === targetRuleId || !currentSection) {
      setDraggedRule(null);
      return;
    }

    const currentOrder = currentSection.rules.map(r => r.id);
    const draggedIndex = currentOrder.indexOf(draggedRule);
    const targetIndex = currentOrder.indexOf(targetRuleId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new order
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedRule);

    onReorderRules(selectedSection, newOrder);
    setDraggedRule(null);
  };

  if (!currentSection) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-custom-cyan-200">Sezione non trovata</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{currentSection.title}</h2>
          <p className="text-custom-cyan-200">{currentSection.rules.length} regole in questa sezione</p>
        </div>
        <button
          onClick={handleAddRule}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-gradient text-white rounded-lg hover:bg-orange-gradient-reverse transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Aggiungi Regola</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-custom-cyan-300" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-custom-cyan-400/30 rounded-lg bg-custom-cyan-800/50 text-white placeholder-custom-cyan-300 focus:outline-none focus:ring-2 focus:ring-custom-orange-400 focus:border-transparent"
          placeholder="Cerca regole..."
        />
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-custom-cyan-800/50 to-custom-cyan-700/50 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30">
            <h3 className="text-lg font-semibold text-custom-cyan-200 mb-2">
              {searchTerm ? 'Nessuna regola trovata' : 'Nessuna regola in questa sezione'}
            </h3>
            <p className="text-custom-cyan-300 mb-4">
              {searchTerm ? 'Prova a modificare i termini di ricerca' : 'Inizia aggiungendo la prima regola'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddRule}
                className="px-4 py-2 bg-orange-gradient text-white rounded-lg hover:bg-orange-gradient-reverse transition-all shadow-lg"
              >
                Aggiungi Prima Regola
              </button>
            )}
          </div>
        ) : (
          filteredRules.map((rule, index) => (
            <div
              key={rule.id}
              draggable
              onDragStart={(e) => handleDragStart(e, rule.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rule.id)}
              className={`bg-gradient-to-r from-custom-cyan-800/50 to-custom-cyan-700/50 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 p-6 hover:border-custom-orange-400/50 transition-all cursor-move ${
                draggedRule === rule.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-custom-cyan-300 mt-1" />
                    <div className="w-8 h-8 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3">{rule.title}</h3>
                    <div 
                      className="text-custom-cyan-100 leading-relaxed prose prose-invert prose-sm max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: rule.content }}
                    />
                    
                    {(rule.createdAt || rule.updatedAt) && (
                      <div className="flex items-center space-x-4 text-xs text-custom-cyan-300">
                        {rule.createdAt && (
                          <span>Creata: {new Date(rule.createdAt).toLocaleDateString('it-IT')}</span>
                        )}
                        {rule.updatedAt && rule.updatedAt !== rule.createdAt && (
                          <span>Modificata: {new Date(rule.updatedAt).toLocaleDateString('it-IT')}</span>
                        )}
                        {rule.createdBy && (
                          <span>da {rule.createdBy}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 text-custom-cyan-300 hover:text-blue-300 hover:bg-custom-cyan-700/50 rounded-lg transition-colors"
                    title="Modifica regola"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleMoveRule(rule)}
                    className="p-2 text-custom-cyan-300 hover:text-green-300 hover:bg-custom-cyan-700/50 rounded-lg transition-colors"
                    title="Sposta regola"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteRule(rule)}
                    className="p-2 text-custom-cyan-300 hover:text-red-300 hover:bg-custom-cyan-700/50 rounded-lg transition-colors"
                    title="Elimina regola"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showRuleModal && (
        <RuleModal
          rule={editingRule}
          sections={sections}
          defaultSectionId={selectedSection}
          onSave={handleSaveRule}
          onClose={() => {
            setShowRuleModal(false);
            setEditingRule(null);
          }}
        />
      )}

      {showDeleteModal && deletingRule && (
        <DeleteConfirmModal
          title={deletingRule.rule.title}
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingRule(null);
          }}
        />
      )}

      {showMoveModal && movingRule && (
        <MoveRuleModal
          rule={movingRule.rule}
          currentSectionId={movingRule.sectionId}
          sections={sections}
          onMove={confirmMove}
          onClose={() => {
            setShowMoveModal(false);
            setMovingRule(null);
          }}
        />
      )}
    </div>
  );
};

export default RulesManager;