'use strict';

var ESC_KEYCODE = 27;
var PHOTOS_QUANTITY = 25;
var AVATAR_QUANTITY = 6;
var MIN_LIKE = 15;
var MAX_LIKE = 200;
var USER_NAMES = [
  'Ирина',
  'Даниил',
  'Владислава',
  'Максим',
  'Вадим',
  'Анжелика'
];
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var HASHTAGS_OPTIONS = {
  MAX_QAUNTITY: 5,
  MAX_LENGTH: 20,
};
var SCALE_OPTIONS = {
  SCALE_STEP: 25,
  MIN_SCALE: 25,
  MAX_SCALE: 100,
};

var uploadFileElement = document.querySelector('input[id="upload-file"]');
var uploadScale = document.querySelector('.img-upload__scale');
var scaleValue = document.querySelector('.scale__control--value');
var imgUploadPreview = document.querySelector('.img-upload__preview img');
var uploadFileOverlay = document.querySelector('.img-upload__overlay');
var uploadFileCancel = document.querySelector('.img-upload__cancel');
var effectLevelValue = document.querySelector('.effect-level__value');
var effectOriginal = document.querySelector('input[id="effect-none"]');
var effectChrome = document.querySelector('input[id="effect-chrome"]');
var effectSepia = document.querySelector('input[id="effect-sepia"]');
var effectMarvin = document.querySelector('input[id="effect-marvin"]');
var effectPhobos = document.querySelector('input[id="effect-phobos"]');
var effectHeat = document.querySelector('input[id="effect-heat"]');
var effects = document.querySelectorAll('.effects__radio');
var hashtagsInput = document.querySelector('.text__hashtags');

var getRandomArrayElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var getUrlAvatar = function (maxCount) {
  var avatarNumber = Math.ceil(Math.random() * maxCount);
  return 'img/avatar-' + avatarNumber + '.svg';
};

var createComments = function () {
  var commentCount = Math.ceil(Math.random() * AVATAR_QUANTITY);
  var comments = [];
  for (var i = 0; i < commentCount; i++) {
    comments.push({
      avatar: getUrlAvatar(AVATAR_QUANTITY),
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(USER_NAMES)
    });
  }
  return comments;
};

var createPhotos = function (count) {
  var photos = [];
  for (var i = 0; i < count; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomInterval(MIN_LIKE, MAX_LIKE),
      comments: createComments()
    });
  }
  return photos;

};

var fillPhotoElement = function (element, data) {
  element.querySelector('.picture__img').src = data.url;
  element.querySelector('.picture__comments').innerText = data.comments.length;
  element.querySelector('.picture__likes').innerText = data.likes;
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

var createCommentElement = function (options) {
  var item = document.createElement('li');
  item.classList.add('social__comment');
  item.innerHTML = '<img class="social__picture" ' +
    'src="' + options.avatar + '" ' +
    'alt="' + options.name + '" ' +
    'width="35" height="35">' +
    '<p class="social__text">' + options.message + '</p>';
  return item;
};

var fillPicturePopup = function (block, picture) {
  var comments = document.querySelector('.social__comments');

  for (var i = 0; i < picture.comments.length; i++) {
    comments.appendChild(createCommentElement(picture.comments[i]));
  }

  block.querySelector('.big-picture__img img').src = picture.url;
  block.querySelector('.likes-count').textContent = picture.likes;
  block.querySelector('.comments-count').textContent = String(picture.comments.length);
  block.querySelector('.social__caption').textContent = picture.description;
};

var photoArr = createPhotos(PHOTOS_QUANTITY);
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturePopupElement = document.querySelector('.big-picture');

document.querySelector('.pictures').appendChild(createDocumentFragment(photoTemplate, photoArr));
fillPicturePopup(picturePopupElement, photoArr[0]);

// picturePopupElement.classList.remove('hidden');
picturePopupElement.querySelector('.social__comment-count').classList.add('visually-hidden');
picturePopupElement.querySelector('.comments-loader').classList.add('visually-hidden');

uploadScale.addEventListener('click', function (evt) {
  var currentScale = Number(scaleValue.value.slice(0, -1));
  var targ = evt.target;
  if (targ.classList[1] === 'scale__control--smaller' && currentScale > SCALE_OPTIONS.MIN_SCALE) {
    currentScale -= SCALE_OPTIONS.SCALE_STEP;

  } else if (targ.classList[1] === 'scale__control--bigger' && currentScale < SCALE_OPTIONS.MAX_SCALE) {
    currentScale += SCALE_OPTIONS.SCALE_STEP;
  }
  scaleValue.value = currentScale + '%';
  imgUploadPreview.style.transform = 'scale(' + currentScale / 100 + ')';
});

var enterCloseHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadOverlay();
  }
};

var openUploadOverlay = function () {
  uploadFileOverlay.classList.remove('hidden');
  document.addEventListener('keydown', enterCloseHandler);
};

var closeUploadOverlay = function () {
  uploadFileOverlay.classList.add('hidden');
};

uploadFileElement.addEventListener('change', openUploadOverlay);
uploadFileCancel.addEventListener('click', closeUploadOverlay);

var addEffectLevelClickHandler = function (maxLevel, minLevel, currentLevel) {
  return ((currentLevel * maxLevel) / 100) + minLevel;
};

var getEffectStyle = function () {
  if (effectChrome.checked) {
    return 'grayscale(' + addEffectLevelClickHandler(1, 0, effectLevelValue.value) + ')';
  }
  if (effectSepia.checked) {
    return 'sepia(' + addEffectLevelClickHandler(1, 0, effectLevelValue.value) + ')';
  }
  if (effectMarvin.checked) {
    return 'invert(' + addEffectLevelClickHandler(100, 0, effectLevelValue.value) + '%)';
  }
  if (effectPhobos.checked) {
    return 'blur(' + addEffectLevelClickHandler(3, 0, effectLevelValue.value) + 'px)';
  }
  if (effectHeat.checked) {
    return 'brightness(' + addEffectLevelClickHandler(3, 1, effectLevelValue.value) + ')';
  }
  return '';
};

var checkEffectsNone = function () {
  if (effectOriginal.checked) {
    document.querySelector('.effect-level').classList.add('visually-hidden');
  } else {
    document.querySelector('.effect-level').classList.remove('visually-hidden');
  }
};

var changeEffect = function (effectName) {
  for (var a = 0; a < effects.length; a++) {
    if (effects[a].checked) {
      imgUploadPreview.className = '';
      imgUploadPreview.style.filter = getEffectStyle;
      imgUploadPreview.classList.add('effects__preview--' + effectName);
    }
  }
};

var addEffectClickHandler = function (currentEffect) {
  currentEffect.addEventListener('click', function () {
    changeEffect(currentEffect.value);
    checkEffectsNone();
  });
};

for (var f = 0; f < effects.length; f++) {
  addEffectClickHandler(effects[f]);
  checkEffectsNone();
}

function validationHashtags() {
  var hashtags = hashtagsInput.value.split(' ').map(function (elem) {
    return elem.toLowerCase();
  }).filter(function (elem) {
    return elem !== '';
  });
  hashtagsInput.value = hashtags.join(' ');

  for (var i = 0; i < hashtags.length; i++) {
    var firstToken = hashtags[i][0];
    var inkr = i + 1;
    if (firstToken !== '#') {
      hashtagsInput.setCustomValidity('Хэштег должен начинаться с #');
    } else if (hashtags.length > HASHTAGS_OPTIONS.MAX_QAUNTITY) {
      hashtagsInput.setCustomValidity('Не более 5 хэштегов');
    } else if (hashtags[i].length > HASHTAGS_OPTIONS.MAX_LENGTH) {
      hashtagsInput.setCustomValidity('Хэштег не иожет быть длиннее 20 символов, включая решетку');
    } else if (firstToken === '#' && hashtags[i].length === 1) {
      hashtagsInput.setCustomValidity('Хэштег не может состоять из одной решетки');
    } else if (hashtags[i].indexOf('#', 1) !== -1) {
      hashtagsInput.setCustomValidity('Хэштеги должны разделяться пробелом');
      break;
    } else if (hashtags.indexOf(hashtags[i], inkr) !== -1) {
      hashtagsInput.setCustomValidity('Хэштеги не могут повторяться');
      break;
    } else {
      hashtagsInput.setCustomValidity('');
    }
  }
}
hashtagsInput.addEventListener('change', validationHashtags);
hashtagsInput.addEventListener('focus', function () {
  document.removeEventListener('keydown', enterCloseHandler);
});
hashtagsInput.addEventListener('blur', function () {
  document.addEventListener('keydown', enterCloseHandler);
});

