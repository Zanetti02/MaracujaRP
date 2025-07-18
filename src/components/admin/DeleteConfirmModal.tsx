import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  onConfirm,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-custom-cyan-800/90 to-custom-cyan-700/90 backdrop-blur-sm rounded-xl border border-custom-cyan-400/30 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-custom-cyan-400/30">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/30 p-2 rounded-lg border border-red-400/30">
              <AlertTriangle className="h-6 w-6 text-red-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Conferma Eliminazione</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-custom-cyan-200 hover:text-white hover:bg-custom-cyan-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-custom-cyan-200 mb-4">
            Sei sicuro di voler eliminare:
          </p>
          <div className="bg-custom-cyan-700/30 rounded-lg p-3 mb-6 border border-custom-cyan-400/20">
            <p className="text-white font-medium">"{title}"</p>
          </div>
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mb-6">
            <p className="text-red-300 text-sm">
              ⚠️ Questa azione non può essere annullata. L'elemento verrà eliminato permanentemente dal database.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-custom-cyan-700/50 text-custom-cyan-200 rounded-lg hover:bg-custom-cyan-600/50 transition-colors border border-custom-cyan-400/30"
            >
              Annulla
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
              <span>Elimina</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;