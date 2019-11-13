'use strict';

(function () {
  var effectPreview = window.form.uploadFileOverlay.querySelectorAll('.effects__preview');

  window.form.uploadFileElement.addEventListener('change', function () {
    var file = window.form.uploadFileElement.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = window.constants.FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        var onReaderLoad = function () {
          window.form.imgPreview.src = reader.result;
          effectPreview.forEach(function (preview) {
            preview.style.backgroundImage = 'url(' + reader.result + ')';
          });
        };

        reader.addEventListener('load', onReaderLoad);

        reader.readAsDataURL(file);
      }
    }
  });
})();
