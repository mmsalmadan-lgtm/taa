// طاء — phone alerts for the dashboard (Web Push). Nothing is cached here: the page always loads fresh from the site.
// An alert carries {title, body, url, tag}; tapping it opens (or focuses) the dashboard on «المساعد», where the message waits.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let m = {};
  try { m = e.data ? e.data.json() : {}; } catch { m = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(m.title || "طاء", {
    body: m.body || "", tag: m.tag || "taa", renotify: true, lang: "ar", dir: "rtl",
    icon: "icon-192.png", badge: "badge-96.png", data: { url: m.url || "/d/?go=bot" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "/d/?go=bot", self.location.origin);
  if (url.origin !== self.location.origin) return;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of wins) if (c.frameType !== "nested" && new URL(c.url).pathname.startsWith("/d/")) { c.postMessage({ go: url.searchParams.get("go") || "bot" }); return c.focus(); }
    return self.clients.openWindow(url.href);
  })());
});
