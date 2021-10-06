/* eslint-disable no-unused-vars */
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { isPushNotificationSupported } from './utils.js';

const firebaseConfig = {
  apiKey: 'XXXXXX',
  authDomain: 'XXXXXX.firebaseapp.com',
  projectId: 'XXXXXX',
  storageBucket: 'XXXXXX.appspot.com',
  messagingSenderId: 'XXXXXX',
  appId: 'XXXXXX',
};

export const notifyUser = () => {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notif = new Notification('Notifikasi telah Aktif!');
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        const notif = new Notification('Notifikasi telah Aktif!');
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
};

export const getFirebaseToken = (getNotificationData) => {
  console.info('getFirebaseToken started');
  if (!isPushNotificationSupported()) {
    const unSupportedNotifErr = 'Browser Anda tidak support notifikasi!';
    alert(unSupportedNotifErr);
    console.error(unSupportedNotifErr);
    return;
  }

  let firebaseToken = '';

  const firebaseApp = initializeApp(firebaseConfig);

  const messaging = getMessaging();
  getToken(messaging, {
    vapidKey:
      'BLN92wJTtLhgnX9Hz66UFZrnO8RSzwoYlaAoB9IyHbBO8cQG5qLW6RCSmoaXNgYTzs3ilG95ocMGuT3IIBFtewA',
  })
    .then((currentToken) => {
      if (currentToken) {
        firebaseToken = currentToken;
        getNotificationData(currentToken, null);
        // Send the token to the server and update the UI if necessary
      } else {
        // Show permission request UI
        console.info(
          'No registration token available. Request permission to generate one.',
        );
        notifyUser();
      }
      return currentToken;
    })
    .catch((err) => {
      console.error('An error occurred while retrieving token. ', err);
      notifyUser();
      // ...
    });

  /** Listen incomming message */
  onMessageListener(messaging, (notifData) => {
    /** get the token and notification data */
    getNotificationData(firebaseToken, notifData);
  });
};

export const onMessageListener = (messaging, callback) => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    callback(payload);
  });
};
