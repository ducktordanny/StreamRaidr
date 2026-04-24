import {useEffect, useState} from 'react';
import {useStreamers} from './hooks/useStreamers';
import {AddStreamer} from './components/AddStreamer';
import {StreamerList} from './components/StreamerList';
import {Settings} from './components/Settings';
import {Button} from '../shared/components/ui/Button';
import {getAutoWatchTabId, setAutoWatchTabId, clearAutoWatchTabId} from '../shared/storage';
import {STORAGE_KEY_AUTO_WATCH_TAB} from '../shared/constants';

export function Popup() {
  const {streamers, loading, addStreamer, removeStreamer, moveStreamer} = useStreamers();
  const [showSettings, setShowSettings] = useState(false);
  const [autoWatchTabId, setLocalTabId] = useState<number | null>(null);
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);

  useEffect(() => {
    getAutoWatchTabId().then(setLocalTabId);
    chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
      if (tab?.id) setCurrentTabId(tab.id);
    });

    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) {
      if (areaName === 'local' && STORAGE_KEY_AUTO_WATCH_TAB in changes) {
        setLocalTabId((changes[STORAGE_KEY_AUTO_WATCH_TAB].newValue as number | undefined) ?? null);
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  async function handleEnableAutoWatch() {
    if (!currentTabId) return;
    await setAutoWatchTabId(currentTabId);
    setLocalTabId(currentTabId);
  }

  async function handleDisableAutoWatch() {
    await clearAutoWatchTabId();
    setLocalTabId(null);
  }

  function handleGoToTab() {
    if (autoWatchTabId !== null) {
      chrome.tabs.update(autoWatchTabId, {active: true});
    }
  }

  function renderAutoWatchBar() {
    if (autoWatchTabId === null) {
      return (
        <div className="auto-watch-bar">
          <Button onClick={handleEnableAutoWatch}>Auto-watch this tab</Button>
        </div>
      );
    }

    if (autoWatchTabId === currentTabId) {
      return (
        <div className="auto-watch-bar auto-watch-active">
          <span className="auto-watch-label">Auto-watch active</span>
          <Button onClick={handleDisableAutoWatch}>Disable</Button>
        </div>
      );
    }

    return (
      <div className="auto-watch-bar">
        <span className="auto-watch-label">Auto-watch on another tab</span>
        <Button onClick={handleGoToTab}>Go to tab</Button>
      </div>
    );
  }

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
          {renderAutoWatchBar()}
          <AddStreamer onAdd={addStreamer} />
          <StreamerList streamers={streamers} onRemove={removeStreamer} onMove={moveStreamer} />
        </>
      )}
    </main>
  );
}
