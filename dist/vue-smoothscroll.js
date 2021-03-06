(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueSmoothScroll"] = factory();
	else
		root["VueSmoothScroll"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var SmoothScroll = __webpack_require__(1);
	module.exports = {
	    install: function (Vue, options) {
	        var isVue3 = Vue.version.startsWith('3');
	        options = options || { name: 'smoothscroll' };
	        Vue.directive(options.name, {
	            inserted: function (el, binding) {
	                SmoothScroll(el, binding.value['duration'], binding.value['callback'], binding.value['context'], binding.value['axis']);
	            }
	        });
	        var prototype = isVue3 ? Vue.config.globalProperties : Vue.prototype;
	        Object.defineProperty(prototype, '$SmoothScroll', {
	            get: function () {
	                return SmoothScroll;
	            }
	        });
	    }
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, smoothScroll) {
	    'use strict';

	    // Support RequireJS and CommonJS/NodeJS module formats.
	    // Attach smoothScroll to the `window` when executed as a <script>.

	    // RequireJS

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (smoothScroll), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	        // CommonJS
	    } else if (typeof exports === 'object' && typeof module === 'object') {
	        module.exports = smoothScroll();
	    } else {
	        root.smoothScroll = smoothScroll();
	    }
	})(this, function () {
	    'use strict';

	    // Do not initialize smoothScroll when running server side, handle it in client:

	    if (typeof window !== 'object') return;

	    // We do not want this script to be applied in browsers that do not support those
	    // That means no smoothscroll on IE9 and below.
	    if (document.querySelectorAll === void 0 || window.pageYOffset === void 0 || history.pushState === void 0) {
	        return;
	    }

	    // Get the top position of an element in the document
	    var getTop = function (element, start, axis) {
	        // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
	        if (element.nodeName === 'HTML') return -start;
	        return (axis ? element.getBoundingClientRect().top : element.getBoundingClientRect().left) + start;
	    };
	    // ease in out function thanks to:
	    // http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
	    var easeInOutCubic = function (t) {
	        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	    };

	    // calculate the scroll position we should be in
	    // given the start and end point of the scroll
	    // the time elapsed from the beginning of the scroll
	    // and the total duration of the scroll (default 500ms)
	    var position = function (start, end, elapsed, duration) {
	        if (elapsed > duration) return end;
	        return start + (end - start) * easeInOutCubic(elapsed / duration); // <-- you can change the easing funtion there
	        // return start + (end - start) * (elapsed / duration); // <-- this would give a linear scroll
	    };

	    // we use requestAnimationFrame to be called by the browser before every repaint
	    // if the first argument is an element then scroll to the top of this element
	    // if the first argument is numeric then scroll to this location
	    // if the callback exist, it is called when the scrolling is finished
	    // if context is set then scroll that element, else scroll window
	    var smoothScroll = function (el, duration, callback, context, axis) {
	        duration = duration || 500;
	        context = context || window;
	        axis = axis === 'both' ? 0b11 : axis === 'y' ? 0b01 : axis === 'x' ? 0b10 : 0b01;
	        var enableY = axis & 0b01,
	            enableX = axis & 0b10;
	        var startY = context.scrollTop || window.pageYOffset;
	        var startX = context.screenLeft || window.pageXOffset;
	        if (typeof el === 'number') {
	            var endY = enableY && parseInt(el);
	            var endX = enableX && parseInt(el);
	        } else {
	            var endY = enableY && getTop(el, startY, true);
	            var endX = enableX && getTop(el, startX, false);
	        }

	        var clock = Date.now();
	        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
	            window.setTimeout(fn, 15);
	        };

	        var step = function () {
	            var elapsed = Date.now() - clock;
	            if (context !== window) {
	                if (enableY) {
	                    context.scrollTop = position(startY, endY, elapsed, duration);
	                }
	                if (enableX) {
	                    context.scrollLeft = position(startX, endX, elapsed, duration);
	                }
	            } else {
	                window.scroll(enableX ? position(startX, endX, elapsed, duration) : startX, enableY ? position(startY, endY, elapsed, duration) : startY);
	            }

	            if (elapsed > duration) {
	                if (typeof callback === 'function') {
	                    callback(el);
	                }
	            } else {
	                requestAnimationFrame(step);
	            }
	        };
	        step();
	    };

	    var linkHandler = function (ev) {
	        ev.preventDefault();

	        if (location.hash !== this.hash) window.history.pushState(null, null, this.hash);
	        // using the history api to solve issue #1 - back doesn't work
	        // most browser don't update :target when the history api is used:
	        // THIS IS A BUG FROM THE BROWSERS.
	        // change the scrolling duration in this call
	        var node = document.getElementById(this.hash.substring(1));
	        if (!node) return; // Do not scroll to non-existing node

	        smoothScroll(node, 500, function (el) {
	            location.replace('#' + el.id);
	            // this will cause the :target to be activated.
	        });
	    };

	    // We look for all the internal links in the documents and attach the smoothscroll function
	    document.addEventListener("DOMContentLoaded", function () {
	        var internal = document.querySelectorAll('a[href^="#"]:not([href="#"])'),
	            a;
	        for (var i = internal.length; a = internal[--i];) {
	            a.addEventListener("click", linkHandler, false);
	        }
	    });

	    // return smoothscroll API
	    return smoothScroll;
	});

/***/ })
/******/ ])
});
;