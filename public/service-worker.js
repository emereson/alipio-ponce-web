// public/service-worker.js

// 1. Escuchar el evento Push que llega desde tu backend
self.addEventListener("push", function (event) {
  // Parsear los datos que mandamos desde el backend
  const data = event.data ? JSON.parse(event.data.text()) : {};

  let urlDestino = data.ruta || "/";

  // Buscamos "/pagos", "/observaciones" o "/notas" y les agregamos el prefijo
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

// 2. Escuchar cuando el usuario hace clic en la notificación
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Cerramos la notificación
  event.waitUntil(
    // Abrimos la ruta correspondiente con el nuevo dominio
    clients.openWindow(event.notification.data.url),
  );
});
