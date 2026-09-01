import { useState } from 'react';
import { toast } from 'sonner';
import { Newspaper } from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';
import { EmptyState } from './EmptyState';
import { SectionActionButton } from './SectionActionButton';
import { useVersion } from '@/contexts/VersionContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MarketReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
}

export function MarketReportsCard() {
  const { emptyMode } = useVersion();
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [reportFrequency, setReportFrequency] = useState('monthly');

  const handleAdd = () => {
    if (!reportName.trim()) return;
    const newReport: MarketReport = {
      id: `mr-${Date.now()}`,
      name: reportName.trim(),
      type: reportType,
      frequency: reportFrequency,
    };
    setReports((prev) => [...prev, newReport]);
    setAddOpen(false);
    setReportName('');
    setReportType('monthly');
    setReportFrequency('monthly');
    toast.success('Market report added');
  };

  return (
    <>
      <CollapsibleCard
        title="Market Reports"
        footer={emptyMode ? undefined : (
          <SectionActionButton
            label="+ Add Report"
            variant="link"
            onClick={() => setAddOpen(true)}
          />
        )}
      >
        {emptyMode ? (
          <EmptyState
            icon={Newspaper}
            title="No market reports"
            action={{ label: 'Add report', onClick: () => setAddOpen(true) }}
          />
        ) : reports.length === 0 ? (
          <div className="bg-bg-muted rounded-1 p-3">
            <p className="text-text-3 text-text-muted">No Market Report</p>
          </div>
        ) : (
          <div className="space-y-spacing-2">
            {reports.map((report) => (
              <div key={report.id} className="p-spacing-2 rounded-1 border border-border-default">
                <p className="text-text-3 font-semibold text-text-default">{report.name}</p>
                <p className="text-text-3 text-text-secondary">{report.frequency} &middot; {report.type}</p>
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>

      {/* Add Report Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Market Report</DialogTitle>
            <DialogDescription>Set up a market report subscription for this lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-4 py-spacing-2">
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Report Name</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., San Jose Housing Market"
                className="w-full h-9 px-spacing-3 rounded-1 border border-border-default bg-white text-text-3 text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-9 rounded-1 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                  <SelectItem value="quarterly">Quarterly Overview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-text-3 font-semibold text-text-default mb-spacing-1">Frequency</label>
              <Select value={reportFrequency} onValueChange={setReportFrequency}>
                <SelectTrigger className="h-9 rounded-1 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              disabled={!reportName.trim()}
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
