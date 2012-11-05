/*
 * Animate v1.0
 *
 * Copyright 2011, enix
 * Date: 2011-9-14
 * http://www.cnblogs.com/enix
 */
 
 
/*
 *	����[Animate]
 *	���ܣ��������
 *	���ã�����
 */
delete function(window,undefined){
function Animate(o,property,data){
		var that=this,indicator=arguments.callee,origin=null,config=null;
		if(!(that instanceof indicator)) return new indicator(o,property,data);
		config={
			O:that.o=o,
			P:that.property=property,
			T:that.t=data.t || 0,
			C:that.c=data.c || 50,
			D:that.d=data.d || 100,
			R:that.r=data.r || false
		};
		'function'===typeof(data.callback) && (config.fn=data.callback);
		if(1!==config['O'].nodeType) return false;
		undefined===this.Tween && (
			indicator.prototype.Tween=function(){
				return that.Bounce.apply(that,arguments);
			}
		);
		indicator.prototype.constructor=indicator;
		indicator.prototype.Bounce=function(t,b,c,d){
			 return c*t/d + b;
		};
		indicator.prototype.fx=function(t,b,c,d){
			var temp=Math.ceil(that.Tween.apply(that,arguments));
			if(temp>that.c) {return false}
			return (true===config['R']?(-temp) : (temp))+origin; 
		};
		indicator.prototype.play=function(O,P){
			var t=config['T'],b=0,end=false;origin=parseInt(that.currentStyle(o,property));
			void function(){
				var distance=that.fx(t,b,config['C'],config['D']);
				O.style[P]=distance+'px';
				Math.abs(distance)<config['C']+origin ? (t++,setTimeout(arguments.callee,13)) : end=true; 
				(true===end && undefined!==config['fn']) && (setTimeout(function(){config['fn'].call(that)},300));
			}();  
		};
		indicator.prototype.currentStyle=function(element,property){
			var computedStyle=null;
			return undefined!==element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element,null)[property];
		};
		that.play.call(that,config['O'],config['P']);
	};
	Animate.doFade=function(steps,value,action,fn){  
		var ie=undefined!==window.ActiveXObject,calls=arguments.callee,t=this,step;
			value+=(action?1:-1)/steps,(action?value>1: value<0) && (value=action?1:0);
			// ie===true ? t.style.filter='alpha(opacity='+value*100+')' : t.style.opacity=value;
			try{
				t.style.opacity=value;
			}catch(e){
				t.style.filter='alpha(opacity='+value*100+')';
			};
			(action?value<1:value>0) && setTimeout(function(){
				calls.call(t,steps,value,action,fn);			
			},1000/steps);
			(action?value===1:value===0 && 'undefined'!==typeof fn) && ('function'===typeof fn && fn.call(t)); 
	};
	
	Animate.fadeOut=function(steps,fn){  
		Animate.doFade.call(this,steps/10,1,false,fn);   
	};  
	Animate.fadeIn=function(steps,fn){  
		Animate.doFade.call(this,steps/10,0,true,fn);   
	};
	imageMagic.animate || (imageMagic.animate=Animate);
}(window)