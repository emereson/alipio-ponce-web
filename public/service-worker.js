// public/service-worker.js

// 1. Escuchar el evento Push que llega desde tu backend
self.addEventListener("push", function (event) {
  // Parsear los datos que mandamos desde el backend
  const data = event.data ? JSON.parse(event.data.text()) : {};

  const options = {
    body: data.descripcion || "Tienes una nueva notificación",
    icon: "/logo.svg", // Cambia esto por la ruta de tu logo (ej: /logo.png)
    badge: "/logo.svg",
    vibrate: [200, 100, 200, 100, 200], // Patrón de vibración en celulares
    data: { url: data.ruta || "/" },
  };

  // Mostrar la notificación nativa del sistema operativo
  event.waitUntil(
    self.registration.showNotification(data.titulo || "Notificación", options),
  );
});

// 2. Escuchar cuando el usuario hace clic en la notificación
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Cerramos la notificación
  event.waitUntil(
    clients.openWindow(event.notification.data.url), // Abrimos la ruta correspondiente
  );
});
