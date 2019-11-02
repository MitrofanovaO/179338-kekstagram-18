'use strict';

(function () {
  var SHOWN_COMMENTS = 5;
  var picturePopupElement = document.querySelector('.big-picture');
  var bigPictureCancel = picturePopupElement.querySelector('.big-picture__cancel');
  var image = picturePopupElement.querySelector('.big-picture__img img');
  var pictureLike = picturePopupElement.querySelector('.likes-count');
  var pictureComment = picturePopupElement.querySelector('.likes-count');
  var pictureDescription = picturePopupElement.querySelector('.social__caption');
  var commentsArr = document.querySelector('.social__comments');
  var commentsLoader = picturePopupElement.querySelector('.comments-loader');

  picturePopupElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  picturePopupElement.querySelector('.comments-loader').classList.add('visually-hidden');

  var fillPicturePopup = function (picture) {

    var commentItem = commentsArr.querySelector('.social__comment');
    var fragment = document.createDocumentFragment();

    picture.comments.forEach(function (item, i) {
      var cloneItem = commentItem.cloneNode(true);
      if (i >= SHOWN_COMMENTS) {
        cloneItem.classList.add('visually-hidden');
      }
      fragment.appendChild(cloneItem);
      var avatar = fragment.children[i].querySelector('.social__picture');
      var text = fragment.children[i].querySelector('.social__text');

      avatar.src = item.avatar;
      avatar.alt = item.name;
      text.textContent = item.message;

      if (picture.comments.length <= SHOWN_COMMENTS) {
        commentsLoader.classList.add('visually-hidden');
      } else {
        commentsLoader.classList.remove('visually-hidden');
      }
    });

    image.src = picture.url;
    pictureLike.textContent = picture.likes;
    pictureComment.textContent = picture.comments.length;
    pictureDescription.textContent = picture.description;

    commentsArr.innerHTML = '';
    commentsArr.appendChild(fragment);

  };

  commentsLoader.addEventListener('click', function () {
    var hideComments = commentsArr.querySelectorAll('.visually-hidden');
    hideComments.forEach(function (item, i) {
      if (i < SHOWN_COMMENTS) {
        item.classList.remove('visually-hidden');
      } else {
        return;
      }
      if (i === hideComments.length - 1) {
        commentsLoader.classList.add('visually-hidden');
      }
    });
  });


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
