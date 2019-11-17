'use strict';
(function () {

  var mainSection = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');


  var initCloseBlockPopup = function (popup) {

    mainSection.insertAdjacentElement('afterbegin', popup);
    var buttons = document.querySelectorAll('button');

    var closePopup = function () {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }

      buttons.forEach(function (button) {
        button.removeEventListener('click', onButtonClick);
      });

      document.removeEventListener('keydown', onEscClose);
      document.removeEventListener('click', onCloseClick);
    };

    var onButtonClick = function () {
      closePopup();
    };

    var onEscClose = function (evt) {
      if (evt.keyCode === window.Constants.ESC_KEYCODE) {
        closePopup();
      }
    };

    var onCloseClick = function (evt) {
      if (popup === evt.target) {
        closePopup();
      }
    };

    buttons.forEach(function (button) {
      button.addEventListener('click', onButtonClick);
    });

    document.addEventListener('keydown', onEscClose);
    popup.addEventListener('click', onCloseClick);
  };

  var showError = function (errorMessage) {
    var errorPopup = errorTemplate.cloneNode(true);

    errorPopup.querySelector('.error__title').textContent = errorMessage;

    initCloseBlockPopup(errorPopup);
  };

  var showSuccess = function () {
    var successPopup = successTemplate.cloneNode(true);

    initCloseBlockPopup(successPopup);
  };

  window.messages = {
    showError: showError,
    showSuccess: showSuccess,
  };
})();
