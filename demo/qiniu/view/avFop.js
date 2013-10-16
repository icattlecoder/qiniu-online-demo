Ext.define('EP.view.qiniu.avFop', {
    extend: 'Ext.form.Panel',
    alias: 'widget.avFop',
    layout: 'border',
    glyph: 42,
    initComponent: function() {
        var loadImg = function(v) {
            if (!form.isValid()) {
                Ext.msg.alert("提示", "图片地址输入有误");
                return;
            }
            Ext.getCmp("txt_imgInfoApi").setValue("<div style=\"color:blue;word-break: break-all;\">" + v + "?imageInfo</div>")
            Ext.getCmp("txt_exifInfoApi").setValue("<div style=\"color:blue;word-break: break-all;\">" + v + "?exif</div>")
            Ext.getCmp("img_disp").setSrc(v);
            panel_ImgInfo.update('<iframe width="100%" height="90%" id="frame_imgInfo" src="' + v + '?imageInfo" />');
            panel_ExifInfo.update('<iframe id="iframeexif"  width="100%" height="90%" id="frame_exifInfo2" src="' + v + '?exif" />')
            Ext.getCmp("disp_preview").setValue("<div style=\"color:blue;word-break: break-all;\"><a target=\"_blank\" href=" + v + ">" + v + "</a></div>")
            panel.expand();
        }
        var form = new Ext.form.Panel({
            region: 'center',
            border: false,
            fieldDefaults: {
                labelWidth: 60
            },
            defaultType: 'textfield',
            bodyPadding: 5,
            items: [{
                fieldLabel: '视频地址',
                anchor: '100%',
                name: 'imgSrc',
                emptyText: 'eg. http://cyj.qiniudn.com/22734/1359639667984p17i8ddoi31ara1ccp1njsq319s62.jpg',
                vtype: 'url',
                value: 'http://open.qiniudn.com/thinking-in-go.mp4',
                id: "txt_avSrcHref"
            }, {
                xtype: 'button',
                text: "加载图片",
                handler: function() {
                    var v = Ext.getCmp("txt_imgSrcHref").getValue();
                    loadImg(v);
                }
            }, {
                xtype: 'fieldset',
                title: '预览',
                items: [{
                    xtype: 'box',
                    id: 'av_disp',
                    autoEl: {
                        tag: 'video',
                        src: 'http://open.qiniudn.com/thinking-in-go.mp4',
                        width:600
                    }
                }]
            }],
            bbar: [{
                fieldLabel: "预览地址",
                xtype: 'displayfield',
                value: "",
                id: "disp_preview"
            }]
        });

        var panel_ImgInfo = Ext.create('Ext.form.Panel', {
            title: '图片基本信息',
            bodyPadding: 10,
            items: [{
                xtype: 'displayfield',
                fieldLabel: 'GET请求',
                anchor: '100%',
                name: 'imgSrc',
                id: 'txt_imgInfoApi',
                value: ''
            }]
        });

        var panel_ExifInfo = Ext.create('Ext.form.Panel', {
            title: '图片EXIF信息',
            bodyPadding: 10,
            items: [{
                xtype: 'displayfield',
                fieldLabel: 'GET请求',
                anchor: '100%',
                name: 'imgSrc',
                id: 'txt_exifInfoApi',
                value: ''
            }]
        });

        var panel_imageView = Ext.create('Ext.form.Panel', {
            title: '缩略图',
            border: true,
            bodyPadding: 20,
            items: [{
                    xtype: 'radiogroup',
                    fieldLabel: 'Mode',
                    columns: 2,
                    name: "imageView",
                    defaults: {
                        name: 'modetype'
                    },
                    items: [{
                        inputValue: '1',
                        id: 'rdo_modetype',
                        checked: true,
                        boxLabel: 'Mode=1'
                    }, {
                        inputValue: '2',
                        boxLabel: 'Mode=2'
                    }]
                }, {
                    xtype: "numberfield",
                    id: "num_width",
                    fieldLabel: "Width",
                    name: "w",
                    minValue: 1
                }, {
                    xtype: "numberfield",
                    id: "num_height",
                    name: "h",
                    fieldLabel: "Height",
                    minValue: 1
                },
                Ext.create('Ext.slider.Single', {
                    fieldLabel: "Quality",
                    width: 250,
                    id: "num_quality",
                    value: 80,
                    name: "Quality",
                    isFormField: true,
                    minValue: 0,
                    maxValue: 100
                }), {
                    id: 'txt_format',
                    xtype: 'combobox',
                    fieldLabel: 'Format',
                    displayField: 'formattxt',
                    name: 'Format',
                    valueField: 'format',
                    emptyText: '选择图片格式',
                    queryMode: 'local',
                    allowBlank: false,
                    margins: '0 6 0 0',
                    store: new Ext.data.Store({
                        fields: ['formattxt', 'format'],
                        data: (function() {
                            var formats = ["jpg", "webp", "gif", "png"]
                            var data = [];
                            for (i = 0; i < formats.length; i++) {
                                data[i] = {
                                    'formattxt': formats[i],
                                    'format': formats[i]
                                };
                            }
                            return data;
                        })()
                    }),
                    forceSelection: true
                }, {
                    xtype: "displayfield",
                    noCal: true,
                    id: 'disp_imageViewUrl'
                }
            ],
            buttons: [{
                "text": "预览",
                handler: function() {
                    var v = Ext.getCmp("txt_imgSrcHref").getValue();
                    v += "?" + formEncoded(panel_imageView).substring(1);
                    Ext.getCmp("disp_preview").setValue("<div style=\"color:blue;word-break: break-all;\"><a target=\"_blank\" href=" + v + ">" + v + "</a></div>")
                    Ext.getCmp("img_disp").setSrc(v);
                }
            }]
        });
        var radio_imageMogr;
        var panel_imageMogr = Ext.create('Ext.form.Panel', {
            title: '高级处理（缩略、裁剪、旋转、转化）',
            border: true,
            bodyPadding: 20,
            items: [{
                    xtype: 'fieldset',
                    noCal:true,
                    title: '缩略图(thumbnail)',
                    defaultType: 'textfield',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        xtype: 'radiogroup',
                        name: "mtype",
                        columns: 2,
                        id: "radio_imageMogr",
                        defaults: {
                            name: "mtype"
                        },
                        items: [{
                            inputValue: '1',
                            boxLabel: '%等比缩放'
                        }, {
                            inputValue: '3',
                            boxLabel: '限宽，高等比自适应'
                        }, {
                            inputValue: '4',
                            boxLabel: '限高，宽等比自适应'
                        }, {
                            inputValue: '5',
                            boxLabel: '宽和高强行缩略'
                        }],
                        listeners: {
                            change: function(thiz, newv, old, eopts) {
                                radio_imageMogr = newv;
                            }
                        }
                    }, {
                        xtype: "numberfield",
                        fieldLabel: "Width",
                        minValue: 1,
                        id: "num_widthx",
                        noCal: true,
                    }, {
                        xtype: "numberfield",
                        fieldLabel: "Height",
                        id: "num_heightx",
                        minValue: 1,
                        noCal: true,
                    }]
                }, {
                    xtype: "displayfield",
                    name: "thumbnail",
                    id: "dsp_thumbnail",
                    hidden: true,
                    getValue: function() {
                        if (!radio_imageMogr) {
                            return "";
                        }
                        var v = "!",
                            w = Ext.getCmp("num_widthx").getValue(),
                            h = Ext.getCmp("num_heightx").getValue();
                        switch (radio_imageMogr.mtype) {
                            case "1":
                                {
                                    v += w + "p";
                                }
                                break;
                            case "2":
                                {
                                    v += w + "pxx" + h + "p";
                                }
                                break;
                            case "3":
                                {
                                    v += w;
                                }
                                break;
                            case "4":
                                {
                                    v += "x" + h;
                                }
                                break;
                            case "5":
                                {
                                    v += w + "x" + h + "!";
                                }
                                break;
                        }
                        return v;
                    }
                },
                gravity("x2","位置"), {
                    xtype: "displayfield",
                    name: "crop",
                    id: "disp_crop",
                    hidden: true
                }, {
                    xtype: "button",
                    text: "裁剪",
                    noCal: true,
                    handler: function() {
                        var me = this;
                        var w = Ext.getCmp("img_disp").getWidth();
                        var h = Ext.getCmp("img_disp").getHeight();
                        $("#img_disp").Jcrop({
                            onSelect: me.getCoords,
                            onChange: me.getCoords
                        }, function() {
                            jcrop_api = this;
                            jcrop_api.animateTo([w/4, h/4, w*0.75, h*0.75]);
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                        });
                    },
                    getCoords: function(c) {
                        if (parseInt(c.w) > 0) {
                            Ext.getCmp("disp_crop").setValue("!" + c.w + "x" + c.h + "a" + c.x + "a" + c.y);
                        }
                    }
                },
                Ext.create('Ext.slider.Single', {
                    fieldLabel: "图片质量(Quality)",
                    anchor: "100%",
                    name: "quality",
                    value: 80,
                    isFormField: true,
                    minValue: 0,
                    maxValue: 100
                }),
                Ext.create('Ext.slider.Single', {
                    fieldLabel: "旋转角度(rotate)",
                    name: "rotate",
                    anchor: "100%",
                    value: 30,
                    isFormField: true,
                    minValue: 0,
                    maxValue: 360
                }), {
                    xtype: 'combobox',
                    fieldLabel: 'Format',
                    displayField: 'formattxt',
                    valueField: 'format',
                    emptyText: '选择图片格式',
                    name: "format",
                    queryMode: 'local',
                    allowBlank: false,
                    margins: '0 6 0 0',
                    store: new Ext.data.Store({
                        fields: ['formattxt', 'format'],
                        data: (function() {
                            var formats = ["jpg", "webp", "gif", "png"]
                            var data = [];
                            for (i = 0; i < formats.length; i++) {
                                data[i] = {
                                    'formattxt': formats[i],
                                    'format': formats[i]
                                };
                            }
                            return data;
                        })()
                    }),
                    forceSelection: true
                }, {
                    xtype: "displayfield",
                }
            ],
            buttons: [{
                "text": "预览",
                handler: function() {
                    if (jcrop_api) {
                        jcrop_api.destroy();
                        $("#img_disp").css("visibility", "visible");
                        $("#img_disp").css("width", "");
                        $("#img_disp").css("height", "");
                        Ext.getCmp("img_disp").show();
                    }
                    var v = Ext.getCmp("txt_imgSrcHref").getValue();
                    v += "?imageMogr/v2/auto-orient";
                    v += formEncoded(panel_imageMogr);
                    console.log("v=", v)
                    Ext.getCmp("disp_preview").setValue("<div style=\"color:blue;word-break: break-all;\"><a target=\"_blank\" href=" + v + ">" + v + "</a></div>")
                    Ext.getCmp("img_disp").setSrc(v);
                }
            }]
        });

        var panel_watermark = Ext.create('Ext.form.Panel', {
            title: '水印',
            border: true,
            fieldDefaults: {
                labelWidth: 140
            },
            defaultType: 'textfield',
            bodyPadding: 5,
            items: [{
                    xtype: 'radiogroup',
                    fieldLabel: 'Mode',
                    name: 'watermark',
                    columns: 2,
                    defaults: {
                        name: 'wmmtype'
                    },
                    items: [{
                        inputValue: '2',
                        checked: true,
                        boxLabel: '文字水印'
                    }, {
                        inputValue: '1',
                        boxLabel: '图像水印'
                    }],
                    listeners: {
                        change: function(thiz, newv, old, eopts) {
                            switch (newv.wmmtype) {
                                case "2": //text
                                    {
                                        Ext.getCmp("txt_wmText").show();
                                        Ext.getCmp("txt_wmFont").show();
                                        Ext.getCmp("txt_wmFontSize").show();
                                        Ext.getCmp("txt_fontcolor").show();
                                        Ext.getCmp("cp_wmcp").show();
                                        Ext.getCmp("txt_wmImage").hide();
                                    }
                                    break;
                                case "1":
                                    {
                                        Ext.getCmp("txt_wmText").hide();
                                        Ext.getCmp("txt_wmFont").hide();
                                        Ext.getCmp("txt_wmFontSize").hide();
                                        Ext.getCmp("txt_fontcolor").hide();
                                        Ext.getCmp("cp_wmcp").hide();
                                        Ext.getCmp("txt_wmImage").show();
                                    }
                                    break;
                            }
                        }
                    }
                }, {
                    name: "image",
                    B64: true,
                    id: "txt_wmImage",
                    hidden: true,
                    fieldLabel: "水印图片(image)"
                }, {
                    name: "text",
                    allowBlank: false,
                    id: 'txt_wmText',
                    fieldLabel: "文字(text)",
                    emptyText: "eg. 七牛云存储,必填",
                    B64: true,
                }, {
                    name: "font",
                    id: 'txt_wmFont',
                    B64: true,
                    emptyText: "eg. 宋体,必填",
                    fieldLabel: "字体(font)"
                }, {
                    id: 'txt_wmFontSize',
                    name: "fontsize",
                    xtype: "numberfield",
                    allowBlank: false,
                    emptyText: "eg. 1000,单位：缇",
                    fieldLabel: "字体大小(fontSize)"
                }, {
                    fieldLabel: "字体颜色",
                    name: "fill",
                    B64: true,
                    xtype: 'displayfield',
                    id: 'txt_fontcolor',
                    hidden: true
                }, {
                    id: 'cp_wmcp',
                    xtype: 'colorpicker',
                    allowReselect: true,
                    focus: Ext.emptyFn,
                    noCal: true,
                    value: "333399",
                    colors: ['000000', '333300', '333399', '008080', '666699', '99CC00', '339966', '3366FF', 'FFCC00', '00CCFF', 'C0C0C0', 'FFFF99', 'CCFFFF', 'FFFFFF'],
                    style: {
                        width: "350px",
                        height: "20px"
                    },
                    handler: function(cp, color) {
                        Ext.getCmp("txt_fontcolor").setValue("#" + color);
                    }
                },
                Ext.create('Ext.slider.Single', {
                    name: "dissolve",
                    fieldLabel: "透明度(Dissolve)",
                    anchor: "100%",
                    value: 80,
                    isFormField: true,
                    minValue: 0,
                    maxValue: 100
                }), gravity("x1"), {
                    name: "dx",
                    xtype: "numberfield",
                    emptyText: "eg. 10",
                    fieldLabel: "横向边距(DistanceX)"
                }, {
                    name: "dy",
                    xtype: "numberfield",
                    emptyText: "eg. 10",
                    fieldLabel: "纵向边距(DistanceY)"
                }
            ],
            buttons: [{
                "text": "预览",
                handler: function() {
                    var v = Ext.getCmp("txt_imgSrcHref").getValue();
                    v += "?";
                    v += formEncoded(panel_watermark).substring(1);
                    console.log("v=", v)
                    Ext.getCmp("img_disp").setSrc(v);
                    Ext.getCmp("disp_preview").setValue("<div style=\"color:blue;word-break: break-all;\"><a target=\"_blank\" href=" + v + ">" + v + "</a></div>")
                    return;
                }
            }]
        });

        var panel = Ext.create('Ext.panel.Panel', {
            layout: 'accordion',
            region: 'west',
            split: true,
            collapsible: true,
            collapsed: true,
            items: [panel_ImgInfo, panel_ExifInfo, panel_imageView, panel_imageMogr, panel_watermark],
            width: 400
        })

        this.items = [form, panel];
        this.callParent();
    },
    initEvents: function() {
        // alert("lsdjf")
    },
    onSelectionChange: function(model, records) {},
    renderStatus: function(val) {},
    renderType: function(val) {},
    renderContact: function(val) {},
    listeners: {
        beforeshow: function(thiz, opts) {}
    },
    reload: function(argument) {}
});
