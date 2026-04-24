import {useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Autocomplete} from '../../shared/components/ui/Autocomplete';
import {useTwitchApi} from '../hooks/useTwitchApi';
import type {TwitchSearchResult} from '../../shared/types';

interface AddStreamerProps {
  onAdd: (username: string) => boolean;
}

export function AddStreamer({onAdd}: AddStreamerProps) {
  const [value, setValue] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const {searchResults, search, clearResults} = useTwitchApi();

  function selectStreamer(username: string) {
    if (onAdd(username)) {
      setValue('');
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
    clearResults();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (value.trim()) selectStreamer(value.trim());
  }

  return (
    <form className="add-streamer-form" onSubmit={handleSubmit}>
      <div className="add-streamer-row">
        <Autocomplete<TwitchSearchResult>
          value={value}
          onChange={(inputValue) => {
            setValue(inputValue);
            setDuplicate(false);
            search(inputValue);
          }}
          items={searchResults}
          onSelect={(result) => selectStreamer(result.broadcaster_login)}
          onClear={clearResults}
          placeholder="Enter Twitch username"
          renderItem={(result) => (
            <>
              <span className="autocomplete-result-name">{result.display_name}</span>
              {result.is_live && (
                <span className="autocomplete-result-live">
                  <span className="streamer-live-dot" />
                  {result.game_name && (
                    <span className="autocomplete-result-detail">{result.game_name}</span>
                  )}
                </span>
              )}
            </>
          )}
        />
        <Button type="submit" disabled={!value.trim()}>
          Add
        </Button>
      </div>
      {duplicate && <p className="duplicate-msg">Already in list</p>}
    </form>
  );
}
