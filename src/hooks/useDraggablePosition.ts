import { useEffect, useState } from 'react';

export function useDraggablePosition(id: string, defaultPos: { x: string, y: string }) {
  const [position, setPosition] = useState<{ x: number | string, y: number | string }>(defaultPos);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`drag_pos_${id}`);
      if (saved) {
        setPosition(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read drag position", e);
    }
  }, [id]);

  const onDragEnd = (event: any, info: any) => {
    // We just let framer motion handle the visual position
    // We can save the absolute position to localstorage if needed, but it's complex since framer motion uses transform.
    // Actually, to persist dragging, framer motion exposes `onDragEnd`.
    // Wait, Framer motion's `drag` just adds transform translation on top of initial position.
    // Saving to localStorage requires reading the actual node's transform or offset, which is tricky.
    // For now, let's keep it simple: we won't persist exact pixels unless necessary, or we save the offset.
  };

  return { position, onDragEnd };
}
