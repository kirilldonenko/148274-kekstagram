'use strict';
// функция загрузки фотографий с помощью JSONP

module.exports = function load(url, params, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function(evt) {
    var pics = JSON.parse(evt.target.response);
    callback(pics);
  };
  xhr.open('GET', url + '?from=' + params.from + '&to=' + params.to + '&filter=' + params.filter);
  xhr.send();
};
