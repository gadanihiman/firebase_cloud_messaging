/** npm packages */
import React from 'react';
import { notifyUser } from '../../helpers/firebase';

function HomePageContainerDesktop({
  firebaseToken,
  isDisplayNotif,
  setIsDisplayNotif,
  notificationData,
}) {
  return (
    <div>
      {isDisplayNotif && (
        <div onClick={() => setIsDisplayNotif(false)}>
          <strong className="mr-auto">{notificationData.title}</strong>
          <span isBlock>{notificationData.body}</span>
          <small>just now</small>
        </div>
      )}
      <div>
        <h1>FIREBASE NOTIFICATION EXAMPLE</h1>
        {firebaseToken && <h1> Notification permission enabled 👍🏻 </h1>}
        {!firebaseToken && <h1> Need notification permission ❗️ </h1>}
        <button onClick={notifyUser}>
          Notif Saya!
        </button>
      </div>
    </div>
  );
}

export default HomePageContainerDesktop;
