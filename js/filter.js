'use strict';


(function () {

  var filters = document.querySelector('.img-filters');
  var allFilters = filters.querySelectorAll('.img-filters__button');

  var filterRandomPhoto = function (photos) {
    var randomPictures = window.data.shuffle(photos).slice(0, 10);
    window.onSuccessPhoto(randomPictures);
  };

  var filterDiscussedPhoto = function (photos) {
    var discussedPictures = photos.slice().sort(function (a, b) {
      return b.likes - a.likes;
    });
    window.onSuccessPhoto(discussedPictures);
  };

  var removePhoto = function () {
    var photoSection = document.querySelector('.pictures');
    var photoTemplate = photoSection.querySelectorAll('.picture');
    photoTemplate.forEach(function (photo) {
      photo.remove();
    });
  };

  filters.addEventListener('click',
      window.data.debounce(function (evt) {
        var filter = evt.target.closest('.img-filters__button');

        if (filter) {
          allFilters.forEach(function (button) {
            button.classList.remove('img-filters__button--active');
          });
          filter.classList.add('img-filters__button--active');
          removePhoto();

          switch (filter.id) {
            case 'filter-random':
              filterRandomPhoto(window.photo);
              break;
            case 'filter-discussed':
              filterDiscussedPhoto(window.photo);
              break;
            case 'filter-popular':
              window.onSuccessPhoto(window.photo);
              break;
          }
        }
      })
  );
})();
