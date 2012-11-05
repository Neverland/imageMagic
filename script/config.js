/*
 * ImageMagic v0.5
 *
 * Copyright 2011, GuoAimin
 * Includes toolkit lib
 * Date: 2011-9-14
 * lastmodified: 2011-12-20
 *http://bluescript.iteye.com/
 */
 
 
/*
 *	功能：核心组件
 *	作用：软件基本配置
 */

delete function(window,undefined){
	imageMagic.config || (imageMagic.config={});
	var doc,toolkit;
	
	imageMagic.config={
		toolbar :'toolbar',
		leftSidebar :'leftSidebar',
		canvasContainer :'canvasContainer',
		importImage :'importImage',
		gallery : 'gallery',
		imageList : 'imageList',
		galleryTitle : 'galleryTitle',
		galleryMassage : 'galleryMassage',
        revoke : 'revoke',
		Enter :'Enter',
		workSpace : {
			//添加新功能需要在以下两项注册
			Function:['clip','scale','rotate','mark'],
			button :[
				'Button_clip',
				'Button_scale',
				'Button_rotate',
				'Button_mark'	
			],
			//
			tab:{t:'control',s:'leftSidebar',tag:'h3'},
			control : { id:'accordion' ,tag :'h3'},/**/
			addSize : 'addSize',
			zoom:0.08,//滚轮缩放系数
			clipDeafult :'clipDeafult',
			scaleLock :false,//开启此项，宽或高等于画布宽或高时停止缩放
			scaleType : 200, //放大界限 200%
			scaleDataSize : false, //是否显示缩放后文件量大小,为了保证鼠标滚轮缩放流程度建议关闭此项
			rotateHandler : 'rotateHandler' ,
			watermarkCon  : 'watermarkCon',
			watermarkControl  : 'watermarkControl',
			watermarkCancel : 'watermarkCancel',
			watermarkOP : 'watermarkOpacity',
			watermarkOpacity :50//水印默认不透明度
		},
		areaSize : [120,120],//剪裁框默认尺寸
		imageLoader:{
			id:'imageLoader',
			loader:'imWebLoader',
			natives:'imLoaderNative',
			web:'imLoaderWeb',
			btn:'imageLoaderBtn',
			dataSize:2048000,
			reg :{
				natives:/\.(jpg|jpeg|png)$/i,
				web:/^http:\/\/.+\.(jpg)$/i
			}
		},
		dataURL : {
			//'clientAreaSize' : {url:'http://cmstest.ws.netease.com/servlet/phototag.jsp',param:{method:'saveCustomDimen'}},
			'clientAreaSize' : {url:'https://pic.ws.netease.com/photo/saveSize.jsp',param:{method:'saveCustomDimen'}},
			'clipSize' : {url:'http://oracle.pic.ws.netease.com/photohtml5.json?',param:{channelid:'0080',method:'getphotosize'}},
			'waterMark' : {url:'http://oracle.pic.ws.netease.com/photohtml5.json?',param:{channelid:'0080',method:'getwatermark'}},
			'proxyImage' : {url:'http://oracle.pic.ws.netease.com/photohtml5.json?',param:{'method':'getphotourl'}},
			'postImage' : {url:'/upimage/cmsimg_imagick.php'}
		},
		jumpURL : {
			'cms':'/imtest/imageList.html',///post/im/imageList.html
			'pic':'/photo/bmodify.jsp',
		}
	}
}(window);