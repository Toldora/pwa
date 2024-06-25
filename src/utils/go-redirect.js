import queryString from 'query-string';

export const goRedirect = () => {
  //   ua_log('force_redirect');
  const searchString = queryString.parse(window.location.search);

  window.location.replace(
    `${import.meta.env.VITE_REDIRECT_URL}?${searchString}`,
  );
};
