import {
  BarChart3,
  Users,
  Mail,
  Calendar,
  Zap,
  Megaphone,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: BarChart3 },
  { label: 'Leads', icon: Users, active: true },
  { label: 'Comms', icon: Mail },
  { label: 'Calendar', icon: Calendar },
  { label: 'Automations', icon: Zap },
  { label: 'Advertising', icon: Megaphone },
  { label: 'Users', icon: User },
  { label: 'Settings', icon: Settings },
];

export function LeftNav() {
  return (
    <aside className="w-[200px] shrink-0 min-w-[200px] bg-blue-110 flex flex-col h-full">
      {/* Wordmark */}
      <div className="p-spacing-6">
        <span className="text-text-6 font-semibold text-white lowercase tracking-tight">
          realgeeks
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-spacing-1 px-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center h-12 px-spacing-4 gap-spacing-2 cursor-pointer transition-colors duration-150 ${
                item.active
                  ? 'bg-blue-100 border-l-[3px] border-white'
                  : 'hover:bg-blue-100 border-l-[3px] border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 text-white shrink-0" />
              <span className="text-text-3 font-normal text-white flex-1">
                {item.label}
              </span>
              <ChevronDown className="w-4 h-4 text-white opacity-70 shrink-0" />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
