

var dom=function DomReady(){
	var userAgent = navigator.userAgent.toLowerCase(),
		browser = {
			version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
			safari: /webkit/.test(userAgent),
			opera: /opera/.test(userAgent),
			msie: (/msie/.test(userAgent)) && (!/opera/.test(userAgent)),
			mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
		},
		readyBound = false,
		isReady = false,
		readyList = [],
		indicator=arguments.callee,
		doc=document,
		that=this;
		if(!that instanceof indicator){ return new indicator()};
		!that.activity && (indicator.prototype.constructor=indicator),
		
		indicator.fn=indicator.prototype,
		indicator.fn.constructor=indicator;
		indicator.fn.domReady=function(){
			if (!isReady) {
			  isReady = true;
			  if (readyList) {
				for (var fn = 0; fn < readyList.length; fn++) {
				  readyList[fn].call(window, []);
				}
				readyList = [];
			  }
			}
		};
		
		indicator.fn.addLoadEvent=function(func) {
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
			  window.onload = func;
			} else {
			  window.onload = function () {
				if (oldonload) {
				  oldonload();
				}
				func();
			  }
			}
		};
			
		indicator.fn.bindReady=function () {
			if (readyBound) {
			  return;
			}
			readyBound = true;
			if (doc.addEventListener && !browser.opera) {
			  doc.addEventListener("DOMContentLoaded", that.domReady, false);
			}
			if (browser.msie && window == top)(function () {
			  if (isReady) return;
			  try {
				doc.documentElement.doScroll("left");
			  } catch (error) {
				setTimeout(arguments.callee, 0);
				return;
			  }
			  that.domReady();
			})();
			if (browser.opera) {
			  doc.addEventListener("DOMContentLoaded", function () {
				if (isReady) return;
				for (var i = 0; i < doc.styleSheets.length; i++)
				if (doc.styleSheets[i].disabled) {
				  setTimeout(arguments.callee, 0);
				  return;
				}
				that.domReady();
			  }, false);
			}
			if (browser.safari) {
			  var numStyles;
			  (function () {
				if (isReady) return;
				if (doc.readyState != "loaded" && doc.readyState != "complete") {
				  setTimeout(arguments.callee, 0);
				  return;
				}
				if (numStyles === undefined) {
				  var links = doc.getElementsByTagName("link");
				  for (var i = 0; i < links.length; i++) {
					if (links[i].getAttribute('rel') == 'stylesheet') {
					  numStyles++;
					}
				  }
				  var styles = doc.getElementsByTagName("style");
				  numStyles += styles.length;
				}
				if (doc.styleSheets.length != numStyles) {
				  setTimeout(arguments.callee, 0);
				  return;
				}
				that.domReady();
			  })();
			}
		that.addLoadEvent(that.domReady);
	};
	indicator.fn.ready = function (fn, args) {
		that.bindReady();
		if (isReady) {
		  fn.call(window, []);
		} else {
		  readyList.push(function () {
			return fn.call(window, []);
		  });
		}
	};
	that.bindReady();
}();