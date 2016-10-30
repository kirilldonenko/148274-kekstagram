'use strict';
// функция отрисовки одной маленькой фотографии

var getPictureMini = function(pic) {

  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;
  var PHOTO_LOAD_TIMEOUT = 10000;
  var IMAGE_WIDTH = 182;
  var IMAGE_LEIGHT = 182;

  var pictureMini = templateContainer.querySelector('.picture').cloneNode(true);
  pictureMini.querySelector('.picture-comments').textContent = pic.comments;
  pictureMini.querySelector('.picture-likes').textContent = pic.likes;
  var photo = new Image();
  var photoTimeout = null;
  var image = pictureMini.getElementsByTagName('img')[0];
  photo.onload = function() {
    clearTimeout(photoTimeout);
    image.src = pic.url;
    image.width = IMAGE_WIDTH;
    image.leight = IMAGE_LEIGHT;
  };
  photo.onerror = function() {
    pictureMini.classList.add('picture-load-failure');
  };
  photo.src = pic.url;
  photoTimeout = setTimeout(function() {
    pictureMini.classList.add('picture-load-failure');
  }, PHOTO_LOAD_TIMEOUT);


  return pictureMini;

};
var Gallery = require('./gallery');
var Picture = function(pic, num) {

  this.data = pic;
  this.element = getPictureMini(pic);
  var self = this;
  this.element.onclick = function(evt) {
    evt.preventDefault();
    if (evt.currentTarget.classList.contains('picture')) {
      Gallery.show(num);
    }
  };
  this.remove = function() {
    self.element.onclick = null;
    self.element.onload = null;
    self.element.onerror = null;
  };
};

module.exports = Picture;
