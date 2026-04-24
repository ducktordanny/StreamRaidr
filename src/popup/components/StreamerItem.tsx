import type {Streamer} from '../../shared/types';
import {Button} from '../../shared/components/ui/Button';

interface StreamerItemProps {
  streamer: Streamer;
  isFirst: boolean;
  isLast: boolean;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function StreamerItem({streamer, isFirst, isLast, onRemove, onMove}: StreamerItemProps) {
  return (
    <li className="streamer-item">
      <span className="streamer-item-info">
        <span className="streamer-rank">{streamer.rank}</span>
        {streamer.username}
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
