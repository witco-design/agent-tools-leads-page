import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ContactInfo {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export function SecondaryContactCard() {
  const [editOpen, setEditOpen] = useState(false);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState<ContactInfo>({ name: '', relationship: 'Spouse', phone: '', email: '' });

  const openEdit = () => {
    setForm(contact || { name: '', relationship: 'Spouse', phone: '', email: '' });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (form.name.trim()) {
      setContact(form);
    }
    setEditOpen(false);
    toast.success('Secondary contact updated');
  };

  return (
    <>
      <CollapsibleCard
        title="Secondary Contact"
        rightAction={
          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-1 text-text-2 font-semibold text-text-link hover:underline cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        }
      >
        {contact ? (
          <div className="space-y-spacing-2">
            <p className="text-text-3 font-semibold text-text-default">{contact.name}</p>
            <p className="text-text-2 text-text-secondary">{contact.relationship}</p>
            {contact.phone && <p className="text-text-3 text-text-default">{contact.phone}</p>}
            {contact.email && <p className="text-text-3 text-text-default">{contact.email}</p>}
          </div>
        ) : (
          <p className="text-text-3 font-normal text-text-muted">Unavailable</p>
        )}
      </CollapsibleCard>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Secondary Contact</DialogTitle>
            <DialogDescription>Update the secondary contact for this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Relationship</label>
              <select
                value={form.relationship}
                onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value }))}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              >
                <option>Spouse</option>
                <option>Partner</option>
                <option>Family</option>
                <option>Co-buyer</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full h-9 px-spacing-3 rounded-2 border border-border-default bg-white text-text-3 text-text-default focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-9 px-spacing-4 rounded-2 bg-blue-110 text-white text-text-3 font-semibold hover:bg-blue-120 transition-colors cursor-pointer"
              onClick={handleSave}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
