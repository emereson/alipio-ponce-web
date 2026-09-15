// public/service-worker.js

// 1. Forzar al nuevo Service Worker a instalarse de inmediato sin esperar
self.addEventListener("install", function (event) {
  self.skipWaiting();
});

// 2. Forzar al nuevo Service Worker a tomar el control de la página actual
self.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim());
});

// 3. Escuchar el evento Push que llega desde tu backend
self.addEventListener("push", function (event) {
  // Parsear los datos que mandamos desde el backend
  const data = event.data ? JSON.parse(event.data.text()) : {};

  let urlDestino = data.ruta || "/";

  // El $1 representa la palabra exacta que encontró (pagos, observaciones o notas)
  urlDestino = urlDestino.replace(
    /\/(pagos|observaciones|notas)/,
    "/reporte-estudiante/$1",
  );

  const options = {
    body: data.descripcion || "Tienes una nueva notificación",
    icon: "/logo.svg",
    badge: "/logo.svg",
    vibrate: [200, 100, 200, 100, 200],
    data: { url: urlDestino },
  };

  event.waitUntil(
    self.registration.showNotification(data.titulo || "Notificación", options),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Cerramos la notificación
  event.waitUntil(
    // Abrimos la ruta correspondiente con el nuevo dominio
    clients.openWindow(event.notification.data.url),
  );
});
