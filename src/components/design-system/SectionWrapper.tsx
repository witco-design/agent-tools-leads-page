import { useInView } from './useInView';

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}

export function SectionWrapper({ id, title, subtitle, children, delay = 0 }: SectionWrapperProps) {
  const { ref, inView } = useInView();

  return (
    <section id={id} className="scroll-mt-[72px]">
      <div className="border-t border-border-default my-spacing-8" />
      <div
        ref={ref}
        className="opacity-0"
        style={{
          animation: inView ? `fade-in-up 0.3s ease-out ${delay}ms forwards` : 'none',
        }}
      >
        <div className="mb-spacing-6">
          <h2 className="text-text-7 font-semibold text-text-default">{title}</h2>
          {subtitle && (
            <p className="text-text-3 font-normal text-text-secondary mt-spacing-1">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
