import {useStreamers} from './hooks/useStreamers';
import {AddStreamer} from './components/AddStreamer';
import {StreamerList} from './components/StreamerList';

export function Popup() {
  const {streamers, loading, addStreamer, removeStreamer, moveStreamer} = useStreamers();

  return (
    <main className="popup">
      <h1>StreamRaidr</h1>
      {loading ? (
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
