'use strict';
// функция показа всех маленьких фотографий
(function() {
  var Gallery = require('./gallery');
  var Picture = require('./picture');
  var pictures = require('./load');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');
  var showPicturesMini = function(pics) {
    pics.forEach(function(pic, num) {
      var miniPic = new Picture(pic, num);
      container.appendChild(miniPic.element);

    });
    Gallery.setPictures(pics);
  };
  pictures(PICTURES_LOAD_URL, showPicturesMini, '__cb_JSONP');
  filters.classList.remove('hidden');
})();
