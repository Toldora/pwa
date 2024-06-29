import '@/styles/index.scss';

import 'virtual:svg-icons-register';
import queryString from 'query-string';
import '@/plugins';
import useViewportSizes from '@/utils/use-viewport-sizes';
import '@/utils/expand-btn';
import '@/utils/pwa';
import { COOKIES_KEY } from '@/const';
import { goRedirect } from '@/utils/go-redirect';

useViewportSizes();

const searchString = queryString.parse(window.location.search);

// eslint-disable-next-line no-undef
const isAppInstalled = Cookies.get(COOKIES_KEY.appInstalled) === '1';

if (isAppInstalled && !searchString.debug) {
  // goRedirect();
}
