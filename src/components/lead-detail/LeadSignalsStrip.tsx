import { Star, Sparkles, Mail, Heart, Activity, HelpCircle, Phone } from 'lucide-react';
import type { TagItem } from './TagOverflowList';

/**
 * Lead signal tags — categorized into the unified tag system.
 * "Slipping Away" is removed from this system.
 */
export const SIGNALS: TagItem[] = [
  {
    label: 'New Lead',
    icon: Star,
    variant: 'communication',
    description: 'Lead created within the past 14 days.',
  },
  {
    label: 'Agent Ready',
    icon: Sparkles,
    variant: 'communication',
    description: 'Lead has shown buying intent and has complete contact info. Ready for direct agent outreach.',
  },
  {
    label: 'Property Inquiry',
    icon: HelpCircle,
    variant: 'communication',
    description: 'Lead has submitted at least one inquiry about a specific listing.',
  },
  {
    label: 'Multiple Site Visits',
    icon: Activity,
    variant: 'behavior',
    description: 'Visited the website 5 or more times in the past 7 days.',
  },
  {
    label: 'Email Received',
    icon: Mail,
    variant: 'communication',
    description: 'Lead has received and engaged with at least one email in the past 30 days.',
  },
  {
    label: '3 Favorited Properties',
    icon: Heart,
    variant: 'behavior',
    description: 'Lead has favorited 3 properties in the past 14 days.',
  },
  {
    label: 'Phone Updated',
    icon: Phone,
    variant: 'behavior',
    description: 'Lead updated their phone number in the past 30 days.',
  },
];
