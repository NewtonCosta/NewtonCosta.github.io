const CACHE_NAME = 'shell-v1';
const DINAMYC_CACHE_NAME = 'site-v1'
const ASSETS = [
    '/',
    '/index.html/',
    '/sumario/',
    '/fallback.html',
    '/assets/images/banner.png', 
    '/assets/images/illustration.png',    
    '/assets/images/icons/gf_logo_02.png',
    '/assets/images/icons/gf_logo.png',
    '/assets/images/icons/android-chrome-192x192.png',
    '/assets/images/icons/favicon.ico',
    '/assets/images/icons/favicon-16x16.png',
    '/assets/images/icons/favicon-32x32.png',
    //'/assets/stylesheets/palette.8828ec21.min.css',
    //'/assets/stylesheets/main.55459416.min.css', 
    '/assets/stylesheets/overrides.2ffcfff4.min.css',   
    //'assets/javascripts/vendor.6438a40d.min.js',
    'assets/javascripts/bundle.23e06a0d.min.js',   
    'assets/javascripts/lunr/min/lunr.pt.min.js',
    'assets/javascripts/worker/search.4ac00218.min.js',
    '/sitemap.xml',
    '/search/search_index.json'
];


// Limiting file size function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
};



// install service worker
self.addEventListener('install', evt => {
    self.skipWaiting();
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.addAll(ASSETS);
        }))
});

// activate service worker
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            Promise.all(keys
                //filtering and delete old caches assets
                .filter(key => key !== CACHE_NAME && key !== DINAMYC_CACHE_NAME)
                .map(key => caches.delete(key))
            )        
        })
    );
});

// fetching assets from cach
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request)
            .then(cacheAsset => {
                return cacheAsset ||  fetch(evt.request)
                .then(fetchRes => {
                    return caches.open(DINAMYC_CACHE_NAME)
                    .then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(DINAMYC_CACHE_NAME, 60);
                        return fetchRes;
                    })
                });
            }).catch(() => {
             let request = evt.request.url;           
             let re = /[a-z]/g;
             if(request.search(re) > -1){
                return caches.match('/fallback.html')  // serving fallback pag
             }               
            })
        );
});