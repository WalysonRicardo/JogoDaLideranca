/* Service worker do Líder 360°.
 * - Cache básico para o app abrir offline depois do primeiro acesso.
 * - Lembrete do devocional: lê as preferências guardadas no próprio aparelho (IndexedDB).
 * Nada é enviado a servidor. */
const CACHE = 'lider360-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest'])).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // rede primeiro (sempre a versão nova), cache como reserva offline
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./')))
  );
});

/* ───── IndexedDB mínimo ───── */
function idb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open('lider360', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function kvGet(key) {
  const db = await idb();
  return new Promise((res) => {
    const q = db.transaction('kv').objectStore('kv').get(key);
    q.onsuccess = () => res(q.result);
    q.onerror = () => res(undefined);
  });
}
async function kvSet(key, val) {
  const db = await idb();
  return new Promise((res) => {
    const t = db.transaction('kv', 'readwrite');
    t.objectStore('kv').put(val, key);
    t.oncomplete = () => res();
    t.onerror = () => res();
  });
}

const isoToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function dayNumber(start) {
  if (!start) return 1;
  const [y, m, d] = start.split('-').map(Number);
  const a = new Date(y, m - 1, d).getTime();
  const n = new Date();
  const b = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

/** Mostra o aviso de hoje se estiver ligado, já passou do horário e ainda não foi enviado. */
async function maybeNotify() {
  const p = await kvGet('reminder');
  if (!p || !p.enabled) return;
  const now = new Date();
  const [hh, mm] = (p.time || '07:00').split(':').map(Number);
  if (now.getHours() * 60 + now.getMinutes() < hh * 60 + mm) return;
  const today = isoToday(now);
  if (p.lastNotified === today) return;
  const n = dayNumber(p.startDate);
  if (n > (p.titles || []).length || (p.done || []).includes(n)) return;
  const title = (p.titles || [])[n - 1] || 'Seu devocional de hoje';
  await self.registration.showNotification(`Devocional · Dia ${n} de ${(p.titles || []).length}`, {
    body: title + ' — toque para abrir seu plano.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: 'devocional-' + today,
    data: { url: './?aba=devocional' },
  });
  await kvSet('reminder', { ...p, lastNotified: today });
}

self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'devocional-diario') e.waitUntil(maybeNotify());
});

self.addEventListener('message', (e) => {
  const msg = e.data || {};
  if (msg.type === 'SAVE_REMINDER') e.waitUntil(kvSet('reminder', msg.payload));
  if (msg.type === 'CHECK_REMINDER') e.waitUntil(maybeNotify());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          c.navigate(url).catch(() => {});
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
