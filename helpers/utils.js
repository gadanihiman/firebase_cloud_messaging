/**
 * is push notif supported
 * @returns {Boolean}
 */
 export function isPushNotificationSupported() {
  return (
    'serviceWorker' in navigator && // For serviceWorker Checking
    ('PushManager' in window || // For Chrome Push Notif Checking
      ('safari' in window && 'pushNotification' in window.safari)) // For Safari Push Notif Checking
  );
}
