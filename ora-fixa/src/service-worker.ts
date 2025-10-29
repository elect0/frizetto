import {build, files, version} from '$service-worker'

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {title: "Eroare", body: "Nu am putut citi notificarea"}
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/192.png'
    })
  )
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  // Deschide fereastra aplicației
  event.waitUntil(
    self.clients.openWindow('/')
  );
});
