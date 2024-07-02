// import { initializeApp } from 'firebase/app';
// // import { getAnalytics } from 'firebase/analytics';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { onBackgroundMessage } from 'firebase/messaging/sw';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_SDK_API_KEY,
//   authDomain: 'mayan-pwa.firebaseapp.com',
//   projectId: 'mayan-pwa',
//   storageBucket: 'mayan-pwa.appspot.com',
//   messagingSenderId: '496250438331',
//   appId: '1:496250438331:web:db1a2f267cda6b80cfdf9e',
//   measurementId: 'G-MSRE9QV4KV',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// const messaging = getMessaging(app);

// function requestPermission() {
//   console.log('Requesting permission...');
//   Notification.requestPermission().then(permission => {
//     console.log(permission);
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//     }
//   });
// }

// requestPermission();

// const init = async () => {
//   const currentToken = await getToken(messaging, {
//     vapidKey: import.meta.env.VITE_FCM_VAPID_KEY,
//   });
//   if (currentToken) {
//     const ref = document.querySelector('.js-token');
//     ref.textContent = currentToken;
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log(
//       'No registration token available. Request permission to generate one.',
//     );
//     // ...
//   }
//   console.log(currentToken);
// };

// init();

// onMessage(messaging, payload => {
//   console.log('Message received. ', payload);
//   // ...
// });

// onBackgroundMessage(messaging, payload => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload,
//   );
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
