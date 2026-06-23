import { useState, useEffect, useCallback } from 'react';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type Mode = 'view' | 'edit';

interface ImportantNotesModalProps {
  open: boolean;
  onClose: () => void;
  note: string;
  onSave: (newNote: string) => void;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export function ImportantNotesModal({
  open,
  onClose,
  note,
  onSave,
  lastUpdatedBy,
  lastUpdatedAt,
}: ImportantNotesModalProps) {
  const [mode, setMode] = useState<Mode>('view');
  const [editValue, setEditValue] = useState(note);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setMode('view');
      setEditValue(note);
      setHasUnsavedChanges(false);
    }
  }, [open, note]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(editValue !== note);
  }, [editValue, note]);

  const handleEnterEditMode = () => {
    setEditValue(note);
    setMode('edit');
  };

  const handleSave = useCallback(() => {
    onSave(editValue);
    setMode('view');
  }, [editValue, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(note);
    setMode('view');
  }, [note]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (mode === 'edit') {
          handleCancel();
        } else {
          onClose();
        }
      }
      if (mode === 'edit' && (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [open, mode, handleSave, handleCancel, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { if (mode === 'edit') { handleCancel(); } else { onClose(); } } }}>
      <DialogContent className="sm:max-w-[640px]">
        {/* Header — stable across both modes */}
        <DialogHeader>
          <DialogTitle>Important Notes</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Editing \u2014 your changes will save when you click Save.'
              : `Last updated by ${lastUpdatedBy} \u00b7 ${lastUpdatedAt}`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Content area — morphs between view and edit */}
        <div className="py-spacing-2">
          {mode === 'view' ? (
            <div className="max-h-[400px] overflow-y-auto">
              <p className="text-text-4 font-normal text-text-default whitespace-pre-line leading-relaxed">
                {note}
              </p>
            </div>
          ) : (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              rows={10}
              className="w-full min-h-[200px] px-spacing-3 py-spacing-2 rounded-1 border-2 border-blue-100 bg-white text-text-4 text-text-default leading-relaxed focus:outline-none resize-none"
              placeholder="Add notes about this lead..."
            />
          )}
        </div>

        {/* Footer — buttons swap based on mode */}
        <DialogFooter>
          {mode === 'view' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleEnterEditMode}
                className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer inline-flex items-center gap-spacing-2"
              >
                <Pencil className="w-4 h-4" aria-hidden="true" />
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="h-8 px-spacing-3 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
