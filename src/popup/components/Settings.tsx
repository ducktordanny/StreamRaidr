import {useEffect, useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Input} from '../../shared/components/ui/Input';
import {getSettings, setSettings, clearAppToken, clearAllData} from '../../shared/storage';
import type {Settings as SettingsType, Theme} from '../../shared/types';
import {DEFAULT_POLL_INTERVAL_MINUTES} from '../../shared/constants';

interface SettingsProps {
  onClose: () => void;
}

const DEFAULT_SETTINGS: SettingsType = {
  clientId: '',
  clientSecret: '',
  pollInterval: DEFAULT_POLL_INTERVAL_MINUTES,
  theme: 'system',
};

export function Settings({onClose}: SettingsProps) {
  const [settings, setLocalSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setLocalSettings(data);
    });
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    await setSettings(settings);
    await clearAppToken();
    setSaved(true);
    setTimeout(() => setSaved(false), 1024);
  }

  async function handleClearData() {
    if (!confirm('This will remove all streamers, settings, and tokens. Continue?')) return;
    await clearAllData();
    setLocalSettings(DEFAULT_SETTINGS);
  }

  return (
    <form className="settings-form" onSubmit={handleSave}>
      <label className="settings-field">
        <span className="settings-label">Client ID</span>
        <Input
          type="text"
          value={settings.clientId}
          placeholder="Twitch Client ID"
          onChange={(event) => setLocalSettings({...settings, clientId: event.target.value})}
        />
      </label>
      <label className="settings-field">
        <span className="settings-label">Client Secret</span>
        <Input
          type="password"
          value={settings.clientSecret}
          placeholder="Twitch Client Secret"
          onChange={(event) => setLocalSettings({...settings, clientSecret: event.target.value})}
        />
      </label>
      <label className="settings-field">
        <span className="settings-label">Poll interval (minutes)</span>
        <Input
          type="number"
          min={1}
          max={60}
          value={String(settings.pollInterval)}
          onChange={(event) =>
            setLocalSettings({...settings, pollInterval: Math.max(1, Number(event.target.value))})
          }
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
