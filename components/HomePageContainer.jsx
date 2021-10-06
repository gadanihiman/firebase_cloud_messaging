/* eslint-disable no-unused-vars */
/** npm packages */
import React, { useEffect, useState } from 'react';
import { bool } from 'prop-types';
import { getFirebaseToken } from '../../helpers/firebase';
// import propTypes from 'prop-types';

/** components */
import HomePageContainerDesktop from './HomePageContainerDesktop';

function HomePageContainer({ isMobile }) {
  const [firebaseToken, setFirebaseToken] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    body: '',
  });
  const [isDisplayNotif, setIsDisplayNotif] = useState(false);

  console.log({ firebaseToken, notificationData });

  useEffect(() => {
    getFirebaseToken(getNotificationData);
  }, []);

  /**
   * Get notification data
   * @param {String} token | Firebase Token
   * @param {Object} notifData | Notification Payload Data
   */
  function getNotificationData(token, notifData) {
    setFirebaseToken(token);
    if (notifData) {
      setIsDisplayNotif(true);
      if (notifData.data) {
        setNotificationData(notifData.data);
      }
    }
  }

  const props = {
    firebaseToken,
    isDisplayNotif,
    setIsDisplayNotif,
    notificationData,
  };

  if (isMobile) {
    return <HomePageContainerDesktop {...props} />;
  }

  return <HomePageContainerDesktop {...props} />;
}

HomePageContainer.propTypes = {
  isMobile: bool.isRequired,
};

export default HomePageContainer;
