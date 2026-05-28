import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { TruncatedText } from './TruncatedText';
import { ChannelIcon } from './ChannelIcon';

export function ContactInfoCard() {
  const [urgency, setUrgency] = useState('none');
  const [status, setStatus] = useState('nurture');
  const [type, setType] = useState('buyer');
  const [timeframe, setTimeframe] = useState('30-days');

  const handleUrgency = (val: string) => {
    setUrgency(val);
    toast(`Urgency updated to ${val.replace(/-/g, ' ')}`);
  };
  const handleStatus = (val: string) => {
    setStatus(val);
    toast(`Status updated to ${val.replace(/-/g, ' ')}`);
  };
  const handleType = (val: string) => {
    setType(val);
    toast(`Type updated to ${val}`);
  };
  const handleTimeframe = (val: string) => {
    setTimeframe(val);
    toast(`Timeframe updated to ${val.replace(/-/g, ' ')}`);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-white rounded-3 border border-border-default shadow-sm p-spacing-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-spacing-4">
          {/* Column 1: Contact details */}
          <div className="space-y-spacing-3">
            <InfoRow label="Primary" value="(415) 555-0142" trailing={<Phone className="w-3.5 h-3.5 text-blue-110" />} />
            <InfoRow label="Alt" value="(415) 555-0188" trailing={<Phone className="w-3.5 h-3.5 text-blue-110" />} />
            <InfoRow label="Email" value={<TruncatedText>cdubois@realgeeks.com</TruncatedText>} trailing={<Mail className="w-3.5 h-3.5 text-blue-110" />} />
            <InfoRow label="Address" value={<TruncatedText>Mountain View, CA 94040</TruncatedText>} />
          </div>

          {/* Column 2: Activity */}
          <div className="md:border-l md:border-border-default md:pl-spacing-6 space-y-spacing-3">
            <InfoRow
              label="Online"
              value={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text"></span>
                  </span>
                  <span className="text-text-2 font-semibold text-success-text">Online Now</span>
                </span>
              }
            />
            <InfoRow
              label="Contacted"
              value={
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <TruncatedText>3 days ago</TruncatedText>
                  <ChannelIcon channel="call" />
                </span>
              }
            />
            <InfoRow
              label="Login"
              value={
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <TruncatedText>14 days ago</TruncatedText>
                  <ChannelIcon channel="website" />
                </span>
              }
            />
            <InfoRow label="IP" value={<TruncatedText>San Jose, CA</TruncatedText>} />
          </div>

          {/* Column 3: Select dropdowns */}
          <div className="md:border-l md:border-border-default md:pl-spacing-6 space-y-spacing-3">
            <SelectRow label="Urgency">
              <Select value={urgency} onValueChange={handleUrgency}>
                <SelectTrigger className="h-8 rounded-2 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fire">Fire (Daily)</SelectItem>
                  <SelectItem value="hot">Hot (Weekly)</SelectItem>
                  <SelectItem value="warm">Warm (Monthly)</SelectItem>
                  <SelectItem value="long-term">Long Term (Quarterly)</SelectItem>
                  <SelectItem value="do-not-contact">Do Not Contact</SelectItem>
                </SelectContent>
              </Select>
            </SelectRow>

            <SelectRow label="Status">
              <Select value={status} onValueChange={handleStatus}>
                <SelectTrigger className="h-8 rounded-2 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue placeholder="Nurture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="attempted-contact">Attempted Contact</SelectItem>
                  <SelectItem value="nurture">Nurture</SelectItem>
                  <SelectItem value="appointment-set">Appointment Set</SelectItem>
                  <SelectItem value="showing-listing">Showing/Listing</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="do-not-contact">Do Not Contact</SelectItem>
                  <SelectItem value="non-client">Non-Client</SelectItem>
                </SelectContent>
              </Select>
            </SelectRow>

            <SelectRow label="Type">
              <Select value={type} onValueChange={handleType}>
                <SelectTrigger className="h-8 rounded-2 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue placeholder="Buyer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </SelectRow>

            <SelectRow label="Timeframe">
              <Select value={timeframe} onValueChange={handleTimeframe}>
                <SelectTrigger className="h-8 rounded-2 border-border-default bg-white text-text-3 px-spacing-3 w-full">
                  <SelectValue placeholder="30 Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-days">30 Days</SelectItem>
                  <SelectItem value="60-days">60 Days</SelectItem>
                  <SelectItem value="90-days">90 Days</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </SelectRow>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function InfoRow({
  label,
  value,
  trailing,
}: {
  label: string;
  value: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-spacing-3">
      <span className="text-text-3 font-normal text-text-secondary w-16 shrink-0">
        {label}
      </span>
      <span className="text-text-3 font-normal text-text-default flex-1 min-w-0">
        {value}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </div>
  );
}

function SelectRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-spacing-3">
      <span className="text-text-3 font-normal text-text-secondary w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
