import {useState} from 'react';
import {Button} from '../../shared/components/ui/Button';
import {Input} from '../../shared/components/ui/Input';

interface AddStreamerProps {
  onAdd: (username: string) => boolean;
}

export function AddStreamer({onAdd}: AddStreamerProps) {
  const [value, setValue] = useState('');
  const [duplicate, setDuplicate] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (onAdd(value)) {
      setValue('');
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  }

  return (
    <form className="add-streamer-form" onSubmit={handleSubmit}>
      <div className="add-streamer-row">
        <Input
          type="text"
          placeholder="Enter Twitch username"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setDuplicate(false);
          }}
        />
        <Button type="submit" disabled={!value.trim()}>
          Add
        </Button>
      </div>
      {duplicate && <p className="duplicate-msg">Already in list</p>}
    </form>
  );
}
