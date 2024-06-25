import '@/styles/index.scss';

import 'virtual:svg-icons-register';
import useViewportSizes from '@/utils/use-viewport-sizes';
import '@/utils/expand-btn';
import '@/utils/pwa';
import { COOKIES_KEY } from '@/const';
import { goRedirect } from '@/utils/go-redirect';

useViewportSizes();

// eslint-disable-next-line no-undef
const isAppInstalled = Cookies.get(COOKIES_KEY.appInstalled) === '1';

if (isAppInstalled) {
  goRedirect();
}
