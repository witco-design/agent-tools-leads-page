/**
 * PROTECTED — Shared edit dialog for contact records.
 * Standard centered modal with backdrop scrim.
 *
 * INTENT: task-focused (edit + save + close). This is INTENTIONALLY different
 * from PinnedFloatingDialog (which is view-focused, no scrim, page interactive).
 * The different affordances signal different intents to the user.
 *
 * Do NOT convert this to a pinned floating dialog. Do NOT remove the scrim.
 * If you need a "reference alongside work" pattern, use PinnedFloatingDialog.
 * If you need "focus on completing this task," this is the right primitive.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'tel' | 'email';
  placeholder?: string;
}

interface ContactEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  title: string;
  initialValues: Record<string, string>;
  fields: FieldConfig[];
  autoFocusField?: string;
}

export function ContactEditDialog({
  isOpen,
  onClose,
  onSave,
  title,
  initialValues,
  fields,
  autoFocusField,
}: ContactEditDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues);
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
        initialFocusRef.current.select();
      }
    }, 0);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  const focusKey = autoFocusField ?? fields[0]?.key;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-spacing-3 max-h-[60vh] overflow-y-auto py-spacing-1">
          {fields.map((field) => {
            const isFocus = field.key === focusKey;
            return (
              <div key={field.key} className="flex items-center gap-spacing-3">
                <label
                  htmlFor={`ced-${field.key}`}
                  className="w-24 text-text-3 text-text-muted flex-shrink-0"
                >
                  {field.label}
                </label>
                <input
                  id={`ced-${field.key}`}
                  ref={isFocus ? initialFocusRef : undefined}
                  type={field.type ?? 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="flex-1 h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-40 focus:border-blue-100"
                />
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-spacing-4 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-spacing-4 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
