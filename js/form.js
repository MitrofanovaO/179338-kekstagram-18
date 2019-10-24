'use strict';

(function () {

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
  var imageUpload = document.querySelector('.img-upload');
  var textInput = imageUpload.querySelector('.text__description');

  var addEffectLevelClickHandler = function (maxLevel, minLevel, currentLevel) {
    return ((currentLevel * maxLevel) / 100) + minLevel;
  };

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

  var enterCloseHandler = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      if (textInput.matches(':focus')) {
        return '';
      } else {
        closeUploadOverlay();
      }
    }
    return '';
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

})();
