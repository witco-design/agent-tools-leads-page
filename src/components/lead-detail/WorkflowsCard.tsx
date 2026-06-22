import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { CollapsibleCard } from './CollapsibleCard';
import { TruncatedText } from './TruncatedText';

interface WorkflowItem {
  id: string;
  name: string;
  startedAt?: string;
  currentStep?: string;
}

const initialWorkflows: WorkflowItem[] = [
  { id: '1', name: 'Buyer Leads - Inactive Last 6 Months', startedAt: 'Oct 15, 2025', currentStep: 'Step 12 of 30' },
  { id: '2', name: 'MEGA 419-Day Buyer Workflow', startedAt: 'Sep 3, 2025', currentStep: 'Step 45 of 419' },
];

const availableWorkflows = [
  { id: 'w1', name: 'Buyer Leads - Inactive Last 6 Months' },
  { id: 'w2', name: 'MEGA 419-Day Buyer Workflow' },
  { id: 'w3', name: 'Email Signature Test' },
  { id: 'w4', name: 'Testing blocker' },
  { id: 'w5', name: "Tiera's Testing Insanity" },
];

export function WorkflowsCard() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(initialWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailWorkflow, setDetailWorkflow] = useState<WorkflowItem | null>(null);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [removeWorkflowId, setRemoveWorkflowId] = useState<string | null>(null);

  const isWorkflowSelected = selectedWorkflow !== '';

  const handleStart = () => {
    if (!selectedWorkflow) return;
    const found = availableWorkflows.find((w) => w.id === selectedWorkflow);
    if (found) {
      const newWf: WorkflowItem = {
        id: `wf-${Date.now()}`,
        name: found.name,
        startedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        currentStep: 'Step 1',
      };
      setWorkflows((prev) => [...prev, newWf]);
      setSelectedWorkflow('');
      toast.success(`Started workflow "${found.name}"`);
    }
  };

  const openDetail = (wf: WorkflowItem) => {
    setDetailWorkflow(wf);
    setDetailOpen(true);
  };

  const confirmRemove = (id: string) => {
    setRemoveWorkflowId(id);
    setRemoveConfirmOpen(true);
  };

  const handleRemove = () => {
    if (!removeWorkflowId) return;
    const wf = workflows.find((w) => w.id === removeWorkflowId);
    setWorkflows((prev) => prev.filter((w) => w.id !== removeWorkflowId));
    setRemoveConfirmOpen(false);
    setDetailOpen(false);
    toast.error(`Removed workflow "${wf?.name || 'Unknown'}"`);
  };

  return (
    <>
      <CollapsibleCard
        title="Workflows"
        infoTooltip="A drip campaign is an automated chain of texts, emails or follow ups"
        footer={
          <div className="flex items-center gap-2">
            <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
              <SelectTrigger className="flex-1 h-9">
                <SelectValue placeholder="Select a Workflow" />
              </SelectTrigger>
              <SelectContent>
                {availableWorkflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              disabled={!isWorkflowSelected}
              onClick={handleStart}
              className={`inline-flex items-center gap-1.5 h-8 px-spacing-3 rounded-1 text-text-5 font-medium shadow-sm transition-colors cursor-pointer ${
                isWorkflowSelected
                  ? 'bg-blue-110 text-white hover:bg-blue-120'
                  : 'bg-gray-40 text-text-muted cursor-not-allowed border border-border-default'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
          </div>
        }
      >
        <div className="space-y-spacing-2">
          {/* Existing workflows */}
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="flex items-center gap-spacing-2 p-spacing-2 -mx-spacing-2 rounded-1 hover:bg-gray-30 transition-colors group"
            >
              <button
                type="button"
                onClick={() => openDetail(workflow)}
                className="flex-1 min-w-0 text-left text-text-4 font-semibold text-text-link hover:underline cursor-pointer"
              >
                <TruncatedText>{workflow.name}</TruncatedText>
              </button>
              <button
                type="button"
                onClick={() => confirmRemove(workflow.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-1 hover:bg-gray-50 cursor-pointer transition-all"
                title="Remove workflow"
              >
                <X className="w-3.5 h-3.5 text-red-80" />
              </button>
            </div>
          ))}

          {workflows.length === 0 && (
            <div className="bg-bg-muted rounded-1 p-3">
              <p className="text-text-4 text-text-muted">No active workflows</p>
            </div>
          )}
        </div>
      </CollapsibleCard>

      {/* Workflow Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Workflow Details</DialogTitle>
            <DialogDescription>{detailWorkflow?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-spacing-3 py-spacing-2">
            <div className="flex items-center justify-between">
              <span className="text-text-4 text-text-secondary">Started</span>
              <span className="text-text-4 font-semibold text-text-default">{detailWorkflow?.startedAt || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-4 text-text-secondary">Progress</span>
              <span className="text-text-4 font-semibold text-text-default">{detailWorkflow?.currentStep || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-4 text-text-secondary">Status</span>
              <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-round bg-green-30 text-green-90 text-text-3 font-semibold">Active</span> {/* text-text-3 OK: status badge */}
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-red-80 text-red-80 text-text-5 font-medium shadow-sm hover:bg-red-30 transition-colors cursor-pointer"
              onClick={() => detailWorkflow && confirmRemove(detailWorkflow.id)}
            >
              Remove from Lead
            </button>
            <button
              type="button"
              className="h-8 px-spacing-3 rounded-1 border border-border-default bg-white text-text-5 font-medium text-text-default hover:bg-bg-muted transition-colors cursor-pointer shadow-sm"
              onClick={() => setDetailOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              The lead will be removed from this workflow. You can re-add it at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-100 text-white hover:bg-red-110"
              onClick={handleRemove}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
