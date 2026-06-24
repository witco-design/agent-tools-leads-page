import { useState } from 'react';
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

interface HomeValuation {
  id: string;
  address: string;
}

export function HomeValuationReportsCard() {
  const [reports, setReports] = useState<HomeValuation[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [address, setAddress] = useState('');

  const handleAdd = () => {
    if (!address.trim()) return;
    const newReport: HomeValuation = {
      id: `hv-${Date.now()}`,
      address: address.trim(),
    };
    setReports((prev) => [...prev, newReport]);
    setAddOpen(false);
    setAddress('');
    toast.success('Home valuation report added');
  };

  return (
    <>
      <CollapsibleCard
        title="Home Valuation Reports"
        footer={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="text-sm font-semibold text-[#3E60C9] hover:underline cursor-pointer"
          >
            + Add Report
          </button>
        }
      >
        {reports.length === 0 ? (
          <div className="bg-bg-muted rounded-1 p-3">
            <p className="text-text-3 text-text-muted">No Home Valuation Reports</p>
          </div>
        ) : (
          <div className="space-y-spacing-2">
            {reports.map((report) => (
              <div key={report.id} className="p-spacing-2 rounded-1 border border-border-default">
                <p className="text-text-3 font-semibold text-text-default">{report.address}</p>
                <p className="text-text-3 text-text-secondary">Home Valuation Report</p>
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>

      {/* Add Report Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Home Valuation Report</DialogTitle>
            <DialogDescription>Create a home valuation report for a specific address.</DialogDescription>
          </DialogHeader>
          <div className="py-spacing-2">
            <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Property Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 123 Main St, San Jose, CA"
              className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-4 rounded-1 border border-border-default bg-white text-text-3 font-semibold text-text-default hover:bg-bg-muted transition-colors cursor-pointer"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!address.trim()}
              className="h-8 px-spacing-4 rounded-1 bg-blue-100 text-white text-text-3 font-semibold hover:bg-blue-110 active:bg-blue-120 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdd}
            >
              Add Report
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
