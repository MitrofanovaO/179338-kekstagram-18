'use strict';

(function () {

  var fillPhotoElement = function (element, data) {
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

  var createDocumentFragment = function (template, photoArr) {
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < photoArr.length; i++) {
      var clone = template.cloneNode(true);
      docFragment.appendChild(fillPhotoElement(clone, photoArr[i]));
    }
    return docFragment;
  };

  var photoArr = window.createPhotos(window.data.PHOTOS_QUANTITY);
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  document.querySelector('.pictures').appendChild(createDocumentFragment(photoTemplate, photoArr));

})();
