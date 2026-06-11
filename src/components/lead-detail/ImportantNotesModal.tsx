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
              className="w-full min-h-[200px] px-spacing-3 py-spacing-2 rounded-1 border-2 border-blue-110 bg-white text-text-4 text-text-default leading-relaxed focus:outline-none resize-none"
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
                className="text-sm text-[#667085] hover:text-[#101828] transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleEnterEditMode}
                className="h-7 px-spacing-3 inline-flex items-center gap-spacing-2 bg-[#3e60c9] hover:bg-[#3840a9] text-white rounded-1 text-sm font-medium transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm text-[#667085] hover:text-[#101828] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="h-7 px-spacing-3 inline-flex items-center bg-[#3e60c9] hover:bg-[#3840a9] disabled:bg-[#bfddff] disabled:cursor-not-allowed text-white rounded-1 text-sm font-medium transition cursor-pointer"
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
