'use strict';

(function () {

  var photoSection = document.querySelector('.pictures');
  var photos = [];

  var fillPhotoElement = function (data) {
    var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
    var element = photoTemplate.cloneNode(true);
    var filters = document.querySelector('.img-filters');

    element.querySelector('.picture__img').src = data.url;
    element.querySelector('.picture__comments').textContent = data.comments.length;
    element.querySelector('.picture__likes').textContent = data.likes;

    element.addEventListener('click', function () {
      window.popup.onClickPictureShow(data);
    });
    element.addEventListener('keydown', function () {
      window.popup.onEnterPressPicture(data);
    });
    filters.classList.remove('img-filters--inactive');
    return element;
  };

  var removePhotos = function () {
    var photoElements = photoSection.querySelectorAll('.picture');
    photoElements.forEach(function (photo) {
      photo.remove();
    });
  };

  var renderPhoto = function (images) {
    var fragment = document.createDocumentFragment();

    images.forEach(function (item) {
      fragment.appendChild(window.picture.fillPhotoElement(item));
    });

    window.picture.photoSection.appendChild(fragment);
  };

  var getPhotos = function () {
    return photos;
  };

  var onSuccessLoadPicture = function (images) {
    photos = images.map(function (photo, index) {
      photo.id = index + 1;
      return photo;
    });
    window.picture.renderPhoto(photos);
  };

  var onErrorLoadPicture = function (errorMessage) {
    window.messages.showError(errorMessage);
  };

  window.backend.load(onSuccessLoadPicture, onErrorLoadPicture);

  window.picture = {
    photoSection: photoSection,
    getPhotos: getPhotos,
    fillPhotoElement: fillPhotoElement,
    renderPhoto: renderPhoto,
    removePhotos: removePhotos,
  };

})();
