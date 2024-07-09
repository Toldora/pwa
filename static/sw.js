// eslint-disable-next-line no-undef
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
);

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);

function onInstall(event) {
  console.log('SW installed');
  self.skipWaiting();
}

function onActivate(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(async subscription => {
      console.log(subscription);
      if (!subscription) {
        const client = await self.clients.matchAll();
        const clientUrl = new URL(client.url);

        self.registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              'BGvJ8sO7rnjWVEuj9NDa0Jnpp0rhtp9PiknmOT0bIFhdymuXB2yXm2i8iY6jgbDa92GzJkHN-B7RzjxZS_MYYYM',
            ),
          })
          .then(async subscription => {
            console.log(subscription);

            const res = await sendSubscriptionToServer({
              subscription,
              click_id: clientUrl.searchParams.get('click_id'),
            });
            console.log(res);
          })
          .catch(error => {
            console.log(error);
            // Handle errors if subscription fails
          });
      }
    }),
  );
}

function onPush(event) {
  const text = event.data.text();

  // console.log(dataObj);
  // const notificationData = dataObj.notification;
  // const notificationTitle = notificationData.title;
  // const notificationOptions = {
  //   body: notificationData.body,
  //   icon: notificationData.image,
  // };

  event.waitUntil(
    // self.registration.showNotification(notificationTitle, notificationOptions),
    self.registration.showNotification(text, { body: text }),
  );
}

function onNotificationClick(event) {
  event.notification.close();
  const urlToOpen = 'https://mayan.bet';

  // switch (event.action) {
  //   case 'show':
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(windowClients => {
        const matchingClient = windowClients.find(wc => wc.url === urlToOpen);

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return self.clients.openWindow(urlToOpen);
        }
      }),
  );
  //     break;
  //   // Handle other actions ...
  // }
}

async function sendSubscriptionToServer(data) {
  const SERVER_URL =
    // `http://localhost:3030/subscriptions/save-subscription`
    'https://api.pwa-test.mayanbet.cloud/subscriptions/save-subscription';
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
