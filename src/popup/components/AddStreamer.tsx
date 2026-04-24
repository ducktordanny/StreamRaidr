import {useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Autocomplete} from '../../shared/components/ui/Autocomplete';
import {useTwitchApi} from '../hooks/useTwitchApi';
import type {NewStreamer, TwitchSearchResult} from '../../shared/types';
import {MAX_STREAMERS} from '../../shared/constants';

interface AddStreamerProps {
  onAdd: (streamer: NewStreamer) => boolean;
  disabled?: boolean;
}

export function AddStreamer({onAdd, disabled}: AddStreamerProps) {
  const [value, setValue] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const {searchResults, search, clearResults} = useTwitchApi();

  function selectStreamer(data: NewStreamer) {
    if (onAdd(data)) {
      setValue('');
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
    clearResults();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    const match = searchResults.find(
      (result) => result.broadcaster_login.toLowerCase() === trimmed.toLowerCase(),
    );

    if (!match) return;
    selectStreamer({
      username: match.broadcaster_login,
      isLive: match.is_live,
      gameName: match.game_name,
      profileImageUrl: match.thumbnail_url,
    });
  }

  return (
    <form className="add-streamer-form" onSubmit={handleSubmit}>
      <div
        className="add-streamer-row"
        title={disabled ? `Maximum of ${MAX_STREAMERS} streamers reached` : undefined}
      >
        <Autocomplete<TwitchSearchResult>
          value={value}
          disabled={disabled}
          onChange={(inputValue) => {
            setValue(inputValue);
            setDuplicate(false);
            search(inputValue);
          }}
          items={searchResults}
          onSelect={(result) =>
            selectStreamer({
              username: result.broadcaster_login,
              isLive: result.is_live,
              gameName: result.game_name,
              profileImageUrl: result.thumbnail_url,
            })
          }
          onClear={clearResults}
          placeholder={disabled ? `Max ${MAX_STREAMERS} streamers` : 'Enter Twitch username'}
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
        <Button type="submit" disabled={disabled || !value.trim()}>
          Add
        </Button>
      </div>
      {duplicate && <p className="duplicate-msg">Already in list</p>}
    </form>
  );
}
