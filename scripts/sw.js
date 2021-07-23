const cacheName = "sw-cache";
const staticAssets = [
    "../",
    "../index.html",
    "../styles/sidebar.css",
    "../styles/style.css",
    "/p5.js",
    "/sidebar.js",
    "/index.js",
    "/sketch.js",
    "../assets/icon.png",
];

self.addEventListener("install", async (e) => {
    e.waitUnil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
