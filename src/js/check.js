'use strict';
// функция для вывода статистических сообщений
var getMessage = function(a, b) { //eslint-disable-line
  if (typeof a === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  } else if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' обектов и ' + b * 4 + ' атрибутов';
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    var amountOfRedPoints = 0;
    for (var i = 0; i < a.length; i++) {
      amountOfRedPoints += a[i];
    }
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    var artifactsSquare = 0;
    for (var j = 0; j < a.length; j++) {
      artifactsSquare += a[j] * b[j];
    }
    return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
  } else {
    return 'Переданы некорректные данные';
  }
};
