/// <reference lib="webworker" />
/**
 * 
 * @param {RequestInfo[]} resources 
 */
async function addResourcesToCache(resources) {
    const cache = await caches.open('v1');
    try {
       await cache.addAll(resources);
       const indexPageResponse = await cache.match('/index.html');
       await cache.put('/', indexPageResponse.clone());
    } catch (err) {
        console.error(`Failed to add resource to cache. Details: ${err}`);
    }
}



self.addEventListener('install', (/** @type {ExtendableEvent} */event) => {
    
    event.waitUntil(addResourcesToCache([
        '/data/ingredients.json',
        '/scripts/alchemy/alchemy.js',
        '/scripts/alchemy/effects.js',
        '/scripts/alchemy/ingredients.js',
        '/scripts/infrastructure/db/db.js',
        '/scripts/infrastructure/db/handlers.js',
        '/scripts/infrastructure/db/query.js',
        '/scripts/infrastructure/events/client-side-events.js',
        '/scripts/infrastructure/html/html.js',
        '/scripts/infrastructure/models/chosen-ingredients.js',
        '/scripts/infrastructure/models/ingredient-list.js',
        '/scripts/infrastructure/views/ingredient-list-view.js',
        '/scripts/infrastructure/worker/alchemy-worker-script.js',
        '/scripts/infrastructure/worker/alchemy-worker.js',
        '/scripts/infrastructure/config.js',
        '/scripts/infrastructure/messaging.js',
        '/scripts/infrastructure/strings.js',
        '/scripts/infrastructure/utils.js',
        '/scripts/main.js',
        '/styles/styles.css',
        '/index.html',
        '/manifest.json',
        '/images/alchemyjs-icon-128x128.png',
        '/images/alchemyjs-icon-144x144.png'
    ]));
});

self.addEventListener('fetch', (/** @type {FetchEvent} */event) => {
    event.respondWith((async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
      
        const response = await fetch(event.request);
      
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
      
        const responseToCache = response.clone();
        const cache = await caches.open('v1')
        await cache.put(event.request, responseToCache);
      
        return response;
    })());
});
