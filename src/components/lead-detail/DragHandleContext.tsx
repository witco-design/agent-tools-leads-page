import { createContext, useContext } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DragHandleContextValue {
  attributes: Record<string, any>;
  listeners: Record<string, any> | undefined;
}

export const DragHandleContext = createContext<DragHandleContextValue>({
  attributes: {},
  listeners: undefined,
});

export const useDragHandle = () => useContext(DragHandleContext);
