'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var shuffle = function (photos) {
    var newRandomArray = photos.slice();
    var currentIndex = newRandomArray.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = newRandomArray[currentIndex];
      newRandomArray[currentIndex] = newRandomArray[randomIndex];
      newRandomArray[randomIndex] = temporaryValue;
    }

    return newRandomArray;
  };

  window.data = {
    debounce: debounce,
    shuffle: shuffle,
  };

})();
