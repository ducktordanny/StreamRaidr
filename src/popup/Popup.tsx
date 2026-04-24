import {useState} from 'react';
import {useStreamers} from './hooks/useStreamers';
import {AddStreamer} from './components/AddStreamer';
import {StreamerList} from './components/StreamerList';
import {Settings} from './components/Settings';
import {Button} from '../shared/components/ui/Button';

export function Popup() {
  const {streamers, loading, addStreamer, removeStreamer, moveStreamer} = useStreamers();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="popup">
      <header className="popup-header">
        <h1>StreamRaidr</h1>
        <Button variant="icon" onClick={() => setShowSettings(!showSettings)} title="Settings">
          ⚙
        </Button>
      </header>
      {showSettings ? (
        <Settings onClose={() => setShowSettings(false)} />
      ) : loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <AddStreamer onAdd={addStreamer} />
          <StreamerList streamers={streamers} onRemove={removeStreamer} onMove={moveStreamer} />
        </>
      )}
    </main>
  );
}
