'use strict';

(function () {

  var fillPhotoElement = function (data) {
    var element = photoTemplate.cloneNode(true);

    element.querySelector('.picture__img').src = data.url;
    element.querySelector('.picture__comments').innerText = data.comments.length;
    element.querySelector('.picture__likes').innerText = data.likes;
    element.addEventListener('click', function () {
      window.onClickPictureShow(data);
    });
    element.addEventListener('keydown', function () {
      window.onEnterPressPicture(data);
    });
    return element;
  };

  var mainSection = document.querySelector('main');
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var imagesList = document.querySelector('.pictures');

  var successHandler = function (imagesArray) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < imagesArray.length; i++) {
      fragment.appendChild(fillPhotoElement(imagesArray[i]));
    }
    imagesList.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var errorTemplateBlock = errorTemplate.cloneNode(true);

    errorTemplateBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorTemplateBlock);
  };

  window.load('https://js.dump.academy/kekstagram/data', successHandler, errorHandler);

})();
