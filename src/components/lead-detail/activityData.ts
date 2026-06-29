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
    timestamp: 'Nov 9 at 10:37am',
    date: '2025-11-09',
    time: '10:37am',
    createdAt: '2 days ago',
    isCompletable: true,
    isCompleted: false,
    inset: {
      kind: 'task',
      fields: {
        Due: 'Nov 9 at 10:37am',
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
    timestamp: 'Nov 12 at 9:00am',
    date: '2025-11-12',
    time: '9:00am',
    createdAt: 'yesterday',
    isCompletable: true,
    isCompleted: false,
    inset: {
      kind: 'task',
      fields: {
        Due: 'Nov 12 at 9:00am',
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
  timestamp: 'Nov 5, 2025 at 2:17pm',
  date: '2025-11-05',
  time: '2:17pm',
  note: 'Discussed pre-approval status and timeline. Camille confirmed she has lender Letter of Intent, ready to view properties next weekend. Wants 3BR townhomes in San Jose/Santa Clara, $650-750K.',
  pinned: true,
};

// ── Page 1 items (recent — Nov 12 through Nov 3) ─────────────
export const page1Items: ActivityItemData[] = [
  // ── Nov 12 (Today) ──
  {
    id: 'act-001',
    type: 'note',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'added a note',
    title: 'Added a note',
    note: 'Camille mentioned wanting to see properties this weekend. Loves modern open floor plans.',
    timestamp: 'Nov 12, 2025 at 10:24am',
    date: '2025-11-12',
    time: '10:24am',
  },
  {
    id: 'act-003',
    type: 'favorite_property_added',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'favorited a property',
    title: 'Camille Dubois favorited a property',
    note: '2339 Shaughnessy Way, San Jose',
    timestamp: 'Nov 12, 2025 at 9:20am',
    date: '2025-11-12',
    time: '9:20am',
  },
  {
    id: 'act-002',
    type: 'property_viewed',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'viewed a property',
    title: 'Camille Dubois viewed a property',
    note: '2339 Shaughnessy Way, San Jose · $695,000',
    timestamp: 'Nov 12, 2025 at 9:18am',
    date: '2025-11-12',
    time: '9:18am',
  },

  // ── Nov 11 ──
  {
    id: 'act-005',
    type: 'email_clicked',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'clicked link in email',
    title: 'Camille Dubois clicked link in email',
    note: 'Viewed: 4521 Oakridge Dr listing',
    timestamp: 'Nov 11, 2025 at 8:43pm',
    date: '2025-11-11',
    time: '8:43pm',
  },
  {
    id: 'act-004',
    type: 'email_opened',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'opened email',
    title: 'Camille Dubois opened email',
    note: 'Subject: 3 New Listings in Your Area',
    timestamp: 'Nov 11, 2025 at 8:42pm',
    date: '2025-11-11',
    time: '8:42pm',
  },
  {
    id: 'act-006',
    type: 'called_contact_made',
    actor: { name: 'Kevin McCarthy', avatarInitials: 'KM' },
    typeLabel: 'logged a call · contact made',
    title: 'Kevin McCarthy logged a call · Contact made',
    note: 'Discussed pre-approval status and timeline. Camille confirmed she has lender Letter of Intent, ready to view properties next weekend. Wants 3BR townhomes in San Jose/Santa Clara, $650-750K.',
    timestamp: 'Nov 11, 2025 at 2:17pm',
    date: '2025-11-11',
    time: '2:17pm',
  },
  {
    id: 'act-007',
    type: 'email_sent',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'sent email',
    title: 'Jon Scharer sent email',
    note: 'Subject: Curated 3BR Townhomes — San Jose / Santa Clara',
    timestamp: 'Nov 11, 2025 at 11:45am',
    date: '2025-11-11',
    time: '11:45am',
  },
  {
    id: 'act-008',
    type: 'search_performed',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'performed a search',
    title: 'Camille Dubois performed a search',
    note: '3BR townhomes · San Jose · $650K-$750K',
    timestamp: 'Nov 11, 2025 at 8:32am',
    date: '2025-11-11',
    time: '8:32am',
  },
  {
    id: 'act-009',
    type: 'visited',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'visited the website',
    title: 'Camille Dubois visited the website',
    timestamp: 'Nov 11, 2025 at 8:30am',
    date: '2025-11-11',
    time: '8:30am',
  },

  // ── Nov 10 ──
  {
    id: 'act-012',
    type: 'video_played',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'watched video tour',
    title: 'Camille Dubois watched video tour',
    note: '103-20675 118th Ave · 2:32 / 4:18',
    timestamp: 'Nov 10, 2025 at 7:51pm',
    date: '2025-11-10',
    time: '7:51pm',
  },
  {
    id: 'act-011',
    type: 'property_viewed',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'viewed a property',
    title: 'Camille Dubois viewed a property',
    note: '103-20675 118th Ave, Santa Clara · $720,000',
    timestamp: 'Nov 10, 2025 at 7:48pm',
    date: '2025-11-10',
    time: '7:48pm',
  },
  {
    id: 'act-010',
    type: 'created_a_followup_for',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'scheduled a follow-up',
    title: 'Jon Scharer scheduled a follow-up',
    note: 'Call back · Discuss interest level on 2339 Shaughnessy and confirm pre-approval status with lender.',
    timestamp: 'Nov 10, 2025 at 4:15pm',
    date: '2025-11-10',
    time: '4:15pm',
  },

  // ── Nov 9 ──
  {
    id: 'act-014',
    type: 'sent_text_message_to',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'sent text message',
    title: 'Jon Scharer sent text message',
    note: 'Hi Camille! Hope your weekend is going well. Want to set up time to see those townhomes we discussed?',
    timestamp: 'Nov 9, 2025 at 3:22pm',
    date: '2025-11-09',
    time: '3:22pm',
  },
  {
    id: 'act-015',
    type: 'received_text_message_from',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'sent a text message',
    title: 'Camille Dubois sent a text message',
    note: 'Yes! Saturday afternoon works best. Around 2pm?',
    timestamp: 'Nov 9, 2025 at 3:47pm',
    date: '2025-11-09',
    time: '3:47pm',
  },
  {
    id: 'act-013',
    type: 'drip_subscription_created',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'subscribed to drip campaign',
    title: 'Subscribed to drip campaign',
    note: 'Drip campaign #139254 (Test-1)',
    timestamp: 'Nov 9, 2025 at 9:00am',
    date: '2025-11-09',
    time: '9:00am',
  },
  {
    id: 'act-016',
    type: 'completed_a_followup_for',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'completed a follow-up',
    title: 'Jon Scharer completed a follow-up',
    note: 'Date: Nov 9, 2025 at 8:37am · Purpose: Call',
    timestamp: 'Nov 9, 2025 at 8:45am',
    date: '2025-11-09',
    time: '8:45am',
  },
  // existing p1-2
  {
    id: 'p1-2',
    type: 'follow_up_completed',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'completed a follow-up',
    title: 'Jon Scharer Completed Follow-up',
    timestamp: 'Nov 9 at 8:37am',
    date: '2025-11-09',
    time: '8:37am',
    note: 'Date: Nov 9, 2025 at 8:37am · Purpose: Call · Title: Call back · Notes: Confirmed Camille is still actively looking.',
  },

  // ── Nov 7 ──
  {
    id: 'act-018',
    type: 'favorite_property_added',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'favorited a property',
    title: 'Camille Dubois favorited a property',
    note: '103-20675 118th Ave, Santa Clara',
    timestamp: 'Nov 7, 2025 at 6:16pm',
    date: '2025-11-07',
    time: '6:16pm',
  },
  {
    id: 'act-017',
    type: 'saved_search_added',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'saved a search',
    title: 'Camille Dubois saved a search',
    note: '3BR townhomes · Bay Area · max $750K',
    timestamp: 'Nov 7, 2025 at 6:14pm',
    date: '2025-11-07',
    time: '6:14pm',
  },

  // ── Nov 5 ──
  {
    id: 'act-019',
    type: 'market_report_viewed',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'viewed market report',
    title: 'Camille Dubois viewed market report',
    note: 'Santa Clara County · Q3 2025',
    timestamp: 'Nov 5, 2025 at 7:22pm',
    date: '2025-11-05',
    time: '7:22pm',
  },
  {
    id: 'act-020',
    type: 'tour_requested',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'requested a tour',
    title: 'Camille Dubois requested a tour',
    note: '2339 Shaughnessy Way · Nov 16, 2:00pm',
    timestamp: 'Nov 5, 2025 at 11:18am',
    date: '2025-11-05',
    time: '11:18am',
  },

  // ── Nov 3 ──
  {
    id: 'act-021',
    type: 'valuation_inquired',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'requested home valuation',
    title: 'Camille Dubois requested home valuation',
    note: '1247 Brookwood Ln, San Jose (current rental)',
    timestamp: 'Nov 3, 2025 at 9:48am',
    date: '2025-11-03',
    time: '9:48am',
  },
  // existing p1-1
  {
    id: 'p1-1',
    type: 'call',
    actor: { name: 'Kevin McCarthy', avatarInitials: 'KM' },
    typeLabel: 'logged a call',
    title: 'Kevin McCarthy called Camille Dubois',
    timestamp: 'Nov 3, 2025 at 4:18pm',
    date: '2025-11-03',
    time: '4:18pm',
  },

  // ── Nov 1 ──
  {
    id: 'act-022',
    type: 'opted_in_to_texting',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'opted in to text messages',
    title: 'Camille Dubois opted in to text messages',
    timestamp: 'Nov 1, 2025 at 2:34pm',
    date: '2025-11-01',
    time: '2:34pm',
  },
];

// ── Page 2 items (older — Oct 28 through Sep 12) ──────────────
export const page2Items: ActivityItemData[] = [
  // ── Oct 28 ──
  // existing p1-3
  {
    id: 'p1-3',
    type: 'drip_started',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'started a drip subscription',
    title: 'Camille Dubois Drip Subscription Started',
    timestamp: 'Oct 28, 2025 at 10:14am',
    date: '2025-10-28',
    time: '10:14am',
    note: 'Subscription to drip campaign #139254 (Buyer Leads - Inactive Last 6 Months) added by agent.',
  },
  {
    id: 'act-024',
    type: 'received_chat_message_from',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'sent chat message',
    title: 'Camille Dubois sent chat message',
    note: 'Just following up - any new listings since last week?',
    timestamp: 'Oct 28, 2025 at 5:01pm',
    date: '2025-10-28',
    time: '5:01pm',
  },
  {
    id: 'act-023',
    type: 'assistant_conversation_started',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'started chat with assistant',
    title: 'Camille Dubois started chat with assistant',
    note: 'Hi! I\'m looking for 3-bedroom townhomes in San Jose under $750K. Can you help?',
    timestamp: 'Oct 28, 2025 at 4:52pm',
    date: '2025-10-28',
    time: '4:52pm',
  },

  // ── Oct 25 ──
  // existing p1-4
  {
    id: 'p1-4',
    type: 'view',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'viewed 3 properties',
    title: 'Camille Dubois viewed 3 properties',
    timestamp: 'Oct 25, 2025 at 7:00pm',
    date: '2025-10-25',
    time: '7:00pm',
    properties: [property1, property2],
  },

  // ── Oct 22 ──
  {
    id: 'act-025',
    type: 'called_left_voicemail',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'left a voicemail',
    title: 'Jon Scharer left a voicemail',
    timestamp: 'Oct 22, 2025 at 11:14am',
    date: '2025-10-22',
    time: '11:14am',
  },
  {
    id: 'act-026',
    type: 'called_no_answer',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'called · no answer',
    title: 'Jon Scharer called · No answer',
    timestamp: 'Oct 22, 2025 at 10:48am',
    date: '2025-10-22',
    time: '10:48am',
  },

  // ── Oct 20 ──
  // existing p1-5
  {
    id: 'p1-5',
    type: 'edited',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'edited the lead',
    title: 'Jon Scharer Edited',
    timestamp: 'Oct 20, 2025 at 3:45pm',
    date: '2025-10-20',
    time: '3:45pm',
    note: 'Tag list: → first-time-buyer, ready-to-tour',
  },

  // ── Oct 19 ──
  {
    id: 'act-027',
    type: 'shared_property_via_email',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'shared property via email',
    title: 'Jon Scharer shared property via email',
    note: '1214-45 Carlton St, Toronto',
    timestamp: 'Oct 19, 2025 at 3:15pm',
    date: '2025-10-19',
    time: '3:15pm',
  },

  // ── Oct 18 ──
  // existing p2-1
  {
    id: 'p2-1',
    type: 'search',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'made a search',
    title: 'Camille Dubois made a search',
    timestamp: 'Oct 18, 2025 at 6:14pm',
    date: '2025-10-18',
    time: '6:14pm',
    searchCriteria: [
      '3 beds',
      '3 baths',
      '$650,000 - $750,000',
      'Townhome / Single Family',
    ],
    addNoteLink: true,
  },

  // ── Oct 17 ──
  // existing p2-2
  {
    id: 'p2-2',
    type: 'favorited',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'favorited a property',
    title: 'Camille Dubois favorited a property',
    timestamp: 'Oct 17, 2025 at 7:00pm',
    date: '2025-10-17',
    time: '7:00pm',
    properties: [property1],
  },

  // ── Oct 15 ──
  {
    id: 'act-028',
    type: 'note',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'added a note',
    title: 'Jon Scharer added a note',
    note: 'Camille mentioned tight timeline — wants to be in new place by end of year. Spouse just accepted promotion at Google.',
    timestamp: 'Oct 15, 2025 at 2:30pm',
    date: '2025-10-15',
    time: '2:30pm',
  },

  // ── Oct 14 ──
  // existing p2-3
  {
    id: 'p2-3',
    type: 'drip_ended',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'ended drip subscription hiatus',
    title: 'Camille Dubois Drip Subscription Ended Hiatus',
    timestamp: 'Oct 14, 2025 at 12:40pm',
    date: '2025-10-14',
    time: '12:40pm',
    note: 'Subscription to drip campaign #139254 (Buyer Leads - Inactive Last 6 Months) taken off hiatus.',
  },

  // ── Oct 8 ──
  {
    id: 'act-029',
    type: 'buyer_consult_held',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'held buyer consultation',
    title: 'Jon Scharer held buyer consultation',
    note: 'Met at Starbucks on Stevens Creek. Reviewed needs, timeline, and budget. Camille is pre-approved up to $750K through Wells Fargo.',
    timestamp: 'Oct 8, 2025 at 10:00am',
    date: '2025-10-08',
    time: '10:00am',
  },

  // ── Oct 4 ──
  {
    id: 'act-030',
    type: 'buyer_consult_set',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'scheduled buyer consultation',
    title: 'Jon Scharer scheduled buyer consultation',
    note: 'Oct 8, 2025 · 10:00am · Starbucks Stevens Creek',
    timestamp: 'Oct 4, 2025 at 4:30pm',
    date: '2025-10-04',
    time: '4:30pm',
  },

  // ── Sep 28 ──
  {
    id: 'act-031',
    type: 'opted_in_lender_tcpa',
    actor: { name: 'Camille Dubois', avatarInitials: 'CD' },
    typeLabel: 'opted in to lender contact (TCPA)',
    title: 'Camille Dubois opted in to lender contact (TCPA)',
    timestamp: 'Sep 28, 2025 at 7:14pm',
    date: '2025-09-28',
    time: '7:14pm',
  },

  // ── Sep 25 ──
  {
    id: 'act-032',
    type: 'important_date_added',
    actor: { name: 'Jon Scharer', avatarInitials: 'JS' },
    typeLabel: 'added important date',
    title: 'Jon Scharer added important date',
    note: 'Anniversary · Dec 8, 2025',
    timestamp: 'Sep 25, 2025 at 1:42pm',
    date: '2025-09-25',
    time: '1:42pm',
  },

  // ── Sep 18 ──
  {
    id: 'act-033',
    type: 'gvl_verified',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'GVL verified',
    title: 'GVL verified',
    note: 'Phone and email verified',
    timestamp: 'Sep 18, 2025 at 9:00am',
    date: '2025-09-18',
    time: '9:00am',
  },

  // ── Sep 12 (Lead Creation) ──
  {
    id: 'act-034',
    type: 'was_assigned',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'assigned to agent',
    title: 'Assigned to agent',
    note: 'Assigned to Jon Scharer',
    timestamp: 'Sep 12, 2025 at 8:00am',
    date: '2025-09-12',
    time: '8:00am',
  },
  {
    id: 'act-035',
    type: 'round_robin',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'distributed via round robin',
    title: 'Distributed via round robin',
    timestamp: 'Sep 12, 2025 at 8:00am',
    date: '2025-09-12',
    time: '8:00am',
  },
  {
    id: 'act-036',
    type: 'created',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'lead created',
    title: 'Lead created',
    note: 'Source: Website form',
    timestamp: 'Sep 12, 2025 at 7:46am',
    date: '2025-09-12',
    time: '7:46am',
  },
  {
    id: 'act-037',
    type: 'imported',
    actor: { name: 'System', avatarInitials: 'SY' },
    typeLabel: 'imported from website',
    title: 'Imported from website',
    note: 'totallynotrealgeeks.com · contact form',
    timestamp: 'Sep 12, 2025 at 7:46am',
    date: '2025-09-12',
    time: '7:46am',
  },
];
