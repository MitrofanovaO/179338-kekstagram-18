'use strict';

(function () {

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, window.data.DEBOUNCE_INTERVAL);
    };
  };

  var shuffle = function (arr) {
    var newRandomArray = arr.slice();
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
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    COMMENTS_QUANTITY: 5,
    DEBOUNCE_INTERVAL: 500,
    debounce: debounce,
    shuffle: shuffle,
  };

})();
