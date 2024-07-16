export const requestNotificationsPermission = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === 'granted') {
    const swReg = await navigator.serviceWorker.getRegistration();
    swReg?.active.postMessage({
      action: 'NOTIFICATION_PERMISSION_GRANTED',
    });
  }
};
