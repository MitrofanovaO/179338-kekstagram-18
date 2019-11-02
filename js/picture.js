'use strict';

(function () {

  window.fillPhotoElement = function (data) {
    var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
    var element = photoTemplate.cloneNode(true);
    var filters = document.querySelector('.img-filters');

    element.querySelector('.picture__img').src = data.url;
    element.querySelector('.picture__comments').textContent = data.comments.length;
    element.querySelector('.picture__likes').textContent = data.likes;

    element.addEventListener('click', function () {
      window.onClickPictureShow(data);
    });
    element.addEventListener('keydown', function () {
      window.onEnterPressPicture(data);
    });
    filters.classList.remove('img-filters--inactive');
    return element;
  };

  window.onSuccessPhoto = function (imagesArray) {
    var fragment = document.createDocumentFragment();
    var photoSection = document.querySelector('.pictures');

    imagesArray.forEach(function (item) {
      fragment.appendChild(window.fillPhotoElement(item));
    });

    photoSection.appendChild(fragment);
  };

  var successHandler = function (imagesArray) {

    window.photo = imagesArray.map(function (photo, id) {
      photo.id = id + 1;
      return photo;
    });

    window.onSuccessPhoto(window.photo);
  };

  var errorHandler = function (errorMessage) {
    var mainSection = document.querySelector('main');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorTemplateBlock = errorTemplate.cloneNode(true);

    errorTemplateBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorTemplateBlock);
  };

  window.load('https://js.dump.academy/kekstagram/data', successHandler, errorHandler);

})();
