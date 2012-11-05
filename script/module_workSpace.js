
/*
 * ImageMagic v0.9
 *
 * Copyright 2011, enix
 * Includes toolkit lib
 * Date: 2011-9-14
 * lastmodified: 2011-12-20
 * http://www.cnblogs.com/enix
 */


/*
 *	����[WorkSpace]
 *	���ܣ��������
 *	���ã�ʵ�ֹ�������
 */
void function(window, undefined) {
    var WorkSpace;
    WorkSpace = function () {
        var
            indicator = arguments.callee,
            doc = document,

            that = this,

            usedWidth = 0,
            usedHeight = 0,
            workWidth = 0,
            workHeight = 0,
            IM = imageMagic,
            tk = IM.tk,
            IMC = IM.config,
            IMW = IMC.workSpace;


        if (!that instanceof indicator) {
            return new indicator();
        }

        IM.editing || (IM.editing = false);

        indicator.fn = indicator.prototype;
        indicator.fn.constructor = indicator;

        indicator.fn.workSpaceControl = function () { //�����������ʹ�����������ӿ�
            var op = {
                toolbar: doc.getElementById(IMC.toolbar),
                leftSidebar: doc.getElementById(IMC.leftSidebar),
                canvasContainer: doc.getElementById(IMC.canvasContainer),
                importImage: doc.getElementById(IMC.importImage),
                gallery: doc.getElementById(IMC.gallery),
                imageList: doc.getElementById(IMC.imageList),
                galleryTitle: doc.getElementById(IMC.galleryTitle),
                imageLoader : doc.getElementById(IMC.imageLoader.id),
                viewPort: IM.tk.getViewportSize()
            };

            usedWidth = doc.getElementById(IMC.leftSidebar).offsetWidth;
            usedHeight = doc.getElementById(IMC.toolbar).offsetHeight;

            workWidth = op.viewPort[0] - parseInt(usedWidth, 10) - 20;
            workHeight = op.viewPort[1] - parseInt(usedHeight, 10) - 10;

            op.canvasContainer.style.width = op.gallery.style.width = workWidth + 'px';
            op.canvasContainer.style.height = op.gallery.style.height = workHeight + 'px';

            op.imageLoader.style.height = op.viewPort[1] + 'px';

            op.imageList.style.height = op.gallery.offsetHeight - op.galleryTitle.offsetHeight - 30 + 'px';

            op.leftSidebar.style.height = op.importImage.style.height = workHeight + 'px';
            IM.availSize || (IM.availSize = null);
            IM.availSize = [workWidth, workHeight];
        };
        indicator.fn.canvasControl = function () { //����canvas��ǩ������
            IM.canvas = tk.getHtmlElement('canvas');
        };
        indicator.fn.workInit = function () { //ͼƬ�ϴ����������
            var that = this,
                btn = doc.getElementById(IMC.imageLoader.btn);

            that.imageListLength = 0;
            that.photosId=[];
            that.form = doc.getElementById('imageForm');
            that.imageList = doc.getElementById(IMC.imageList);
            that.galleryTitle = doc.getElementById(IMC.galleryTitle);
            that.galleryMassage = doc.getElementById(IMC.galleryMassage);
            that.web = doc.getElementById(IMC.imageLoader.web);
            that.natives = doc.getElementById(IMC.imageLoader.natives);
            that.loader = doc.getElementById(IMC.imageLoader.loader);
            that.revoke = doc.getElementById(IMC.revoke);
            that.Enter = doc.getElementById(IMC.Enter);
            ///////////////////////////////
            that.index = 0;
            that.number = 0;
            try {
                that.reader = new FileReader();
            }
            catch (e) {
            }
            that.titleName = [];
            ///////////////////////////////
            that.html || (that.html = /*''*/ []);
            IM.currentEdit || (IM.currentEdit = -1);

            IM.animate.fadeIn.call(that.galleryTitle, 20);

            try {
                new FileReader().readAsDataURL;
            } catch (e) {
                that.natives.parentNode.style.display = 'none';
            }
            IM.tk.addEvent(that.revoke, 'click', function() {
                IM.workSpace.imageInstall(IM.sourceImg);
            });
            IM.tk.addEvent(that.Enter, 'click', function () {
                var temp = IMW.control,
                    handler = doc.getElementById(temp.id).getElementsByTagName(temp.tag);
                //try{IM._clip.removeArea();}catch(e){};
                IM.clip.area && IM._clip.removeArea();
                try {
                    IM._scale.destroy();
                } catch (e) {
                }
                try {
                    IM.markPreview.parentNode.removeChild(IM.markPreview);
                } catch (e) {
                }
                IM.currentEdit == -1 || (
                    that.Enter.disabled = 'disabled',that.outputImage.call(that));
                IM.tk.each(handler, function (a, b) {
                    var temp = b.nextSibling;
                    while (temp.nodeType === 3) {
                        temp = temp.nextSibling;
                    }
                    temp.style.display = 'none';
                })
                return false;
            }, false);
            /*IM.tk.addEvent(btn,'click',function(){
             var temp=IMC.imageLoader.loader;
             IM.imgSrc && (
             that.form.reset(),
             IM.workSpace.imageInstall(IM.imgSrc)
             );

             },false);*/
        };
        indicator.fn.imageLoader = function () {
            var viewPort = IM.tk.getViewportSize(),
                switchs = that.galleryTitle.getElementsByTagName('input');
            IMC.imageLoader.loader = doc.getElementById(IMC.imageLoader.id);
            IMC.imageLoader.loader.style.height = viewPort[1] + 'px';
            IMC.imageLoader.loader.style.display = 'block';


            IM.tk.each(switchs, function (a, b) {
                b.type === 'button' && (
                    IM.tk.addEvent(b, 'click', function () {
                        that.switchsListener(that, b);
                    }, false));
            });

            IM.tk.addEvent(that.web, 'blur', function () {
                var reg = IMC.imageLoader.reg.web,
                    value = this.value.trim();
                reg.test(value) && (that.web.disabled = 'disabled',that.loader && (that.loader.style.display = 'inline-block'),that.imageWebSrc(value));
                this.value = this.defaultValue;
            }, false);

            IM.tk.addEvent(that.web, 'focus', function () {
                this.value == this.defaultValue && (this.value = '');
            }, false);

            IM.tk.addEvent(that.natives, 'change', function () {
                var value = this.value,
                    reg = IMC.imageLoader.reg.natives;
                //reg.test(value) && (that.imageNativeSrc(this),this.value='');
                that.imageNativeSrc(this),this.value = ''; //
            }, false);
        };
        indicator.fn.outputImage = function () {
            var that = this,
                temp = IMC.imageLoader.loader,
                imageData = null,
                number = IM.currentEdit;

            try {
                imageData = IM.canvas.toDataURL('image/jpeg');
                IM.images[number].src = imageData;
            } catch (e) {
            }
            /*IM.animate(temp,'top',{c:temp.offsetHeight,d:20,r:true,callback:function(){

             }});*/
            //temp.style.top='0';
            setTimeout(function () {
                try {
                    temp.style.display = 'block';
                } catch (e) {
                }
                //IM.animate.fadeIn.call(temp,20,function(){
                that.Enter.removeAttribute('disabled');
                IM.canvas.width = 0;
                IM.canvas.height = 0;
                //});
            }, 200);
        };
        indicator.fn.addImageListImgEvent = function () {
            var that = this,
                images = that.imageList.getElementsByTagName('img'),
                i = images.length;
            IM.images || (IM.images = images);
            IM.tk.each(images, function (a, b) {
                void
                    function (i) {
                        IM.tk.addEvent(b, 'dblclick', function (e) {
                            IM.currentEdit = i;
                            that.imageInstall(b.src, function () {
                                var temp = IMC.imageLoader.loader;
                                //IM.animate.fadeOut.call(temp,20,function(){
                                //temp.style.top=0;
                                temp.style.display = 'none';
                                //});
                                //IM.animate(temp,'top',{c:temp.offsetHeight,d:20});
                            });
                            IM.tk.stopEvent(e);
                        }, false);

	                    IM.tk.addEvent(b, 'tocuchstart', function (e) {
                            /*IM.currentEdit = i;
                            that.imageInstall(b.src, function () {
                                var temp = IMC.imageLoader.loader;
                                //IM.animate.fadeOut.call(temp,20,function(){
                                //temp.style.top=0;
                                temp.style.display = 'none';
                                //});
                                //IM.animate(temp,'top',{c:temp.offsetHeight,d:20});
                            });
                            IM.tk.stopEvent(e);*/

                        }, false);
	                    
                    }(a)
            });
            /*for(;i>0;){
             void function(i){
             var img=images[i];
             IM.tk.addEvent(img,'dblclick',function(e){
             IM.currentEdit=i;
             that.imageInstall(img.src,function(){
             var temp=IMC.imageLoader.loader;
             IM.animate(temp,'top',{c:temp.offsetHeight,d:20});
             });
             IM.tk.stopEvent(e);
             },false);
             }(--i);
             }*/
        };
        indicator.fn.addImageListCheckboxEvent = function () {
            var inputs = that.imageList.getElementsByTagName('input');

            //console.log(inputs);
            IM.tk.each(inputs, function (a, b) {
                if (b.type === 'button') {
                    /*IM.tk.addEvent(b,'click',function(e){
                     this.className==='del' && (console.log(1111111111111),that.removeImageItem(b));
                     IM.tk.stopEvent(e);
                     },false);*/
                    b.onclick = function () {
                        this.className === 'del' && (that.removeImageItem(this));
                        return false;
                    }
                }
            });
        };
        indicator.fn.switchsListener = function (that, elem) {
        	
            ({
                'galleryAll': function () {
                    that.checkboxControl(that, 1);
                },
                'galleryReverse': function () {
                    that.checkboxControl(that, -1);
                },
                //'galleryEnter' :1,
                'galleryDelete': function () {
                    that.checkboxControl(that, 0);
                },
                'galleryPost': function () {
                    var inputs = that.imageList.getElementsByTagName('input'),
                        tempdata = that.getAllData(inputs),
                        tips,
                        dailog;

                    //console.log(tempdata);
                    if (tempdata.length === 0) {
                        //alert('��ѡ��Ҫ�ϴ���ͼƬ��');
                        tips=IM.dailog({name:'uploadTips',title:'��ʾ',html:'<p><b>��ѡ��Ҫ�ϴ���ͼƬ��</b></p><p>2����Զ��ر�</p>',width:300,height:100},function(){
                            setTimeout(function(){tips.removeDailog()},2000);
                        });

                        return false;
                    }

                    var ajax = new IM.tk.ajax(),

                        temp = IM.config.dataURL.postImage,
                        searchs = location.search.replace(/\?/g, ''),
                        data = searchs + '&' + 'imgdata=' + tempdata.join(''),
                        
                        cancelUpload=function(d){
                            ajax.abortAjax();
                            d.removeDailog();
                        },
                        callback = {
                            success: function (a, b) {
                                var temp = eval('(' + a + ')'); //(new Function('return '+a))();
                                ({
                                    'ok': function () {
                                        dailog.container.innerHTML='<p><b>ѡ��ͼƬ���ϴ���ɣ�</b></p>';
                                        setTimeout(function(){dailog.removeDailog();},1000);
                                        if(temp.photoids){
											that.photosId.push(temp.photoids);
											that.shutData(inputs,function(){
												setTimeout(function(){
													that.imageListLength ===0 && (
															location.href=(IMC.jumpURL.pic+location.search+'&batch='+that.photosId.join(','))
													);
												},2000);
											});
                                        }
	                                    if(temp.imgurl){
		                                    that.shutData(inputs,function(){
												setTimeout(function(){
													that.imageListLength ===0 && (
															 window.open(IMC.jumpURL.cms+'?data='+encodeURI(temp.imgurl))
													);
												},2000);
											});
	                                    }
                                    },
                                    'error': function () {
                                        alert('�ϴ�ʧ��');
                                        dailog.removeDailog();
                                    }

                                })[temp.status]()

                            },
                            failure: function (stauts) {
                                dailog.removeDailog();
                                alert('ajax����ʧ��:' + stauts);
                            }
                        };
                    //alert(elem)
                    //if (!doc.getElementById('postLoading')) {
                        //parent.appendChild(loading)
                    //}
                    //loading.innerHTML=/*'<img src="" />'*/;
                    //loading.id = 'postLoading';
                    //loading.setAttribute('style', style);
                    //elem.disabled=true;
                    //elem.className = 'posting';
                    ajax.request({
                        method: 'POST',
                        url: temp.url,
                        callback: callback,
                        postVars: encodeURI(data)
                    },function(){
                        dailog=IM.dailog({name :'uploading',title:'�ϴ�',html:'<p><b>�����ϴ�,�����ĵȴ�</b></p><p><input type="button" id="uploadImageCancel" value="  ȡ��  " /> </p>',width:300,height:100},function(){
                            var btn=doc.getElementById('uploadImageCancel'),that=this,parent=that.cancel.parentNode,rmbtn=null,cancelBtn=null;
                            try{rmbtn=parent.removeChild(that.cancel);}catch(e){alert(e)};
                            cancelBtn=rmbtn.cloneNode(true);

                            parent.appendChild(cancelBtn);
                            IM.tk.addEvent(cancelBtn,'click',function(){
                                cancelUpload(that);
                            },false);
                            IM.tk.addEvent(btn,'click',function(){
                                cancelUpload(that);
                            },false);
                        });
                    });
                }
            })[elem.id]();
        };

        indicator.fn.shutData = function (inputs,fn) {
            IM.tk.each(inputs, function (a, b) {
                (b.type === 'checkbox' && b.checked === true) && (
                    that.removeImageItem(b));
            });
            typeof fn =='function' && fn();
        };
        indicator.fn.getAllData = function (inputs) {
            var html = [],
                temp = null;
            IM.tk.each(inputs, function (a, b) {
                (b.type === 'checkbox' && b.checked === true) && (
                    temp = b.parentNode.previousSibling,html.push(temp.src + '!' + temp.title + '#'));
            });

	        /*IM.tk.duffsDevice(inputs,function(b,a){
		        //console.log(b)
		        (b.type === 'checkbox' && b.checked === true) && (
                    temp = b.parentNode.previousSibling,html.push(temp.src + '$' + temp.title + '#'));
	        })*/

            return html;
        };
        indicator.fn.checkboxControl = function (that, flag) {
            var checkbox = that.imageList.getElementsByTagName('input');
            IM.tk.each(checkbox, function (a, b) {
                if (b.type === 'checkbox') {
                    that.checkeStatus.call(that, b, flag);
                }
            });
        };
        indicator.fn.checkeStatus = function (elem, flag) {
            switch (flag) {
                case 1:
                    elem.checked = 'checked';
                    break;
                case -1:
                    elem.checked === true ? elem.checked = false : elem.checked = true;
                    break;
                case 0:
                    if (elem.checked == true) {
                        this.removeImageItem(elem)
                    }
                    break;
            }
        };
        indicator.fn.removeImageItem = function (elem) {
            var parent = elem.parentNode;
            while (parent.tagName.toLowerCase() !== 'dl') {
                parent = parent.parentNode;
            }
            IM.animate(parent, 'left', {
                c: parent.offsetWidth / 2,
                d: 5,
                r: true,
                callback: function () {
                    try {
                        parent.parentNode.removeChild(parent)
                    } catch (e) {
                    }
                    that.imageListLength--;
                    that.galleryMassage.innerHTML = 'ͼƬ����' + (that.imageListLength);

                    //console.log(that.imageListLength+' ');
                    that.imageListLength = that.imageListLength < 0 ? Math.abs(that.imageListLength) : that.imageListLength;
                    //console.log(that.imageListLength+' ');
                    //(that.imageListLength == 0 && IM.tk.currentStyle(that.galleryTitle, 'opacity') === '1') && (IM.animate.fadeOut.call(that.galleryTitle, 20, function () {

                    //}));
                }
            });
            IM.animate.fadeOut.call(parent, 50);

        };
//        indicator.fn.fileAPIReader = function(file) {
//            var that = this//,reader = new FileReader();
//
//            /*that.reader.readAsDataURL(file);
//            that.reader.onload = function(e) {
//                //alert(e.target.result)
//                e = IM.tk.getEvent(e);
//                that.createImageList(e.target.result, file.name);
//                that.setImageList();
//            };
//            return false;*/
//            var calls = arguments.callee,
//            temp = function (e) {
//                that.createImageList(e.target.result, file.name);
//                that.setImageList();
//                calls(file);
//            };
//            that.reader.onload = temp;
//            that.reader.onerror = temp;
//            try {
//                that.reader.readAsDataURL(file.shift())
//            } catch (e) {}
//        };
        /*indicator.fn.imageNativeSrc = function(img) {//��ñ����ϴ���ͼƬ���
         var srcs = img.files,that = this;
         IM.tk.each(srcs, function(a, b) {
         if (b.type === 'image/jpeg' && b.size < IMC.imageLoader.dataSize) {
         that.fileAPIReader(b);
         }
         if (b.size > IMC.imageLoader.dataSize) {
         alert('��ʾ��ͼƬ' + b.name + '��С���� ' + IMC.imageLoader.dataSize / 1024000 + 'M ���ƣ�û�е��룡');
         }
         });
         };*/

        indicator.fn.fileAPIReader = function (file, length, index) {

            var calls = arguments.callee,
                temp = function (e) {
                    /*var img = doc.getElementById('images' + that.number),
                     title = doc.getElementById('imagesTitle' + that.number);
                     img.src = e.target.result;

                     title.innerHTML = that.titleName[that.number];*/


                    that.createImageList(e.target.result, that.titleName[that.number]);

                    that.number++;
                    calls(file, length, index + 1);
                };
            that.reader.onload = temp;
            that.reader.onerror = temp;
            that.setImageList();
            try {
                that.reader.readAsDataURL(file.shift());
            } catch (e) {
            }
        };
        indicator.fn.imageNativeSrc = function (img) { //��ñ����ϴ���ͼƬ���
            var srcs = img.files,
                that = this,
                arr = [],
                temp;

            IM.tk.each(srcs, function (a, b) {
                if (b.size > IMC.imageLoader.dataSize) {
                    //alert('��ʾ��ͼƬ' + b.name + '��С���� ' + IMC.imageLoader.dataSize / 1024000 + 'M ���ƣ�û�е��룡');

                    /*temp=IM.dailog({name :a,title:'��ʾ',html:'<p align="center">ͼƬ' + b.name + '��С���� ' + IMC.imageLoader.dataSize / 1024000 + 'M ���ƣ�û�е��룡</p><p align="center">2����Զ��ر�</p>',width:300,height:100},function(){
                        //var that=this;
                        //this.removeDailog()
                        //setTimeout(function(){temp.removeDailog()},2000);
                    });*/

                    temp || (temp=IM.dailog({name :'imageSizeTip',title:'��ʾ',width:360,height:120}));

                    temp.container.innerHTML+='<p>'+a+'.ͼƬ<b>' + b.name + '</b>��С���� ' + IMC.imageLoader.dataSize / 1024000 + 'M ���ƣ�û�е��룡</p>';

                }
                if (b.type === 'image/jpeg' && b.size < IMC.imageLoader.dataSize) {
                    arr.push(b);
                    that.titleName.push(b.name);
                    //that.createImageList();
                }

            });
            //that.setImageList();
            setTimeout(function () {
                //console.log(arr);
                that.fileAPIReader(arr, arr.length, 0);
            }, 100);
        };
        indicator.fn.initWebLoader = function () {
            that.web.removeAttribute('disabled');
            that.loader && (that.loader.style.display = 'none');
        };
        indicator.fn.imageWebSrc = function (src) {
            var that = this,
                temp = IM.config.dataURL.proxyImage,
                param = temp.param;
            param.photourl = src;
            IM.tk.dynamicScriptProxy(temp.url, param, function (b) {
                var data = b[0];
                //console.log(data.imgdata)
                data.status === 'ok' && (that.initWebLoader(),that.createImageList('data:image/jpeg;base64,'+data.imgdata,data.name),that.setImageList()/*,that.setWebSrc.call(that, 'data:image/jpeg;base64,' + data.imgdata, data.name)*/);
                //that.setWebSrc.call(that,'data:image/jpeg;base64,'+data.imgdata,data.name)����
                data.status === 'error' && (alert('����ͼƬ��ȡʧ��'),that.initWebLoader());
            });
        };
        indicator.fn.setWebSrc = function (src, name) {
            var that = this,
                img = doc.getElementById('images' + that.number),
                title = doc.getElementById('imagesTitle' + that.number);
            img.src = src;
            title.innerHTML = name;
            that.number++;
        };
        /*indicator.fn.createImageList=function(data,name){
         var that=this;
         that.html+='<dl><dt><img src="'+data+'" title="'+name+'" /><span><input type="checkbox" checked="true" /><input type="button" class="del" value="ɾ" /></span></dt><dd>'+name+'</dd></dl>';
         that.imageListLength++;
         that.imageList.innerHTML+=that.html;
         return false;
         };*/
        indicator.fn.createImageList = function(data, name) {
            var that = this,create = IM.tk.getHtmlElement,dl = create('dl'),dt = create('dt'),dd = create('dd'),img = create('img'),span = create('span'),inputA = create('input'),inputB = create('input'),dummy = doc.createDocumentFragment();

            inputA.type = 'checkbox';
            inputA.checked = true;

            inputB.type = 'button';
            inputB.className = 'del';
            inputB.value = 'ɾ';

            img.src = data;
            img.title = name;

            span.appendChild(inputA);
            span.appendChild(inputB);

            dt.appendChild(img);
            dt.appendChild(span);
            dd.nodeValue = name;

            dl.appendChild(dt);
            dl.appendChild(dd);

            dd.innerHTML = name;

            dummy.appendChild(dl);

            that.imageList.appendChild(dummy);
            that.imageListLength++;

            that.galleryMassage.innerHTML = 'ͼƬ����' + that.imageListLength;
        };
        /*indicator.fn.createImageList = function () {
         var that = this;
         that.html.push('<dl><dt><img id="images' + that.index + '" src="" title="" /><span><input type="checkbox" /><input type="button" class="del" value="ɾ" /></span></dt><dd id="imagesTitle' + that.index + '"></dd></dl>'),
         that.imageListLength++;
         that.index++;
         };*/
        indicator.fn.setImageList = function() {
            that.galleryMassage.innerHTML = 'ͼƬ����' + that.imageListLength;
            //console.log(that.imageListLength);
            that.imageListLength > 0 && (
                that.addImageListCheckboxEvent(),
                    that.addImageListImgEvent()
                //(IM.tk.currentStyle(that.galleryTitle, 'opacity') === '0' && IM.animate.fadeIn.call(that.galleryTitle, 20))
                );
            that.imageList.style.height = IM.availSize[1] - that.galleryTitle.scrollHeight - 30 + 'px';
            ((that.imageList.scrollHeight > that.imageList.offsetHeight) || (that.imageList.scrollHeight > IM.availSize[1])) ? that.imageList.style.overflowY = 'scroll' : that.imageList.style.overflowY = 'hidden';
            that.html = ''/*[]*/;
            return false;
        };
        /*indicator.fn.setImageList = function () {
         that.imageList.innerHTML += that.html.join('');
         that.galleryMassage.innerHTML = 'ͼƬ����' + that.imageListLength;
         that.imageListLength > 0 && (IM.animate.fadeIn.call(that.imageList, 50, function () {
         that.addImageListCheckboxEvent(),that.addImageListImgEvent()
         }),(IM.tk.currentStyle(that.galleryTitle, 'opacity') === '0' && IM.animate.fadeIn.call(that.galleryTitle, 50)));
         that.imageList.scrollHeight >= that.imageList.offsetHeight || that.imageList.scrollHeight >= IM.availSize[1] ? that.imageList.style.overflowY = 'auto' : that.imageList.style.overflowY = 'hidden';
         that.html = [];

         };*/
        indicator.fn.imageInstall = function (imgSrc, fn) {
            var canvas = IM.canvas,
                cxt = canvas.getContext('2d');
            IM.img = new Image;
            IM.sourceImg = '';
            tk.addEvent(IM.img, 'load', function () {
                var canvasSize = [IM.img.width, IM.img.height];
                IM.maxSize = canvasSize;
                cxt.strokeStyle = cxt.createPattern(IM.img, 'no-repeat');
                canvas.width = canvasSize[0],canvas.height = canvasSize[1];
                cxt.drawImage(IM.img, 0, 0, canvasSize[0], canvasSize[1]);

                typeof(fn) === 'function' && fn();

            }, false);
            tk.addEvent(IM.img, 'error', function () {
                alert('ͼƬ��ȡʧ�ܣ���ʹ��Ctrl+F5');
            }, false);
            IM.sourceImg = imgSrc;
            IM.img.src = imgSrc;
            doc.getElementById(IMC.canvasContainer).appendChild(canvas);
        };
        indicator.fn.getCanvas = function () {
            //var canvas=IM.canvas,cxt;
            var canvas = doc.getElementById('canvas'),
                cxt;
            canvas.getContext && (cxt = canvas.getContext('2d'));
            return cxt;
        };
        indicator.fn.clearCanvas = function () {
            //var canvas=IM.canvas,cxt;
            var canvas = doc.getElementById('canvas'),
                cxt = canvas.getContext('2d');
            cxt.clearRect(0, 0, IM.availSize[0], IM.availSize[1]);
        };

        indicator.fn.availableNumberInput = function (inputs) {
            var len = inputs.length,i,reg = /^(8|9|4[8-9]|5[0-7]|9[6-9]|10[0-5])$/ig;

            doc.onmousedown = function() {
                try {
                    document.selection.empty()
                } catch(e) {
                    getSelection().removeAllRanges()
                }
            }
            for (i = len; i > 0; (inputs[--i].onkeydown = function(e) {
                e = window.event || e;
                var target = e.srcElement || e.target,code = e.charCode || e.keyCode;
                reg.lastIndex = 0;
                if (!reg.test(code) || e.shiftKey) {
                    return false;
                }
                target.value === '0' && (target.value = '');
            },inputs[i].oncontextmenu = function() {
                return false;
            }),inputs[i].style.imeMode = 'disabled') {
            }
        };
        indicator.fn.init = function () {
            var temp = IMW.control,
                handler = doc.getElementById(temp.id).getElementsByTagName(temp.tag),
                i = handler.length,
                inputs = doc.getElementById(IMC.leftSidebar).getElementsByTagName('input');

            this.availableNumberInput(inputs);
            tk.each(handler, function (a, b) {
                tk.addEvent(b, 'click', function () {
                    var canvas = IM.canvas,
                        cxt = canvas.getContext('2d');
                    /////////////////////////////////
                    //console.log(this.id.replace(/IM/,''))
                    IM.editing = b.id.replace(/IM/g, '');
                    //that.dispose();
                    (cxt && this.id !== undefined) && IM[this.id.toString().replace(/IM/, '')].init();
                }, false);
            });
        };
        indicator.fn.destroy = function () {
            var temp = IMW,
                handler = temp.button;
            tk.each(handler, function (a, b) {
                var B = doc.getElementById(b);
                tk.addEvent(B, 'click', function (e) {
                    e = IM.tk.getEvent(e);
                    var target = IM.tk.getTarget(e);
                    IM[this.id.replace(/Button/, '')].destroy();

                    //target.style.cssText='background:#4D90FE;box-shadow:none;color:white;1px solid #666;';
                    target.disabled = 'true';
                    target.value = ' ��Ӧ�� ';
                    target.className = 'highlight';
                }, false)
                /*b.onfocus=function(){
                 this.blur();
                 };*/
                tk.addEvent(b, 'focus', function () {
                    this.blur();
                    //this.style.border='solid 1px #4D90FE';
                }, false);
            });
        };
        indicator.fn.buttonReset = function (elem) {
            //elem.disabled === 'true' && (
            elem.value = elem.title,elem.removeAttribute('style'),
                elem.className = '',
                elem.removeAttribute('disabled')
            // );
        };
        /*indicator.fn.dispose=function(){
         tk.each(IMW.Function,function(a,b){
         IM['_'+b].destroy();
         });
         };*/

        //public method end


        //interface [init] [destroy]
        //////////////////////////////////////////////////////////////////////////////////////////
        IM._clip = { //��������þ�̬����
            init: function () {

                try {
                    IM.clip.area && IM._clip.removeArea();
                } catch (e) {
                }

                var that = IM._clip,
                    canvas = IM.canvas,
                    cxt = IM.canvas.getContext('2d');
                that.canvas = canvas;
                that.button = doc.getElementById('Button' + IM.editing);


                that.defaultValue.call(that); //���ù�����clipԤ�ü��ÿ�
                that.clientValue(); //���ù�����clip�û��Զ�����ÿ�
                that.w.value = IMC.areaSize[0];
                that.h.value = IMC.areaSize[1];

                that.select = doc.getElementById(IMW.clipDeafult);
                that.radioA = doc.getElementById('clipRadioDefault');
                that.radioB = doc.getElementById('clipRadioClient');
	            that.addSize = doc.getElementById(IMW.addSize);



                IM.img.src = canvas.toDataURL('image/jpeg');

                that.areaCut(IMC.areaSize[0], IMC.areaSize[1]);
                
                that.select.options[0].selected = 'selected';

                IM.tk.addEvent(that.w, 'change', function() {
                    that.restButton();
                }, false);
                IM.tk.addEvent(that.h, 'change', function() {
                    that.restButton();
                }, false);

                that.restButton();

	            IM.tk.addEvent(that.addSize,'click', that.addAreaSize, false);
                IM.tk.addEvent(that.radioA, 'click', that.areaSet, false);
                IM.tk.addEvent(that.radioB, 'click', that.areaSet, false);
                IM.tk.trigger(that.radioA, 'click');
            },
            restButton : function () {
                IM.workSpace.buttonReset(this.button);
            },
            proportion : function(x, y,refer) {
                refer=(refer ===2)?2:1,x = x.toPrecision(refer),y = y.toPrecision(refer);
                var z = ((x < y) ? x : y);
                while (true) {
                    if (x % z == 0 && y % z == 0) {
                        break;
                    }
                    z--;
                }
                return [(x / z),(y / z)];
            },
            uploadImg: function () { //��Ⱦ���û�õ�ͼƬ
                var canvas = IM.canvas,
                    cxt = canvas.getContext('2d'),
                    newImg, temp = IM.clip.getData(),
                    x, y, w, h;
                IM.step || (IM.step = 0);
                tk.is(temp) === 'Array' && (
                    x = Math.max(temp[0], 0),y = Math.max(temp[1], 0),w = Math.min(temp[2] - 2, IM.maxSize[0] - x),h = Math.min(temp[3] - 2, IM.maxSize[1] - y));
                if (w > 0 && h > 0) {
                    try {
                        newImg = cxt.getImageData(x, y, w, h),canvas.width = w,canvas.height = h
                    } catch (e) {
                    }
                }
                try {
                    cxt.putImageData(newImg, 0, 0)
                } catch (e) {
                }
                //localStorage.setItem('Img'+IM.step++,JSON.stringify(newImg));
            },
	        addAreaSize : function(){
				/*var ajax = new IM.tk.ajax(),callback={},that=IM._clip,url=IM.config.dataURL.clientAreaSize.url;
		        
				ajax.request({
				   method: 'POST',
				   url: url,
				   callback: callback,
				   postVars: 'dimen='+(that.w.value+'*'+that.h.value)
			   },function(){
				   alert('�ղسɹ�');
			   });*/
		        var that=IM._clip,config=IM.config.dataURL.clientAreaSize,url=config.url,param=config.param,dailog=null;
				console.log(param);
		        param? (param['size']=(that.w.value+'*'+that.h.value)):(param={size:that.w.value+'*'+that.h.value});


		        IM.tk.dynamicScriptProxy(url,param,function(b){
			        console.log(b);
			        if(!b) return ;

			        that.select.length = 0;
                    that.select[0] = new Option('---��ѡ��---');
                    that.select.options[0].disabled = 'true';
                    IM.tk.each(b, function (x, y) {
                        that.select.options[x + 1] = new Option(y);
                    });
                    that.select.options[0].selected = 'selected';

			        IM.dailog({name:'uploadTips',title:'��ʾ',html:'<p>�ղسɹ�</p><p>2����Զ��ر�</p>',width:300,height:100},function(){
                        var that=this;
                        setTimeout(function(){that.removeDailog()},2000);
                    });


		        })
	        },
            updataSelect: function () {
                var that = IM._clip,
                    temp = IM.config.dataURL.clipSize;
                IM.tk.dynamicScriptProxy(temp.url, temp.param, function (b) {

                    that.select.length = 0;
                    that.select[0] = new Option('---��ѡ��---');
	                that.select[0].disabled=true;
                    that.select.options[0].disabled = 'true';
                    IM.tk.each(b, function (x, y) {
                        select.options[x + 1] = new Option(y);
                    });

                    that.select.options[0].selected = 'selected';

                    //that.select.disabled=true;
                });
            },
            areaCut: function (x, y) { //��ɼ��ÿ�
                var that = IM._clip,
                    area = IM.clip.area,
                    clipBtn = doc.getElementById(IMW.button[0]);
                IM.clip.activity({
                    width: x,
                    height: y
                }, function () {
                    //////////////////////////////
                    that.w.value = IM.clip.area.clientWidth;
                    that.h.value = IM.clip.area.clientHeight;

                    //////////////////////////////
                });
                IM.tk.addEvent(IM.clip.area, 'dblclick', function () {
                    that.getImage();
                    that.removeArea();
                    IM.tk.trigger(that.button, 'click')
                }, false);

                IM.tk.addEvent(clipBtn, 'click', function () {
                    /*clipBtn.disabled='disabled';

                     IM._clip.getImage();
                     IM._clip.removeArea(function(){
                     clipBtn.removeAttribute('disabled');
                     });*/
                    that.finishClip(clipBtn);
                    return false;
                }, false);
                IM.tk.addEvent(document, 'keypress', this.keybordCut, false);
            },
            areaSet: function (e) {
                e = IM.tk.getEvent(e);
                var that = IM._clip,
                    target = IM.tk.getTarget(e);
                ({
                    clipRadioDefault: function () {
                        that.w.disabled = true;
                        that.h.disabled = true;
                        that.select.disabled = false;
                    },
                    clipRadioClient: function () {
                        that.w.disabled = false;
                        that.h.disabled = false;
                        that.select.disabled = true;
                    }
                })[target.id]();
            },
            keybordCut: function (e) {
                e = tk.getEvent(e);
                var keyCode = e.keyCode || e.charCode,
                    target = IM.tk.getTarget(e);
                if (keyCode === 13) {
                    IM._clip.finishClip(e.target);
                }
                return false;
            },
            getImage: function () { //��ȡ����ͼƬ�����ü��ÿ򶥵���0 0
                try {
                    IM._clip.uploadImg();
                    IM.clip.area.style.left = '0px',IM.clip.area.style.top = '0px'
                } catch (e) {
                }
            },
            removeArea: function (fn) {
                IM.clip.removeArea(fn);
            },
            defaultValue: function () { //������Ĭ������
                var node = doc.getElementById('clipDeafult'),
                    radio = doc.getElementById('clipRadioDefault'),
                    value = null,
                    that = this;

                IM.tk.addEvent(node, 'change', function () {

                    //true===radio.checked &&(
                    value = node.value.split('*'),IM._clip.areaCut(value[0], value[1])
                    //);
                    //that.button.disabled === true && (
                    that.restButton()
                    //);

                }, false);
            },
            clientValue: function () {
                var that = IM._clip,
                    radio = doc.getElementById('clipRadioClient');
                that.w = doc.getElementById('clipClientWidth'),that.h = doc.getElementById('clipClientHeight');

                IM.tk.addEvent(that.w, 'keyup', function () {

                    //true===radio.checked && IM._clip.setClientValue.call(this,h,0);
                    IM._clip.setClientValue.call(this, that.h, 0);
                }, false);
                IM.tk.addEvent(that.h, 'keyup', function () {
                    //true===radio.checked && IM._clip.setClientValue.call(this,w,1);
                    IM._clip.setClientValue.call(this, that.w, 1);
                }, false);
            },
            setClientValue: function (node, flag) {
                /*var temp=this.value.trim(),x=parseInt(node.value.trim());
                 if(/^\d+$/.test(temp) && /^\d+$/.test(x)){
                 if(temp>IMC.areaSize[0] && x>IMC.areaSize[1]){
                 if(temp<IM.maxSize[0]&& x<IM.maxSize[1]){
                 0===flag ? IM._clip.areaCut(temp,x) : IM._clip.areaCut(x,temp);
                 }
                 };
                 }
                 ///^[1-9]*[1-9][0-9]*$/g*/

                var temp = this.value.trim(),
                    x = parseInt(node.value.trim(), 10),
                    reg = /^(?!0)\d+$/g;

                (0 === flag && reg.test(temp)) && (
                    isNaN(x) ? IMC.areaSize[1] : x,temp = temp > IM.canvas.width ? (IM.canvas.width) : temp,this.value = temp,IM._clip.areaCut(temp, x));
                (1 === flag && reg.test(temp)) && (
                    isNaN(x) ? IMC.areaSize[0] : x,temp = temp > IM.canvas.height ? (IM.canvas.height) : temp,this.value = temp,IM._clip.areaCut(x, temp));
            },
            finishClip: function (O) {
                O.disabled = 'disabled';
                IM._clip.getImage();
                IM._clip.removeArea(function () {
                    O.removeAttribute('disabled');
                });
                return false;
            },
            destroy: function () {
                this.button.disabled = 'true';
                IM.tk.removeEvent(document, 'keypress', this.keybordCut, false);
                IM.tk.removeEvent(this.radioA, 'click', that.areaSet, false);
                IM.tk.removeEvent(this.radioB, 'click', that.areaSet, false);
                try {
                    IM._scale.destroy();
                } catch (e) {
                }
                //IM.img.src=this.canvas.toDataURL('image/jpeg');
            }
        };


        IM._scale = { //���������ž�̬����
            x: 1,
            y: 1,
            scaleDW: 'scaleDW',
            scaleDH: 'scaleDH',
            scaleDS: 'scaleDS',
            scaleCS: 'scaleCS',
            scaleCW: 'scaleCW',
            scaleCH: 'scaleCH',
            locked: 'scaleLocked',
            scaleRest: 'scaleRest',
            canvas: null,
            init: function () {

                try {
                    IM.clip.area && IM._clip.removeArea();
                    //IM._mark.destroy();
                } catch (e) {
                }

                var that = IM._scale,
                    canvas = IM.canvas,
                    cxt = IM.canvas.getContext('2d');

                that.canvas = canvas;
                that.dw = doc.getElementById(that.scaleDW),that.dh = doc.getElementById(that.scaleDH);
                that.ds = doc.getElementById(that.scaleDS),that.cs = doc.getElementById(that.scaleCS);
                that.cw = doc.getElementById(that.scaleCW),that.ch = doc.getElementById(that.scaleCH);

                that.lock = doc.getElementById(that.locked);
                that.rest = doc.getElementById(that.scaleRest);
                that.dw.innerHTML = canvas.width;
                that.dh.innerHTML = canvas.height;


                IM.img.src = canvas.toDataURL('image/jpeg');

                //this.ds.innerHTML=IM.img.src.length;
                that.w = canvas.width;
                that.h = canvas.height;
                that.button = doc.getElementById('Button' + IM.editing);

                that.cw.value = '100';
                that.ch.value = '100';

                IM.tk.addEvent(that.cw, 'change', function() {
                    that.restButton();
                }, false);
                IM.tk.addEvent(that.ch, 'change', function() {
                    that.restButton();
                }, false);

                that.restButton();

                that.upInfo(canvas.width, canvas.height);
                IM.tk.addEvent(that.rest, 'click', that.restIamge, false);
                that.addEvent();
            },
            restButton : function () {
                IM.workSpace.buttonReset(this.button);
            },
            upInfo: function (w, h, l) {
                w = w || 0,h = h || 0,l = l || 0;
                this.dw.innerHTML = w;
                this.dh.innerHTML = h;
                //this.cs.innerHTML=l || 'δ֪';
            },
            restIamge: function () {
                var that = IM._scale;
                that.x = 1;
                that.y = 1;
                that.setScale();
            },
            addEvent: function () {
                var that = IM._scale;
                that.container = doc.getElementById(IMC.canvasContainer);
                that.wheel = navigator.userAgent.indexOf('Firefox') !== -1 ? 'DOMMouseScroll' : 'mousewheel';

                IM.tk.addEvent(that.cw, 'keyup', that.clientValue, false);
                IM.tk.addEvent(that.ch, 'keyup', that.clientValue, false);
                IM.tk.addEvent(that.container, that.wheel, that.zoom, false);
            },
            clientValue: function (e) {
                e = IM.tk.getEvent(e);
                var that = IM._scale,
                    target = IM.tk.getTarget(e),
                    value = parseInt(target.value.trim(), 10),
                    reg = /\d+/,
                    checked = that.locked;
                value = Math.max(value, 1);
                value = Math.min(value, IMW.scaleType);
                value = isNaN(value) ? 0 : value;

                target.value = value;
                if (target === that.cw && reg.test(value)) {
                    that.correctXY(value, that.ch);
                } else if (target === that.ch && reg.test(value)) {
                    that.correctXY(value, that.cw);
                }
                that.x /= 100;
                that.y /= 100;
                that.setScale(1);
            },
            correctXY: function (value, b) {
                var that = IM._scale;
                that.x = value;
                if (that.lock.checked === true) {
                    that.y = value;
                    b.value = isNaN(value) ? 10 : value;
                } else {
                    that.y = parseInt(b.value, 10);
                }
            },
            zoom: function (e) {
                e = tk.getEvent(e);
                IM._scale.getScale((e.wheelDelta ? e.wheelDelta / (-120) : (e.detail || 0) / 3) * (IMW.zoom));
                IM._scale.setScale();
            },
            setScale: function (src) {
                var that = IM._scale,
                    canvas = IM.canvas,
                    cxt = IM.canvas.getContext('2d'),
                    img = IM.img,
                    x = Math.ceil(that.x),
                    y = Math.ceil(that.y),
                    w = Math.max(img.width * that.x, 1),
                    h = Math.max(img.height * that.y, 1);

                w = parseInt(w, 10),h = parseInt(h, 10);

                if (IMW.scaleLock) {
                    w = Math.min(w, IM.availSize[0]),h = Math.min(h, IM.availSize[1]);
                    if (w === IM.availSize[0] || h === IM.availSize[1]) {
                        return false
                    }
                }

                IMW.scaleDataSize === true && this.upInfo(w, h, canvas.toDataURL('image/jpeg').length);
                cxt.clearRect(0, 0, canvas.width, canvas.height);
                cxt.scale(that.x, that.y);
                canvas.width = w;
                canvas.height = h;
                src === 1 || (
                    that.ch.value = parseInt(Math.ceil(w / that.w * 100), 10),that.cw.value = parseInt(Math.ceil(h / that.h * 100), 10));

                that.dw.innerHTML = isNaN(w) ? 1 : w;
                that.dh.innerHTML = isNaN(h) ? 1 : h;

                cxt.drawImage(img, 0, 0, w, h);
            },
            getScale: function () {
                function zoom(s, z) {
                    return s > 0 && s > -z ? z : s < 0 && s < z ? -z : 0;
                }

                return function (z) {
                    if (z) {
                        var hZoom = zoom(this.y, z),
                            vZoom = zoom(this.x, z);
                        if (hZoom && vZoom) {
                            this.y += hZoom,this.x += vZoom;
                            this.x = Math.min(this.x, IMW.scaleType / 100);
                            this.y = Math.min(this.y, IMW.scaleType / 100);
                        }
                    }
                }
            }(),
            destroy: function () {
                var that = this;
                this.button.disabled = 'true';
                //that.cw.value = that.cw.defaultValue;
                //that.ch.value = that.ch.defaultValue;
                IM.tk.removeEvent(that.rest, 'click', that.restIamge, false);
                try {
                    IM.tk.removeEvent(that.container, that.wheel, that.zoom, false);
                } catch (e) {
                }
                //IM.img.src=that.canvas.toDataURL('image/jpeg');
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////////
        IM._rotate = { //57��17'44.806' һ����
            a: 1,
            b: -1,
            m: 0,
            canvas: null,
            init: function () {
                try {
                    IM.clip.area && IM._clip.removeArea();
                    IM._scale.destroy();
                } catch (e) {
                }

                var that = IM._rotate,
                    canvas = IM.canvas,
                    cxt = IM.canvas.getContext('2d');

                that.canvas = canvas;

                that.handers = doc.getElementById(IMW.rotateHandler);
                that.r = 0;
                that.button = doc.getElementById('Button' + IM.editing);
                IM.img.src = canvas.toDataURL('image/jpeg');
                IM.tk.addEvent(that.handers, 'click', that.addEvent, false);
            },
            restButton : function () {
                IM.workSpace.buttonReset(this.button);
            },
            addEvent: function (e) {
                e = tk.getEvent(e);
                var that = IM._rotate,
                    target = tk.getTarget(e),
                    t = null;

                if (target.nodeType === 1 && target.nodeName.toLowerCase() === 'img') {
                    t = target.getAttribute('alt');
                    ({
                        l: function () {
                            (that.m == 0) ? that.m = 3 : that.m--;
                            that.left();
                            that.setRotate(1);
                        },
                        r: function () {
                            (that.m == 3) ? that.m = 0 : that.m++;
                            that.right();
                            that.setRotate(1);
                        },
                        v: function () {
                            that.a *= -1,that.b *= -1,that.vertical(),that.setRotate();
                        },
                        h: function () {
                            that.b *= -1,that.a *= -1,that.horizontal(),that.setRotate();
                        }
                    })[t]();
                }
                IM.tk.stopEvent(e);
            },
            vertical: function () {
                this.r = Math.PI - this.r;
            },
            horizontal: function () {
                this.r = Math.PI - this.r;
            },
            rotate: function (n) {
                this.r = n;
            },
            left: function () {
                /*this.r -= 90;
                 if(this.r === -90){
                 this.r = 270;
                 };this.setRotate(1)*/

                this.r -= Math.PI / 2;
            },
            right: function () {
                /*this.r += 90;
                 this.setRotate(1);
                 if(this.r === 270){
                 this.r = -90;
                 };*/

                this.r -= Math.PI / 2;
            },
            setRotate: function (n) {
                var that = IM._rotate,
                    canvas = IM.canvas,
                    cxt = IM.canvas.getContext('2d'),
                    img = IM.img,
                    rules = null,
                    w = img.width,
                    h = img.height;

                cxt.clearRect(0, 0, canvas.width, canvas.height);
                cxt.save();

                rules = {
                    0: function () {
                        canvas.setAttribute('width', w);
                        canvas.setAttribute('height', h);
                        cxt.rotate(0 * Math.PI / 180);
                        cxt.drawImage(img, 0, 0);
                        //console.log(1);
                    },
                    1: function () {
                        canvas.setAttribute('width', h);
                        canvas.setAttribute('height', w);
                        cxt.rotate(90 * Math.PI / 180);
                        cxt.drawImage(img, 0, -h);
                        //console.log(2);
                    },
                    2: function () {
                        canvas.setAttribute('width', w);
                        canvas.setAttribute('height', h);
                        cxt.rotate(180 * Math.PI / 180);
                        cxt.drawImage(img, -w, -h);
                        //console.log(2);
                    },
                    3: function () {
                        canvas.setAttribute('width', h);
                        canvas.setAttribute('height', w);
                        cxt.rotate(270 * Math.PI / 180);
                        cxt.drawImage(img, -w, 0);
                        //console.log(4);
                    }

                };
                n && (rules)[that.m]()

                //ˮƽ��ֱ��ת
                n || (

                    //cxt.translate(0,w),
                    //cxt.rotate(this.r),
                    //cxt.rotate(180*Math.PI/180),
                    cxt.transform(that.a, 0, 0, that.b, 0, 0),cxt.drawImage(img, -w, 0)


                    );
                cxt.restore();
                //IM.img=canvas.toDataURL('image/jpeg');
            },
            destroy: function () {
                this.button.disabled = 'true';
                IM.tk.removeEvent(this.handers, 'click', this.addEvent, false);
                //IM.img.src=this.canvas.toDataURL('image/jpeg');
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////////
        IM._mark = {
            init: function () {
                try {
                    IM.clip.area && (IM._clip.removeArea());
                    IM._scale.destroy();
                } catch (e) {
                }
                var that = IM._mark,
                    canvas = IM.canvas;
                that.cxt = IM.canvas.getContext('2d');
                that.canvas = canvas;
                IM.img.src = canvas.toDataURL('image/jpeg');

                //that.title=doc.getElementById('IM_'+IMW.Function[4]);
                that.markers = doc.getElementById(IMW.watermarkCon);
                that.control || (that.control = null);
                that.preview || (that.preview = null);
                that.xy || (that.xy = null);
                that.markSrc || (that.markSrc = null);
                that.handers = doc.getElementById(IMW.watermarkControl);
                that.preview = IM.tk.getHtmlElement('canvas');
                IM.markPreview = that.preview;
                that.content = that.preview.getContext('2d');
                //that.cancel=doc.getElementById(IMW.watermarkCancel);
                //that.OP = doc.getElementById(IMW.watermarkOP);
                /*that.opacity = IMW.watermarkOpacity;*/
                that.buttons = doc.getElementById('watermarkControl').getElementsByTagName('input');
                that.button = doc.getElementById('Button' + IM.editing);
                that.markerList = that.markers.getElementsByTagName('li');
	            that.imageLists = that.markers.getElementsByTagName('img');
                that.buttonInit.call(that);

                //IM.tk.addEvent(that.cancel,'click',function(){that.removePreview.call(that)},false);
                IM.tk.addEvent(that.handers, 'click', that.addEvent, false);


                IM.tk.addEvent(that.markers, 'click', that.markersEvent, false);
                //IM.tk.addEvent(that.OP, 'change', that.getWatermarkOpacity, false);

                IM.tk.trigger(that.buttons[that.buttons.length-1],'click');
                IM.tk.trigger(that.imageLists[0],'click');

                /*IM.tk.addEvent(that.OP, 'change', function() {
                    that.restButton();
                }, false);*/
                that.restButton();
                //that.hiddenMark();
            },
            restButton : function () {
                IM.workSpace.buttonReset(this.button);
            },
            hiddenMark: function () {
                this.markers.style.visibility = 'hidden';
                this.cancel.style.visibility = 'hidden';
            },
            buttonInit: function () {
                IM.tk.each(this.button, function (a, b) {
                    b.className = '';
                });
            },
            getWatermark: function (src, alpha) {
                var that = IM._mark,
                    markImg = new Image,
                    content = null;

                //alpha = ((alpha === 0 || undefined === alpha) ? 1 : alpha);

                markImg.onload = function () {

                    that.preview.width = this.width;
                    that.preview.height = this.height;
                    that.content.drawImage(markImg, 0, 0);
                    var IMG = that.content.getImageData(0, 0, this.width, this.height),
                        data = IMG.data,
                        len = data.length,
                        i = 3;

                    /*if(src.indexOf('png')===-1){
                        for (; i < len; i += 4) {
                            data[i] = alpha * 2.55
                        }
                    };*/
                    markImg.src = null;
                    markImg.onload = null;
                    IMG.data = data;

                    //that.preview.width=0;
                    //that.preview.height=0;
                    that.content.putImageData(IMG, 0, 0);
                    //markImg.src = that.preview.toDataURL();
                    that.markSrc = that.preview.toDataURL();

                    /*if (that.canvas.width > markImg.width && that.canvas.height > markImg.height) {
                     that.previewMark(markImg);
                     } else {
                     alert('ˮӡ�ߴ粻�ܴ���ͼƬ�ߴ�');
                     that.removePreview();
                     return false;
                     };*/
                    //canvas=null;
                };
                markImg.src = src;
                that.cxt.restore();
            },
            getWatermarkOpacity: function (e) {
                e = IM.tk.getEvent(e);
                var that = IM._mark,
                    target = IM.tk.getTarget(e),
                    value = parseInt(this.value, 10);

                value >= 100 && (this.value = 100);
                value < 0 && (this.value = 0);

                if (!isNaN(value) && value >= 0) {
                    value >= 100 && (this.value = 100);
                    that.opacity = value;
                }
                //that.markSrc && (
                that.getWatermark(that.markSrc, that.opacity)
                //);
            },
            addEvent: function (e) {

                e = IM.tk.getEvent(e);
                var target = IM.tk.getTarget(e),
                    that = IM._mark;

                /*if(target.nodeType===1 && target.nodeName.toLowerCase()==='img'){
                 ({
                 'waterMark':function(){
                 that.markSrc=target.src;
                 },
                 'waterMarkClose':function(){
                 var p=target.parentNode;
                 while(p.nodeName.toLowerCase()!=='table'){
                 p=p.parentNode;
                 };
                 p.parentNode.children.length>1 && p.parentNode.removeChild(p);
                 }
                 })[target.className]()
                 }*/
                if (target.nodeType === 1 && target.nodeName.toLowerCase() === 'input') {
                    //that.markers.style.visibility='visible';
                    //that.cancel.style.visibility='visible';
                    that.control = target.id.replace(/wm/g, '');
                    that.buttonInit.call(that);
                    IM.tk.each(that.buttons, function(a, b) {
                        b.className = '';
                    });

                    that.button.disabled === true && (
                        that.restButton()
                    );

                    target.className = 'markPosition';

                    //that.rules.TL.call(that.canvas);
                }
            },
            markersEvent: function (e) {
                var target = IM.tk.getTarget(e),that = IM._mark;
                if (target.nodeType === 1 && target.nodeName.toLowerCase() === 'img') {
                    /*({
                        'waterMark': function () {
                            IM.tk.each(that.markerList, function(a, b) {

                                b.removeAttribute('class');
                            });
                            that.button.disabled === true && (
                                that.restButton()
                            );
                            //target.parentNode.className = 'watermarkHl';
	                        target.className = 'watermarkHl';
                            that.getWatermark(target.src*//*, that.opacity*//*);
                        }
                    })[target.className]();*/

	                IM.tk.each(that.imageLists, function(a, b) {
						b.removeAttribute('class');
					});
					that.button.disabled === true && (
						that.restButton()
					);
					target.className = 'watermarkHl';
					that.getWatermark(target.src/*, that.opacity*/);

                }
            },
            rules: {
                TL: function (w, h) {
                    return [10, 10];
                },
                TC: function (w, h) {
                    return [(this.width - w) / 2, 10];
                },
                TR: function (w, h) {
                    return [this.width - w - 10, 10];
                },
                CL: function (w, h) {
                    return [10, (this.height - h) / 2];
                },
                CC: function (w, h) {
                    return [(this.width - w) / 2, (this.height - h) / 2];
                },
                CR: function (w, h) {
                    return [this.width - w - 10, (this.height - h) / 2];
                },
                BL: function (w, h) {
                    return [10, this.height - h - 10];
                },
                BC: function (w, h) {
                    return [(this.width - w) / 2, this.height - h - 10];
                },
                BR: function (w, h) {
                    return [this.width - w - 10, this.height - h - 10];
                }
            },
            previewMark: function (src) {
                var that = this,img = new Image;
                img.onload = function () {
                    that.xy = that.getXY(img);
                    that.canvas.parentNode.appendChild(that.preview);
                    that.preview.style.cssText = 'position:absolute;left:' + that.xy[0] + 'px;top:' + that.xy[1] + 'px;';//visibility:hidden;
                    that.content.drawImage(this, 0, 0);
                }
                img.src = src;
            },
            getMark: function () {
                var that = IM._mark,
                    temp = IM.config.dataURL.waterMark,
                    parent = doc.getElementById(IMW.watermarkCon),
                    ul = IM.tk.getHtmlElement('ul');
                parent.innerHTML = '';
                IM.tk.dynamicScriptProxy(temp.url, temp.param, function (b) {
                    IM.tk.each(b, function (x, y) {
                        var li = IM.tk.getHtmlElement('li'),
                            radio = IM.tk.getHtmlElement('input'),
                            img = IM.tk.getHtmlElement('img');

                        img.src = b[x].img;
                        img.className = 'waterMark';
                        //radio.type='radio';
                        //radio.name='waterMark';
                        //li.appendChild(radio);
                        li.appendChild(img);
                        ul.appendChild(li);
                    });
                    parent.appendChild(ul);
                });
            },
            getXY: function (img) {
                if (!this.control) {
                    return false;
                }
                return this.rules[this.control].call(this.canvas, img.width, img.height);
            },
            uploadImg: function () {
                var that = this,img = new Image;
                if (that.markSrc == null) {
                    //alert('��ѡ��ˮӡ');
                    IM.dailog({name:'uploadTips',title:'��ʾ',html:'<p>��ѡ��ˮӡ!</p><p>2����Զ��ر�</p>',width:300,height:100},function(){
                        var that=this;
                        setTimeout(function(){that.removeDailog()},2000);
                    });
                    setTimeout(function() {
                        IM.workSpace.buttonReset(that.button)
                    }, 200);
                    return false;
                }
                img.onload = function () {
                    that.xy = that.getXY(img);
                    if (that.xy === false) {
                        //alert('��ѡ��ˮӡλ��');
                        IM.dailog({name:'uploadTips',title:'��ʾ',html:'<p>��ѡ��ˮӡλ��!</p><p>2����Զ��ر�</p>',width:300,height:100},function(){
                            var that=this;
                            setTimeout(function(){that.removeDailog()},2000);
                        });
                        IM.workSpace.buttonReset(that.button);
                        return false;
                    }
                    //that.canvas.parentNode.appendChild(that.preview);
                    //that.preview.style.cssText = 'position:absolute;left:' + that.xy[0] + 'px;top:' + that.xy[1] + 'px;';//visibility:hidden;
                    //that.content.drawImage(this, 0, 0);
                    //try {
                    that.cxt.drawImage(img, that.xy[0], that.xy[1]);
                    //} catch (e) {}
                    that.button.disabled = 'true';
                };
                img.src = that.markSrc;
            },
            removePreview: function () {
                var that = this //IM._mark;
                try {
                    that.canvas.parentNode.removeChild(that.preview);
                    that.preview.width = 0,that.preview.height = 0;
                } catch (e) {
                }
            },
            destroy: function () {
                this.uploadImg();

                //this.removePreview();
                //this.hiddenMark();
                //IM.tk.('click',that.title)
                //IM.tk.removeEvent(this.handers,'click',this.addEvent,false);
                //IM.tk.addEvent(this.cancel,'click',that.removePreview,false);
                //this.preview=null;
            }
        };
        IM.tk.addEvent(window, 'load', function() {
            //window['$'] = null;
        }, false);
        if (window === this || 'indicator' in this) {
            return new indicator;
        }
    };
    imageMagic.workSpace || (imageMagic.workSpace = new WorkSpace());

}(window);
