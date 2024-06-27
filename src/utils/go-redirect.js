export const goRedirect = () => {
  //   ua_log('force_redirect');
  const searchString = window.location.search;

  window.location.replace(
    searchString.length
      ? `${import.meta.env.VITE_REDIRECT_URL}/?${searchString}`
      : import.meta.env.VITE_REDIRECT_URL,
  );
};
