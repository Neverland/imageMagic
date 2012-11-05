/*
 * Accordion v1.0
 *
 * Copyright 2011, GuoAimin
 * Date: 2011-9-14
 *http://bluescript.iteye.com/
 */
 
 
/*
 *	类名：[Accordion]
 *	功能：UI组件
 *	作用：手风琴组件
 */

delete function(){
    function moduleAccordion(O){  
        var thee=this,doc=document,indicator=arguments.callee;  
		if(!(this instanceof arguments.callee)) return new arguments.callee(O);
		thee.wrapper=O.wrapper;  
        thee.handler=O.handler || 'h3';  
        thee.container=O.container || 'div'; 
		thee.current=O.current || 'current'; 
        thee.action=false;
        var wrapper=doc.getElementById(thee.wrapper),handler=wrapper.getElementsByTagName(thee.handler),container=wrapper.getElementsByTagName(thee.container) , _handler=getChildLength(handler,wrapper), _container=getChildLength(container,wrapper);   
        if(!cheackCondition()) return;  
        function cheackCondition(){  
            if(!wrapper) return false;  
            if(!(_handler.length== _container.length))return false;  
            return true;  
        }  
        function getChildLength(c,p){     
            var i=0,len=c.length,t=0,o=[];  
            for(;i<len;){  
                c[i].parentNode==p && (++t,o.push(c[i])) ;  
                i++;  
            }  
            return { length : t,obt : o };  
        }  
        indicator.prototype.constructor = indicator.name;  
        (typeof thee.each !='function') && (indicator.prototype.each = function (o, fn) {  
            var i = 0,  
                key, len = o.length,  
                rt = this || window;  
            if (len === undefined) {  
                for (key in o) {  
                    if (fn.call(rt, key, o[key]) === false) {  
                        break;  
                    }  
                }  
            } else {  
                for (; i < len && fn.call(rt, i, o[i]) !== false; ++i) {}  
            }  
            return o;  
        });   
        indicator.prototype.Linear = function(t,b,c,d){  
			return c*t/d + b;
            /*if ((t/=d) < (1/2.75)) {  
                return c*(7.5625*t*t) + b;  
            } else if (t < (2/2.75)) {  
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;  
            } else if (t < (2.5/2.75)) {  
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;  
            } else {  
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;  
            }  */
        };  
        indicator.prototype.fx=function(o){  
            var b=0,c=thee.getHeight(o),d=5,t=0,k=0;  
            ~function(){  
                o.style.height=Math.ceil(thee.Linear(t,b,c,d))+'px';  
                if(parseInt(o.style.height)<c){ t++; setTimeout(arguments.callee, 5);};   
                if(k<100){ k++; thee.fade.call(o,Math.ceil(thee.Linear(k,b,100,d)));}; 
				  
            }();  
        };  
        indicator.prototype.fade=function (i){    
            this.style.filter ="alpha(opacity=" + i + ")";    
            this.style.opacity= i/100;    
        } ;  
        indicator.prototype.getHeight = function(o){  
            var t=0;  
            o.style.visiblity='hidden';  
            t=o.scrollHeight;     
            o.style.visiblity='hidden';  
            return t;  
        };  
        indicator.prototype.release= function (){  
            thee.each(_container.obt,function(a,b){ b.style.cssText='display:none';    });  
        };  
        indicator.prototype.init = function (){  
            thee.release();  
            thee.each(_handler.obt,function(a,b){  
                thee.play(b);  
            });  
        };  
		indicator.prototype.currentStyle=function(element,property){
			var computedStyle=null;
			return undefined!==element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element,null)[property];
		};
        indicator.prototype.play=function (o){
			var that=this;  
            thee.addEvent(o,'click',function(e){  
                e=window.event || e;
                var t=e.srcElement || e.target,index=thee.index(t,_handler.obt),sibling=_container.obt[index];  
                //if(sibling.offsetHeight==0){  
					var temp=that.currentStyle(sibling,'display')
					thee.each(handler,function(x,y){  
						if(x!==index){y.removeAttribute('class')};  
					});
					
					o.className=thee.current;
                    thee.release();  
                    //thee.fx(sibling); 

					sibling.style.display=temp==='block'?'none':'block'; 
               // }else{  
                //    return false;  
               // }  
            },false);  
        };  
        indicator.prototype.index = function (a,b){  
            var t=-1;  
            thee.each(b,function(x,y){  
                a===y && (t=x);   
            });  
            return t;  
        };  
        indicator.prototype.addEvent = function (elem, evType, fn, capture){  
            if (elem.addEventListener) {  
                elem.addEventListener(evType, fn, capture);  
            }else if (elem.attachEvent) {  
                elem['e' + evType + fn] = fn;  
                elem[evType + fn] = function () {  
                    elem['e' + evType + fn](window.event)  
                };  
                elem.attachEvent('on' + evType, function () {  
                    fn.call(elem);  
                });  
            } else {  
                elem['on' + evType] = fn;  
            }  
        };  
        return {init: function(){thee.init()}}  
    }  
	imageMagic.accordion || (imageMagic.accordion=moduleAccordion);
}();