import React, { useState, useEffect } from 'react';
import { X, Save, Palette } from 'lucide-react';
import { RuleSection } from '../../types';

interface SectionModalProps {
  section?: RuleSection | null;
  availableIcons: Array<{ name: string; label: string; component: React.ComponentType<any> }>;
  onSave: (sectionData: { title: string; description?: string; icon: string }) => void;
  onClose: () => void;
}

const SectionModal: React.FC<SectionModalProps> = ({
  section,
  availableIcons,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Shield');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setDescription(section.description || '');
      setSelectedIcon(section.icon);
    }
  }, [section]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Il titolo deve essere di almeno 3 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-custom-cyan-800/90 to-custom-cyan-700/90 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-custom-cyan-400/30">
          <h2 className="text-xl font-bold text-white">
            {section ? 'Modifica Sezione' : 'Nuova Sezione'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-custom-cyan-200 hover:text-white hover:bg-custom-cyan-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-custom-cyan-200 mb-2">
              Titolo *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 bg-custom-cyan-700/50 border rounded-lg text-white placeholder-custom-cyan-300 focus:outline-none focus:ring-2 focus:ring-custom-orange-400 focus:border-transparent ${
                errors.title ? 'border-red-400' : 'border-custom-cyan-400/30'
              }`}
              placeholder="Inserisci il titolo della sezione"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-300">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-custom-cyan-200 mb-2">
              Descrizione (opzionale)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-custom-cyan-700/50 border border-custom-cyan-400/30 rounded-lg text-white placeholder-custom-cyan-300 focus:outline-none focus:ring-2 focus:ring-custom-orange-400 focus:border-transparent resize-none"
              placeholder="Descrizione breve della sezione..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-custom-cyan-200 mb-3">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Icona</span>
              </div>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {availableIcons.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = selectedIcon === icon.name;
                
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setSelectedIcon(icon.name)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-custom-orange-400 bg-custom-orange-500/20'
                        : 'border-custom-cyan-400/30 bg-custom-cyan-700/30 hover:border-custom-cyan-300/50'
                    }`}
                    title={icon.label}
                  >
                    <IconComponent className={`h-6 w-6 mx-auto ${
                      isSelected ? 'text-custom-orange-300' : 'text-custom-cyan-300'
                    }`} />
                    <span className={`text-xs mt-1 block ${
                      isSelected ? 'text-custom-orange-200' : 'text-custom-cyan-300'
                    }`}>
                      {icon.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-custom-cyan-700/30 rounded-lg p-4 border border-custom-cyan-400/20">
            <h4 className="text-custom-orange-200 font-medium mb-3">Anteprima:</h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg">
                {(() => {
                  const IconComponent = availableIcons.find(i => i.name === selectedIcon)?.component;
                  return IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : null;
                })()}
              </div>
              <div>
                <h5 className="text-white font-semibold">{title || 'Titolo sezione'}</h5>
                {description && (
                  <p className="text-custom-cyan-200 text-sm">{description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-custom-cyan-700/50 text-custom-cyan-200 rounded-lg hover:bg-custom-cyan-600/50 transition-colors border border-custom-cyan-400/30"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-gradient text-white rounded-lg hover:bg-orange-gradient-reverse transition-all shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{section ? 'Salva Modifiche' : 'Crea Sezione'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;