import { ActivityItemData } from './ActivityItem';

const property1 = {
  address: '2339 Shaughnessy St, Port Coquitlam, BC V3C 3E2',
  mls: '1043 1063 2',
  price: '$798,000',
  beds: '3 beds',
  baths: '3 baths',
  type: 'Single Family',
};

const property2 = {
  address: '6101 151 St, Surrey, BC V3S 5J7',
  mls: '1043 1065 4',
  price: '$865,000',
  beds: '3 beds',
  baths: '4 baths',
  type: 'Single Family',
};

// ── Upcoming follow-ups ────────────────────────────────────────
export const upcomingItems: ActivityItemData[] = [
  {
    id: 'fu-1',
    type: 'follow_up',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'scheduled a follow-up',
    title: 'Call back',
    note: 'Discuss interest level on 2339 Shaughnessy and confirm pre-approval status with lender.',
    timestamp: 'Nov 9, 10:37 AM',
    date: '2025-11-09',
    time: '10:37 AM',
    createdAt: '2 days ago',
    isCompletable: true,
    isCompleted: false,
    inset: {
      kind: 'task',
      fields: {
        Due: 'Nov 9, 10:37 AM',
        Priority: 'High',
        'Assigned to': 'Jon Scharer',
      },
    },
  },
  {
    id: 'fu-2',
    type: 'follow_up',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'scheduled a follow-up',
    title: 'Send listings',
    note: 'Email curated list of 3-bed townhomes in San Jose / Santa Clara area, $650K-$750K.',
    timestamp: 'Nov 12, 9:00 AM',
    date: '2025-11-12',
    time: '9:00 AM',
    createdAt: 'yesterday',
    isCompletable: true,
    isCompleted: false,
    inset: {
      kind: 'task',
      fields: {
        Due: 'Nov 12, 9:00 AM',
        Priority: 'Medium',
        'Assigned to': 'Jon Scharer',
      },
    },
  },
];

// ── Pinned item ────────────────────────────────────────────────
export const pinnedItem: ActivityItemData = {
  id: 'pinned-1',
  type: 'call',
  actor: { name: 'Kevin McCarthy', avatarInitials: 'KM' },
  typeLabel: 'logged a call',
  title: 'Kevin McCarthy called Camille Dubois',
  timestamp: 'Nov 5, 2025 at 2:17 PM',
  date: '2025-11-05',
  time: '2:17 PM',
  note: 'Discussed pre-approval status and timeline. Camille confirmed she has lender Letter of Intent, ready to view properties next weekend. Wants 3BR townhomes in San Jose/Santa Clara, $650-750K.',
  pinned: true,
};

// ── Page 1 items ───────────────────────────────────────────────
export const page1Items: ActivityItemData[] = [
  {
    id: 'p1-1',
    type: 'call',
    actor: { name: 'Kevin McCarthy', avatarInitials: 'KM' },
    typeLabel: 'logged a call',
    title: 'Kevin McCarthy called Camille Dubois',
    timestamp: 'Nov 3, 2025 at 4:18 PM',
    date: '2025-11-03',
    time: '4:18 PM',
  },
  {
    id: 'p1-2',
    type: 'follow_up_completed',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'completed a follow-up',
    title: 'Jon Scharer Completed Follow-up',
    timestamp: 'Nov 9, 8:37 AM',
    date: '2025-11-09',
    time: '8:37 AM',
    note: 'Date: Sunday, November 9, 2025 08:37 AM\nPurpose: Call\nTitle: Call back\nNotes: Confirmed Camille is still actively looking.',
  },
  {
    id: 'p1-3',
    type: 'drip_started',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'started a drip subscription',
    title: 'Camille Dubois Drip Subscription Started',
    timestamp: 'Oct 28, 2025 at 10:14 AM',
    date: '2025-10-28',
    time: '10:14 AM',
    note: 'Subscription to drip campaign #139254 (Buyer Leads - Inactive Last 6 Months) added by agent.',
  },
  {
    id: 'p1-4',
    type: 'view',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'viewed 3 properties',
    title: 'Camille Dubois viewed 3 properties',
    timestamp: 'Oct 25, 2025 at 7:00 PM',
    date: '2025-10-25',
    time: '7:00 PM',
    properties: [property1, property2],
  },
  {
    id: 'p1-5',
    type: 'edited',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'edited the lead',
    title: 'Jon Scharer Edited',
    timestamp: 'Oct 20, 2025 at 3:45 PM',
    date: '2025-10-20',
    time: '3:45 PM',
    note: 'Tag list: → first-time-buyer, ready-to-tour',
  },
];

// ── Page 2 items ───────────────────────────────────────────────
export const page2Items: ActivityItemData[] = [
  {
    id: 'p2-1',
    type: 'search',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'made a search',
    title: 'Camille Dubois made a search',
    timestamp: 'Oct 18, 2025 at 6:14 PM',
    date: '2025-10-18',
    time: '6:14 PM',
    searchCriteria: [
      '3 beds',
      '3 baths',
      '$650,000 - $750,000',
      'Townhome / Single Family',
    ],
    addNoteLink: true,
  },
  {
    id: 'p2-2',
    type: 'favorited',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'favorited a property',
    title: 'Camille Dubois favorited a property',
    timestamp: 'Oct 17, 2025 at 7:00 PM',
    date: '2025-10-17',
    time: '7:00 PM',
    properties: [property1],
  },
  {
    id: 'p2-3',
    type: 'drip_ended',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'ended drip subscription hiatus',
    title: 'Camille Dubois Drip Subscription Ended Hiatus',
    timestamp: 'Oct 14, 2025 at 12:40 PM',
    date: '2025-10-14',
    time: '12:40 PM',
    note: 'Subscription to drip campaign #139254 (Buyer Leads - Inactive Last 6 Months) taken off hiatus.',
  },
];
