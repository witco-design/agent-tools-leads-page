import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Users,
  Mail,
  CalendarCheck,
  Split,
  Star,
  UserCog,
  Settings,
  ListChecks,
  ChevronDown,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

// ── Nav config ───────────────────────────────────────────────────
interface SubmenuItem {
  label: string;
  path: string;
}

interface NavItemConfig {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: SubmenuItem[];
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    icon: BarChart3,
    label: 'Dashboard',
    children: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Agent Stats', path: '/dashboard/agent-stats' },
      { label: 'Agent Activity', path: '/dashboard/agent-activity' },
    ],
  },
  {
    icon: Users,
    label: 'Leads',
    children: [
      { label: 'Leads List', path: '/leads' },
      { label: 'Buyers List', path: '/buyers' },
      { label: 'Import', path: '/leads/import' },
      { label: 'Ponds', path: '/leads/ponds' },
    ],
  },
  {
    icon: Mail,
    label: 'Inbox',
    children: [
      { label: 'Emails', path: '/inbox/emails' },
      { label: 'Texts', path: '/inbox/texts' },
      { label: 'Live Chat', path: '/inbox/live-chat' },
      { label: 'eBlasts', path: '/inbox/eblasts' },
      { label: 'Videos', path: '/inbox/videos' },
      { label: 'Postcards', path: '/inbox/postcards' },
      { label: 'Templates', path: '/inbox/templates' },
      { label: 'Message Settings', path: '/inbox/settings' },
    ],
  },
  {
    icon: CalendarCheck,
    label: 'Calendar',
    children: [
      { label: 'Calendar View', path: '/calendar' },
      { label: 'All Follow-Ups', path: '/calendar/follow-ups' },
    ],
  },
  {
    icon: Split,
    label: 'Automations',
    children: [
      { label: 'Drip Workflows', path: '/automations/workflows' },
      { label: 'Drip Library', path: '/automations/library' },
      { label: 'Reactive Responses', path: '/automations/reactive' },
      { label: 'Geek AI', path: '/automations/ai' },
      { label: 'Office Hours', path: '/automations/hours' },
    ],
  },
  {
    icon: Star,
    label: 'Marketing',
    children: [
      { label: 'Pro Lead Gen', path: '/marketing/pro-lead-gen' },
      { label: 'FB Ad Tool', path: '/marketing/fb-ads' },
      { label: 'Design & Print', path: '/marketing/design' },
      { label: 'Self-Serve Ads', path: '/marketing/self-serve' },
      { label: 'Brand Boost', path: '/marketing/brand-boost' },
    ],
  },
  {
    icon: UserCog,
    label: 'Users',
    children: [
      { label: 'Users List', path: '/users' },
      { label: 'Lead Assignment', path: '/users/assignment' },
      { label: 'Pond Availability', path: '/users/pond-availability' },
    ],
  },
  {
    icon: Settings,
    label: 'Settings',
    children: [
      { label: 'Profile', path: '/settings/profile' },
      { label: 'Notifications', path: '/settings/notifications' },
      { label: 'Integrations', path: '/settings/integrations' },
      { label: 'Edit Website', path: '/settings/website' },
      { label: 'Comms', path: '/settings/comms' },
      { label: 'Calendar', path: '/settings/calendar' },
      { label: 'Customize', path: '/settings/customize' },
    ],
  },
];

const FOOTER_ITEM: NavItemConfig = {
  icon: ListChecks,
  label: 'Setup Checklist',
  path: '/setup-checklist',
};

// ── Helper: find which parent owns the active route ──────────────
function findActiveParent(items: NavItemConfig[], activePath: string): string | null {
  for (const item of items) {
    if (item.children?.some((c) => c.path === activePath)) {
      return item.label;
    }
  }
  return null;
}

// ── Component ────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  // Active route — in a real app this would use useLocation()
  const activePath = '/leads';

  // Multiple submenus can be open simultaneously (Set-based)
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const activeParent = findActiveParent(NAV_ITEMS, activePath);
    if (activeParent) initial.add(activeParent);
    return initial;
  });

  // Close all submenus when sidebar collapses
  useEffect(() => {
    if (collapsed) setOpenSubmenus(new Set());
  }, [collapsed]);

  const toggleSubmenu = useCallback((label: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const handleNavClick = useCallback(
    (item: NavItemConfig) => {
      if (item.children) {
        if (collapsed) {
          // Expand sidebar first, then open submenu
          onToggle();
          setTimeout(() => {
            setOpenSubmenus((prev) => {
              const next = new Set(prev);
              next.add(item.label);
              return next;
            });
          }, 200);
        } else {
          toggleSubmenu(item.label);
        }
      }
      // Items without children would navigate — no-op in prototype
    },
    [collapsed, onToggle, toggleSubmenu],
  );

  const isParentActive = useCallback(
    (item: NavItemConfig) => {
      if (item.path === activePath) return true;
      if (item.children?.some((c) => c.path === activePath)) return true;
      return false;
    },
    [activePath],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        data-state={collapsed ? 'collapsed' : 'expanded'}
        className="fixed top-14 bottom-0 left-0 z-20 flex flex-col"
        style={{
          width: collapsed ? 72 : 220,
          background: '#3E60C9',
          transition: 'width 180ms ease',
        }}
      >
        {/* ── Brand row ─────────────────────────────────────── */}
        <div className="h-14 flex items-center px-4 shrink-0 border-b border-white/10">
          {!collapsed && (
            <span className="text-text-5 font-bold text-white lowercase tracking-tight whitespace-nowrap overflow-hidden">
              realgeeks
            </span>
          )}
        </div>

        {/* ── Nav list ──────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              collapsed={collapsed}
              parentActive={isParentActive(item)}
              submenuOpen={openSubmenus.has(item.label)}
              activePath={activePath}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </nav>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-white/10">
          <NavRow
            item={FOOTER_ITEM}
            collapsed={collapsed}
            parentActive={FOOTER_ITEM.path === activePath}
            submenuOpen={false}
            activePath={activePath}
            onClick={() => {}}
          />
        </div>
      </aside>
    </TooltipProvider>
  );
}

// ── NavRow sub-component ─────────────────────────────────────────
interface NavRowProps {
  item: NavItemConfig;
  collapsed: boolean;
  parentActive: boolean;
  submenuOpen: boolean;
  activePath: string;
  onClick: () => void;
}

function NavRow({ item, collapsed, parentActive, submenuOpen, activePath, onClick }: NavRowProps) {
  const Icon = item.icon;
  const hasChildren = !!item.children;

  // Active child exists under this parent?
  const hasActiveChild = hasChildren && item.children!.some((c) => c.path === activePath);

  // Parent-level "active" treatment:
  // - If parent has children AND an active child → "active group" (subtle bg, NO left bar)
  // - If parent has no children AND is the active path → full active (bg + left bar)
  const isDirectActive = !hasChildren && item.path === activePath;
  const showActiveBg = parentActive;
  const showLeftBar = isDirectActive;

  const row = (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 cursor-pointer transition-colors relative"
      style={{
        height: 44,
        background: showActiveBg ? 'rgba(255,255,255,0.12)' : 'transparent',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
      onMouseEnter={(e) => {
        if (!showActiveBg) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        if (!showActiveBg) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Active indicator bar — only for items without children */}
      {showLeftBar && (
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-white"
          style={{ borderRadius: 0 }}
        />
      )}
      <Icon className="w-[18px] h-[18px] text-white shrink-0" />
      {!collapsed && (
        <>
          <span className="text-[14px] font-semibold text-white flex-1 text-left whitespace-nowrap overflow-hidden">
            {item.label}
          </span>
          {hasChildren && (
            <ChevronDown
              className="w-4 h-4 text-white/70 shrink-0 transition-transform duration-200"
              style={{ transform: submenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          )}
        </>
      )}
    </button>
  );

  // Calculate submenu max-height for animation
  const submenuMaxHeight = submenuOpen && item.children ? item.children.length * 36 : 0;

  return (
    <div>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{row}</TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-120 text-white text-sm px-3 py-1.5 font-normal">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        row
      )}

      {/* Submenu with expand/collapse animation (expanded state only) */}
      {hasChildren && !collapsed && (
        <div
          style={{
            maxHeight: submenuMaxHeight,
            transition: 'max-height 180ms ease',
            overflow: 'hidden',
          }}
        >
          {item.children!.map((child) => {
            const childActive = child.path === activePath;
            return (
              <button
                key={child.label}
                type="button"
                className="w-full flex items-center cursor-pointer transition-colors relative"
                style={{
                  height: 36,
                  paddingLeft: 48,
                  paddingRight: 16,
                  background: childActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!childActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!childActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {childActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-white" />
                )}
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {child.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
