'use strict';

(function () {
  var picturePopupElement = document.querySelector('.big-picture');
  var bigPictureCancel = picturePopupElement.querySelector('.big-picture__cancel');

  picturePopupElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  picturePopupElement.querySelector('.comments-loader').classList.add('visually-hidden');

  var fillPicturePopup = function (picture) {
    var commentsArr = document.querySelector('.social__comments');
    commentsArr.innerHTML = '';

    for (var i = 0; i < picture.comments.length; i++) {
      commentsArr.appendChild(window.createCommentElement(picture.comments[i]));
    }

    picturePopupElement.querySelector('.big-picture__img img').src = picture.url;
    picturePopupElement.querySelector('.likes-count').textContent = picture.likes;
    picturePopupElement.querySelector('.comments-count').textContent = picture.comments.length;
    picturePopupElement.querySelector('.social__caption').textContent = picture.description;
  };


  window.onEnterPressPicture = function (evt, picture) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      fillPicturePopup(picture);
    }
  };

  window.onClickPictureShow = function (picture) {
    picturePopupElement.classList.remove('hidden');
    fillPicturePopup(picture);
  };

  var closeBigPicture = function () {
    picturePopupElement.classList.add('hidden');
    document.removeEventListener('click', onCloseBigPicture);
  };

  var onCloseBigPicture = function () {
    closeBigPicture();
  };

  var onPressEscBigPicture = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);

})();
