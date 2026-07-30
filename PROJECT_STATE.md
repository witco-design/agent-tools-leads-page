# PROJECT_STATE.md

Snapshot of the **Lead Details** page prototype (a real estate CRM lead profile) as of the latest session. This file documents what the **code actually does**, not what was intended. Use it to seed a fresh chat context.

> Build status: `npm run build` passes cleanly (exit 0, no TypeScript errors). The only build output is an informational chunk-size advisory for the `LeadDetailPage` bundle (>500kB), which is a warning, not an error.

---

## 1. Project Overview

This is a **Lead Details page** prototype for a real estate CRM (Real Geeks). It renders a single lead's profile: a top contact-info strip, signal tags, a Geek AI Insights summary card, an activity history feed with pinned + date-grouped items, and a right column with two tabs (Info / Engagement) of draggable cards.

- **Framework:** React 18.2, Vite 7.1, TypeScript 5.8
- **Styling:** Tailwind CSS 3.4.1 + `tailwindcss-animate`, with a custom Real Geeks design-token config
- **UI primitives:** shadcn/ui-style components in `src/components/ui/*` built on Radix UI
- **Icons:** `lucide-react` 0.394
- **Other libs:** `react-router-dom` 6.23, `react-hook-form` + `zod`, `@dnd-kit/core` + `@dnd-kit/sortable` (drag reorder), `recharts`, `framer-motion`, `sonner` (toasts), `vaul` (drawer), `date-fns`
- **Routing:** `/` → `LeadDetailPage`; `/design-system` → design system showcase (`Home`)
- **Deployment URL:** Not known from this environment.

Source: `package.json`, `src/App.tsx`.

---

## 2. Design System — Tokens Currently Used

Source of truth: **`tailwind.config.js`**. Token scales are derived from Real Geeks Figma exports (referenced in the config header comments).

### Base color scales (10–120 step)
All defined under `theme.extend.colors`:

| Scale   | Notable stops                                                                 |
|---------|-------------------------------------------------------------------------------|
| `blue`  | 10 `#f5fcff` … 100 `#4172dc` (brand) … 120 `#3840a9` (focus ring)             |
| `gray`  | 10 `#fcfcfd` … 50 `#e4e7ec` (border) … 80 `#667085` (muted) … 120 `#101828`   |
| `green` | 10 `#f8fcfb` … 70 `#45ac86` … 120 `#11442c`                                  |
| `red`   | 10 `#fffafb` … 70 `#ec423d` … 120 `#b10005`                                  |
| `orange`| 10 `#fef5dd` … 70 `#f48a3c` … 120 `#aa5420`                                  |
| `purple`| 10 `#f6f6ff` … 100 `#3830a5` … 120 `#2d2684` (AI accent)                     |
| `ink`   | `white #FFFFFF`, `black #000000`                                             |

### Semantic color tokens (aliases over base scales)
- Surfaces: `bg-app #fcfcfd`, `bg-card #FFFFFF`, `bg-canvas #FFFFFF`, `bg-muted #fcfcfd`
- Text: `text-default #101828`, `text-secondary #475467`, `text-muted #667085`, `text-link #4172dc`, `text-link-hover #3e60c9`
- Borders: `border-default #e4e7ec`, `border-strong #d0d5dd`, `border-focus #4172dc`
- Brand: `brand-primary #4172dc`, `brand-primary-hover #3e60c9`
- Focus: `focus-ring #3840a9`, `focus-ring-default #101828`
- Status: success/warning/error/info `*-bg`, `*-border`, `*-text` triples
- Tag/chip: `tag-bg #dedcff`, `tag-text #322b95`
- Disabled: `disabled-content #98a2b3`, `disabled-bg #f2f4f7`

> **Important usage nuance:** semantic text tokens are referenced as Tailwind color utilities like `text-text-default`, `text-text-muted`, `bg-bg-app`, `border-border-default` (i.e. the token name includes its role prefix). The raw hex values above are the underlying definitions.

### Spacing tokens (`theme.extend.spacing`)
`spacing-0` 0px · `spacing-05` 2px · `spacing-1` 4px · `spacing-2` 8px · `spacing-3` 12px · `spacing-4` 16px · `spacing-5` 20px · `spacing-6` 24px · `spacing-7` 28px · `spacing-8` 32px · `spacing-9` 36px · `spacing-10` 40px · `spacing-11` 48px

### Sizing tokens (`theme.extend.width` / `height`)
`sizing-0` 0px through `sizing-15` 60px (in 4px steps, with a 4px jump 44→48→52…). Used as e.g. `w-sizing-6`, `h-sizing-8`.

### Border radius (`theme.extend.borderRadius`)
`rounded-1` 4px · `rounded-2` 8px · `rounded-3` 12px · `rounded-4` 16px · `rounded-round` 999px. Also shadcn aliases `lg`/`md`/`sm` via `--radius` CSS var.

> **PROTECTED:** Panel radius is `rounded-3` (12px), NOT 16px. Button radius is unified at `rounded-1` (4px).

### Typography (`theme.extend.fontSize`)
`text-1` 8px/10px · `text-2` 12px/16px · `text-3` 14px/20px · `text-4` 16px/24px · `text-5` 18px/24px · `text-6` 20px/24px · `text-7` 24px/32px · `text-8` 32px/40px · `text-9` 60px/60px

Font family: `lato` / `sans` → `'Lato', sans-serif`.

### Shadows (`theme.extend.boxShadow`)
`sm`, `md`, `lg` (layered multi-stop), plus `button-press: '0 0 0 2px #bfddff'`.

### Custom keyframes / animations (`theme.extend.keyframes` + `animation`)
`accordion-down/up`, `fade-in-up`, `fade-in`, `spin-slow`, `blink`, `chat-pulse`, `dot-pulse`, `badge-burst`, and notably **`shimmer`** (`shimmer 1.4s ease-in-out infinite`, background-position 200% → -200%) used by the Geek AI Insights loading skeleton.

---

## 3. Page Structure — Component Tree

Entry: `src/App.tsx` → lazy `LeadDetailPage` at `/`. Page root: `src/components/lead-detail/LeadDetailPage.tsx`.

```
LeadDetailPage (LeadDetailPage.tsx)
├── AppHeader (src/components/shell/AppHeader.tsx) — fixed top nav, full width
├── Sidebar (src/components/shell/Sidebar.tsx) — fixed left, 184px / 72px collapsed
│   └── Collapse toggle button (inline in LeadDetailPage, reads --sidebar-width)
├── LeadHeader (LeadHeader.tsx) — name + action buttons + back nav
├── Two-column grid [1fr_320px]:
│   ├── LEFT COLUMN:
│   │   ├── LeadSignalTagsCard (LeadSignalTagsCard.tsx) — color-coded Example tags
│   │   ├── ContactInfoCard (ContactInfoCard.tsx) — "Lead Data Snapshot" top strip
│   │   ├── RobinAISummaryCard (RobinAISummaryCard.tsx) — "Geek AI Insights" card
│   │   └── ActivityHistoryCard (ActivityHistoryCard.tsx)
│   │       └── ActivityItem (ActivityItem.tsx) — per-row activity
│   │           └── CallDetailDialog (CallDetailDialog.tsx) — call detail modal (call type only)
│   └── RIGHT COLUMN: RightColumn (RightColumn.tsx)
│       └── Tabs: Info | Engagement (sortable via @dnd-kit)
│           ├── Info tab cards:
│           │   ImportantNotesCard, ActivityStatsCard, HighlightsCard,
│           │   ContactInfoSection, SearchCriteriaCard, ImportantDatesCard,
│           │   TagsCard, SecondaryContactCard, LeadAssignmentCard, SourceCard
│           └── Engagement tab cards:
│               FollowUpsCard, WorkflowsCard, SavedSearchesCard, MarketReportsCard,
│               SmsEmailOptOutsCard, HomeValuationReportsCard
```

Shared primitives:
- `CollapsibleCard` (`CollapsibleCard.tsx`) — white card shell with header + collapse
- `SortableCard` (`SortableCard.tsx`) — dnd-kit wrapper for right-column reordering
- `PinnedFloatingDialog` (`src/components/PinnedFloatingDialog.tsx`)
- `ContactEditDialog` (`src/components/ContactEditDialog.tsx`)
- `ImportantNotesModal` (`ImportantNotesModal.tsx`)
- `LogActivityDialog` (`LogActivityDialog.tsx`)

Contexts: `ContactInfoContext` (`src/contexts/ContactInfoContext.tsx`), `ActivityFilterContext` (`ActivityFilterContext.tsx`), `DragHandleContext` (`DragHandleContext.tsx`).

Dev tooling: `src/devmode/*` (DevModeToggle / overlay / token inspector) — opt-in tooling, not part of the page UX.

---

## 4. Established Interaction Patterns

### PinnedFloatingDialog
- **What:** Panel-like floating dialog pinned to bottom-left of the content area, **no backdrop scrim**, page stays interactive. Respects `--sidebar-width` (`left: calc(var(--sidebar-width, 184px) + 16px)`).
- **Used for:** Important Notes "Expand" and Geek AI Insights "Expand".
- **File:** `src/components/PinnedFloatingDialog.tsx`

### ContactEditDialog
- **What:** Standard centered modal **with scrim**, task-focused (edit → save → close).
- **Used for:** Editing Contact Info (top strip) and Secondary Contact (right column).
- **File:** `src/components/ContactEditDialog.tsx`

### CallDetailDialog
- **What:** Centered modal **with scrim**, 4 tabs (Summary | Transcript | Recording | Coaching). Header shows call metadata. Content area `min-h-[480px] max-h-[70vh]` for stable sizing. Tabs left-aligned (`justify-start`).
- **Used for:** Call activities that have an `aiInsight` — opened via the "Geek AI Insights" button at the bottom of the call activity item.
- **File:** `src/components/lead-detail/CallDetailDialog.tsx`

### Field Menu Trigger (top contact strip)
- **What:** Clicking a contact value opens a Radix `DropdownMenu` with context actions: phone → Call/Text/Copy/Edit; email → Send Email/Copy/Edit; address → See On Map/Copy/Edit. "Edit" opens `ContactEditDialog` with that field auto-focused.
- **File:** `src/components/lead-detail/ContactInfoCard.tsx`

### Log Activity Tabs pattern
- **What:** Horizontal icon+label tabs with an underline indicator for the active state. Reused inside `CallDetailDialog`.
- **File:** `src/components/lead-detail/LogActivityDialog.tsx`, `CallDetailDialog.tsx`

### Shimmer generation state
- **What:** On first mount, `RobinAISummaryCard` shows a purple gradient shimmer skeleton for **600ms** (`setTimeout`), then reveals real content with a `fade-in` animation. The overflow/fade-gradient measurement runs only after `isGenerating` flips false.
- **File:** `src/components/lead-detail/RobinAISummaryCard.tsx`

### Hover-only Expand affordance
- **What:** An icon-only "Expand" button sits in the bottom-right of the tinted content area, `opacity-0 group-hover:opacity-100 focus-within:opacity-100`. No text label. Opens a `PinnedFloatingDialog`.
- **Used in:** ImportantNotesCard (blue accent) and RobinAISummaryCard (purple accent).

### Portal-to-body for fixed positioning
- **What:** `PinnedFloatingDialog` uses `createPortal(..., document.body)` to escape any transformed ancestor so its `position: fixed` anchoring is correct.
- **File:** `src/components/PinnedFloatingDialog.tsx`

---

## 5. PROTECTED Decisions

Explicit `PROTECTED` comment blocks found in the codebase. Do not change without direction.

| File | Protects | Rationale |
|------|----------|-----------|
| `src/components/PinnedFloatingDialog.tsx` | Pinned floating dialog primitive (bottom-left, no scrim, respects `--sidebar-width`) | View-focused, page-interactive — intentionally distinct from edit dialogs |
| `src/components/ContactEditDialog.tsx` | Shared edit dialog: centered modal **with** scrim | Task-focused (edit+save+close). Do not convert to pinned dialog or remove scrim |
| `src/components/lead-detail/CallDetailDialog.tsx` | Call detail dialog: centered modal with scrim, 4 tabs | Reading pattern, not pinned. Do not remove scrim |
| `src/components/lead-detail/RobinAISummaryCard.tsx` | (a) 600ms shimmer generation state — signature AI moment; (b) overflow measurement runs after `isGenerating` flips; (c) card structure = white outer + purple `bg-purple-10` tinted inner + hover-only Expand; no Edit button on AI header | Neutral chrome, color lives inside tinted area |
| `src/components/lead-detail/ImportantNotesCard.tsx` | (a) Standardized 200px scrollable content + bottom fade gradient for Notes & AI Insights (parity); (b) hover-only Expand affordance, icon-only | Visual parity between the two cards |
| `src/components/lead-detail/ContactInfoCard.tsx` | (a) Field menu trigger — both value and chevron open the same dropdown; (b) **Address is a SINGLE grid cell** at r3c1 with `flex items-start`, value column `flex-col items-end gap-0`, all lines `text-sm leading-5`; row 3 grid uses `xl:items-baseline`. Do NOT re-split into r3c1 + r4c1 | Visual grouping + tight line-spacing for multi-line address |
| `src/components/lead-detail/ContactInfoSection.tsx` | Right-column contact card renders display-only; empty fields hidden; edit via header Edit link → ContactEditDialog | Do not reintroduce inline inputs / Done button |
| `src/components/lead-detail/SecondaryContactCard.tsx` | Same display-only pattern as ContactInfoSection | Same as above |
| `src/components/lead-detail/LeadDetailPage.tsx` | Sidebar collapse toggle position reads `--sidebar-width` (with `translateX(-50%)` overlap). Do not hardcode `left` values | Toggle auto-follows sidebar width changes |
| `src/components/shell/Sidebar.tsx` | Broadcasts `--sidebar-width` on `document.documentElement` (184px / 72px) | Single source of truth consumed by toggle + pinned dialog |
| `src/devmode/DevModeToggle.tsx` | DevMode toggle position tracks `--sidebar-width` | Consistent with sidebar toggle |

**Token-level PROTECTED decisions** (no inline comment, but enforced by convention):
- Panel radius `rounded-3` (12px), NOT 16px
- Button radius unified at `rounded-1` (4px)
- Date formatting via `src/utils/formatDate.ts` — never inline `format()` calls

---

## 6. Anti-Patterns / Things Tried and Rejected

- **`items-baseline` alone** for aligning a multi-line address cell with single-line cells — unreliable. Current solution: `items-start` + explicit `text-sm leading-5` metrics on the cell, plus `xl:items-baseline` on the grid for cross-label baseline alignment.
- **Splitting the address into r3c1 + r4c1** (street on row 3, city/state/zip on row 4) — caused city/state/zip to misalign with IP. Recombined into a single cell.
- **Inline "Read more / Show less" expansion** on the AI Insights card — replaced with hover Expand → `PinnedFloatingDialog`.
- **Direct click-to-edit** on top strip values — replaced with a dropdown field menu → Edit.
- **Whole card purple background** on AI Insights — replaced with white outer + purple-tinted inner content area.
- **Typewriter animation** on AI content reveal — rejected in favor of shimmer skeleton + fade-in reveal.
- **Chevron collapse on Geek AI Insights card** — kept (card has a collapse chevron). Important Notes also keeps its collapse via `CollapsibleCard`.

---

## 7. Current Sample Data / Demo State

All data is hardcoded in component files (no Supabase persistence is wired into the UI).

### Lead (Contact Info)
Defined in `LeadDetailPage.tsx` `INITIAL_CONTACT_INFO`, consumed via `ContactInfoContext`:
- Name: **Camille Dubois** (firstName/lastName)
- Primary: (415) 555-0142 · Alt: (415) 555-0188 · Office/Fax: empty
- Email: cdubois@realgeeks.com
- Address: 123 Malcolm Street, Unit 3, Atlanta, GA 30019 (addressLine2 populated)

### Secondary Contact
In `SecondaryContactCard.tsx`: **Tom Dubois**, (214) 555-8832, tom.dubois@email.com (hardcoded demo).

### Signal Tags (top of page)
`LeadSignalTagsCard.tsx`: 4 "Example" badges with color-coded backgrounds — Purple/20 (`#EBEAFF`), Blue/30 (`#E4F2FF`), Green/30 (`#E0F1EC`), Orange/20 (`#FBE4AB`).

> **Discrepancy flagged:** `TagsCard.tsx` (right-column "Custom Tags") uses 3 "Example" tags with plain `bg-gray-30` chips (not color-coded), plus add/delete-with-confirm. The color-coded set lives only in `LeadSignalTagsCard`. If a task refers to "color-coded Custom Tags," verify which card is meant.

### Important Notes
`ImportantNotesCard.tsx` `NOTE_CONTENT`: multi-paragraph note about Camille (first-time buyer, CA, spouse in tech, 3BR Bay Area, pre-approved $750K, etc.).

### Geek AI Insights summary
`RobinAISummaryCard.tsx`: hardcoded `SUMMARY_TEXT` + `NEXT_STEP_TEXT` (Camille 14 visits / 2 weeks; next-step nudge). (The full per-call insight data lives on activity items, see below.)

### Activity feed
`activityData.ts` exports: `upcomingItems` (2 follow-ups), `pinnedItem` (1 pinned call), `page1Items` (recent, Nov 12 → Nov 1), `page2Items` (older, Oct 28 → Sep 12). Total ~40 items across pinned + date-grouped sections.

**Demo call activities with full `aiInsight`:**
- `pinnedItem` ("pinned-1", Nov 5 2025): full summary + `nextStep` + 10-line `transcript` (Kevin/Camille) + `recordingUrl: '/samples/call-recording.mp3'` + `coaching` (42%/58% talk-time, 5 feedback bullets). This is the canonical fully-populated call.
- `page1Items` "p1-1" (Nov 3 2025): full summary + `nextStep` + 6-line transcript + `recordingUrl: '#stub-recording-p1-1'` + coaching (42%/58%, 4 feedback bullets).
- `page1Items` "act-006" (Nov 11): has `aiInsight` but ONLY `summary` + `transcriptUrl`/`recordingUrl` stubs (no transcript/coaching arrays) → its Transcript/Coaching tabs will show empty states.

> **Note:** The `recordingUrl: '/samples/call-recording.mp3'` file does not exist in the repo; the audio player will render but the media won't load. Stub `#stub-...` URLs are intentional placeholders.

### Follow Ups
`FollowUpsCard.tsx` `initialFollowUps`: 2 items — "Call back" (Nov 9, video, alarm) and "Send listings" (Nov 12, email). Add/edit dialogs are functional (local state).

### Right-column cards (sample data sources)
- `WorkflowsCard.tsx`, `SavedSearchesCard.tsx` (has `initialSearches`), `MarketReportsCard.tsx`, `HomeValuationReportsCard.tsx`, `SmsEmailOptOutsCard.tsx` — each carries its own hardcoded demo content. (Inventory not fully enumerated here; read each file for exact items.)
- `ActivityStatsCard.tsx` (`stats` array), `HighlightsCard.tsx`, `SearchCriteriaCard.tsx` (`fields`), `ImportantDatesCard.tsx` (`INITIAL_DATES`), `LeadAssignmentCard.tsx`, `SourceCard.tsx` — hardcoded demo content.

---

## 8. Recent Changes (latest session)

- **Address recombine into single grid cell** — applied (prior session). r3c1 holds label + a `flex-col items-end gap-0` value column stacking street → (optional Line 2) → city/state/zip, all `text-sm leading-5`; grid uses `xl:items-baseline`. Row 4 left column is empty.
- **Top contact strip: demo address + truncation + uniform row heights** — applied. (a) Demo address changed to shorter reference data: `123 Malcolm Street / Unit 3 / Atlanta, GA 30019` (populates Address Line 2 so all 3 lines render). (b) Removed `truncate` + `max-w-full` from all 3 address value spans; replaced with `whitespace-nowrap` so lines stay on one line without clipping. (c) All 12 content cells changed to `items-start min-h-[60px]` (was `items-center min-h-9` for most) so every grid row is a uniform 60px regardless of content height. Dividers left unchanged.
- **Field-menu triggers verified intact** — Primary, Email, and all 3 Address lines render as `<button>` inside `DropdownMenuTrigger`; chevron only on street (line 1). No fix was needed.
- **CallDetailDialog cleanups** — applied: (a) "Geek AI Insights" button relocated from top-right action cluster to a new right-aligned row at the bottom of call activity items (`mt-spacing-3`); (b) tabs left-aligned (`justify-start`); (c) green phone-icon avatar removed from header; (d) content area `min-h-[480px] max-h-[70vh]` for stable sizing; (e) `pinnedItem` `aiInsight` fully populated with nextStep/transcript/recordingUrl/coaching.
- **Geek AI Insights card structure** — applied (white outer + purple-tinted inner + shimmer + hover-only Expand). Predates this session but verified intact.
- **Sidebar width 184px expanded / 72px collapsed**, broadcast via `--sidebar-width` on `document.documentElement` — applied (`Sidebar.tsx`).
- **Sidebar collapse toggle** uses `var(--sidebar-width)` with `translateX(-50%)` overlap — applied.
- **Page background** `bg-bg-app` (gray.10 `#fcfcfd`) — applied.

---

## 9. Known Issues / Ongoing Debugging

- **Cross-column baseline alignment (top strip):** `xl:items-baseline` + `items-start min-h-[60px]` + `text-sm leading-5` should produce uniform 60px rows with top-aligned labels. Not pixel-verified in DevTools this session — needs DOM check that row-3 label baselines (Address/Login/Type) align.
- **Address Line 2 now populated:** demo data has `addressLine2: 'Unit 3'`, so the conditional Line 2 line renders. Visually confirmed in code that it stacks between street and city/state/zip with `gap-0` + `leading-5`. Needs browser verification that all 3 lines fit without wrapping or truncation in the ~150px value column.
- **`act-006` call activity** has only a stub `aiInsight` (no transcript/coaching arrays) → its CallDetailDialog Transcript/Recording/Coaching tabs will show empty states. Not a regression; the demo was only fully populated for `pinnedItem` and `p1-1`.
- **`/samples/call-recording.mp3`** does not exist in the repo; the Recording tab's audio player will render but media won't play.
- **Pre-existing TS error** in `ActivityHistoryCard.tsx` (`notifyRecipient`/`notifyMe` prop mismatch) — **fixed this session**. `npm run build` now passes cleanly.

---

## 10. Verification Checklist for Fresh Session

- [ ] Sidebar expanded width is 184px; collapsed is 72px
- [ ] `--sidebar-width` CSS variable is set on `document.documentElement` (check in DevTools)
- [ ] Sidebar collapse toggle circle overlaps the sidebar/content edge and slides on toggle
- [ ] Top contact strip: Address is ONE cell — street, (optional Line 2), and city/state/zip all stack tight, right-aligned, only street has a chevron
- [ ] Address label baseline aligns with Login label baseline and Type label baseline (row 3)
- [ ] Row 4 left column is empty; middle/right columns still show IP and Timeframe at row 4
- [ ] Geek AI Insights card has white outer + purple (`bg-purple-10`) inner content area
- [ ] Important Notes card has white outer + orange (`bg-orange-10`) inner content area
- [ ] Both Expand buttons are hover-only (icon-only when visible), bottom-right of tinted area
- [ ] Geek AI Insights shows a shimmer skeleton for ~600ms on first load, then fades in real content
- [ ] Call activities show a "Geek AI Insights" button at the BOTTOM of the item (right-aligned), not in the top-right action cluster
- [ ] CallDetailDialog: tabs are left-aligned; header has no phone icon; dialog stays ≥480px tall across tabs
- [ ] All 4 CallDetailDialog tabs render real content for the pinned Nov 5 call (Summary, 10-line Transcript, Recording player, Coaching with 42/58 bars + 5 bullets)
- [ ] Contact edit uses ContactEditDialog (centered modal with scrim); field menu "Edit" opens it with the field focused
- [ ] Important Notes / Geek AI "Expand" opens a PinnedFloatingDialog (no scrim, page interactive, pinned bottom-left respecting sidebar width)
- [ ] Right-column Info/Engagement cards are drag-reorderable
- [ ] No new console errors on page load
