/*
 * Tab v:final
 *
 * Copyright 2011, GuoAimin
 * Date: 2011-9-14
 *http://bluescript.iteye.com/
 */


/*
 *	类名：[Tab]
 *	功能：UI组件
 *	作用：选项卡，稳定版本
 */




void function() {
	function Tab(O) {
		if (!(this instanceof arguments.callee)) return new arguments.callee(O);
		var indicator,doc,that;

		(
				doc = document,
						that = this,
						indicator = arguments.callee
				)

		that.T = doc.getElementById(O.t);
		that.S = doc.getElementById(O.s);
		that.E = {'mouseover':1,'click':1}[O.eType] === 1 ? O.eType : 'click';
		that.C = O.current || 'current';
		that.tag = O.tag || 'li';
		that.t = that.T.getElementsByTagName(that.tag);
		that.s = that.S.children;
		that.index = O.index > that.s ? 0 : O.index - 1;

		if (that.t.length === 0 || !that.T || that.t.length !== that.s.length) {
			return false
		}

		that.handler || (indicator.prototype.handler = function() {
			var i = that.t.length;
			for (; i > 0; void function(j) {
				that.addEvent(that.t[j], that.E, function(e) {
					e = e || window.event;
					that.control(j);
					that.stopEvent(e);
				}, false);
			}(--i)) {
			}
			;
		});
		indicator.fn = indicator.prototype;
		indicator.fn.constructor = indicator;

		indicator.fn.addEvent = function(elem, evType, fn, capture) {
			var indicator = arguments.callee;
			elem.attachEvent && (indicator = function(elem, evType, fn) {
				elem.attachEvent('on' + evType, fn)
			}).apply(this, arguments)
			elem.addEventListener && (indicator = function(elem, evType, fn) {
				elem.addEventListener(evType, fn, capture || false);
			}).apply(this, arguments);
			elem['on' + evType] && (indicator = function(elem, evType, fn) {
				elem['on' + evType] = function() {
					fn();
				};
			}).apply(this, arguments);
		};
		indicator.fn.trigger = function(elem, evType) {//封装模拟用户行为的方法。
			var event,doc = document;
			undefined !== doc.createEvent ? (event = doc.createEvent('MouseEvents'),event.initMouseEvent(evType, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null),elem.dispatchEvent(event)) : (event = doc.createEventObject(),event.screenX = 100,event.screenY = 0,event.clientX = 0,event.clientY = 0,event.ctrlKey = false,event.altKey = false,event.shiftKey = false,event.button = false,elem.fireEvent('on' + evType, event));
		};
		indicator.fn.stopEvent = function(e) {
			e.returnValue && (
					e.returnValue = false,
							e.cancelBubble = false
					);
			e.preventDefault && (
					e.preventDefault(),
							e.stopPropagation()
					);
		};
		indicator.fn.control = function(index) {
			that.off(index);
			that.t[index].className = that.C;
			that.s[index].style.display = 'block';
		};
		indicator.fn.off = function(I) {
			var i = that.s.length;
			for (; i > 0;) {
				if (--i !== I) {
					that.s[i].style.display = 'none';
					that.t[i].removeAttribute('class');
				}
			}
			;
		};
		that.handler();
		that.trigger(that.t[that.index || 0 ], that.E);
	}

	imageMagic.tk.domReady(function() {
		imageMagic.tab || (imageMagic.tab = Tab);
	});

}()