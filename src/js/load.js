'use strict';
module.exports = function pictures(url, callback, callbackName) {
  if (!callbackName) {
    callbackName = 'cd' + Date.now();
  }
  window[callbackName] = function(pics) {
    callback(pics);
  };
  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};
