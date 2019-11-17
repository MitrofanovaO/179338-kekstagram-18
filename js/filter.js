'use strict';

(function () {

  var MAX_QUANTITY_PHOTOS = 10;

  var filtersContainer = document.querySelector('.img-filters');
  var currentActiveFilter = filtersContainer.querySelector('.img-filters__button--active');

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

    if (currentActiveFilter) {
      currentActiveFilter.classList.remove('img-filters__button--active');
    }

    filter.classList.add('img-filters__button--active');

    currentActiveFilter = filter;
  };

  var getFilteredPhotos = function (filter) {
    switch (filter.id) {
      case 'filter-random':
        return filterRandomPhoto(window.picture.getAll());
      case 'filter-discussed':
        return filterDiscussedPhoto(window.picture.getAll());
      case 'filter-popular':
        return window.picture.getAll();
    }
    return [];
  };

  var showFilteredPhotos = function (filter) {
    if (filter) {
      changeClassButton(filter);
    }
    window.picture.removeAll();
    window.picture.render(getFilteredPhotos(filter));
  };

  var onFilterClick = function (evt) {
    var filter = evt.target.closest('.img-filters__button');

    if (filter) {
      showFilteredPhotos(filter);
    }
  };

  var onDebouncedFilterClick = window.data.debounce(onFilterClick);

  filtersContainer.addEventListener('click', onDebouncedFilterClick);

})();
