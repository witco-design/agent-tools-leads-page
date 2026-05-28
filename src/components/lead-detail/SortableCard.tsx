import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleContext } from './DragHandleContext';

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

export function SortableCard({ id, children }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.12)' : undefined,
  };

  return (
    <DragHandleContext.Provider value={{ attributes, listeners }}>
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    </DragHandleContext.Provider>
  );
}
