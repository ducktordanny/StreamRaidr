import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Popup} from './Popup';
import './Popup.css';

const container = document.getElementById('root');

if (!container) throw new Error('Root container not found');

createRoot(container).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
);
