'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var effectPreview = window.form.uploadFileOverlay.querySelectorAll('.effects__preview');

  window.form.uploadFileElement.addEventListener('change', function () {
    var file = window.form.uploadFileElement.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });

      if (matches) {
        var reader = new FileReader();

        var onReaderLoad = function () {
          window.form.imgUploadPreview.src = reader.result;
          effectPreview.forEach(function (preview) {
            preview.style = 'background-image: url(' + reader.result + ')';
          });
        };

        reader.addEventListener('load', onReaderLoad);

        reader.readAsDataURL(file);
      }
    }
  });
})();
