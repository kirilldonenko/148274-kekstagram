'use strict';

// функция показа всех маленьких фотографий

(function() {
  var gallery = require('./gallery');
  var Picture = require('./picture');
  var load = require('./load');
  var GAP = 100;
  var TROTTLE_TIMEOUT = 100;
  var PICTURES_LOAD_URL = 'http://localhost:1507/api/pictures';
  var container = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');
  var footer = document.querySelector('.footer');
  var numberPic = 0;
  var pageSize = 12;
  var filter = 'filter-popular';
  var showPicturesMini = function(pics) {
    pics.forEach(function(pic, num) {
      num += numberPic * pageSize;
      var miniPic = new Picture(pic, num);
      container.appendChild(miniPic.element);
    });
    gallery.setPictures(pics);
  };
  var loadPictures = function(filterID, callback) {
    load(PICTURES_LOAD_URL, {
      from: numberPic * pageSize,
      to: numberPic * pageSize + pageSize,
      filter: filterID
    }, callback);
  };
  var renderPage = function(filterID) {
    var lengthArr = 0;
    loadPictures(filterID, function(pics) {
      lengthArr = pics.length;
      showPicturesMini(pics);
      if (container.getBoundingClientRect().bottom < window.innerHeight && (numberPic <= lengthArr / pageSize)) {
        numberPic++;
        renderPage(filterID);
      }
    });
  };
  renderPage(filter);
  var lastCall = Date.now();
  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= TROTTLE_TIMEOUT) {
      if (footer.getBoundingClientRect().top - window.innerHeight - GAP < 0) {
        numberPic++;
        loadPictures(filter, function(pics) {
          showPicturesMini(pics);
        });
      }
      lastCall = Date.now();
    }
  });
  var changeFilter = function(filterID) {
    container.innerHTML = '';
    numberPic = 0;
    gallery.clearPictures();
    renderPage(filterID);
  };
  filters.addEventListener('change', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      filter = evt.target.id;
      changeFilter(filter);
    }
  }, true);
  filters.classList.remove('hidden');
})();
