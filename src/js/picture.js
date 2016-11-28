'use strict';

// функция отрисовки одной маленькой фотографии

var gallery = require('./gallery');
var Picture = function(pic, num) {
  this.data = pic;
  this.num = num;
  this.element = this.create(pic);
  this.onClick = this.onClick.bind(this);
  this.element.addEventListener('click', this.onClick);
};
Picture.prototype.onClick = function(evt) {
  evt.preventDefault();
  if (evt.currentTarget.classList.contains('picture')) {
    gallery.show(this.num);
  }
};
Picture.prototype.create = function(pic) {
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;
  var PHOTO_LOAD_TIMEOUT = 10000;
  var IMAGE_WIDTH = 182;
  var IMAGE_LEIGHT = 182;
  var photo = new Image();
  var photoTimeout = null;
  var pictureMini = templateContainer.querySelector('.picture').cloneNode(true);
  var image = pictureMini.getElementsByTagName('img')[0];
  pictureMini.querySelector('.picture-comments').textContent = pic.comments;
  pictureMini.querySelector('.picture-likes').textContent = pic.likes;
  photo.addEventListener('load', function() {
    clearTimeout(photoTimeout);
    image.src = pic.url;
    image.width = IMAGE_WIDTH;
    image.leight = IMAGE_LEIGHT;
  });
  photo.addEventListener('error', function() {
    pictureMini.classList.add('picture-load-failure');
  });
  photo.src = pic.url;
  photoTimeout = setTimeout(function() {
    pictureMini.classList.add('picture-load-failure');
  }, PHOTO_LOAD_TIMEOUT);
  return pictureMini;
};
Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.onClick);
    //this.element.removeEventListener('load', handlerLoadPhoto);
    //this.element.removeEventListener('error', handlerError);
};
module.exports = Picture;
