import { useState } from 'react';
import { navLinks } from './tokens';

export function TopNavigation() {
  const [active, setActive] = useState('#colors');

  const handleClick = (href: string) => {
    setActive(href);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-sizing-14 bg-brand-primary flex items-center px-spacing-8 animate-fade-in"
         style={{ animationDuration: '0.4s' }}>
      {/* Logo */}
      <div className="flex items-center gap-spacing-3 mr-spacing-10">
        <div className="w-sizing-8 h-sizing-8 bg-ink-white rounded-2 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-primary" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.12 3.56L12 11.3 4.88 7.74 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
          </svg>
        </div>
        <span className="text-text-4 font-semibold text-ink-white tracking-tight">Real Geeks</span>
        <span className="text-text-2 font-normal text-blue-30 ml-spacing-1">Design System</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-spacing-6">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => handleClick(link.href)}
            className={`text-text-3 font-normal transition-all duration-200 pb-1 border-b-2 cursor-pointer ${
              active === link.href
                ? 'text-ink-white border-ink-white'
                : 'text-blue-30 border-transparent hover:text-ink-white hover:border-blue-40'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
