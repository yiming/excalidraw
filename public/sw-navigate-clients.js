// Loaded by the generated service worker via workbox importScripts.
//
// A normal reload is answered by the previous worker's precached index.html.
// vite-plugin-pwa's autoUpdate reload listens for `activated` only after the
// app bundle executes. sw.js itself is small and calls skipWaiting() plus
// clientsClaim() while that bundle is still downloading, so the listener
// never runs and the tab keeps the old shell. Hard refresh bypasses the
// worker, which is why only Ctrl+Shift+R showed the new deploy.
//
// On an update, activate navigates open windows once. The new worker is
// already in control, so that load uses the new precache. The first install
// has no active worker and does not navigate. Offline precaching is unchanged.

self.__excalidrawSwUpdate = Boolean(
  self.registration && self.registration.active,
);

self.addEventListener("activate", (event) => {
  if (!self.__excalidrawSwUpdate) {
    return;
  }

  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await Promise.all(
        windows.map(async (client) => {
          if (!client.url) {
            return;
          }
          try {
            await client.navigate(client.url);
          } catch {
            // A client that cannot navigate picks up this worker on its next load.
          }
        }),
      );
    })(),
  );
});
