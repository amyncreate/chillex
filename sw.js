/**
 * Chill Express — service worker
 * Bump CACHE_VERSION on every deploy that changes cached files so old
 * clients pick up the new assets instead of being stuck on stale ones.
 */
'use strict';

var CACHE_VERSION = 'chillexpress-v1';
var STATIC_CACHE = CACHE_VERSION + '-static';
var PAGES_CACHE = CACHE_VERSION + '-pages';

var APP_SHELL = [
  './',
  'menu/',
  'cart/',
  'location/',
  'offline.html',
  'manifest.json',
  'assets/css/styles.css',
  'assets/js/data.js',
  'assets/js/cart-store.js',
  'assets/js/app.js',
  'assets/js/home.js',
  'assets/js/menu.js',
  'assets/js/cart-page.js',
  'assets/icons/icons.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/images/logo.png',
  'assets/fonts/space-grotesk-latin-700-normal.woff2',
  'assets/fonts/space-grotesk-latin-600-normal.woff2',
  'assets/fonts/inter-latin-400-normal.woff2',
  'assets/fonts/inter-latin-600-normal.woff2',
  'assets/fonts/inter-latin-800-normal.woff2'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key.indexOf(CACHE_VERSION) !== 0; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept') && request.headers.get('accept').indexOf('text/html') !== -1);
}

function isStaticAsset(url) {
  return url.pathname.indexOf('/assets/') !== -1 || url.pathname.indexOf('manifest.json') !== -1;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Only handle same-origin GET requests; let everything else pass through untouched.
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(PAGES_CACHE).then(function (cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        var networkFetch = fetch(request).then(function (response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(STATIC_CACHE).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        }).catch(function () { return cached; });
        return cached || networkFetch;
      })
    );
  }
});
