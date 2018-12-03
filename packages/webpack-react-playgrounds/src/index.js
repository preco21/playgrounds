import './styles/style.css';
import React from 'react';
import {hydrate, render} from 'react-dom';
import App from './components/App';

const rootEl = document.getElementById('__root');
if (rootEl && rootEl.hasChildNodes()) {
  hydrate(<App />, rootEl);
} else {
  render(<App />, rootEl);
}

