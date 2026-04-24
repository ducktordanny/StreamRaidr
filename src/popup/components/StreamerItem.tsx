import type {Streamer} from '../../shared/types';
import {Button} from '../../shared/components/ui/Button';

interface StreamerItemProps {
  streamer: Streamer;
  isDragging: boolean;
  showDropBefore: boolean;
  showDropAfter: boolean;
  onRemove: (id: string) => void;
  onDragStart: (event: React.PointerEvent) => void;
}

function formatViewerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function StreamerItem({
  streamer,
  isDragging,
  showDropBefore,
  showDropAfter,
  onRemove,
  onDragStart,
}: StreamerItemProps) {
  const className = [
    'streamer-item',
    isDragging && 'streamer-item-dragging',
    showDropBefore && 'streamer-item-drop-above',
    showDropAfter && 'streamer-item-drop-below',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      <span className="streamer-item-info">
        <span className="streamer-drag-handle" onPointerDown={onDragStart} title="Drag to reorder">
          ⠿
        </span>
        {streamer.profileImageUrl && (
          <img className="streamer-avatar" src={streamer.profileImageUrl} alt={streamer.username} />
        )}
        <span className="streamer-name">
          {streamer.username}
          {streamer.isLive && (
            <span className="streamer-live-status">
              <span className="streamer-live-dot" />
              {streamer.viewerCount !== undefined && (
                <span className="streamer-viewer-count">
                  {formatViewerCount(streamer.viewerCount)}
                </span>
              )}
              {streamer.gameName && <span className="streamer-game-name">{streamer.gameName}</span>}
            </span>
          )}
        </span>
      </span>
      <span className="streamer-item-actions">
        <Button variant="icon" onClick={() => onRemove(streamer.id)} title="Remove">
          ×
        </Button>
      </span>
    </li>
  );
}
