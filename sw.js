/* Kachunk service worker — app-shell cache */
const CACHE = 'kachunk-v18';
const SHELL = ['./','index.html','styles.css','app.js','icons.js','matter.min.js','three-bundle.js','manifest.webmanifest','favicon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','badge-96.png',
  'fonts/bricolage-grotesque-latin-600-normal.woff2','fonts/bricolage-grotesque-latin-700-normal.woff2','fonts/bricolage-grotesque-latin-800-normal.woff2',
  'fonts/inclusive-sans-latin-400-normal.woff2','fonts/inclusive-sans-latin-600-normal.woff2','fonts/inclusive-sans-latin-700-normal.woff2',
  'fonts/figtree-latin-300-normal.woff2','fonts/figtree-latin-400-normal.woff2','fonts/figtree-latin-600-normal.woff2','fonts/figtree-latin-700-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Navigations are network-first: users always get fresh HTML (and thus fresh hashed-by-version assets
  // once the SW updates) whenever they're online; the cache is only the offline fallback.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(hit => hit || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  })));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return clients.openWindow('./');
  }));
});
