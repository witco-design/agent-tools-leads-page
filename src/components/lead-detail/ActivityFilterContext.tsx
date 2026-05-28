import { createContext, useContext, useState, type ReactNode } from 'react';

interface ActivityFilterContextType {
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  toggleFilter: (filter: string) => void;
}

const ActivityFilterContext = createContext<ActivityFilterContextType>({
  activeFilter: null,
  setActiveFilter: () => {},
  toggleFilter: () => {},
});

export function ActivityFilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  };

  return (
    <ActivityFilterContext.Provider value={{ activeFilter, setActiveFilter, toggleFilter }}>
      {children}
    </ActivityFilterContext.Provider>
  );
}

export function useActivityFilter() {
  return useContext(ActivityFilterContext);
}
