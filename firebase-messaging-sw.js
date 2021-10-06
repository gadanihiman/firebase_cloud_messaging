/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js',
);

console.log('===========================================');
console.log('FIREBASE SERVICE WORKER RUNNING');
console.log('===========================================');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyDBhaYgqcyctFSX_LDUA8AzAaBIx1csvBE',
  authDomain: 'sehatq-testing.firebaseapp.com',
  projectId: 'sehatq-testing',
  storageBucket: 'sehatq-testing.appspot.com',
  messagingSenderId: '644611337350',
  appId: '1:644611337350:web:bbe5aefd8f0997bb7e3507',
});

/** START CUSTOM PUSH EVENT */

class CustomPushEvent extends Event {
  constructor(data) {
    super('push');

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

/** END CUSTOM PUSH EVENT */

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

/** START custom onnotificationclick handler */

self.onnotificationclick = function (event) {
  console.log('On notification click: ', event.notification.tag);
  console.log('event.notification: ', event.notification);
  event.notification.close();
  const pathAction = '/';
  const actionUrl = `${location.origin}${pathAction}`;

  /** FOR CUSTOM click_action / if there's a custom click_action (url) data */
  if (event.notification.data && event.notification.data.click_action) {
    self.clients.openWindow(event.notification.data.click_action);
    return;
  }
  /** end custom click_action */

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true, // IMPORTANT: include the uncontrolled window
        type: 'window',
      })
      // eslint-disable-next-line func-names
      // eslint-disable-next-line consistent-return
      .then(function (clientList) {
        console.log('clientList', clientList);
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url == actionUrl && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(actionUrl);
      }),
  );
};

/** END custom onnotificationclick handler */

/** START receive onBackgroundMessage handler */

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  if (!payload && !payload.data) {
    console.error('payload message notification data is empty!');
    return;
  }

  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );

  // Customize notification here
  const notificationTitle = payload.data.title || 'Notif';
  const notificationOptions = {
    body: payload.data.body || 'Body Notification',
    icon: payload.data.icon || '/favicon.ico',
    badge: payload.data.badge || '/favicon.ico',
    tag: payload.data.tag || 'main',
    sound: payload.data.sound || 'default',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/** END receive onBackgroundMessage handler */
