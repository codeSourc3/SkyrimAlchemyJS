/// <reference lib="webworker" />
/**
 * 
 * @param {RequestInfo[]} resources 
 */
async function addResourcesToCache(resources) {
    const cache = await caches.open('v1');
    await cache.addAll(resources);
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
        '/index.html'
    ]));
});

self.addEventListener('fetch', (/** @type {FetchEvent} */event) => {
    let req = event.request;
    let reqUrl = new URL(req.url);
    if (reqUrl.pathname === '/') {
        req = '/index.html';
    }
    event.respondWith(caches.match(req));
});