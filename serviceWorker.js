const kassaApp = "Kassa-v1"
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

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})
