'use strict';

(function () {

  var COMMENTS_STEP = 5;

  var bodyElement = document.querySelector('body');
  var picturePopupElement = document.querySelector('.big-picture');
  var bigPictureCancel = picturePopupElement.querySelector('.big-picture__cancel');
  var image = picturePopupElement.querySelector('.big-picture__img img');
  var pictureLike = picturePopupElement.querySelector('.likes-count');
  var pictureComment = picturePopupElement.querySelector('.likes-count');
  var pictureDescription = picturePopupElement.querySelector('.social__caption');
  var commentsArr = document.querySelector('.social__comments');
  var commentsLoader = picturePopupElement.querySelector('.comments-loader');
  var commentsCountBlock = picturePopupElement.querySelector('.social__comment-count');
  var commentsCount = commentsCountBlock.querySelector('.comments-count');
  var commentsCountShow = commentsCountBlock.querySelector('.comments-count-show');
  picturePopupElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  picturePopupElement.querySelector('.comments-loader').classList.add('visually-hidden');

  var fillPicturePopup = function (picture) {

    var template = commentsArr.querySelector('.social__comment');
    var fragment = document.createDocumentFragment();
    commentsCountShow.textContent = COMMENTS_STEP;

    picture.comments.forEach(function (item, index) {
      var commentsElement = template.cloneNode(true);
      commentsCountBlock.classList.remove('visually-hidden');
      if (index >= COMMENTS_STEP) {
        commentsElement.classList.add('visually-hidden');
      }
      fragment.appendChild(commentsElement);

      var avatar = fragment.children[index].querySelector('.social__picture');
      var text = fragment.children[index].querySelector('.social__text');

      avatar.src = item.avatar;
      avatar.alt = item.name;
      text.textContent = item.message;

    });

    if (picture.comments.length <= COMMENTS_STEP) {
      commentsLoader.classList.add('visually-hidden');
      commentsCountBlock.classList.add('visually-hidden');
    } else {
      commentsCount.textContent = picture.comments.length;
      commentsLoader.classList.remove('visually-hidden');
    }

    image.src = picture.url;
    pictureLike.textContent = picture.likes;
    pictureComment.textContent = picture.comments.length;
    pictureDescription.textContent = picture.description;

    commentsArr.innerHTML = '';
    commentsArr.appendChild(fragment);
    bodyElement.classList.add('modal-open');

  };

  commentsLoader.addEventListener('click', function () {
    var hideComments = commentsArr.querySelectorAll('.visually-hidden');
    hideComments.forEach(function (item, index) {
      if (index >= COMMENTS_STEP) {
        return;
      }
      item.classList.remove('visually-hidden');
      if (index === hideComments.length - 1) {
        commentsLoader.classList.add('visually-hidden');
        commentsCountBlock.classList.add('visually-hidden');
      }
    });
    var hiddenComment = commentsArr.querySelectorAll('.visually-hidden');
    var commentBlockAll = commentsArr.querySelectorAll('.social__comment');
    commentsCountShow.textContent = commentBlockAll.length - hiddenComment.length;
  });


  var onEnterPressPicture = function (evt, picture) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      fillPicturePopup(picture);
    }
  };

  var onClickPictureShow = function (picture) {
    picturePopupElement.classList.remove('hidden');
    fillPicturePopup(picture);
  };

  var closeBigPicture = function () {
    picturePopupElement.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('click', onCloseBigPicture);
  };

  var onCloseBigPicture = function () {
    closeBigPicture();
  };

  var onPressEscBigPicture = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  bigPictureCancel.addEventListener('click', onCloseBigPicture);
  document.addEventListener('keydown', onPressEscBigPicture);

  window.popup = {
    onClickPictureShow: onClickPictureShow,
    onEnterPressPicture: onEnterPressPicture,
  };

})();
