import { COOKIES_KEY } from '@/const';
import { goRedirect } from '@/utils/go-redirect';

let deferredPrompt;
const installButton = document.getElementById('install_button');
const loading = document.querySelector('.loading');
const progressWord = document.querySelector('.progress_word');
const runner = document.querySelector('.runner');
// eslint-disable-next-line no-undef
const ua = new UAParser();
// const urlParams = new URLSearchParams(window.location.search);
let fast_fire = 0;
let no_fire = 1;

// if (ua.getBrowser().name !== 'Chrome' && ua.getBrowser().name !== 'Yandex') {
//   let lnk = document.getElementById('r');
//   //lnk.setAttribute("href", `intent://navigate?url=${window.location.hostname}/?#Intent;scheme=googlechrome;end;`);
//   lnk.setAttribute(
//     'href',
//     `intent://${window.location.hostname}/?#Intent;scheme=https;package=com.android.chrome;end;`,
//   );
//   lnk.click();
//   if (ua.getBrowser().name == 'Chrome WebView') {
//     //goLink();
//   }
// }

function ua_log() {}
// function ua_log(action) {
//   if (action == 'install') {
//     let trans = $('.trans-btns').html();
//     let desc = $('.app-description__main-content').html();
//     let update = $('.app-comp__recent-changes-wrapper').html();
//     let comments = $('#testimotials').html();
//     let ads = $('.app-comp__ad-status').html();
//     let cat = $('.cat').html();

//     let postObj = {
//       lang_html: trans,
//       desc: desc,
//       update: update,
//       comments: comments,
//       ads: ads,
//       cat: cat,
//       test: 1,
//     };

//     $.ajax({
//       type: 'post',
//       url: '/lang.php',
//       data: postObj,
//       dataType: 'json',
//       processData: true,
//     });
//   }

//   $.ajax({
//     type: 'get',
//     url: '/ua.php',
//     data:
//       'type=installer&action=' +
//       action +
//       '&device=' +
//       ua.getBrowser().name +
//       '&utm_source=' +
//       urlParams.get('utm_source') +
//       '&utm_medium=' +
//       urlParams.get('utm_medium') +
//       '&utm_campaign=' +
//       urlParams.get('utm_campaign') +
//       '&utm_term=' +
//       urlParams.get('utm_term') +
//       '&utm_content=' +
//       urlParams.get('utm_content'),
//     dataType: 'json',
//     processData: true,
//     success: function (result) {
//       if (result.offer_pid == 5 && action == 'install') {
//         Cookies.set('offer_pid', '5', { expires: 365 });
//       }
//     },
//   });
//   return true;
// }

// function pp_sake() {
//   let sended = Cookies.get('install_ev');
//   if (!sended) {
//     Cookies.set('install_ev', '1', { expires: 1 });
//     setTimeout(function () {
//       $.ajax({
//         type: 'get',
//         url: '/push.php',
//         dataType: 'json',
//         processData: true,
//       });
//       return true;
//     }, 2000);
//   }
// }

// function goLink() {
//   $.get('link.php', function (data) {
//     setTimeout(function () {
//       ua_log('force_redirect');
//       window.open(data, '_system');
//     }, 1000);
//   });
// }

// function findGetParameter(parameterName) {
//   let result = null,
//     tmp = [];
//   let items = location.search.substr(1).split('&');
//   for (let index = 0; index < items.length; index++) {
//     tmp = items[index].split('=');
//     if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
//   }
//   return result;
// }

function getProgress(e, n) {
  const i = [];
  let s = 0;
  for (let o = e / n / 3; n > s; ) {
    s++;
    let t = s * (e / n);
    (t += 0.5 < Math.random() ? o : -1 * o), i.push(t.toFixed(2));
  }
  return i.splice(i.length - 1, 1, e), i;
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  fast_fire = 1;
  no_fire = 0;

  //ua_log('prompt');
});

setTimeout(function () {
  if (fast_fire == 1) {
    installButton.innerHTML = 'Установить';
    installButton.hidden = false;
    installButton.addEventListener('click', fastInstallApp);
  } else {
    installButton.innerHTML = 'Скачать';
    installButton.hidden = false;
    installButton.addEventListener('click', longInstallApp);
  }
}, 3000);

window.addEventListener('appinstalled', () => {
  installButton.innerHTML = 'Установка ...';
  installButton.disabled = false;
  installButton.removeEventListener('click', fastInstallApp);
  installButton.removeEventListener('click', longInstaller);
  installButton.removeEventListener('click', longInstallApp);

  // eslint-disable-next-line no-undef
  Cookies.set(COOKIES_KEY.appInstalled, '1', { expires: 365 });
  setTimeout(function () {
    installButton.innerHTML = 'Играть';
    installButton.addEventListener('click', goRedirect);

    // OneSignal.showNativePrompt();
  }, 3000);
});

function fastInstallApp() {
  deferredPrompt.prompt();
  installButton.disabled = true;
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      installButton.style.display = 'none';
      loading.style.display = 'block';
      progressWord.innerText = `0 MB / 12.3 MB`;
      runner.style.width = '0%';
      let t = Math.round(5 * Math.random() + 15);
      const e = getProgress(12.3, t),
        n = setInterval(() => {
          let t;
          e.length
            ? ((t = e.shift()),
              (progressWord.innerText = `${t} MB / 12.3 MB`),
              (t = ((100 * t) / 12.3).toFixed(2)),
              (runner.style.width = `${t}%`))
            : (clearInterval(n),
              (installButton.innerText = 'Играть'),
              (loading.style.display = 'none'),
              (installButton.style.display = 'block'));
        }, Math.round(200 * Math.random() + 800));

      // let OneSignal = window.OneSignal || [];
      // let initConfig = {
      //   appId: 'cfcd8e78-cb4e-4c8f-ac71-01f4cfca4a17',
      //   welcomeNotification: { disable: true },
      //   persistNotification: true,
      // };
      // OneSignal.push(function () {
      //   OneSignal.SERVICE_WORKER_PARAM = { scope: '/push/' };
      //   OneSignal.init(initConfig);
      // });

      // OneSignal.sendTag('tracking_id', '667a86571fece5.58836978');

      // setTimeout(function () {
      //   let offer_pid = Cookies.get('offer_pid');
      //   if (!offer_pid) {
      //     // OneSignal.sendTag("offer_pid", "5");
      //   }
      // }, 1000);

      // OneSignal.on('subscriptionChange', function (t) {
      //   ua_log('push');
      //   pp_sake();
      // });
    }

    installButton.disabled = false;
    deferredPrompt = null;
  });
}

function longInstallApp() {
  installButton.style.display = 'none';
  loading.style.display = 'block';

  progressWord.innerText = `0 MB / 12.3 MB`;
  runner.style.width = '0%';
  let t = Math.round(5 * Math.random() + 15);
  const e = getProgress(12.3, t),
    n = setInterval(() => {
      let t;
      e.length
        ? ((t = e.shift()),
          (progressWord.innerText = `${t} MB / 12.3 MB`),
          (t = ((100 * t) / 12.3).toFixed(2)),
          (runner.style.width = `${t}%`))
        : (clearInterval(n),
          (installButton.innerText = 'Установить'),
          (loading.style.display = 'none'),
          (installButton.style.display = 'block'),
          installButton.removeEventListener('click', longInstallApp),
          installButton.addEventListener('click', longInstaller));
    }, Math.round(200 * Math.random() + 300));

  // let OneSignal = window.OneSignal || [];
  // let initConfig = {
  //   appId: 'cfcd8e78-cb4e-4c8f-ac71-01f4cfca4a17',
  //   welcomeNotification: { disable: true },
  //   persistNotification: true,
  // };
  // OneSignal.push(function () {
  //   OneSignal.SERVICE_WORKER_PARAM = { scope: '/push/' };
  //   OneSignal.init(initConfig);
  // });

  // OneSignal.sendTag('tracking_id', '667a86571fece5.58836978');

  // setTimeout(function () {
  //   let offer_pid = Cookies.get('offer_pid');
  //   if (!offer_pid) {
  //     // OneSignal.sendTag("offer_pid", "5");
  //   }
  // }, 1000);

  /*OneSignal.push(function() {
        OneSignal.on('notificationPermissionChange', 
        function(permissionChange) {
            var currentPermission = permissionChange.to;
            console.log('1 New permission state:', currentPermission);
        });
    }); */

  /*OneSignal.on('notificationPermissionChange', function(permissionChange) {
        var isSubscribed = permissionChange.to === 'granted';
        if (isSubscribed) {
            //ua_log('push');
            //pp_sake();
        }
    });   */

  // OneSignal.on('subscriptionChange', function (t) {
  //   ua_log('push');
  //   pp_sake();
  // });
}

function longInstaller() {
  installButton.innerHTML = 'Установка ...';
  if (no_fire == 0) {
    deferredPrompt.prompt();
  } else {
    setTimeout(function () {
      goRedirect();
    }, 10000);
  }

  // let OneSignal = window.OneSignal || [];
  // let initConfig = {
  //   appId: 'cfcd8e78-cb4e-4c8f-ac71-01f4cfca4a17',
  //   welcomeNotification: { disable: true },
  //   persistNotification: true,
  // };
  // OneSignal.push(function () {
  //   OneSignal.SERVICE_WORKER_PARAM = { scope: '/push/' };
  //   OneSignal.init(initConfig);
  // });

  // OneSignal.sendTag('tracking_id', '667a86571fece5.58836978');

  // setTimeout(function () {
  //   let offer_pid = Cookies.get('offer_pid');
  //   if (!offer_pid) {
  //     // OneSignal.sendTag("offer_pid", "5");
  //   }
  // }, 1000);

  // OneSignal.on('subscriptionChange', function (t) {
  //   ua_log('push');
  //   pp_sake();
  // });
}
