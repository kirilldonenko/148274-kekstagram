'use strict';
var Gallery = function() {
  var self = this;
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = this.galleryOverlay.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = this.galleryOverlay.querySelector('.gallery-overlay-image');


  Gallery.prototype.setPictures = function(pics) {
    this.pictures = pics;
  };
  Gallery.prototype.show = function(number) {
    self.galleryOverlayClose.onclick = function() {
      self.hide();
    };
    self.galleryOverlayImage.onclick = function() {
      if (number < self.pictures.length) {
        self.setActivePicture(number + 1);
      } else {
        self.setActivePicture(0);
      }
    };
    this.galleryOverlay.classList.remove('invisible');
    self.setActivePicture(number);
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');
    self.galleryOverlayClose.onclick = null;
    self.galleryOverlayImage.onclick = null;
  };
  Gallery.prototype.setActivePicture = function(number) {
    this.activePicture = number;
    var bigPicture = this.pictures[number];
    this.galleryOverlayImage.src = bigPicture.src;
    this.galleryOverlay.querySelector('.likes-count').textContent = bigPicture.likes;
    this.galleryOverlay.querySelector('.comments-count').textContent = bigPicture.comments;
  };
};
module.exports = new Gallery();
