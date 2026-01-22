// Suppress benign ResizeObserver error from webpack-dev-server overlay
window.addEventListener('error', (e) => {
  if (e.message?.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
  }
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 