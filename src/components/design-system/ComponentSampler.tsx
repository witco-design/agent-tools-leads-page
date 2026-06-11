import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon,
  Home,
  Star,
  ArrowRight,
  X,
} from 'lucide-react';

type ButtonState = 'default' | 'hover' | 'focus' | 'disabled';
const buttonStates: ButtonState[] = ['default', 'hover', 'focus', 'disabled'];

export function ComponentSampler() {
  const [primaryState, setPrimaryState] = useState<ButtonState>('default');
  const [secondaryState, setSecondaryState] = useState<ButtonState>('default');

  const cyclePrimary = () => {
    const idx = buttonStates.indexOf(primaryState);
    setPrimaryState(buttonStates[(idx + 1) % buttonStates.length]);
  };

  const cycleSecondary = () => {
    const idx = buttonStates.indexOf(secondaryState);
    setSecondaryState(buttonStates[(idx + 1) % buttonStates.length]);
  };

  const getPrimaryStyles = (state: ButtonState) => {
    const base = 'inline-flex items-center justify-center h-sizing-11 px-spacing-6 rounded-round text-text-3 font-semibold transition-all duration-200 cursor-pointer select-none';
    switch (state) {
      case 'default':
        return `${base} bg-brand-primary text-ink-white`;
      case 'hover':
        return `${base} bg-brand-primary-hover text-ink-white`;
      case 'focus':
        return `${base} bg-brand-primary text-ink-white ring-2 ring-blue-40 ring-offset-2`;
      case 'disabled':
        return `${base} bg-gray-40 text-gray-70 cursor-not-allowed`;
    }
  };

  const getSecondaryStyles = (state: ButtonState) => {
    const base = 'inline-flex items-center justify-center h-sizing-11 px-spacing-6 rounded-round text-text-3 font-semibold transition-all duration-200 cursor-pointer select-none border';
    switch (state) {
      case 'default':
        return `${base} bg-bg-canvas border-border-default text-text-default`;
      case 'hover':
        return `${base} bg-bg-muted border-border-default text-text-default`;
      case 'focus':
        return `${base} bg-bg-canvas border-border-default text-text-default ring-2 ring-focus-ring ring-offset-2`;
      case 'disabled':
        return `${base} bg-gray-20 border-border-default text-gray-60 cursor-not-allowed`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-6">
      {/* Primary & Secondary Buttons */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Buttons</h3>
        <p className="text-text-2 font-normal text-text-muted mb-spacing-2">Click to cycle states: default → hover → focus → disabled</p>

        <div className="space-y-spacing-4">
          <div>
            <div className="text-text-2 font-semibold text-text-secondary mb-spacing-2">
              Primary Button
              <span className="ml-spacing-2 text-text-1 font-normal text-text-muted">({primaryState})</span>
            </div>
            <button className={getPrimaryStyles(primaryState)} onClick={cyclePrimary}>
              Get Started
              <ArrowRight className="ml-spacing-2 w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-text-2 font-semibold text-text-secondary mb-spacing-2">
              Secondary Button
              <span className="ml-spacing-2 text-text-1 font-normal text-text-muted">({secondaryState})</span>
            </div>
            <button className={getSecondaryStyles(secondaryState)} onClick={cycleSecondary}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Text Input</h3>
        <p className="text-text-2 font-normal text-text-muted mb-spacing-2">Click the input to see the focus ring</p>

        <div className="space-y-spacing-3">
          <label className="text-text-3 font-semibold text-text-default block">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full h-sizing-11 px-spacing-3 bg-bg-muted border border-border-default rounded-1 text-text-3 font-normal text-text-default placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all duration-200"
          />
          <p className="text-text-2 font-normal text-text-muted">Focus ring uses <code className="text-text-2 font-semibold text-brand-primary bg-blue-10 px-1 rounded-1">focus-ring (gray.120)</code></p>
        </div>
      </div>

      {/* Tag Chip */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Tag Chip</h3>

        <div className="flex gap-spacing-2 flex-wrap">
          <span className="inline-flex items-center px-spacing-2 h-[28px] bg-tag-bg text-tag-text text-text-2 font-semibold rounded-round">
            Featured
          </span>
          <span className="inline-flex items-center px-spacing-2 h-[28px] bg-tag-bg text-tag-text text-text-2 font-semibold rounded-round">
            New Listing
          </span>
          <span className="inline-flex items-center px-spacing-2 h-[28px] bg-tag-bg text-tag-text text-text-2 font-semibold rounded-round gap-1">
            Open House
            <X className="w-3 h-3 opacity-70 hover:opacity-100 cursor-pointer" />
          </span>
        </div>
        <p className="text-text-2 font-normal text-text-muted">
          <code className="text-text-2 font-semibold text-brand-primary bg-blue-10 px-1 rounded-1">tag-bg (purple.30)</code> bg +{' '}
          <code className="text-text-2 font-semibold text-brand-primary bg-blue-10 px-1 rounded-1">tag-text (purple.110)</code> text
        </p>
      </div>

      {/* Status Banners */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Status Banners</h3>

        {/* Online Now Banner */}
        <div className="bg-success-bg border border-success-border rounded-1 px-spacing-4 py-spacing-3 flex items-center gap-spacing-3">
          <CheckCircle2 className="w-5 h-5 text-success-text flex-shrink-0" />
          <div>
            <div className="text-text-3 font-semibold text-success-text">Online Now</div>
            <div className="text-text-2 font-normal text-success-text/80">Agent is currently available</div>
          </div>
        </div>

        {/* Important Notes Card */}
        <div className="bg-warning-bg border border-warning-border rounded-3 px-spacing-4 py-spacing-3 flex items-start gap-spacing-3">
          <AlertTriangle className="w-5 h-5 text-warning-text flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-text-3 font-semibold text-warning-text">Important Notes</div>
            <div className="text-text-3 font-normal text-text-default">
              Please review the property disclosure documents before scheduling your visit.
            </div>
          </div>
        </div>
      </div>

      {/* Link Text & Icons */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Link Text</h3>

        <div className="space-y-spacing-2">
          <a href="#" className="text-text-3 text-text-link underline underline-offset-2 hover:text-brand-primary-hover transition-colors duration-150 block">
            View all available properties
          </a>
          <a href="#" className="text-text-3 text-text-link underline underline-offset-2 hover:text-brand-primary-hover transition-colors duration-150 block">
            Contact our sales team
          </a>
        </div>
        <p className="text-text-2 font-normal text-text-muted">
          Using <code className="text-text-2 font-semibold text-brand-primary bg-blue-10 px-1 rounded-1">text-link (blue.110)</code> with underline
        </p>
      </div>

      {/* Icon Specimen */}
      <div className="bg-bg-canvas rounded-3 shadow-md border border-border-default p-spacing-6 space-y-spacing-4">
        <h3 className="text-text-4 font-semibold text-text-default">Icon Specimen</h3>
        <p className="text-text-2 font-normal text-text-muted mb-spacing-2">16px icons with color flexibility</p>

        <div className="flex items-center gap-spacing-6">
          <div className="flex flex-col items-center gap-spacing-1">
            <Home className="w-4 h-4 text-icon-default" />
            <span className="text-text-1 font-normal text-text-muted">icon-default</span>
          </div>
          <div className="flex flex-col items-center gap-spacing-1">
            <Star className="w-4 h-4 text-brand-primary" />
            <span className="text-text-1 font-normal text-text-muted">brand-primary</span>
          </div>
          <div className="flex flex-col items-center gap-spacing-1">
            <CheckCircle2 className="w-4 h-4 text-success-text" />
            <span className="text-text-1 font-normal text-text-muted">success-text</span>
          </div>
          <div className="flex flex-col items-center gap-spacing-1">
            <LinkIcon className="w-4 h-4 text-text-link" />
            <span className="text-text-1 font-normal text-text-muted">text-link</span>
          </div>
          <div className="flex flex-col items-center gap-spacing-1">
            <AlertTriangle className="w-4 h-4 text-warning-text" />
            <span className="text-text-1 font-normal text-text-muted">warning-text</span>
          </div>
          <div className="flex flex-col items-center gap-spacing-1">
            <X className="w-4 h-4 text-error-text" />
            <span className="text-text-1 font-normal text-text-muted">error-text</span>
          </div>
        </div>
      </div>
    </div>
  );
}
