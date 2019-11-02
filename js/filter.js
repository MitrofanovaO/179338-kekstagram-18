'use strict';


(function () {

  var filters = document.querySelector('.img-filters');
  var allFilters = filters.querySelectorAll('.img-filters__button');

  var filterRandomPhoto = function (photos) {
    var randomPictures = window.data.shuffle(photos).slice(0, 10);
    return randomPictures;
  };

  var filterDiscussedPhoto = function (photos) {
    var discussedPictures = photos.slice().sort(function (a, b) {
      return b.likes - a.likes;
    });
    return discussedPictures;
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

          var getFilteredPhotos = function () {
            switch (filter.id) {
              case 'filter-random':
                return filterRandomPhoto(window.photo);
              case 'filter-discussed':
                return filterDiscussedPhoto(window.photo);
              case 'filter-popular':
                return window.photo;
            }
            return '';
          };

          window.onSuccessPhoto(getFilteredPhotos());
        }
      })
  );
})();
