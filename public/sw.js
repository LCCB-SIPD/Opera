// Minimal service worker to satisfy requests to /sw.js
// This file prevents 404 logs when clients try to load /sw.js.
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
// Optional: no-op fetch handler so SW doesn't interfere with normal requests.
self.addEventListener('fetch', () => {});
