'use strict';

(function () {

  var MIN_BRIGHTNESS = 1;
  var MAX_BRIGHTNESS = 3;
  var MAX_VALUE_BLUR = 3;
  var MAX_VALUE_FOR_DIVIDE = 100;

  var HashtagsOptions = {
    MAX_QUANTITY: 5,
    MAX_LENGTH: 20,
  };

  var ScaleOptions = {
    SCALE_STEP: 25,
    MIN_SCALE: 25,
    MAX_SCALE: 100,
  };

  var Coordinates = {
    MIN: 0,
    MAX: 453
  };

  var uploadFileElement = document.querySelector('input[id="upload-file"]');
  var uploadScale = document.querySelector('.img-upload__scale');
  var scaleValue = document.querySelector('.scale__control--value');
  var imgPreview = document.querySelector('.img-upload__preview img');
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
  var lineElement = uploadFileOverlay.querySelector('.effect-level__line');
  var depthElement = uploadFileOverlay.querySelector('.effect-level__depth');
  var pinWrap = uploadFileOverlay.querySelector('.img-upload__effect-level');
  var effectPreviewPicture = uploadFileOverlay.querySelectorAll('input[name="effect"]');
  var currentFilter = 'none';

  uploadScale.addEventListener('click', function (evt) {
    var currentScale = parseInt(scaleValue.value, 10);

    var theTarget = evt.target;
    if (theTarget.classList.contains('scale__control--smaller') && currentScale > ScaleOptions.MIN_SCALE) {
      currentScale -= ScaleOptions.SCALE_STEP;

    } else if (theTarget.classList.contains('scale__control--bigger') && currentScale < ScaleOptions.MAX_SCALE) {
      currentScale += ScaleOptions.SCALE_STEP;
    }
    scaleValue.value = currentScale;
    imgPreview.style.transform = 'scale(' + currentScale / MAX_VALUE_FOR_DIVIDE + ')';
  });

  function getValidationHashtags() {
    var hashtags = hashtagsInput.value.split(' ').map(function (elem) {
      return elem;
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
      if (hashtags.length > HashtagsOptions.MAX_QUANTITY) {
        return 'Не более 5 хэштегов';
      }
      if (hashtags[i].length > HashtagsOptions.MAX_LENGTH) {
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
    } else {
      markDefaultField(hashtagsInput);
    }
    return '';
  }
  var markInvalidField = function (element) {
    element.style.border = '2px red solid';
  };
  var markDefaultField = function (element) {
    element.style.border = '';
  };

  hashtagsInput.addEventListener('change', function () {
    hashtagsInput.setCustomValidity(getValidationHashtags());
  });
  hashtagsInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEnterButtonClick);
  });
  hashtagsInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onEnterButtonClick);
  });
  hashtagsInput.addEventListener('invalid', function () {
    markInvalidField(hashtagsInput);
  });

  var onEnterButtonClick = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE && !textInput.matches(':focus')) {
      closeUploadOverlay();
    }
  };

  var openUploadOverlay = function () {
    uploadFileOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEnterButtonClick);
  };

  var closeUploadOverlay = function () {
    resetForm();
    uploadFileOverlay.classList.add('hidden');
  };

  var resetForm = function () {
    uploadFileElement.value = '';
    hashtagsInput.value = '';
    textInput.value = '';
    scaleValue.value = '100';
    effectPreviewPicture[0].checked = true;
    imgPreview.style.transform = '';
    markDefaultField(hashtagsInput);
    setFilter('none');
    setEffectLevel(true);
  };

  var submitForm = function () {
    var message = getValidationHashtags();
    hashtagsInput.setCustomValidity(message);

    if (message) {
      return;
    }

    var formData = new FormData(uploadFileForm);

    var closeBlockPopup = function (template, button) {

      var closePopup = function () {
        if (template.parentNode) {
          template.parentNode.removeChild(template);
        }
        button.removeEventListener('click', onClose);
        document.removeEventListener('keydown', onEscClose);
        document.removeEventListener('click', onCloseClick);
      };

      var onClose = function () {
        closePopup();
      };

      var onEscClose = function (evt) {
        if (evt.keyCode === window.constants.ESC_KEYCODE) {
          closePopup();
        }
      };

      var onCloseClick = function (evt) {
        if (evt.target !== template.children) {
          closePopup();
        }
      };
      resetForm();
      button.addEventListener('click', onClose);
      document.addEventListener('keydown', onEscClose);
      document.addEventListener('click', onCloseClick);
    };

    var onFormError = function (errorMessage) {
      var errorTemplateBlock = errorTemplate.cloneNode(true);

      uploadFileOverlay.classList.add('hidden');
      errorTemplateBlock.querySelector('.error__title').textContent = errorMessage;
      mainSection.insertAdjacentElement('afterbegin', errorTemplateBlock);

      var buttons = document.querySelectorAll('.error__button');
      buttons.forEach(function (button) {
        button.addEventListener('click', closeBlockPopup(errorTemplateBlock, button));
      });
    };

    var onFormSuccess = function () {
      var successTemplateBlock = successTemplate.cloneNode(true);

      uploadFileOverlay.classList.add('hidden');
      mainSection.insertAdjacentElement('afterbegin', successTemplateBlock);

      var successButton = document.querySelector('.success__button');
      closeBlockPopup(successTemplateBlock, successButton);
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

  var defaultPin = effectLevelValue.value / MAX_VALUE_FOR_DIVIDE;
  var pinProcent = Coordinates.MAX / MAX_VALUE_FOR_DIVIDE * effectLevelValue.value;

  var setFilter = function (classFilter) {
    imgPreview.className = 'effects__preview--' + classFilter;
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
      position = pinElement.offsetLeft / lineElement.offsetWidth;
    }

    showPin();

    var setEffectDepth = function () {
      depthElement.style.width = (position * MAX_VALUE_FOR_DIVIDE) + '%';
    };
    var getFilterValue = function () {
      switch (currentFilter) {
        case 'chrome':
          return 'grayscale(' + position + ')';
        case 'sepia':
          return 'sepia(' + position + ')';
        case 'marvin':
          return 'invert(' + position * MAX_VALUE_FOR_DIVIDE + '%)';
        case 'phobos':
          return 'blur(' + position * MAX_VALUE_BLUR + 'px)';
        case 'heat':
          return 'brightness(' + ((MAX_BRIGHTNESS - MIN_BRIGHTNESS) * position + MIN_BRIGHTNESS) + ')';
      }
      return '';
    };
    imgPreview.style.filter = getFilterValue();

    var setEffectValue = function () {
      effectLevelValue.value = Math.round(position * MAX_VALUE_FOR_DIVIDE);
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
    if ((newPosition >= Coordinates.MIN) && (newPosition <= Coordinates.MAX)) {
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

  window.form = {
    uploadFileOverlay: uploadFileOverlay,
    uploadFileElement: uploadFileElement,
    imgPreview: imgPreview,
    mainSection: mainSection,
  };

})();
