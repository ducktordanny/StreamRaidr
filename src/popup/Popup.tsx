import {useEffect, useState} from 'react';
import {useStreamers} from './hooks/useStreamers';
import {AddStreamer} from './components/AddStreamer';
import {StreamerList} from './components/StreamerList';
import {Settings} from './components/Settings';
import {Button} from '../shared/components/ui/Button';
import {
  getAutoWatchTabId,
  setAutoWatchTabId,
  clearAutoWatchTabId,
  getSettings,
  getUserToken,
} from '../shared/storage';
import {login} from '../shared/twitchAuth';
import {
  STORAGE_KEY_AUTO_WATCH_TAB,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_TOKEN,
  MAX_STREAMERS,
} from '../shared/constants';
import type {Theme} from '../shared/types';

function applyTheme(theme: Theme) {
  const prefersDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', prefersDark);
  document.documentElement.classList.toggle('light', !prefersDark);
}

export function Popup() {
  const {streamers, loading, addStreamer, removeStreamer, reorderStreamer} = useStreamers();
  const [showSettings, setShowSettings] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [autoWatchTabId, setLocalTabId] = useState<number | null>(null);
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);

  useEffect(() => {
    getSettings().then((settings) => applyTheme(settings?.theme ?? 'system'));
    getUserToken().then((token) => setLoggedIn(!!token));
    getAutoWatchTabId().then(setLocalTabId);
    chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
      if (tab?.id) setCurrentTabId(tab.id);
    });

    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) {
      if (areaName !== 'local') return;
      if (STORAGE_KEY_TOKEN in changes) {
        setLoggedIn(!!changes[STORAGE_KEY_TOKEN].newValue);
      }
      if (STORAGE_KEY_AUTO_WATCH_TAB in changes) {
        setLocalTabId((changes[STORAGE_KEY_AUTO_WATCH_TAB].newValue as number | undefined) ?? null);
      }
      if (STORAGE_KEY_SETTINGS in changes) {
        const newSettings = changes[STORAGE_KEY_SETTINGS].newValue as {theme?: Theme} | undefined;
        applyTheme(newSettings?.theme ?? 'system');
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

  function renderContent() {
    if (showSettings) return <Settings onClose={() => setShowSettings(false)} />;
    if (loggedIn === null || loading) return <p>Loading…</p>;
    if (!loggedIn) {
      return (
        <div className="login-prompt">
          <p>Login with Twitch to get started.</p>
          <Button onClick={() => void login()}>Login with Twitch</Button>
        </div>
      );
    }
    return (
      <>
        {renderAutoWatchBar()}
        <AddStreamer onAdd={addStreamer} disabled={streamers.length >= MAX_STREAMERS} />
        <StreamerList streamers={streamers} onRemove={removeStreamer} onReorder={reorderStreamer} />
      </>
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
      {renderContent()}
    </main>
  );
}
