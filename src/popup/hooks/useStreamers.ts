import {useCallback, useEffect, useState} from 'react';
import type {NewStreamer, Streamer} from '../../shared/types';
import {getStreamers, setStreamers} from '../../shared/storage';
import {MAX_STREAMERS} from '../../shared/constants';

function reorder<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  const item = list[fromIndex];
  const without = list.filter((_, index) => index !== fromIndex);
  return [...without.slice(0, toIndex), item, ...without.slice(toIndex)];
}

function withRanks(list: Streamer[]): Streamer[] {
  return list.map((streamer, index) => ({...streamer, rank: index + 1}));
}

function persist(list: Streamer[]): Streamer[] {
  const ranked = withRanks(list);
  void setStreamers(ranked);
  return ranked;
}

export function useStreamers() {
  const [streamers, setLocalStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStreamers().then((data) => {
      setLocalStreamers(withRanks(data));
      setLoading(false);
    });

    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) {
      if (areaName === 'sync' && 'streamers' in changes) {
        setLocalStreamers(
          withRanks((changes['streamers'].newValue as Streamer[] | undefined) ?? []),
        );
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const addStreamer = useCallback(
    (streamer: NewStreamer): boolean => {
      const trimmed = streamer.username.trim();
      if (!trimmed) return false;

      const id = trimmed.toLowerCase();
      if (streamers.length >= MAX_STREAMERS) return false;
      if (streamers.some((existing) => existing.id === id)) return false;

      const next = persist([
        ...streamers,
        {
          id,
          username: trimmed,
          rank: streamers.length + 1,
          isLive: streamer.isLive,
          gameName: streamer.gameName,
          profileImageUrl: streamer.profileImageUrl,
        },
      ]);
      setLocalStreamers(next);
      return true;
    },
    [streamers],
  );

  const removeStreamer = useCallback(
    (id: string) => {
      const next = persist(streamers.filter((streamer) => streamer.id !== id));
      setLocalStreamers(next);
    },
    [streamers],
  );

  const reorderStreamer = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      if (fromIndex < 0 || toIndex < 0) return;
      if (fromIndex >= streamers.length || toIndex >= streamers.length) return;

      setLocalStreamers(persist(reorder(streamers, fromIndex, toIndex)));
    },
    [streamers],
  );

  return {streamers, loading, addStreamer, removeStreamer, reorderStreamer};
}
