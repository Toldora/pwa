// eslint-disable-next-line no-undef
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js',
);

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

self.addEventListener('install', event => {
  console.log('SW installed');
});

self.addEventListener('activate', event => {
  event.waitUntil(
    // swReg.pushManager.getSubscription()
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          'BGvJ8sO7rnjWVEuj9NDa0Jnpp0rhtp9PiknmOT0bIFhdymuXB2yXm2i8iY6jgbDa92GzJkHN-B7RzjxZS_MYYYM',
        ),
      })
      .then(async subscription => {
        console.log(subscription);
        if (!subscription) {
          console.log('No Subscription endpoint present');
        }

        const res = await sendSubscriptionToServer(subscription);
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        // Handle errors if subscription fails
      }),
  );
});

self.addEventListener('push', function (event) {
  // const dataObj = event.data.json();
  const text = event.data.text();
  console.log(text);
  // console.log(dataObj);
  // const notificationData = dataObj.notification;
  // const notificationTitle = notificationData.title;
  // const notificationOptions = {
  //   body: notificationData.body,
  //   icon: notificationData.image,
  // };

  //Do some logic to fulfill the notificationOptions
  event.waitUntil(
    // self.registration.showNotification(notificationTitle, notificationOptions),
    self.registration.showNotification(text, { body: text }),
  );
});

async function sendSubscriptionToServer(subscription) {
  const SERVER_URL =
    'http://api.pwa-test.mayanbet.cloud/subscriptions/save-subscription';
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
}
