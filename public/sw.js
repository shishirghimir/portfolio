// The old version of this site installed a caching service worker. This one
// replaces it, clears every cache it left behind and then removes itself, so
// returning visitors always get the current site straight from the network.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: "window" });
    windows.forEach((w) => w.navigate(w.url));
  })());
});
