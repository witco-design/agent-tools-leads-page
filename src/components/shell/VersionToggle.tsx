import { useVersion, type Version } from '@/contexts/VersionContext';
import { cn } from '@/lib/utils';

const SEGMENTS: { label: string; value: Version }[] = [
  { label: 'V1', value: 'V1' },
  { label: 'V2', value: 'V2' },
];

export function VersionToggle() {
  const { version, setVersion } = useVersion();

  return (
    <div
      role="group"
      aria-label="Experience version"
      // Tracks --sidebar-width (broadcast by Sidebar.tsx) plus the DevMode
      // button width (40px) and the gap (8px) so this toggle sits just to
      // the right of the DevMode button and moves with it on collapse/expand.
      style={{
        left: 'calc(var(--sidebar-width, 184px) + 16px + 40px + 8px)',
      }}
      className="fixed bottom-4 z-50 h-10 inline-flex items-center gap-1 p-1 rounded-full bg-[#101828] shadow-lg transition-[left] duration-200"
    >
      {SEGMENTS.map((seg) => {
        const active = version === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            onClick={() => setVersion(seg.value)}
            aria-pressed={active}
            className={cn(
              'h-8 px-3 rounded-full text-sm font-semibold transition-colors cursor-pointer',
              active
                ? 'bg-blue-100 text-white'
                : 'text-white/60 hover:text-white',
            )}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
