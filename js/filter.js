'use strict';

(function () {

  var MAX_QUANTITY_PHOTOS = 10;

  var filters = document.querySelector('.img-filters');
  var allFilters = filters.querySelectorAll('.img-filters__button');

  var filterRandomPhoto = function (photos) {
    var randomPictures = window.data.shuffle(photos).slice(0, MAX_QUANTITY_PHOTOS);
    return randomPictures;
  };

  var filterDiscussedPhoto = function (photos) {
    var discussedPictures = photos.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
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
    var photoTemplate = window.picture.photoSection.querySelectorAll('.picture');
    photoTemplate.forEach(function (photo) {
      photo.remove();
    });
  };

  var getFilteredPhotos = function (filter) {
    switch (filter.id) {
      case 'filter-random':
        return filterRandomPhoto(window.picture.getPhotos());
      case 'filter-discussed':
        return filterDiscussedPhoto(window.picture.getPhotos());
      case 'filter-popular':
        return window.picture.getPhotos();
    }
    return '';
  };

  var showFilteredPhotos = function (filter) {
    if (filter) {
      changeClassButton(filter);
    }
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
