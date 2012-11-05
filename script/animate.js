/*
 * Accordion v1.0
 *
 * Copyright 2011, enix

 * http://www.cnblogs.com/enix
 */
function Animate(o,property,data){
		var that=this,indicator=arguments.callee,origin=null,config=null,data=data ||{};
		if(1!==o.nodeType) return false;
		if(!(this instanceof indicator)){ return new indicator(o,property,data)};
		config={
			O:that.o=o,
			P:that.property=property,
			T:that.t=data.t || 0,
			C:that.c=data.c || 50,
			D:that.d=data.d || 100,
			R:that.r=data.r || false
		};
		'function'===typeof(data.callback) && (config.fn=data.callback);
		
		undefined===this.Tween && (
			indicator.prototype.Tween=function(){
				return that.Bounce.apply(that,arguments);
			}
		);
		indicator.prototype.constructor=indicator;
		indicator.prototype.Bounce=function(t,b,c,d){
			 return -c *(t/=d)*(t-2) + b;
			/*if ((t/=d) < (1/2.75)) {  
				return c*(7.5625*t*t) + b;  
			} else if (t < (2/2.75)) {  
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;  
			} else if (t < (2.5/2.75)) {  
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;  
			} else {  
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;  
			}*/
		};
		indicator.prototype.fx=function(t,b,c,d){
			var temp=Math.ceil(that.Tween.apply(that,arguments));
			return (true===config['R']?(-temp) : (temp)); 
		};
		indicator.prototype.play=function(O,P){
			var t=config['T'],b=0,end=false;origin=parseInt(that.currentStyle(o,property)),oLeft=parseInt(that.currentStyle(o,'left')),oTop=parseInt(that.currentStyle(o,'top'));
			void function(){
				var distance=that.fx(t,b,config['C'],config['D']);
				O.style[P]=origin+distance+'px';
				(/width/gi.test(P) && O.clientWidth>0) && (O.style['left']=oLeft-distance/2+'px');
				(/height/gi.test(P)&& O.clientHeight>0) && (O.style['top']=oTop-distance/2+'px');
				Math.abs(distance)<config['C']+origin ? (t++,timeout=setTimeout(arguments.callee,13)) : end=true; 
				(true===end) && (undefined!==config['fn'] && (config['fn'].call(that)));
			}(); 
			; 	
		};
		indicator.prototype.currentStyle=function(element,property){
			var computedStyle=null;
			return undefined!==element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element,null)[property];
		};
		that.play.call(that,config['O'],config['P']);
	};