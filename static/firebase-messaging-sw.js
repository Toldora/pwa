// IMPORTANT: This file only exists for dev mode purposes. Do not modify this file. Any changes should be made in `src/firebase-messaging-sw.js`.

/* eslint-isable no-undef */
console.log(typeof importScripts);
if (typeof importScripts === 'function') {
  importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
  importScripts(
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js',
  );

  const firebaseConfig = {
    apiKey: "AIzaSyCWKBO0OazGjtEugpR41mA7_cOSSDBkwjU",
    authDomain: 'mayan-pwa.firebaseapp.com',
    projectId: 'mayan-pwa',
    storageBucket: 'mayan-pwa.appspot.com',
    messagingSenderId: '496250438331',
    appId: '1:496250438331:web:db1a2f267cda6b80cfdf9e',
    measurementId: 'G-MSRE9QV4KV',
  };

  const app = firebase.initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const messaging = firebase.messaging(app);
  console.log(messaging);

  self.addEventListener('install', () => {
    console.log('installed SW!');
  });

  // const requestPermission = () => {
  //   console.log('Requesting permission...');
  //   Notification.requestPermission().then(permission => {
  //     console.log(permission);
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted.');
  //     }
  //   });
  // };

  // requestPermission();

  // const init = async () => {
  //   const currentToken = await getToken(messaging, {
  //     vapidKey: "BGvJ8sO7rnjWVEuj9NDa0Jnpp0rhtp9PiknmOT0bIFhdymuXB2yXm2i8iY6jgbDa92GzJkHN-B7RzjxZS_MYYYM",
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
}