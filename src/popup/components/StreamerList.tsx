import type {Streamer} from '../../shared/types';
import {StreamerItem} from './StreamerItem';

interface StreamerListProps {
  streamers: Streamer[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export function StreamerList({streamers, onRemove, onMove}: StreamerListProps) {
  if (streamers.length === 0) return <p className="empty-msg">No streamers added yet.</p>;

  return (
    <ul className="streamer-list">
      {streamers.map((streamer, index) => (
        <StreamerItem
          key={streamer.id}
          streamer={streamer}
          isFirst={index === 0}
          isLast={index === streamers.length - 1}
          onRemove={onRemove}
          onMove={onMove}
        />
      ))}
    </ul>
  );
}
