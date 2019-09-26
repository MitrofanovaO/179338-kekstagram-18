'use strict';

var PHOTOS_QUANTITY = 25;
var AVATAR_QUANTITY = 6;
var MIN_LIKE = 15;
var MAX_LIKE = 200;
var USER_NAMES = [
  'Ирина',
  'Даниил',
  'Владислава',
  'Максим',
  'Вадим',
  'Анжелика'
];
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var getRandomArrayElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var getUrlAvatar = function (maxCount) {
  var avatarNumber = Math.ceil(Math.random() * maxCount);
  return 'img/avatar-' + avatarNumber + '.svg';
};

var createComments = function () {
  var commentCount = Math.ceil(Math.random() * AVATAR_QUANTITY);
  var comments = [];
  for (var i = 0; i < commentCount; i++) {
    comments.push({
      avatar: getUrlAvatar(AVATAR_QUANTITY),
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(USER_NAMES)
    });
  }
  return comments;
};

var createPhotos = function (count) {
  var photos = [];
  for (var i = 0; i < count; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomInterval(MIN_LIKE, MAX_LIKE),
      comments: createComments()
    });
  }
  return photos;

};

var fillPhotoElement = function (element, data) {
  element.querySelector('.picture__img').src = data.url;
  element.querySelector('.picture__comments').innerText = data.comments.length;
  element.querySelector('.picture__likes').innerText = data.likes;
  return element;
};

var createDocumentFragment = function (template, photoArr) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < photoArr.length; i++) {
    var clone = template.cloneNode(true);
    docFragment.appendChild(fillPhotoElement(clone, photoArr[i]));
  }
  return docFragment;
};

var photoArr = createPhotos(PHOTOS_QUANTITY);
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

document.querySelector('.pictures').appendChild(createDocumentFragment(photoTemplate, photoArr));
