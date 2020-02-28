const kassaApp = "Kassa-v2"
const expectedCaches = [kassaApp];

const assets = [
  "/wandelkassa/",
  "/wandelkassa/index.html",
  "/wandelkassa/css/kassa.css",
  "/wandelkassa/css/bootstrap.min.css",
  "/wandelkassa/css/bootstrap.min.css.map",
  "/wandelkassa/js/kassa.js",
  "/wandelkassa/js/jquery.slim.min.js",
  "/wandelkassa/js/jquery.slim.min.map",
  "/wandelkassa/js/bootstrap.min.js",
  "/wandelkassa/js/bootstrap.min.js.map",
  "/wandelkassa/js/popper.min.js",
  "/wandelkassa/js/popper.min.js.map",
  "/wandelkassa/serviceWorker.js"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(kassaApp).then(cache => {
            cache.addAll(assets)
        })
    )
})
  
self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(key => {
          if (!expectedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      )).then(() => {
        console.log('V2 now ready to handle fetches!');
      })
    );
  });
