/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(6);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	(function() {
	  /**
	   * @constructor
	   * @param {string} image
	   */
	  var Resizer = function(image) {
	    // Изображение, с которым будет вестись работа.
	    this._image = new Image();
	    this._image.src = image;
	
	    // Холст.
	    this._container = document.createElement('canvas');
	    this._ctx = this._container.getContext('2d');
	
	    // Создаем холст только после загрузки изображения.
	    this._image.onload = function() {
	      // Размер холста равен размеру загруженного изображения. Это нужно
	      // для удобства работы с координатами.
	      this._container.width = this._image.naturalWidth;
	      this._container.height = this._image.naturalHeight;
	
	      /**
	       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
	       * стороны изображения.
	       * @const
	       * @type {number}
	       */
	      var INITIAL_SIDE_RATIO = 0.75;
	
	      // Размер меньшей стороны изображения.
	      var side = Math.min(
	          this._container.width * INITIAL_SIDE_RATIO,
	          this._container.height * INITIAL_SIDE_RATIO);
	
	      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
	      // от размера меньшей стороны.
	      this._resizeConstraint = new Square(
	          this._container.width / 2 - side / 2,
	          this._container.height / 2 - side / 2,
	          side);
	
	      // Отрисовка изначального состояния канваса.
	      this.setConstraint();
	    }.bind(this);
	
	    // Фиксирование контекста обработчиков.
	    this._onDragStart = this._onDragStart.bind(this);
	    this._onDragEnd = this._onDragEnd.bind(this);
	    this._onDrag = this._onDrag.bind(this);
	  };
	
	  Resizer.prototype = {
	    /**
	     * Родительский элемент канваса.
	     * @type {Element}
	     * @private
	     */
	    _element: null,
	
	    /**
	     * Положение курсора в момент перетаскивания. От положения курсора
	     * рассчитывается смещение на которое нужно переместить изображение
	     * за каждую итерацию перетаскивания.
	     * @type {Coordinate}
	     * @private
	     */
	    _cursorPosition: null,
	
	    /**
	     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
	     * от верхнего левого угла исходного изображения.
	     * @type {Square}
	     * @private
	     */
	    _resizeConstraint: null,
	
	    /**
	     * Отрисовка канваса.
	     */
	    redraw: function() {
	      // Очистка изображения.
	      this._ctx.clearRect(0, 0, this._container.width, this._container.height);
	
	      // Параметры линии.
	      // NB! Такие параметры сохраняются на время всего процесса отрисовки
	      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
	      // чего-либо с другой обводкой.
	
	      // Толщина линии.
	      this._ctx.lineWidth = 6;
	      // Цвет обводки.
	      this._ctx.strokeStyle = '#ffe753';
	      // Размер штрихов. Первый элемент массива задает длину штриха, второй
	      // расстояние между соседними штрихами.
	      this._ctx.setLineDash([15, 10]);
	      // Смещение первого штриха от начала линии.
	      this._ctx.lineDashOffset = 7;
	
	      // Сохранение состояния канваса.
	      this._ctx.save();
	
	      // Установка начальной точки системы координат в центр холста.
	      this._ctx.translate(this._container.width / 2, this._container.height / 2);
	
	      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
	      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
	      // Отрисовка изображения на холсте. Параметры задают изображение, которое
	      // нужно отрисовать и координаты его верхнего левого угла.
	      // Координаты задаются от центра холста.
	      this._ctx.drawImage(this._image, displX, displY);
	
	      // Отрисовка прямоугольника, обозначающего область изображения после
	      // кадрирования. Координаты задаются от центра.
	      this._ctx.strokeRect(
	          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
	          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
	          this._resizeConstraint.side - this._ctx.lineWidth / 2,
	          this._resizeConstraint.side - this._ctx.lineWidth / 2);
	
	      // Добавление оверлея(чёрного цвета с прозрачностью 80%) и размера изображения.
	      // Для лучшей читаемости кода объявим переменные с короткими именами.
	      var sideC = this._resizeConstraint.side; // сторона кадра
	      var sideW = this._container.width; // ширина изображения
	      var sideH = this._container.height; // высота изображения
	      var lineW = this._ctx.lineWidth; // толщина линии
	
	      // толщина верхней части оверлея
	      var deltaW = (this._container.width - this._resizeConstraint.side) / 2;
	
	      // толщина боковой части оверлея
	      var deltaH = (this._container.height - this._resizeConstraint.side) / 2;
	
	      this._ctx.beginPath();
	      this._ctx.moveTo(-sideW / 2, -sideH / 2);
	      this._ctx.lineTo(sideW / 2, -sideH / 2);
	      this._ctx.lineTo(sideW / 2, sideH / 2);
	      this._ctx.lineTo(sideW / 2 - deltaW - lineW / 2, sideH / 2 - deltaH - lineW / 2);
	      this._ctx.lineTo(sideW / 2 - deltaW - lineW / 2, sideH / 2 - deltaH - sideC - lineW);
	      this._ctx.lineTo(sideW / 2 - deltaW - sideC - lineW, sideH / 2 - deltaH - sideC - lineW);
	      this._ctx.lineTo(-sideW / 2, -sideH / 2);
	      this._ctx.lineTo(-sideW / 2, sideH / 2);
	      this._ctx.lineTo(sideW / 2, sideH / 2);
	      this._ctx.lineTo(sideW / 2 - deltaW - lineW / 2, sideH / 2 - deltaH - lineW / 2);
	      this._ctx.lineTo(sideW / 2 - deltaW - sideC - lineW, sideH / 2 - deltaH - lineW / 2);
	      this._ctx.lineTo(sideW / 2 - deltaW - sideC - lineW, sideH / 2 - deltaH - sideC - lineW);
	      this._ctx.lineTo(-sideW / 2, -sideH / 2);
	      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	      this._ctx.fill();
	      this._ctx.fillStyle = 'white';
	      this._ctx.font = '20px sans-serif';
	      this._ctx.textBaseline = 'bottom';
	      this._ctx.textAlign = 'center';
	      this._ctx.fillText(sideW + ' x ' + sideH, 0, -sideH / 2 + deltaH - lineW);
	
	      // Восстановление состояния канваса, которое было до вызова ctx.save
	      // и последующего изменения системы координат. Нужно для того, чтобы
	      // следующий кадр рисовался с привычной системой координат, где точка
	      // 0 0 находится в левом верхнем углу холста, в противном случае
	      // некорректно сработает даже очистка холста или нужно будет использовать
	      // сложные рассчеты для координат прямоугольника, который нужно очистить.
	      this._ctx.restore();
	    },
	
	    /**
	     * Включение режима перемещения. Запоминается текущее положение курсора,
	     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
	     * позволяющие перерисовывать изображение по мере перетаскивания.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    _enterDragMode: function(x, y) {
	      this._cursorPosition = new Coordinate(x, y);
	      document.body.addEventListener('mousemove', this._onDrag);
	      document.body.addEventListener('mouseup', this._onDragEnd);
	    },
	
	    /**
	     * Выключение режима перемещения.
	     * @private
	     */
	    _exitDragMode: function() {
	      this._cursorPosition = null;
	      document.body.removeEventListener('mousemove', this._onDrag);
	      document.body.removeEventListener('mouseup', this._onDragEnd);
	    },
	
	    /**
	     * Перемещение изображения относительно кадра.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    updatePosition: function(x, y) {
	      this.moveConstraint(
	          this._cursorPosition.x - x,
	          this._cursorPosition.y - y);
	      this._cursorPosition = new Coordinate(x, y);
	    },
	
	    /**
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDragStart: function(evt) {
	      this._enterDragMode(evt.clientX, evt.clientY);
	    },
	
	    /**
	     * Обработчик окончания перетаскивания.
	     * @private
	     */
	    _onDragEnd: function() {
	      this._exitDragMode();
	    },
	
	    /**
	     * Обработчик события перетаскивания.
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDrag: function(evt) {
	      this.updatePosition(evt.clientX, evt.clientY);
	    },
	
	    /**
	     * Добавление элемента в DOM.
	     * @param {Element} element
	     */
	    setElement: function(element) {
	      if (this._element === element) {
	        return;
	      }
	
	      this._element = element;
	      this._element.insertBefore(this._container, this._element.firstChild);
	      // Обработчики начала и конца перетаскивания.
	      this._container.addEventListener('mousedown', this._onDragStart);
	    },
	
	    /**
	     * Возвращает кадрирование элемента.
	     * @return {Square}
	     */
	    getConstraint: function() {
	      return this._resizeConstraint;
	    },
	
	    /**
	     * Смещает кадрирование на значение указанное в параметрах.
	     * @param {number} deltaX
	     * @param {number} deltaY
	     * @param {number} deltaSide
	     */
	    moveConstraint: function(deltaX, deltaY, deltaSide) {
	      this.setConstraint(
	          this._resizeConstraint.x + (deltaX || 0),
	          this._resizeConstraint.y + (deltaY || 0),
	          this._resizeConstraint.side + (deltaSide || 0));
	    },
	
	    /**
	     * @param {number} x
	     * @param {number} y
	     * @param {number} side
	     */
	    setConstraint: function(x, y, side) {
	      if (typeof x !== 'undefined') {
	        this._resizeConstraint.x = x;
	      }
	
	      if (typeof y !== 'undefined') {
	        this._resizeConstraint.y = y;
	      }
	
	      if (typeof side !== 'undefined') {
	        this._resizeConstraint.side = side;
	      }
	
	      requestAnimationFrame(function() {
	        this.redraw();
	        var resizerChangeEvent = document.createEvent('CustomEvent');
	        resizerChangeEvent.initEvent('resizerchange', false, false);
	        window.dispatchEvent(resizerChangeEvent);
	      }.bind(this));
	    },
	
	    /**
	     * Удаление. Убирает контейнер из родительского элемента, убирает
	     * все обработчики событий и убирает ссылки.
	     */
	    remove: function() {
	      this._element.removeChild(this._container);
	
	      this._container.removeEventListener('mousedown', this._onDragStart);
	      this._container = null;
	    },
	
	    /**
	     * Экспорт обрезанного изображения как HTMLImageElement и исходником
	     * картинки в src в формате dataURL.
	     * @return {Image}
	     */
	    exportImage: function() {
	      // Создаем Image, с размерами, указанными при кадрировании.
	      var imageToExport = new Image();
	
	      // Создается новый canvas, по размерам совпадающий с кадрированным
	      // изображением, в него добавляется изображение взятое из канваса
	      // с измененными координатами и сохраняется в dataURL, с помощью метода
	      // toDataURL. Полученный исходный код, записывается в src у ранее
	      // созданного изображения.
	      var temporaryCanvas = document.createElement('canvas');
	      var temporaryCtx = temporaryCanvas.getContext('2d');
	      temporaryCanvas.width = this._resizeConstraint.side;
	      temporaryCanvas.height = this._resizeConstraint.side;
	      temporaryCtx.drawImage(this._image,
	          -this._resizeConstraint.x,
	          -this._resizeConstraint.y);
	      imageToExport.src = temporaryCanvas.toDataURL('image/png');
	
	      return imageToExport;
	    }
	  };
	
	  /**
	   * Вспомогательный тип, описывающий квадрат.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @param {number} side
	   * @private
	   */
	  var Square = function(x, y, side) {
	    this.x = x;
	    this.y = y;
	    this.side = side;
	  };
	
	  /**
	   * Вспомогательный тип, описывающий координату.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @private
	   */
	  var Coordinate = function(x, y) {
	    this.x = x;
	    this.y = y;
	  };
	
	  window.Resizer = Resizer;
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* global Resizer: true */
	
	/**
	 * @fileoverview
	 * @author Igor Alexeenko (o0)
	 */
	
	'use strict';
	
	(function() {
	  /** @enum {string} */
	  var FileType = {
	    'GIF': '',
	    'JPEG': '',
	    'PNG': '',
	    'SVG+XML': ''
	  };
	
	  /** @enum {number} */
	  var Action = {
	    ERROR: 0,
	    UPLOADING: 1,
	    CUSTOM: 2
	  };
	
	  /**
	   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
	   * из ключей FileType.
	   * @type {RegExp}
	   */
	  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');
	
	  /**
	   * @type {Object.<string, string>}
	   */
	  var filterMap;
	
	  /**
	   * Объект, который занимается кадрированием изображения.
	   * @type {Resizer}
	   */
	  var currentResizer;
	
	  /**
	   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
	   * изображением.
	   */
	  var cleanupResizer = function() {
	    if (currentResizer) {
	      currentResizer.remove();
	      currentResizer = null;
	    }
	  };
	
	  /**
	   * Ставит одну из трех случайных картинок на фон формы загрузки.
	   */
	  var updateBackground = function() {
	    var images = [
	      'img/logo-background-1.jpg',
	      'img/logo-background-2.jpg',
	      'img/logo-background-3.jpg'
	    ];
	
	    var backgroundElement = document.querySelector('.upload');
	    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
	    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
	  };
	
	  /**
	   * Форма кадрирования изображения.
	   * @type {HTMLFormElement}
	   */
	  var resizeForm = document.forms['upload-resize'];
	
	  /**
	   * Проверяет, валидны ли данные, в форме кадрирования.
	   * @return {boolean}
	   */
	  var coordX = document.querySelector('#resize-x');
	  var coordY = document.querySelector('#resize-y');
	  var sizeFrame = document.querySelector('#resize-size');
	  var resizeFormIsValid = function() {
	    coordX.min = 0;
	    coordY.min = 0;
	    sizeFrame.min = 0;
	    coordX.max = currentResizer._image.naturalWidth;
	    coordY.max = currentResizer._image.naturalHeight;
	    sizeFrame.max = currentResizer._image.naturalWidth;
	    var totalSizeX = +coordX.value + (+sizeFrame.value);
	    var totalSizeY = +coordY.value + (+sizeFrame.value);
	    if (totalSizeX <= currentResizer._image.naturalWidth &&
	      totalSizeY <= currentResizer._image.naturalHeight &&
	      coordX.value !== '' &&
	      coordY.value !== '' &&
	      sizeFrame.value !== '') {
	      return true;
	    } else {
	      return false;
	    }
	  };
	
	  /* Деактивация кнопки отправки, если введенные данные невалидны и
	  изменение положения и размера кадра в форме */
	
	  var buttonSubmit = document.querySelector('#resize-fwd');
	  buttonSubmit.disabled = true;
	  resizeForm.addEventListener('input', function handlerInput() {
	    if (resizeFormIsValid()) {
	      buttonSubmit.disabled = false;
	    } else {
	      buttonSubmit.disabled = true;
	    }
	  });
	
	  /**
	   * Форма загрузки изображения.
	   * @type {HTMLFormElement}
	   */
	  var uploadForm = document.forms['upload-select-image'];
	
	  /**
	   * Форма добавления фильтра.
	   * @type {HTMLFormElement}
	   */
	  var filterForm = document.forms['upload-filter'];
	
	  /**
	   * @type {HTMLImageElement}
	   */
	  var filterImage = filterForm.querySelector('.filter-image-preview');
	
	  /**
	   * @type {HTMLElement}
	   */
	  var uploadMessage = document.querySelector('.upload-message');
	
	  /**
	   * @param {Action} action
	   * @param {string=} message
	   * @return {Element}
	   */
	  var showMessage = function(action, message) {
	    var isError = false;
	
	    switch (action) {
	      case Action.UPLOADING:
	        message = message || 'Кексограмим&hellip;';
	        break;
	
	      case Action.ERROR:
	        isError = true;
	        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
	        break;
	    }
	
	    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
	    uploadMessage.classList.remove('invisible');
	    uploadMessage.classList.toggle('upload-message-error', isError);
	    return uploadMessage;
	  };
	
	  var hideMessage = function() {
	    uploadMessage.classList.add('invisible');
	  };
	
	  /**
	   * Обработчик изменения изображения в форме загрузки. Если загруженный
	   * файл является изображением, считывается исходник картинки, создается
	   * Resizer с загруженной картинкой, добавляется в форму кадрирования
	   * и показывается форма кадрирования.
	   * @param {Event} evt
	   */
	  uploadForm.addEventListener('change', function handlerChangeResizer(evt) {
	    var element = evt.target;
	    if (element.id === 'upload-file') {
	      // Проверка типа загружаемого файла, тип должен быть изображением
	      // одного из форматов: JPEG, PNG, GIF или SVG.
	      if (fileRegExp.test(element.files[0].type)) {
	        var fileReader = new FileReader();
	
	        showMessage(Action.UPLOADING);
	
	        fileReader.addEventListener('load', function handlerLoad() {
	          cleanupResizer();
	
	          currentResizer = new Resizer(fileReader.result);
	          currentResizer.setElement(resizeForm);
	
	          uploadMessage.classList.add('invisible');
	
	          uploadForm.classList.add('invisible');
	          resizeForm.classList.remove('invisible');
	
	          hideMessage();
	        });
	
	        fileReader.readAsDataURL(element.files[0]);
	      } else {
	        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
	        showMessage(Action.ERROR);
	      }
	    }
	  });
	
	  // Установка начальных значений в поля формы кадрирования.
	
	  var setValuesInForm = function() {
	    var parametersFrame = currentResizer.getConstraint();
	    coordX.value = parametersFrame.x;
	    coordY.value = parametersFrame.y;
	    sizeFrame.value = parametersFrame.side;
	  };
	
	  window.addEventListener('resizerchange', setValuesInForm);
	
	  resizeForm.addEventListener('change', function() {
	    if (resizeFormIsValid()) {
	      currentResizer.setConstraint(+coordX.value, +coordY.value, +sizeFrame.value);
	    }
	  });
	
	  /**
	   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
	   * и обновляет фон.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('reset', function handlerResetResizer(evt) {
	    evt.preventDefault();
	
	    cleanupResizer();
	    updateBackground();
	
	    resizeForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });
	
	  // Установка фильтра из LocalStorage
	
	  if (localStorage.getItem('upload-filter')) {
	    var activeFilter = filterForm.querySelector('[value=' + localStorage.getItem('upload-filter') + ']');
	    filterImage.className = 'filter-image-preview ' + 'filter-' + localStorage.getItem('upload-filter');
	  } else {
	    activeFilter = filterForm.querySelector('#upload-filter-none');
	  }
	  activeFilter.checked = true;
	
	  /**
	   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
	   * кропнутое изображение в форму добавления фильтра и показывает ее.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('submit', function handlerSubmitResizer(evt) {
	    evt.preventDefault();
	
	    if (resizeFormIsValid()) {
	      var image = currentResizer.exportImage().src;
	
	      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
	      for (var i = 0; i < thumbnails.length; i++) {
	        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
	      }
	
	      filterImage.src = image;
	
	      resizeForm.classList.add('invisible');
	      filterForm.classList.remove('invisible');
	    }
	  });
	
	  /**
	   * Сброс формы фильтра. Показывает форму кадрирования.
	   * @param {Event} evt
	   */
	  filterForm.addEventListener('reset', function handlerResetFilter(evt) {
	    evt.preventDefault();
	
	    filterForm.classList.add('invisible');
	    resizeForm.classList.remove('invisible');
	  });
	
	  /**
	   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
	   * записав сохраненный фильтр в LocalStorage.
	   * @param {Event} evt
	   */
	  filterForm.addEventListener('submit', function handlerSubmitFilter(evt) {
	    evt.preventDefault();
	    var listFilters = document.getElementsByName('upload-filter');
	    for (var i = 0; i < listFilters.length; i++) {
	      if (listFilters[i].checked) {
	        localStorage.setItem('upload-filter', listFilters[i].value);
	      }
	    }
	
	    cleanupResizer();
	    updateBackground();
	
	    filterForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });
	
	  /**
	   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
	   * выбранному значению в форме.
	   */
	  filterForm.addEventListener('change', function handlerChangeFilter() {
	    if (!filterMap) {
	      // Ленивая инициализация. Объект не создается до тех пор, пока
	      // не понадобится прочитать его в первый раз, а после этого запоминается
	      // навсегда.
	      filterMap = {
	        'none': 'filter-none',
	        'chrome': 'filter-chrome',
	        'sepia': 'filter-sepia',
	        'marvin': 'filter-marvin'
	      };
	    }
	
	    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
	      return item.checked;
	    })[0].value;
	
	    // Класс перезаписывается, а не обновляется через classList потому что нужно
	    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
	    // состояние или просто перезаписывать.
	    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
	  });
	
	  cleanupResizer();
	  updateBackground();
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// функция отрисовки одной маленькой фотографии
	
	var gallery = __webpack_require__(5);
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	var Gallery = function() {
	  this.pictures = [];
	  this.activePicture = 0;
	  this.galleryOverlay = document.querySelector('.gallery-overlay');
	  this.galleryOverlayClose = this.galleryOverlay.querySelector('.gallery-overlay-close');
	  this.galleryOverlayImage = this.galleryOverlay.querySelector('.gallery-overlay-image');
	  Gallery.prototype.setPictures = function(pics) {
	    this.pictures = this.pictures.concat(pics);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// функция показа всех маленьких фотографий
	
	(function() {
	  var gallery = __webpack_require__(5);
	  var Picture = __webpack_require__(4);
	  var load = __webpack_require__(3);
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


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map?dropcache