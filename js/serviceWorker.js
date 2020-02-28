const kassaApp = "Kassa-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/css/bootstrap.min.css",
  "/css/bootstrap.min.css.map",
  "/js/kassa.js",
  "/js/jquery.slim.min.js",
  "/js/jquery.slim.min.js.map",
  "/js/bootstrap.min.js",
  "/js/bootstrap.min.js.map",
  "/js/popper.min.js",
  "/js/popper.min.js.map",
  "/js/serviceWorker.js"
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
