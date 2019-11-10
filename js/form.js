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

  var mainSection = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var pinElement = uploadFileOverlay.querySelector('.effect-level__pin');
  var LineElement = uploadFileOverlay.querySelector('.effect-level__line');
  var DepthElement = uploadFileOverlay.querySelector('.effect-level__depth');
  var pinWrap = uploadFileOverlay.querySelector('.img-upload__effect-level');
  var effectPreviewPicture = uploadFileOverlay.querySelectorAll('input[name="effect"]');
  var currentFilter = 'none';

  window.form = {
    uploadFileOverlay: uploadFileOverlay,
    uploadFileElement: uploadFileElement,
    imgUploadPreview: imgUploadPreview,
  };

  uploadScale.addEventListener('click', function (evt) {
    var currentScale = parseInt(scaleValue.value, 10);

    var targ = evt.target;
    if (targ.classList.contains('scale__control--smaller') && currentScale > SCALE_OPTIONS.MIN_SCALE) {
      currentScale -= SCALE_OPTIONS.SCALE_STEP;

    } else if (targ.classList.contains('scale__control--bigger') && currentScale < SCALE_OPTIONS.MAX_SCALE) {
      currentScale += SCALE_OPTIONS.SCALE_STEP;
    }
    scaleValue.value = currentScale;
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
    if (evt.keyCode === window.data.ESC_KEYCODE && !textInput.matches(':focus')) {
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

  var resetForm = function () {
    hashtagsInput.value = '';
    textInput.value = '';
    effectPreviewPicture[0].checked = true;
    setFilter('none');
    setEffectLevel(true);
  };

  var submitForm = function () {
    var message = validationHashtags();
    hashtagsInput.setCustomValidity(message);

    if (message) {
      return;
    }

    var formData = new FormData(uploadFileForm);

    var onClosePopup = function (template, button) {

      var closePopup = function () {
        mainSection.removeChild(template);
        button.removeEventListener('click', onClose);
        document.removeEventListener('keydown', onEscClose);
        document.removeEventListener('click', onCloseClick);
      };

      var onClose = function () {
        closePopup();
      };

      var onEscClose = function (evt) {
        if (evt.keyCode === window.data.ESC_KEYCODE) {
          closePopup();
        }
      };

      var onCloseClick = function (evt) {
        if (evt.target === template) {
          closePopup();
        }
      };

      button.addEventListener('click', onClose);
      document.addEventListener('keydown', onEscClose);
      document.addEventListener('click', onCloseClick);
    };

    var onFormError = function (errorMessage) {
      var errorTemplateBlock = errorTemplate.cloneNode(true);

      uploadFileOverlay.classList.add('hidden');
      errorTemplateBlock.querySelector('.error__title').textContent = errorMessage;
      mainSection.insertAdjacentElement('afterbegin', errorTemplateBlock);

      var errorButton = document.querySelector('.error__button');
      onClosePopup(errorTemplateBlock, errorButton);

    };

    var onFormSuccess = function () {
      var successTemplateBlock = successTemplate.cloneNode(true);

      uploadFileOverlay.classList.add('hidden');
      resetForm();
      mainSection.insertAdjacentElement('afterbegin', successTemplateBlock);

      var successButton = document.querySelector('.success__button');
      onClosePopup(successTemplateBlock, successButton);
    };

    window.backend.upload(formData, onFormSuccess, onFormError);
  };


  uploadFileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitForm();
  });

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
    var getFilterValue = function () {
      switch (currentFilter) {
        case 'chrome':
          return 'grayscale(' + position + ')';
        case 'sepia':
          return 'sepia(' + position + ')';
        case 'marvin':
          return 'invert(' + position * 100 + '%)';
        case 'phobos':
          return 'blur(' + position * 3 + 'px)';
        case 'heat':
          return 'brightness(' + position * 3 + ')';
      }
      return '';
    };
    imgUploadPreview.style.filter = getFilterValue();

    var setEffectValue = function () {
      effectLevelValue.setAttribute('value', position * 100);
    };

    setEffectValue();
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

  effectPreviewPicture.forEach(function (item) {
    item.addEventListener('change', onChangeEffect);
  });

})();
