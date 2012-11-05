/*
 * Ajax v:1.0
 *
 * Copyright 2011, GuoAimin
 * Date: 2011-9-29
 *http://bluescript.iteye.com/
 */
 
 
/*
 *	类名：[Ajax]
 *	功能：功能组件
 *	作用：发送ajax请求
 */

delete function(window,undefined){

var Ajax=function () {}
	Ajax.prototype = {
		request: function (m,fn) {
			var r = (m.method).toUpperCase(),
			q = m.url,
			k = m.callback,
			n = m.postVars || null,
			l = m.timeout || 0,
			o = m.async || true,
            that=this,
			p;
            that.ajax = that.createXhr(),
            
			that.ajax.onreadystatechange = function () {
				/*switch (that.ajax.readyState) {
				case 1:
					if (l) {
						p = setTimeout(function () {
							if (that.ajax.readyStat == 1) {
								that.ajax.abort();
							}
						}, l);
						clearTimeout(p)
					}
					k.loading ? k.loading.call(this, p) : null;
					break;
				case 2:
					k.loaded ? k.loaded.call(this, p) : null;
					break;
				case 3:
					k.interactive ? k.interactive.call(this, p) : null;
					break;
				case 4:
					/200|304/.test(that.ajax.status) ? k.success(that.ajax.responseText, that.ajax.responseXML) : {};
					break
				}*/
				
				({
					1:function(){
						if (l) {
							p = setTimeout(function () {
								if (that.ajax.readyStat == 1) {
									that.ajax.abort();
								}
							}, l);
							clearTimeout(p)
						}
						k.loading ? k.loading.call(this, p) : null;
					},
					2:function(){
						k.loaded ? k.loaded.call(this, p) : null;
					},
					3:function(){
						k.interactive ? k.interactive.call(this, p) : null;
					},
					4:function(){
						/200|304/.test(that.ajax.status) ? k.success(that.ajax.responseText, that.ajax.responseXML) : {};
					}
				})[that.ajax.readyState]()
			};
			that.ajax.open(r, q, o);
			if (r !== "POST") {
				n = null
			};
			that.ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded;");
			that.ajax.send(n);

            typeof fn==='function' && fn();
		},
        abortAjax:function(){
            this.ajax.abort();
        },
		createXhr: function () {
			var g = [function () {
				return new XMLHttpRequest()
			}, function () {
				return new ActiveXObject("Msxml2.XMLHTTP")
			}, function () {
				return new ActiveXObject("Mircosoft.XMLHTTP")
			}];
			for (var f = 0, h = g.length; f < h; f++) {
				try {
					g[f]()
				} catch (e) {
					continue
				}
				this.createXhr = g;
				return g[f]()
			}
			throw new Error("This browser could not create Ajax Object")
		},
		getJson: function (b) {
			this.temp = new Ajax();
			this.temp.request(b);
			return parse = function (a) {
				if (!/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
					return null
				}
				return window.JSON && window.JSON.parse ? window.JSON.parse(a) : (new Function("return " + a))()
			}
		}
	};
	
	imageMagic.tk.ajax || (imageMagic.tk.ajax=Ajax);
}(window);