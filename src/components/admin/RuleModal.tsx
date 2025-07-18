import React, { useState, useEffect } from 'react';
import { X, Save, Type, Code } from 'lucide-react';
import { Rule, RuleSection } from '../../types';

interface RuleModalProps {
  rule?: Rule | null;
  sections: RuleSection[];
  defaultSectionId: string;
  onSave: (rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const RuleModal: React.FC<RuleModalProps> = ({
  rule,
  sections,
  defaultSectionId,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setContent(rule.content);
      // Don't change section for existing rules
    }
  }, [rule]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Il titolo deve essere di almeno 3 caratteri';
    }

    if (!content.trim()) {
      newErrors.content = 'Il contenuto è obbligatorio';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Il contenuto deve essere di almeno 10 caratteri';
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
      content: content.trim(),
      orderIndex: rule?.orderIndex || 0
    });
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent = '';
    if (tag === 'ul' || tag === 'ol') {
      newContent = content.substring(0, start) + 
        `<${tag}>\n  <li>${selectedText || 'Elemento lista'}</li>\n</${tag}>` + 
        content.substring(end);
    } else if (tag === 'blockquote') {
      newContent = content.substring(0, start) + 
        `<blockquote>${selectedText || 'Citazione'}</blockquote>` + 
        content.substring(end);
    } else {
      newContent = content.substring(0, start) + 
        `<${tag}>${selectedText}</${tag}>` + 
        content.substring(end);
    }
    
    setContent(newContent);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + tag.length + 2 + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-custom-cyan-800/90 to-custom-cyan-700/90 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-custom-cyan-400/30">
          <h2 className="text-xl font-bold text-white">
            {rule ? 'Modifica Regola' : 'Nuova Regola'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-custom-cyan-200 hover:text-white hover:bg-custom-cyan-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Selection (only for new rules) */}
          {!rule && (
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-custom-cyan-200 mb-2">
                Sezione
              </label>
              <select
                id="section"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full px-3 py-2 bg-custom-cyan-700/50 border border-custom-cyan-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-custom-orange-400 focus:border-transparent"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              placeholder="Inserisci il titolo della regola"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-300">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-custom-cyan-200">
                Contenuto *
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsHtmlMode(!isHtmlMode)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs transition-colors ${
                    isHtmlMode 
                      ? 'bg-custom-orange-500/30 text-custom-orange-200' 
                      : 'bg-custom-cyan-700/50 text-custom-cyan-300 hover:bg-custom-cyan-600/50'
                  }`}
                >
                  {isHtmlMode ? <Code className="h-3 w-3" /> : <Type className="h-3 w-3" />}
                  <span>{isHtmlMode ? 'HTML' : 'Testo'}</span>
                </button>
              </div>
            </div>

            {/* HTML Toolbar */}
            {isHtmlMode && (
              <div className="mb-3 p-3 bg-custom-cyan-700/30 rounded-lg border border-custom-cyan-400/20">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('strong')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('em')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('h4')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    H4
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('p')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('ul')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    UL
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('ol')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    OL
                  </button>
                  <button
                    type="button"
                    onClick={() => insertHtmlTag('blockquote')}
                    className="px-2 py-1 bg-custom-cyan-600/50 text-custom-cyan-200 rounded text-xs hover:bg-custom-cyan-500/50 transition-colors"
                  >
                    Quote
                  </button>
                </div>
              </div>
            )}

            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={isHtmlMode ? 12 : 8}
              className={`w-full px-3 py-2 bg-custom-cyan-700/50 border rounded-lg text-white placeholder-custom-cyan-300 focus:outline-none focus:ring-2 focus:ring-custom-orange-400 focus:border-transparent resize-none font-mono text-sm ${
                errors.content ? 'border-red-400' : 'border-custom-cyan-400/30'
              }`}
              placeholder={isHtmlMode ? 
                "Inserisci il contenuto HTML della regola...\n\nEsempio:\n<p>Questa è una <strong>regola importante</strong>.</p>\n<ul>\n  <li>Punto 1</li>\n  <li>Punto 2</li>\n</ul>" :
                "Descrivi la regola in dettaglio..."
              }
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-300">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-custom-cyan-300">
              {content.length} caratteri {isHtmlMode && '(HTML)'}
            </p>
          </div>

          {/* Preview */}
          {content && (
            <div className="bg-custom-cyan-700/30 rounded-lg p-4 border border-custom-cyan-400/20">
              <h4 className="text-custom-orange-200 font-medium mb-3">Anteprima:</h4>
              <div className="bg-custom-cyan-800/50 rounded-lg p-4">
                <h5 className="text-white font-semibold mb-3">{title || 'Titolo regola'}</h5>
                <div 
                  className="text-custom-cyan-100 leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          )}

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
              <span>{rule ? 'Salva Modifiche' : 'Crea Regola'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RuleModal;