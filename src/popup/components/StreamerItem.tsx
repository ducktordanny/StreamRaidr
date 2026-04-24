import type {Streamer} from '../../shared/types';
import {Button} from '../../shared/components/ui/Button';

interface StreamerItemProps {
  streamer: Streamer;
  isFirst: boolean;
  isLast: boolean;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

function formatViewerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function StreamerItem({streamer, isFirst, isLast, onRemove, onMove}: StreamerItemProps) {
  return (
    <li className="streamer-item">
      <span className="streamer-item-info">
        <span className="streamer-rank">{streamer.rank}</span>
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
        <Button
          variant="icon"
          disabled={isFirst}
          onClick={() => onMove(streamer.id, 'up')}
          title="Move up"
        >
          ↑
        </Button>
        <Button
          variant="icon"
          disabled={isLast}
          onClick={() => onMove(streamer.id, 'down')}
          title="Move down"
        >
          ↓
        </Button>
        <Button variant="icon" onClick={() => onRemove(streamer.id)} title="Remove">
          ×
        </Button>
      </span>
    </li>
  );
}
