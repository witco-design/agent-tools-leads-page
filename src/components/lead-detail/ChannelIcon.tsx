import {
  Phone,
  MessageSquare,
  Mail,
  MessagesSquare,
  Globe,
  Smartphone,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type Channel = 'call' | 'text' | 'email' | 'chat' | 'website' | 'mobile';

const channelMap: Record<Channel, { icon: React.ElementType; label: string }> = {
  call: { icon: Phone, label: 'Via call' },
  text: { icon: MessageSquare, label: 'Via text' },
  email: { icon: Mail, label: 'Via email' },
  chat: { icon: MessagesSquare, label: 'Via chat' },
  website: { icon: Globe, label: 'Via website' },
  mobile: { icon: Smartphone, label: 'Via mobile' },
};

export function ChannelIcon({ channel }: { channel: Channel }) {
  const { icon: Icon, label } = channelMap[channel];
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-text-secondary" />
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
