import {useRef, useState} from 'react';
import type {Streamer} from '../../shared/types';
import {StreamerItem} from './StreamerItem';

interface StreamerListProps {
  streamers: Streamer[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface DragState {
  fromIndex: number;
  insertAt: number;
}

function findInsertIndex(listEl: HTMLUListElement, pointerY: number): number {
  const items = listEl.querySelectorAll('.streamer-item');
  for (let idx = 0; idx < items.length; idx++) {
    const rect = items[idx].getBoundingClientRect();
    if (pointerY < rect.top + rect.height / 2) return idx;
  }
  return items.length;
}

export function StreamerList({streamers, onRemove, onReorder}: StreamerListProps) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  function handleDragStart(index: number, event: React.PointerEvent) {
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setDrag({fromIndex: index, insertAt: index});
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!drag || !listRef.current) return;
    setDrag({...drag, insertAt: findInsertIndex(listRef.current, event.clientY)});
  }

  function handlePointerUp() {
    if (!drag) return;
    const toIndex = drag.insertAt > drag.fromIndex ? drag.insertAt - 1 : drag.insertAt;
    if (drag.fromIndex !== toIndex) onReorder(drag.fromIndex, toIndex);
    setDrag(null);
  }

  if (streamers.length === 0) return <p className="empty-msg">No streamers added yet.</p>;

  const wouldMove =
    drag !== null && drag.insertAt !== drag.fromIndex && drag.insertAt !== drag.fromIndex + 1;
  const lastIndex = streamers.length - 1;

  return (
    <ul
      className="streamer-list"
      ref={listRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {streamers.map((streamer, index) => (
        <StreamerItem
          key={streamer.id}
          streamer={streamer}
          isDragging={drag?.fromIndex === index}
          showDropBefore={wouldMove && drag?.insertAt === index}
          showDropAfter={wouldMove && drag?.insertAt === streamers.length && index === lastIndex}
          onRemove={onRemove}
          onDragStart={(event) => handleDragStart(index, event)}
        />
      ))}
    </ul>
  );
}
