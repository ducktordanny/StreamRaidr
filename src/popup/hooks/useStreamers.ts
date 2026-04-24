import {useCallback, useEffect, useState} from 'react';
import type {Streamer} from '../../shared/types';
import {getStreamers, setStreamers as saveStreamers} from '../../shared/storage';

function withRanks(list: Streamer[]): Streamer[] {
  return list.map((streamer, index) => ({...streamer, rank: index + 1}));
}

function persist(list: Streamer[]): Streamer[] {
  const ranked = withRanks(list);
  void saveStreamers(ranked);
  return ranked;
}

export function useStreamers() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStreamers().then((data) => {
      setStreamers(withRanks(data));
      setLoading(false);
    });
  }, []);

  const addStreamer = useCallback(
    (username: string): boolean => {
      const trimmed = username.trim();
      if (!trimmed) return false;

      const id = trimmed.toLowerCase();
      if (streamers.some((streamer) => streamer.id === id)) return false;

      const next = persist([
        ...streamers,
        {id, username: trimmed, rank: streamers.length + 1, isLive: false},
      ]);
      setStreamers(next);
      return true;
    },
    [streamers],
  );

  const removeStreamer = useCallback(
    (id: string) => {
      const next = persist(streamers.filter((streamer) => streamer.id !== id));
      setStreamers(next);
    },
    [streamers],
  );

  const moveStreamer = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const idx = streamers.findIndex((streamer) => streamer.id === id);
      if (idx === -1) return;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= streamers.length) return;

      const copy = [...streamers];
      [copy[idx], copy[targetIdx]] = [copy[targetIdx], copy[idx]];
      const next = persist(copy);
      setStreamers(next);
    },
    [streamers],
  );

  return {streamers, loading, addStreamer, removeStreamer, moveStreamer};
}
