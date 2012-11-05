/*
 * ImageMagic v0.5
 *
 * Copyright 2011, enix
 * Includes toolkit lib
 * Date: 2011-9-14
 * http://www.cnblogs.com/enix
 */


/*
 *	功能：核心组件
 *	作用：实现软件初始化
 */

typeof function(window, undefined) {

    var doc,toolkit,root,rt,IM;

    imageMagic.tk.domReady(function() {
        doc = document;
        IM = imageMagic;

        //启用浏览器功能测试
        try {
            var temp = doc.createElement('canvas'),cxt = temp.getContext('2d');
        } catch(e) {
            doc.body.innerHTML = '';
            alert('改浏览器不支持canvas API,请使用firefox3.6+，IE8+，chrome2.0+,Opera10+浏览器。');
        }

        IM.root = doc.getElementsByTagName('body')[0];
        //IM.tab(imageMagic.config.workSpace.tab);

        //启用功能菜单
        IM.accordion({wrapper:imageMagic.config.workSpace.control.id,current:'accordionHandler'}).init();

        //启用调整工作区功能
        IM.workSpace.workSpaceControl();//调整工作区
        IM.workSpace.workInit();
        /////////////////////////////////////////

        //启用图片列表组件
        //IM.workSpace.imageLoader();


        /////////////////////////////////////////
        //初始化功能
        IM.workSpace.init();
        IM.workSpace.destroy();

        IM.workSpace.canvasControl();

        /////////////////////////////////////////

        /////////////////////////////////////////
        //装载水印
        //IM._mark.getMark();
        /////////////////////////////////////////

        /////////////////////////////////////////
        //生成自定义剪裁框尺寸
        //IM._clip.updataSelect()
        /////////////////////////////////////////

        /*IM.tk.addEvent(window, 'beforeunload', function() {
            localStorage.clear();
        }, false);*/


        /*IM.tk.addEvent(IM.clip.area,'dblclick',function(){
         IM._clip.getImage();
         },false);*/
        IM.tk.addEvent(window, 'resize', function() {
            IM.workSpace.workSpaceControl();
            //IM.config.imageLoader.loader && IM.workSpace.imageLoader();
            IM.workSpace.init();
        }, false);
    });
}(window);

//////////////////测试图片装载///////////////////////
window.onload=function(){
 //测试图片装载
 imageMagic.workSpace.imageInstall('images/test.jpg',function(){
 //imageMagic.workSpace.outputImage ();
 });
 /////////////////////////////////////////
};
//////////////////测试图片装载///////////////////////