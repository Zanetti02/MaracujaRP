import React, { useState } from 'react';
import { RuleSection } from '../../types';
import { Plus, Edit, Trash2, Move, GripVertical, Shield, Users, Heart, AlertTriangle, Settings, Database, Lock, Globe, Zap, Star, Crown, Award } from 'lucide-react';
import SectionModal from './SectionModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface SectionsManagerProps {
  sections: RuleSection[];
  onAddSection: (sectionData: { title: string; description?: string; icon: string }) => void;
  onUpdateSection: (sectionId: string, sectionData: { title?: string; description?: string; icon?: string }) => void;
  onDeleteSection: (sectionId: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
}

const iconMap = {
  Shield,
  Users,
  Heart,
  AlertTriangle,
  Settings,
  Database,
  Lock,
  Globe,
  Zap,
  Star,
  Crown,
  Award,
};

const availableIcons = [
  { name: 'Shield', label: 'Scudo', component: Shield },
  { name: 'Users', label: 'Utenti', component: Users },
  { name: 'Heart', label: 'Cuore', component: Heart },
  { name: 'AlertTriangle', label: 'Avviso', component: AlertTriangle },
  { name: 'Settings', label: 'Impostazioni', component: Settings },
  { name: 'Database', label: 'Database', component: Database },
  { name: 'Lock', label: 'Lucchetto', component: Lock },
  { name: 'Globe', label: 'Globo', component: Globe },
  { name: 'Zap', label: 'Fulmine', component: Zap },
  { name: 'Star', label: 'Stella', component: Star },
  { name: 'Crown', label: 'Corona', component: Crown },
  { name: 'Award', label: 'Premio', component: Award },
];

const SectionsManager: React.FC<SectionsManagerProps> = ({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections
}) => {
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSection, setEditingSection] = useState<RuleSection | null>(null);
  const [deletingSection, setDeletingSection] = useState<RuleSection | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const handleAddSection = () => {
    setEditingSection(null);
    setShowSectionModal(true);
  };

  const handleEditSection = (section: RuleSection) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  const handleDeleteSection = (section: RuleSection) => {
    setDeletingSection(section);
    setShowDeleteModal(true);
  };

  const handleSaveSection = (sectionData: { title: string; description?: string; icon: string }) => {
    if (editingSection) {
      onUpdateSection(editingSection.id, sectionData);
    } else {
      onAddSection(sectionData);
    }
    setShowSectionModal(false);
    setEditingSection(null);
  };

  const confirmDelete = () => {
    if (deletingSection) {
      onDeleteSection(deletingSection.id);
      setShowDeleteModal(false);
      setDeletingSection(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSectionId) {
      setDraggedSection(null);
      return;
    }

    const currentOrder = sections.map(s => s.id);
    const draggedIndex = currentOrder.indexOf(draggedSection);
    const targetIndex = currentOrder.indexOf(targetSectionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new order
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedSection);

    onReorderSections(newOrder);
    setDraggedSection(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestione Sezioni</h2>
          <p className="text-custom-cyan-200">Organizza e gestisci le sezioni del regolamento</p>
        </div>
        <button
          onClick={handleAddSection}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-gradient text-white rounded-xl hover:bg-orange-gradient-reverse transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Nuova Sezione</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-custom-cyan-800/50 to-custom-cyan-700/50 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-custom-cyan-200 text-sm font-medium">Sezioni Totali</p>
              <p className="text-2xl font-bold text-white">{sections.length}</p>
            </div>
            <Database className="h-8 w-8 text-custom-cyan-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-custom-orange-800/50 to-custom-orange-700/50 backdrop-blur-sm rounded-xl border border-custom-orange-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-custom-orange-200 text-sm font-medium">Regole Totali</p>
              <p className="text-2xl font-bold text-white">
                {sections.reduce((total, section) => total + section.rules.length, 0)}
              </p>
            </div>
            <Shield className="h-8 w-8 text-custom-orange-300" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl border border-green-400/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Media per Sezione</p>
              <p className="text-2xl font-bold text-white">
                {sections.length > 0 ? Math.round(sections.reduce((total, section) => total + section.rules.length, 0) / sections.length) : 0}
              </p>
            </div>
            <Star className="h-8 w-8 text-green-300" />
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-gradient-to-r from-custom-cyan-800/50 to-custom-cyan-700/50 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Sezioni del Regolamento</h3>
        
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-custom-cyan-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-custom-cyan-200 mb-2">Nessuna sezione</h4>
            <p className="text-custom-cyan-300 mb-6">Inizia creando la prima sezione del regolamento</p>
            <button
              onClick={handleAddSection}
              className="px-6 py-3 bg-orange-gradient text-white rounded-xl hover:bg-orange-gradient-reverse transition-all shadow-lg"
            >
              Crea Prima Sezione
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, index) => {
              const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Shield;
              
              return (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section.id)}
                  className={`bg-custom-cyan-700/30 rounded-xl border border-custom-cyan-400/20 p-6 hover:border-custom-orange-400/50 transition-all cursor-move ${
                    draggedSection === section.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-5 w-5 text-custom-cyan-300" />
                        <div className="w-8 h-8 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="w-10 h-10 bg-custom-cyan-600/50 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-custom-cyan-200" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">{section.title}</h4>
                        {section.description && (
                          <p className="text-custom-cyan-200 text-sm mb-2">{section.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-custom-cyan-300">
                          <span>{section.rules.length} regole</span>
                          {section.createdAt && (
                            <span>Creata: {new Date(section.createdAt).toLocaleDateString('it-IT')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSection(section)}
                        className="p-2 text-custom-cyan-300 hover:text-blue-300 hover:bg-custom-cyan-700/50 rounded-lg transition-colors"
                        title="Modifica sezione"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteSection(section)}
                        className="p-2 text-custom-cyan-300 hover:text-red-300 hover:bg-custom-cyan-700/50 rounded-lg transition-colors"
                        title="Elimina sezione"
                        disabled={section.rules.length > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {section.rules.length > 0 && (
                    <div className="mt-4 p-3 bg-custom-orange-500/10 rounded-lg border border-custom-orange-400/20">
                      <p className="text-custom-orange-200 text-sm">
                        ⚠️ Questa sezione contiene {section.rules.length} regole. Elimina prima tutte le regole per poter eliminare la sezione.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showSectionModal && (
        <SectionModal
          section={editingSection}
          availableIcons={availableIcons}
          onSave={handleSaveSection}
          onClose={() => {
            setShowSectionModal(false);
            setEditingSection(null);
          }}
        />
      )}

      {showDeleteModal && deletingSection && (
        <DeleteConfirmModal
          title={`sezione "${deletingSection.title}"`}
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingSection(null);
          }}
        />
      )}
    </div>
  );
};

export default SectionsManager;