(function () {
  window.addEventListener('popstate', function () {
    for (let i = 0; i < 10; i++) {
      window.history.pushState('target', '', location.href);
    }
  });
  window.history.pushState('target', '', location.href);
})();

let EBtEl = document.getElementById('expand-button');
let text = document.getElementById('text');
const showText = EBtEl.getAttribute('data-show');
const hideText = EBtEl.getAttribute('data-hide');

EBtEl.innerText = showText;
EBtEl.addEventListener('click', () => {
  if (EBtEl.innerText === showText) {
    EBtEl.innerText = hideText;
    text.className = text.className.replace(/\bcollapsed\b/g, '');
  } else {
    EBtEl.innerText = showText;
    text.className += 'collapsed';
  }
});

const helpers = {
  decode: value => {
    const decode = document.createElement('textarea');
    decode.innerHTML = value;
    return decode.innerText;
  },
};

window.addEventListener('load', function () {
  document.querySelectorAll('[helpers-decode]').forEach(value => {
    value.innerText = helpers.decode(value.innerText);
  });
});
