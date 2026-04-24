import {useCallback, useEffect, useRef, useState} from 'react';
import type {TwitchSearchResult} from '../../shared/types';
import {searchChannels} from '../../shared/twitchApi';
import {AUTOCOMPLETE_DEBOUNCE_MS} from '../../shared/constants';

export function useTwitchApi() {
  const [searchResults, setSearchResults] = useState<TwitchSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchChannels(query.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSearchLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return {searchResults, searchLoading, search, clearResults};
}
