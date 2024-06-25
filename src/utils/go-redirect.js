export const goRedirect = () => {
  //   ua_log('force_redirect');

  window.location.replace(
    `${import.meta.env.VITE_REDIRECT_URL}?${window.location.search}`,
  );
};
