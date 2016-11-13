'use strict';
var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = this.galleryOverlay.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = this.galleryOverlay.querySelector('.gallery-overlay-image');


  Gallery.prototype.setPictures = function(pics) {
    this.pictures = pics;
  };

  Gallery.prototype.clearPictures = function() {
    this.pictures = [];
  };

  Gallery.prototype.show = function(number) {
    var self = this;
    this.setActivePicture(number);
    this.galleryOverlayClose.onclick = function() {
      self.hide();
    };
    this.galleryOverlayImage.onclick = function() {

      if (self.activePicture < self.pictures.length - 1) {
        self.setActivePicture(self.activePicture + 1);
      } else {
        self.setActivePicture(0);
      }
    };
    this.galleryOverlay.classList.remove('invisible');
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
  };
  Gallery.prototype.setActivePicture = function(number) {
    this.activePicture = number;
    var bigPicture = this.pictures[number];
    this.galleryOverlayImage.src = bigPicture.url;
    this.galleryOverlay.querySelector('.likes-count').textContent = bigPicture.likes;
    this.galleryOverlay.querySelector('.comments-count').textContent = bigPicture.comments;
  };
};
module.exports = new Gallery();
