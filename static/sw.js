// eslint-disable-next-line no-undef
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
);

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);
self.addEventListener('message', onMessage);

async function onInstall(event) {
  console.log('SW installed');
  const promise = async () => {
    self.storage = new IndexDbStorage('mayan', 'params');

    const windowClients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    });
    const workerScope = self.registration.scope;
    const currentClient = windowClients.find(wc =>
      workerScope.match(new URL(wc.url).host),
    );
    const clientUrl = new URL(currentClient.url);
    const clickId = clientUrl.searchParams.get('click_id');
    await self.storage.set('clickId', clickId);
  };
  event.waitUntil(promise());

  self.skipWaiting();
}

function onActivate(event) {
  if ('permissions' in navigator) {
    navigator.permissions
      .query({ name: 'notifications' })
      .then(notificationPerm => {
        notificationPerm.onchange = async () => {
          if (notificationPerm.state === 'granted') {
            self.registration.active.postMessage({
              action: 'NOTIFICATION_PERMISSION_GRANTED',
            });
          } else {
            //  unsubscribe from server
          }
        };
      });
  }
}

function onPush(event) {
  const dataObj = event.data.json();
  const notificationData = dataObj.notification;
  const notificationTitle = notificationData.title;
  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions),
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

function onMessage(event) {
  switch (event.data.action) {
    case 'NOTIFICATION_PERMISSION_GRANTED':
      event.waitUntil(subscribeUser());
      break;

    default:
      break;
  }
}

async function sendSubscriptionToServer(data) {
  const SERVER_URL =
    // `http://localhost:3030/subscriptions/save`;
    'https://api.pwa-test.mayanbet.cloud/subscriptions/save';
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function deleteSubscriptionOnServer(data) {
  const SERVER_URL = `http://localhost:3030/subscriptions/delete`;
  // 'https://api.pwa-test.mayanbet.cloud/subscriptions/delete';
  const response = await fetch(SERVER_URL, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function subscribeUser() {
  try {
    const subscription = await self.registration.pushManager.getSubscription();

    if (!subscription && Notification.permission === 'granted') {
      const newSubscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          'BGvJ8sO7rnjWVEuj9NDa0Jnpp0rhtp9PiknmOT0bIFhdymuXB2yXm2i8iY6jgbDa92GzJkHN-B7RzjxZS_MYYYM',
        ),
      });

      const clickId = await self.storage.get('clickId');
      const result = await sendSubscriptionToServer({
        subscription: newSubscription,
        clickId,
      });
      return result;
    }
  } catch (error) {
    console.log(error);
    // Handle errors if subscription fails
  }
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

// const windowClients = await self.clients.matchAll({
//   includeUncontrolled: true,
//   type: 'window',
// });
// const workerScope = self.registration.scope;
// const currentClient = windowClients.find(wc =>
//   workerScope.match(new URL(wc.url).host),
// );
// const currentClientUrl = new URL(currentClient.url);

function log(msg) {
  // if (isDebugMode()) {
  console.log('[SW] ' + msg);
  // };
}

function IndexDbStorage(dbName, store) {
  let db = null;
  let storeName = null;
  let obj = this;

  if (store) storeName = store;

  this.init = init;

  function init(store) {
    let initId = Math.random();
    log('init store:' + store + '; db:' + dbName + '; id:' + initId);
    let promise = new Promise(function (resolve, reject) {
      if (db && store == storeName) {
        log(
          'resolve old connection store:' +
            store +
            '; db:' +
            dbName +
            '; id:' +
            initId,
        );
        resolve(db);
        return;
      }

      let handle = indexedDB.open(dbName);
      handle.onupgradeneeded = function (event) {
        log('start onupgradeneeded' + '; id:' + initId);

        db = handle.result;

        if (event.oldVersion < 1) {
          let st = db.createObjectStore(storeName, { keyPath: 'key' });

          let transaction = event.target.transaction;
          let addRequest = transaction
            .objectStore(storeName)
            .add({ key: 'version', value: event.newVersion });
          addRequest.onsuccess = function () {
            log(
              'Success upgrade to version:' +
                event.newVersion +
                '; id:' +
                initId,
            );
          };
          log('create store:' + storeName + '; id:' + initId);
        }

        log('end onupgradeneeded' + '; id:' + initId);
      };

      handle.onerror = function (e) {
        reject(
          new Error(
            'Error on open Db (' + dbName + '):' + e + '; id:' + initId,
          ),
        );
      };

      handle.onsuccess = function () {
        db = handle.result; // db.version will be 3.
        log('success init db store:' + dbName + '; id:' + initId);
        resolve(db);
      };
    });

    return promise;
  }

  this.get = function (key) {
    let promise = new Promise(function (resolve, reject) {
      log('start get ' + key + ': before init');
      obj
        .init(storeName)
        .then(function (database) {
          log('start get ' + key + ': after init');

          let transaction = database.transaction(storeName, 'readonly');
          let store = transaction.objectStore(storeName);

          let data = store.get(key);
          data.onsuccess = function (e) {
            log(
              'success get ' +
                key +
                ': ' +
                (e.target.result ? e.target.result.value : 'null'),
            );
            resolve(e.target.result ? e.target.result.value : null);
          };
          data.onerror = function (e) {
            reject(
              new Error(
                'Error on get key:' + key + ' (' + storeName + '):' + e,
              ),
            );
          };
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  };

  this.set = function (key, value) {
    let promise = new Promise(function (resolve, reject) {
      obj
        .init(storeName)
        .then(function (db) {
          log('start set ' + key + ': after init');
          let transaction = db.transaction(storeName, 'readwrite');
          let store = transaction.objectStore(storeName);

          store.put({ key: key, value: value }).onsuccess = function (e) {
            resolve(e.target.result);
          };
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  };

  this.del = function (key) {
    let promise = new Promise(function (resolve, reject) {
      obj
        .init(storeName)
        .then(function (db) {
          let transaction = db.transaction(storeName, 'readwrite');
          let store = transaction.objectStore(storeName);

          store.delete(key).onsuccess = function () {
            resolve(true);
          };
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  };

  // this.store = function (store) {
  //   storeName = store;
  // };
}
