// SchoolOS Service Worker v2.0
// Implements network-first for HTML/JS/CSS, network-first for API calls,
// and IndexedDB-backed background sync queue for attendance submissions

const CACHE_NAME = 'schoolos-v2';
const OFFLINE_QUEUE_STORE = 'sync-queue';
const DB_NAME = 'schoolos-offline';
const DB_VERSION = 1;

// ─── IndexedDB helpers ───

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(OFFLINE_QUEUE_STORE)) {
        db.createObjectStore(OFFLINE_QUEUE_STORE, { autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function enqueueRequest(requestData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    tx.objectStore(OFFLINE_QUEUE_STORE).add(requestData);
    tx.oncomplete = resolve;
    tx.onerror    = (e) => reject(e.target.error);
  });
}

async function getAllQueued() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx   = db.transaction(OFFLINE_QUEUE_STORE, 'readonly');
    const req  = tx.objectStore(OFFLINE_QUEUE_STORE).getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

async function clearQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    tx.objectStore(OFFLINE_QUEUE_STORE).clear();
    tx.oncomplete = resolve;
    tx.onerror    = (e) => reject(e.target.error);
  });
}

// ─── Lifecycle ───

self.addEventListener('install', (event) => {
  // Skip waiting to activate the new SW immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Purge ALL old caches from previous versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch Strategy ───

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // API calls: network-first, fallback to offline response
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ success: false, message: 'You are offline. Data will sync when reconnected.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Navigation requests (HTML pages): ALWAYS network-first
  // This ensures React Router always gets the latest index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest index.html for offline fallback
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // JS and CSS bundles: NETWORK-FIRST with cache fallback
  // This ensures new features appear on normal refresh without Ctrl+Shift+R
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Other static assets (images, fonts, etc): cache-first for performance
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Return offline fallback for navigation
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ─── Background Sync ───

self.addEventListener('sync', (event) => {
  if (event.tag === 'attendance-sync') {
    event.waitUntil(flushAttendanceQueue());
  }
});

async function flushAttendanceQueue() {
  const items = await getAllQueued();
  if (!items || items.length === 0) return;

  const successes = await Promise.allSettled(
    items.map(item =>
      fetch(item.url, {
        method: item.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...item.headers },
        body: JSON.stringify(item.body)
      })
    )
  );

  // Only clear if all succeeded
  const allOk = successes.every(r => r.status === 'fulfilled' && r.value?.ok);
  if (allOk) await clearQueue();
}

// ─── Push Notifications ───

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'SchoolOS';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/logo192.png',
    badge: '/favicon.ico',
    data: { url: data.url || '/teacher/dashboard' },
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
