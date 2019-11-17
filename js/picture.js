'use strict';

(function () {

  var photoSection = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture');
  var photos = [];

  var fillPicture = function (data) {
    var photoTemplate = pictureTemplate.content.querySelector('.picture');
    var picture = photoTemplate.cloneNode(true);
    var filters = document.querySelector('.img-filters');

    picture.querySelector('.picture__img').src = data.url;
    picture.querySelector('.picture__comments').textContent = data.comments.length;
    picture.querySelector('.picture__likes').textContent = data.likes;

    picture.addEventListener('click', function () {
      window.popup.onClickPictureShow(data);
    });
    picture.addEventListener('keydown', function () {
      window.popup.onEnterPressPicture(data);
    });
    filters.classList.remove('img-filters--inactive');
    return picture;
  };

  var removePhotos = function () {
    var pictures = photoSection.querySelectorAll('.picture');
    pictures.forEach(function (photo) {
      photo.remove();
    });
  };

  var renderPhoto = function (images) {
    var fragment = document.createDocumentFragment();

    images.forEach(function (item) {
      fragment.appendChild(fillPicture(item));
    });

    photoSection.appendChild(fragment);
  };

  var getPhotos = function () {
    return photos;
  };

  var onSuccessLoadPicture = function (images) {
    photos = images.map(function (photo, index) {
      photo.id = index + 1;
      return photo;
    });
    renderPhoto(photos);
  };

  var onErrorLoadPicture = function (errorMessage) {
    window.messages.showError(errorMessage);
  };

  window.backend.load(onSuccessLoadPicture, onErrorLoadPicture);

  window.picture = {
    getAll: getPhotos,
    render: renderPhoto,
    removeAll: removePhotos,
  };

})();
