/*
 * Dailog v:1.0
 *
 * Copyright 2011, enix
 * Date: 2011-11-14
 * Includes toolkit lib
 * http://www.cnblogs.com/enix
 */


/*
 *	����[Dailog]
 *	���ܣ�UI���
 *	���ã��Ի���
 */

delete function (window, undefined) {
    function Dailog(O,fn) {
        if (!(this instanceof arguments.callee)) return new arguments.callee(O,fn);
        var indicator,doc,that,frame,root,tk, im;

        (
            doc = document,
            that = this,
            im = imageMagic,
            tk = im.tk,
            root = im.root,
            frame = doc.createDocumentFragment(),
            indicator = arguments.callee
        )


        O || (O = {});


        that.html = O.html;
        that.titleTxt = O.title || '����';
        that.buttonText = O.btn || ' ȷ�� ';
        that.hasMask = O.hasMask || true;
        that.hasCancel = O.cancel || true;
        that.cancelTxt = O.cancelTxt || ' X ';
        that.width = O.width || 400;
        that.height = O.height || 300;
        that.hasAnimate = O.animate || false;

        that.name = O.name || '';

        that.maskColor = O.maskColor || 'black';
        that.maskDepth = O.maskDepth || 50;
        that.dialogBg = O.dialogBg || 'white';
        that.zIndex = Math.floor(999 + Math.random() * 9000);
        that.viewPort = tk.getViewportSize();
        that.scollPos = tk.getScrollPosition();
        that.maxSize = [that.viewPort[0] + that.scollPos[0],that.viewPort[1] + that.scollPos[1]];

        typeof fn === 'function' && (that.fn = fn);

        that.mask = that.title = that.titleCon = that.cancel = that.container = null;


        indicator.fn = indicator.prototype;
        indicator.fn.constructor = indicator;

        indicator.fn.init = function() {
            that.htmlFactory();
            that.hasMask && that.createMask();
            that.createDailog();
            that.addEvent();
        };
        indicator.fn.htmlFactory = function() {
            that.mask = tk.getHtmlElement('div');
            that.dailog = tk.getHtmlElement('div');
            that.title = tk.getHtmlElement('h3');
            that.titleCon = tk.getHtmlElement('span');
            that.cancel = tk.getHtmlElement('b');
            that.container = tk.getHtmlElement('div');
        };
        indicator.fn.createMask = function() {
            root.appendChild(that.mask);
            that.mask.style.cssText = 'position:absolute;z-index:' + that.zIndex + ';background-color:' + that.maskColor + ';opacity:' + that.maskDepth / 100 + ';width:100%;height:' + that.maxSize[1] + 'px;top:0;left:0;';
        };
        indicator.fn.createDailog = function() {


            that.titleCon.appendChild(doc.createTextNode(that.titleTxt));
            that.title.appendChild(that.titleCon);

            that.cancel.appendChild(doc.createTextNode(that.cancelTxt));
            that.cancel.style.cssText = 'position:absolute;right:10px;cursor:pointer';


            that.title.appendChild(that.cancel);
            that.container.appendChild(that.title);
            that.name && (that.container.id='dailogContainer-'+that.name);
            that.container.className='dailogContainer';

            that.dailog.appendChild(that.title);
            that.dailog.style.cssText = 'position:absolute;z-index:' + (that.zIndex + 1) + ';width:' + that.width + 'px;height:' + that.height + 'px;left:' + (that.viewPort[0] - that.width) / 2 + 'px;top:' + ((that.viewPort[1] - that.height) / 2 + that.scollPos[1]) + 'px;background-color:' + that.dialogBg;

            that.name && (that.dailog.id = 'dailog-'+that.name);
            that.dailog.className='dailog';
            
            that.dailog.appendChild(that.container);



            that.hasAnimate && (
                that.dailog.style.opacity = 0,
                    im.animate.fadeIn.call(that.dailog, 80)
                );
            frame.appendChild(that.dailog);
            root.appendChild(frame);

            that.html && (that.container.innerHTML=that.html);

            that.fn && (that.fn.call(that));

        };
        indicator.fn.removeDailog = function() {
            try{
                that.hasAnimate && (
                    im.animate.fadeOut.call(that.dailog, 20,function(){
                        delete that.dailog.parentNode.removeChild(that.dailog);
                    })
                );

                that.dailog.parentNode.removeChild(that.dailog);
            }catch(e){}
            try{
                that.mask.parentNode.removeChild(that.mask);
            }catch(e){}

            that.dailog=that.mask=null;
        };
        indicator.fn.addEvent = function() {
            tk.addEvent(that.cancel, 'click', function() {
                that.removeDailog();
            }, false)
        };
        that.init();
    }
	imageMagic.dailog || (imageMagic.dailog=Dailog);
}(window)