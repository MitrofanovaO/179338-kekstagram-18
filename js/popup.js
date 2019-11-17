'use strict';

(function () {

  var COMMENTS_STEP = 5;

  var body = document.querySelector('body');
  var picturePopup = document.querySelector('.big-picture');
  var bigPictureCancel = picturePopup.querySelector('.big-picture__cancel');
  var image = picturePopup.querySelector('.big-picture__img img');
  var pictureLike = picturePopup.querySelector('.likes-count');
  var pictureComment = picturePopup.querySelector('.comments-count');
  var pictureDescription = picturePopup.querySelector('.social__caption');
  var comments = document.querySelector('.social__comments');
  var commentsLoader = picturePopup.querySelector('.comments-loader');
  var commentsCountBlock = picturePopup.querySelector('.social__comment-count');
  var commentsCount = commentsCountBlock.querySelector('.comments-count');
  var commentsCountShow = commentsCountBlock.querySelector('.comments-count-show');
  picturePopup.querySelector('.social__comment-count').classList.add('visually-hidden');
  picturePopup.querySelector('.comments-loader').classList.add('visually-hidden');

  var fillPicturePopup = function (picture) {

    var template = comments.querySelector('.social__comment');
    var fragment = document.createDocumentFragment();
    commentsCountShow.textContent = COMMENTS_STEP;

    picture.comments.forEach(function (item, index) {
      var commentTemplate = template.cloneNode(true);
      commentsCountBlock.classList.remove('visually-hidden');
      if (index >= COMMENTS_STEP) {
        commentTemplate.classList.add('visually-hidden');
      }
      fragment.appendChild(commentTemplate);

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

    comments.innerHTML = '';
    comments.appendChild(fragment);
    body.classList.add('modal-open');

  };

  commentsLoader.addEventListener('click', function () {
    var hideComments = comments.querySelectorAll('.visually-hidden');
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
    var hiddenComment = comments.querySelectorAll('.visually-hidden');
    var commentBlockAll = comments.querySelectorAll('.social__comment');
    commentsCountShow.textContent = commentBlockAll.length - hiddenComment.length;
  });


  var onEnterPressPicture = function (evt, picture) {
    if (evt.keyCode === window.constants.ENTER_KEYCODE) {
      fillPicturePopup(picture);
    }
  };

  var onClickPictureShow = function (picture) {
    picturePopup.classList.remove('hidden');
    fillPicturePopup(picture);
  };

  var closeBigPicture = function () {
    picturePopup.classList.add('hidden');
    body.classList.remove('modal-open');
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
