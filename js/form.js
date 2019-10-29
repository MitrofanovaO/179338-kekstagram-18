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

  var COORDINATES = {
    MIN: 0,
    MAX: 453
  };

  var uploadFileElement = document.querySelector('input[id="upload-file"]');
  var uploadScale = document.querySelector('.img-upload__scale');
  var scaleValue = document.querySelector('.scale__control--value');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var uploadFileOverlay = document.querySelector('.img-upload__overlay');
  var uploadFileCancel = document.querySelector('.img-upload__cancel');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var imageUpload = document.querySelector('.img-upload');
  var textInput = imageUpload.querySelector('.text__description');

  var uploadFileForm = document.querySelector('.img-upload__form');
  var submitFormButton = uploadFileOverlay.querySelector('.img-upload__submit');

  var pinElement = uploadFileOverlay.querySelector('.effect-level__pin');
  var LineElement = uploadFileOverlay.querySelector('.effect-level__line');
  var DepthElement = uploadFileOverlay.querySelector('.effect-level__depth');
  var pinWrap = uploadFileOverlay.querySelector('.img-upload__effect-level');
  var effectPreviewPicture = uploadFileOverlay.querySelectorAll('input[name="effect"]');
  var currentFilter = 'none';

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

  function validationHashtags() {
    var hashtags = hashtagsInput.value.split(' ').map(function (elem) {
      return elem.toLowerCase();
    }).filter(function (elem) {
      return elem !== '';
    });
    hashtagsInput.value = hashtags.join(' ');
    var hashtagsList = [];

    for (var i = 0; i < hashtags.length; i++) {
      var firstToken = hashtags[i][0];
      if (firstToken !== '#') {
        return 'Хэштег должен начинаться с #';
      }
      if (hashtags.length > HASHTAGS_OPTIONS.MAX_QAUNTITY) {
        return 'Не более 5 хэштегов';
      }
      if (hashtags[i].length > HASHTAGS_OPTIONS.MAX_LENGTH) {
        return 'Хэштег не иожет быть длиннее 20 символов, включая решетку';
      }
      if (firstToken === '#' && hashtags[i].length === 1) {
        return 'Хэштег не может состоять из одной решетки';
      }
      if (hashtags[i].indexOf('#', 1) !== -1) {
        return 'Хэштеги должны разделяться пробелом';
      }
      if (!hashtagsList.includes(hashtags[i])) {
        hashtagsList.push(hashtags[i]);
      }
    }
    if (hashtagsList.length !== hashtags.length) {
      return 'Хэштеги не могут повторяться';
    }
    return '';
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

  var submitForm = function () {
    var message = validationHashtags();

    if (message) {
      hashtagsInput.setCustomValidity(message);
      return;
    }

    uploadFileForm.submit();
  };

  var onEnterPressSubmitForm = function () {
    submitForm();
  };

  submitFormButton.addEventListener('click', onEnterPressSubmitForm);

  uploadFileElement.addEventListener('change', openUploadOverlay);
  uploadFileCancel.addEventListener('click', closeUploadOverlay);

  // Перемещение пина

  var defaultPin = effectLevelValue.value / 100;
  var pinProcent = COORDINATES.MAX / 100 * effectLevelValue.value;

  var setFilter = function (classFilter) {
    imgUploadPreview.className = 'effects__preview--' + classFilter;
    currentFilter = classFilter;
  };

  var showPin = function () {
    pinWrap.classList.add('hidden');
    if (currentFilter !== 'none') {
      pinWrap.classList.remove('hidden');
    }
  };

  var setEffectLevel = function (maxValue) {
    var position;
    if (maxValue) {
      position = defaultPin;
      setPinPosition(pinProcent);
    } else {
      position = pinElement.offsetLeft / LineElement.offsetWidth;
    }

    showPin();

    var setEffectDepth = function () {
      DepthElement.style.width = (position * 100) + '%';
    };
    var value = '';
    switch (currentFilter) {
      case 'chrome':
        value = 'grayscale(' + position + ')';
        break;
      case 'sepia':
        value = 'sepia(' + position + ')';
        break;
      case 'marvin':
        value = 'invert(' + position * 100 + '%)';
        break;
      case 'phobos':
        value = 'blur(' + position * 3 + 'px)';
        break;
      case 'heat':
        value = 'brightness(' + position * 3 + ')';
        break;
    }
    imgUploadPreview.style.filter = value;

    setEffectDepth();
  };

  var onChangeEffect = function (evt) {
    var classFilter = evt.target.value;
    setFilter(classFilter);
    setEffectLevel(true);
  };

  var setPinPosition = function (newPosition) {
    if ((newPosition >= COORDINATES.MIN) && (newPosition <= COORDINATES.MAX)) {
      pinElement.style.left = newPosition + 'px';
    }
  };

  var onMouseDownEffectLevel = function (evt) {
    var positionX = evt.clientX;

    var onMouseMoveEffectLevel = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = positionX - moveEvt.clientX;
      positionX = moveEvt.clientX;
      var newPosition = pinElement.offsetLeft - shiftX;
      setPinPosition(newPosition);
      setEffectLevel();
    };

    var onMouseUpEffectLevel = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMoveEffectLevel);
      document.removeEventListener('mouseup', onMouseUpEffectLevel);
    };

    document.addEventListener('mousemove', onMouseMoveEffectLevel);
    document.addEventListener('mouseup', onMouseUpEffectLevel);
  };
  showPin();
  pinElement.addEventListener('mousedown', onMouseDownEffectLevel);

  for (var i = 0; i < effectPreviewPicture.length; i++) {
    effectPreviewPicture[i].addEventListener('change', onChangeEffect);
  }

})();
