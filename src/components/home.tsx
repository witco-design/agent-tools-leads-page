import { TopNavigation } from './design-system/TopNavigation';
import { SectionWrapper } from './design-system/SectionWrapper';
import { ColorPaletteSection } from './design-system/ColorPaletteSection';
import { TypeRampSection } from './design-system/TypeRampSection';
import { SemanticAliasCards } from './design-system/SemanticAliasCards';
import { SpacingSizingGrid } from './design-system/SpacingSizingGrid';
import { BorderRadiusStrip } from './design-system/BorderRadiusStrip';
import { ShadowShowcase } from './design-system/ShadowShowcase';
import { ComponentSampler } from './design-system/ComponentSampler';
import { useInView } from './design-system/useInView';

function Home() {
  const { ref: titleRef, inView: titleInView } = useInView();

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Page Shell */}
      <main className="pt-sizing-14 px-spacing-8">
        <div className="max-w-[1200px] mx-auto py-spacing-10">
          {/* Page Title */}
          <div
            ref={titleRef}
            className="mb-spacing-4 opacity-0"
            style={{
              animation: titleInView ? 'fade-in-up 0.3s ease-out 200ms forwards' : 'none',
            }}
          >
            <h1 className="text-text-8 font-semibold text-text-default tracking-tight">
              Component Library
            </h1>
            <p className="text-text-4 font-normal text-text-secondary mt-spacing-2 max-w-[640px]">
              A living style guide and reference implementation of the Real Geeks design system.
              Every token — color, spacing, radius, shadow, and type ramp — is applied to real UI components.
            </p>
          </div>

          {/* Color Palette Section */}
          <SectionWrapper
            id="colors"
            title="Color Palette"
            subtitle="Complete color scales with 12 steps each. Click any swatch to copy its Tailwind utility class."
            delay={60}
          >
            <ColorPaletteSection />
          </SectionWrapper>

          {/* Typography Section */}
          <SectionWrapper
            id="typography"
            title="Type Ramp"
            subtitle="Lato in Regular (400) and Semi-Bold (600) across nine scale steps."
            delay={120}
          >
            <TypeRampSection />
          </SectionWrapper>

          {/* Semantic Alias Cards */}
          <SectionWrapper
            id="aliases"
            title="Semantic Aliases"
            subtitle="Named tokens that map raw scale values to contextual roles. Click any row to copy the token name."
            delay={180}
          >
            <SemanticAliasCards />
          </SectionWrapper>

          {/* Spacing & Sizing Grid */}
          <SectionWrapper
            id="spacing"
            title="Spacing & Sizing"
            subtitle="Named spacing and sizing tokens used for all gaps, padding, margins, and component dimensions."
            delay={240}
          >
            <SpacingSizingGrid />
          </SectionWrapper>

          {/* Border Radius Strip */}
          <SectionWrapper
            id="radius"
            title="Border Radius"
            subtitle="Five radius tokens from subtle rounding to fully circular elements."
            delay={300}
          >
            <BorderRadiusStrip />
          </SectionWrapper>

          {/* Shadow Showcase */}
          <SectionWrapper
            id="shadows"
            title="Shadows"
            subtitle="Three elevation levels for layered depth. Hover to see shadow upgrades."
            delay={360}
          >
            <ShadowShowcase />
          </SectionWrapper>

          {/* Component Sampler */}
          <SectionWrapper
            id="components"
            title="Component Sampler"
            subtitle="Assembled components built exclusively from design system tokens. Interactive demos for buttons, inputs, tags, and status banners."
            delay={420}
          >
            <ComponentSampler />
          </SectionWrapper>

          {/* Footer spacing */}
          <div className="border-t border-border-default mt-spacing-8 pt-spacing-6 pb-spacing-10">
            <p className="text-text-2 font-normal text-text-muted text-center">
              Real Geeks Design System &middot; Built with React, Tailwind CSS, and named tokens
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
