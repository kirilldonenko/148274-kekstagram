'use strict';
// функция показа всех маленьких фотографий
(function() {
  var Gallery = require('./gallery');
  var getPictureMini = require('./picture');
  var pictures = require('./load');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');
  var showPicturesMini = function(pics) {
    pics.forEach(function(pic) {
      container.appendChild(getPictureMini(pic));
    });
    Gallery.setPictures(pics);
  };
  pictures(PICTURES_LOAD_URL, showPicturesMini, '__cb_JSONP');
  filters.classList.remove('hidden');
})();
