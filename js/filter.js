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

  var changeClassButton = function (filter) {
    allFilters.forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    filter.classList.add('img-filters__button--active');
  };

  var removePhotos = function () {
    var photoSection = document.querySelector('.pictures');
    var photoTemplate = photoSection.querySelectorAll('.picture');
    photoTemplate.forEach(function (photo) {
      photo.remove();
    });
  };

  var getFilteredPhotos = function (filter) {
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

  var showFilteredPhotos = function (filter) {
    changeClassButton(filter);
    removePhotos();
    window.picture.renderPhoto(getFilteredPhotos(filter));
  };

  var onFilterClick = function (evt) {
    var filter = evt.target.closest('.img-filters__button');

    if (filter) {
      showFilteredPhotos(filter);
    }
  };

  var onDebouncedFilterClick = window.data.debounce(onFilterClick);

  filters.addEventListener('click', onDebouncedFilterClick);

})();
