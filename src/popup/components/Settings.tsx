import {useEffect, useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Input} from '../../shared/components/ui/Input';
import {getSettings, setSettings, getUserToken, clearAllData} from '../../shared/storage';
import {login, logout} from '../../shared/twitchAuth';
import type {Settings as SettingsType, Theme} from '../../shared/types';
import {DEFAULT_POLL_INTERVAL_MINUTES, STORAGE_KEY_TOKEN} from '../../shared/constants';

interface SettingsProps {
  onClose: () => void;
}

const DEFAULT_SETTINGS: SettingsType = {
  pollInterval: DEFAULT_POLL_INTERVAL_MINUTES,
  theme: 'system',
};

export function Settings({onClose}: SettingsProps) {
  const [settings, setLocalSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [pollIntervalInput, setPollIntervalInput] = useState(DEFAULT_SETTINGS.pollInterval);
  const [saved, setSaved] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) {
        setLocalSettings(data);
        setPollIntervalInput(data.pollInterval);
      }
    });
    getUserToken().then((token) => setLoggedIn(!!token));

    function handleStorageChange(changes: Record<string, chrome.storage.StorageChange>) {
      if (STORAGE_KEY_TOKEN in changes) {
        setLoggedIn(!!changes[STORAGE_KEY_TOKEN].newValue);
      }
    }

    chrome.storage.local.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.local.onChanged.removeListener(handleStorageChange);
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const pollInterval = Math.min(
      60,
      Math.max(1, pollIntervalInput || DEFAULT_POLL_INTERVAL_MINUTES),
    );
    setPollIntervalInput(pollInterval);
    await setSettings({...settings, pollInterval});
    setSaved(true);
    setTimeout(() => setSaved(false), 1024);
  }

  async function handleLogin() {
    await login();
  }

  async function handleLogout() {
    await logout();
  }

  async function handleClearData() {
    if (!confirm('This will remove all streamers, settings, and tokens. Continue?')) return;
    await clearAllData();
    setLocalSettings(DEFAULT_SETTINGS);
  }

  return (
    <form className="settings-form" onSubmit={handleSave}>
      <div className="settings-field">
        <span className="settings-label">Twitch account</span>
        {loggedIn ? (
          <div className="settings-login-row">
            <span className="settings-logged-in">Connected</span>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : loggedIn === false ? (
          <Button type="button" onClick={handleLogin}>
            Login with Twitch
          </Button>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <label className="settings-field">
        <span className="settings-label">Poll interval (minutes)</span>
        <Input
          type="number"
          min={1}
          max={60}
          value={pollIntervalInput || ''}
          onChange={(event) => setPollIntervalInput(+event.target.value)}
        />
      </label>
      <label className="settings-field">
        <span className="settings-label">Theme</span>
        <select
          className="input"
          value={settings.theme}
          onChange={(event) => setLocalSettings({...settings, theme: event.target.value as Theme})}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <div className="settings-actions">
        <Button type="submit">Save</Button>
        <Button type="button" variant="danger" onClick={handleClearData}>
          Clear data
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {saved && <span className="settings-saved">Saved</span>}
      </div>
    </form>
  );
}
