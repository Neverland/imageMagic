/*
 * toolkit lib v1.0
 *
 * Copyright 2011, enix
 * Includes toolkit lib
 * Date: 2011-9-14
 * lastmodified: 2011-11-20
 * http://www.cnblogs.com/enix
 */


/*
 *	����[toolKit]
 *	���ܣ��������
 *	���ã�΢�����
 */

delete function(window, undefined) {
	var toolKit = function() {
		var indicator = arguments.callee,doc = document,that = this;


		indicator.prototype = {
			slice:([]).slice,
			is:function(o) {
				return ({}).toString.call(o).slice(8, -1);
			},
			each:function(object, callback) {
				var index,i = 0,len = object.length,isO = len === undefined && ({}).toString.call(object).slice(8, -1) === 'Object';
				if (isO) {
					for (index in object) {
						if (callback.call(object[index], index, object[index]) === false) {
							break;
						}
					}
				} else {
					for (; i < len;) {
						if (callback.call(object[i], i, object[i++]) === false) {
							break;
						}
					}
				}
			},
			toArray:function(o) {
				return that.slice.call(o);
			},
			getHtmlElement:function(O) {
				var that = toolKit;
				that.element || (that.element = {});
				that.element[O] || (that.element[O] = doc.createElement(O));
				return that.element[O].cloneNode(true);
			},
			getEvent:function(e) {
				return e || window.event;
			},
			getTarget:function(e) {
				return e.srcElement || e.target;
			},
			stopEvent:function(e) {
				e.returnValue && (
						e.returnValue = false,
								e.cancelBubble = false
						);
				e.preventDefault && (
						e.preventDefault(),
								e.stopPropagation()
						);
			},
			getViewportSize:function() {
				var value = [0,0];
				undefined !== window.innerWidth ? value = [window.innerWidth,window.innerHeight] : value = [document.documentElement.clientWidth,document.documentElement.clientHeight];
				return value;
			},
			getClinetRect:function (f) {
				var d = f.getBoundingClientRect(),e = (e = {left:d.left,right:d.right,top:d.top,bottom:d.bottom,height:(d.height ? d.height : (d.bottom - d.top)),width:(d.width ? d.width : (d.right - d.left))});
				return e;
			},
			getScrollPosition:function() {
				var position = [0, 0];
				if (window.pageYOffset) {
					position = [window.pageXOffset, window.pageYOffset];
				}
				else if (typeof document.documentElement.scrollTop != 'undefined' && document.documentElement.scrollTop > 0) {
					position = [document.documentElement.scrollLeft, document.documentElement.scrollTop];
				} else if (typeof document.body.scrollTop != 'undefined') {
					position = [document.body.scrollLeft, document.body.scrollTop];
				}
				return position;
			},
			addEvent:function(elem, evType, fn, capture) {
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
			},
			removeEvent:function (elem, evType, fn, capture) {
				var indicator = arguments.callee;
				elem.detachEvent && (indicator = function(elem, evType, fn) {
					elem.detachEvent('on' + evType, fn)
				}).apply(this, arguments)
				elem.removeEventListener && (indicator = function(elem, evType, fn) {
					elem.removeEventListener(evType, fn, capture || false);
				}).apply(this, arguments);
				elem['on' + evType] && (indicator = function(elem, evType, fn) {
					elem['on' + evType] = null;
				}).apply(this, arguments);
			},
			currentStyle:function(element, property) {
				return undefined !== element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element, null)[property];
			},
			getClipboardText:function(e) {
				e = this.getEvent(e);
				var cText = e.clipboardData;
				return cText.getData('text');
			},
			setClipboardText:function(e, value) {
				e = this.getEvent(e);
				/*if (e.clipboardData) {
					return e.clipboardData.setData('text/plain', value);
				} else if (window.clipboardData) {
					return window.clipboardData.setData('text', value);
				}*/

				try {
					window.clipboardData.setData('text', value);
				} catch(e) {
					netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
					var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
					var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
					trans.addDataFlavor('text/unicode');
					var nsiStr = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
					nsiStr.data = value;
					trans.setTransferData("text/unicode", nsiStr, value.length * 2);
					var clipid = Components.interfaces.nsIClipboard;
					clip.setData(trans, null, clipid.kGlobalClipboard);
				}
			},
			domReady:(function() {
				var dom = [],doc = document;
				dom.isReady = false;
				dom.isFunction = function(obj) {
					return Object.prototype.toString.call(obj) === "[object Function]";
				};
				dom.Ready = function(fn) {
					dom.initReady();//���û�н���DOM�������ߵڶ������洢����һ��ɱ
					if (dom.isFunction(fn)) {
						if (dom.isReady) {
							fn();//����Ѿ�����DOM������һ��ɱһ��
						} else {
							dom.push(fn);//�洢�����¼�
						}
					}
				};
				dom.fireReady = function() {
					if (dom.isReady)  return;
					dom.isReady = true;
					for (var i = 0,n = dom.length; i < n; i++) {
						var fn = dom[i];
						fn();
					}
					dom.length = 0;//����¼�
				};
				dom.initReady = function() {
					if (doc.addEventListener) {
						doc.addEventListener("DOMContentLoaded", function() {
							doc.removeEventListener("DOMContentLoaded", arguments.callee, false);//�����غ���
							dom.fireReady();
						}, false);
					} else {
						if (doc.getElementById) {
							doc.write("<script id=\"ie-domReady\" defer='defer' src=\"//:\"><\/script>");
							doc.getElementById("ie-domReady").onreadystatechange = function() {
								if (this.readyState === "complete") {
									dom.fireReady();
									this.onreadystatechange = null;
									this.parentNode.removeChild(this)
								}
							};
						}
					}
				};
				return dom.Ready;
			})(),
			dynamicScriptProxy:function (src, data, callback) {
				var doc = document,script = doc.createElement('script'),timestamp = +(new Date()),keygen = 'abcdefghijk',key = Math.random().toFixed(1) * 10,temp = keygen[key] + timestamp;


				src += src.indexOf('?') > 0 ? '' : '?';
				for (var i in data) {
					src += i + '=' + data[i] + '&';
				}
				src += 'jsoncallback=' + temp + '&';
				src += 'timestamp=' + timestamp;
				if (typeof callback == 'function') {
					window[temp] = function() {
						try {
							callback.apply(this, arguments);
						} catch(e) {
							throw new Error(e);
						} finally {
							window[temp] = null;
							if (script.attributes.length > 0) {
								for (var j in script) {
									/*if(script.hasOwnProperty(j)){*/
									try {
										script.removeAttribute(script[j]);
									} catch(e) {
									}
									/*}*/
								}
							}
							if (script && script.parentNode) {
								script.parentNode.removeChild(script);
							}
						}
					}
				}

				script.setAttribute('type', 'text/javascript');
				script.setAttribute('src', src);
				doc.getElementsByTagName('head')[0].appendChild(script);
			},
			trigger:function(elem, evType) {//��װģ���û���Ϊ�ķ�����
				var event,doc = document;
				undefined !== doc.createEvent ? (event = doc.createEvent('MouseEvents'),event.initMouseEvent(evType, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null),elem.dispatchEvent(event)) : (event = doc.createEventObject(),event.screenX = 100,event.screenY = 0,event.clientX = 0,event.clientY = 0,event.ctrlKey = false,event.altKey = false,event.shiftKey = false,event.button = false,elem.fireEvent('on' + evType, event));
			},
			duffsDevice: function(items, fn) {
				if ('function' !== typeof(fn)) return;
				var iterations = items.length % 8, i = items.length - 1,callback = fn;
				while (iterations) {
					callback(items[i--]);
					iterations--;
				}

				iterations = Math.floor(items.length / 8);

				while (iterations) {
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					iterations--;
				}
			}
		};
		if (window === this || 'indicator' in this) {
			return new indicator
		}
	}();
	imageMagic.tk || (imageMagic.tk = toolKit);
}(window)