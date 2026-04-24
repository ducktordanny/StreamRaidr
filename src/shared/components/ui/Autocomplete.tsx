import {type ReactNode, useRef, useState} from 'react';
import {Input} from './Input';
import './Autocomplete.css';

interface AutocompleteItem {
  id: string;
}

interface AutocompleteProps<TItem extends AutocompleteItem> {
  value: string;
  onChange: (value: string) => void;
  items: TItem[];
  onSelect: (item: TItem) => void;
  onClear: () => void;
  renderItem: (item: TItem, isActive: boolean) => ReactNode;
  placeholder?: string;
}

export function Autocomplete<TItem extends AutocompleteItem>({
  value,
  onChange,
  items,
  onSelect,
  onClear,
  renderItem,
  placeholder,
}: AutocompleteProps<TItem>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function handleSelect(item: TItem) {
    onSelect(item);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(items[highlightedIndex]);
    } else if (event.key === 'Escape') {
      onClear();
      setHighlightedIndex(-1);
    }
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => {
      onClear();
      setHighlightedIndex(-1);
    }, 128);
  }

  function handleDropdownMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  }

  return (
    <div className="autocomplete" onBlur={handleBlur}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
      />
      {items.length > 0 && (
        <ul className="autocomplete-dropdown" onMouseDown={handleDropdownMouseDown}>
          {items.map((item, index) => (
            <li
              key={item.id}
              className={`autocomplete-item${index === highlightedIndex ? ' autocomplete-item-active' : ''}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {renderItem(item, index === highlightedIndex)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
