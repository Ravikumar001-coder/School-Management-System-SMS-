// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // ← This line is CRITICAL
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ── PWA Service Worker Registration ──
// Uses a "check for updates on every page load" strategy so new features
// appear immediately on normal refresh (no Ctrl+Shift+R needed).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SchoolOS SW] Registered:', registration.scope);

        // Force the new service worker to activate immediately when available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SchoolOS SW] New version activated — fresh content available.');
              }
            });
          }
        });

        // Check for updates on every page load
        registration.update().catch(() => {});

        // Trigger background sync for queued attendance on reconnection
        window.addEventListener('online', () => {
          if (registration.sync) {
            registration.sync.register('attendance-sync')
              .catch(err => console.warn('[SchoolOS SW] Sync register failed:', err));
          }
        });
      })
      .catch((err) => {
        console.warn('[SchoolOS SW] Registration failed:', err);
      });
  });
}