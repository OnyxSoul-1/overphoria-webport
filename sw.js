const CACHE_NAME = 'overphoria-v1';
const FILES_TO_CACHE = [
  './index.html',
  './Build/Web.loader.js',
  './Build/Web.framework.js.gz',
  './Build/Web.data.gz',
  './Build/Web.wasm.gz.part1',
  './Build/Web.wasm.gz.part2',
  './Build/Web.wasm.gz.part3',
  './TemplateData/style.css'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Inject headers so Unity works offline
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
        newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
        if (event.request.url.includes('.wasm')) {
            newHeaders.set('Content-Type', 'application/wasm');
        }
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }
      return fetch(event.request);
    })
  );
});
