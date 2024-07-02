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

// self.addEventListener('activate', event => {
//   event.waitUntil(
//     self.registration.pushManager
//       .subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlB64ToUint8Array(
//           import.meta.env.VITE_FCM_VAPID_KEY,
//         ),
//       })
//       .then(subscription => {
//         console.log(subscription);
//         // Handle the subscription or do something with it
//       })
//       .catch(error => {
//         console.log(error);
//         // Handle errors if subscription fails
//       }),
//   );
// });
