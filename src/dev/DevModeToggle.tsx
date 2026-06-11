import { Code2 } from 'lucide-react';
import { useDevMode } from './DevModeContext';
import { InspectorPanel } from './InspectorPanel';
import { DevModeOverlay } from './DevModeOverlay';

export function DevModeToggle() {
  const { active, setActive } = useDevMode();

  return (
    <>
      {/* Floating toggle button — bottom-left, outside sidebar */}
      <button
        type="button"
        data-devmode-toggle
        onClick={() => setActive(!active)}
        aria-label={active ? 'Exit DevMode' : 'Enter DevMode'}
        aria-pressed={active}
        className={`fixed bottom-4 left-[240px] z-50 h-10 w-10 inline-flex items-center justify-center rounded-full shadow-lg transition cursor-pointer ${
          active
            ? 'bg-[#3e60c9] text-white hover:bg-[#3840a9]'
            : 'bg-[#101828] text-white hover:bg-[#1d2939]'
        }`}
      >
        <Code2 className="w-5 h-5" />
      </button>

      {/* Hover/selection overlays */}
      <DevModeOverlay />

      {/* Right-docked inspector panel */}
      {active && (
        <div
          data-devmode-panel
          className="fixed top-0 right-0 bottom-0 w-[380px] z-[60] border-l border-[#e4e7ec] bg-white shadow-2xl overflow-y-auto"
        >
          <InspectorPanel />
        </div>
      )}
    </>
  );
}
