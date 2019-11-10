'use strict';

(function () {

  var createXhr = function (url, method, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 3000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    return xhr;
  };

  var upload = function (data, onSuccess, onError) {
    var url = 'https://js.dump.academy/kekstagram';
    var xhr = createXhr(url, 'POST', onSuccess, onError);
    xhr.send(data);
  };

  var load = function (onSuccess, onError) {
    var url = 'https://js.dump.academy/kekstagram/data';
    var xhr = createXhr(url, 'GET', onSuccess, onError);
    xhr.send();
  };
  window.backend = {
    load: load,
    upload: upload
  };

})();
