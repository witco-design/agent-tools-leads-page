import { useState } from 'react';
import { ArrowRight, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { CollapsibleCard } from './CollapsibleCard';
import { SectionActionButton } from './SectionActionButton';
import { EmptyState } from './EmptyState';
import { useVersion } from '@/contexts/VersionContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const AGENT_MAP: Record<string, string> = {
  'jon-scharer': 'Jon Scharer',
  'sarah-lee': 'Sarah Lee',
  'kevin-mccarthy': 'Kevin McCarthy',
  'tiera-jones': 'Tiera Jones',
  unassigned: 'Unassigned',
};

const LENDER_MAP: Record<string, string> = {
  unassigned: 'Unassigned',
  'bank-of-america': 'Bank of America',
  'wells-fargo': 'Wells Fargo',
  'quicken-loans': 'Quicken Loans',
  'local-credit-union': 'Local Credit Union',
};

export function LeadAssignmentCard() {
  const { emptyMode } = useVersion();
  const [agent, setAgent] = useState('jon-scharer');
  const [lender, setLender] = useState('unassigned');
  const [pondOpen, setPondOpen] = useState(false);

  const handleAgentChange = (val: string) => {
    setAgent(val);
    toast(`Lead assigned to ${AGENT_MAP[val] || val}`);
  };

  const handleLenderChange = (val: string) => {
    setLender(val);
    toast(`Lender updated to ${LENDER_MAP[val] || val}`);
  };

  return (
    <>
      <CollapsibleCard
        title="Lead Assignment"
        footer={
          <div className="flex justify-end">
            <SectionActionButton
              label="Send to Pond"
              icon={ArrowRight}
              iconPosition="after"
              variant="link"
              onClick={() => setPondOpen(true)}
            />
          </div>
        }
      >
        {emptyMode ? (
          <EmptyState
            icon={UserCog}
            title="No assignment yet"
            subtitle="Agent and lender assignments will appear here once this lead is assigned."
          />
        ) : (
        <div className="space-y-spacing-3">
          <div className="flex items-center gap-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary w-[60px] shrink-0">
              Agent
            </span>
            <div className="flex-1">
              <Select value={agent} onValueChange={handleAgentChange}>
                <SelectTrigger className="h-8 rounded-1 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AGENT_MAP).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-spacing-2">
            <span className="text-text-3 font-normal text-text-secondary w-[60px] shrink-0">
              Lender
            </span>
            <div className="flex-1">
              <Select value={lender} onValueChange={handleLenderChange}>
                <SelectTrigger className="h-8 rounded-1 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LENDER_MAP).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        )}
      </CollapsibleCard>

      <AlertDialog open={pondOpen} onOpenChange={setPondOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this lead to the Pond?</AlertDialogTitle>
            <AlertDialogDescription>
              This lead will be unassigned from you and returned to the team pool. You can claim it back at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-100 text-white hover:bg-blue-110 active:bg-blue-120"
              onClick={() => toast.success('Lead sent to the Pond. Agent unassigned.')}
            >
              Send to Pond
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
