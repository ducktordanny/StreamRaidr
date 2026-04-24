import {useEffect, useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Input} from '../../shared/components/ui/Input';
import {getSettings, setSettings, clearAppToken} from '../../shared/storage';
import type {Settings as SettingsType} from '../../shared/types';
import {DEFAULT_POLL_INTERVAL_MINUTES} from '../../shared/constants';

interface SettingsProps {
  onClose: () => void;
}

const DEFAULT_SETTINGS: SettingsType = {
  clientId: '',
  clientSecret: '',
  autoWatchEnabled: false,
  pollInterval: DEFAULT_POLL_INTERVAL_MINUTES,
};

export function Settings({onClose}: SettingsProps) {
  const [settings, setLocal] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      if (data) setLocal(data);
    });
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    await setSettings(settings);
    await clearAppToken();
    setSaved(true);
    setTimeout(() => setSaved(false), 1024);
  }

  return (
    <form className="settings-form" onSubmit={handleSave}>
      <label className="settings-field">
        <span className="settings-label">Client ID</span>
        <Input
          type="text"
          value={settings.clientId}
          placeholder="Twitch Client ID"
          onChange={(event) => setLocal({...settings, clientId: event.target.value})}
        />
      </label>
      <label className="settings-field">
        <span className="settings-label">Client Secret</span>
        <Input
          type="password"
          value={settings.clientSecret}
          placeholder="Twitch Client Secret"
          onChange={(event) => setLocal({...settings, clientSecret: event.target.value})}
        />
      </label>
      <div className="settings-actions">
        <Button type="submit">Save</Button>
        <Button type="button" variant="icon" onClick={onClose} title="Close settings">
          ×
        </Button>
        {saved && <span className="settings-saved">Saved</span>}
      </div>
    </form>
  );
}
