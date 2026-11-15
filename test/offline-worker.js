const cacheName = 'alreem-trial-offline-19';
const entry = new URL('./', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add(new Request(entry,{cache:'reload'}))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const target = new URL(entry);
  if (event.request.mode !== 'navigate' || url.origin !== target.origin ||
      ![target.pathname,target.pathname+'index.html'].includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(event.request);
      if (!response.ok) return await cache.match(entry) || response;
      await cache.put(entry,response.clone());
      return response;
    } catch {
      return await cache.match(entry) || Response.error();
    }
  })());
});
