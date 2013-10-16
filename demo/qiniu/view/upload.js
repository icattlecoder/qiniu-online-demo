App = {
    Bucket: "qtestbucket",
    SignUrl: "token.php",
    //test account
    AK: "iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV",
    SK: "6QTOr2Jg1gcZEWDQXKOGZh5PziC2MCV5KsntT70j"
}
Q.Bucket(App.Bucket);
// Q.SignUrl(App.SignUrl);

Ext.define('EP.view.qiniu.Qupload', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.Qupload',
    layout: 'border',
    glyph: 42,
    initComponent: function() {
        var progressbar = Ext.create('Ext.ProgressBar', {
            width: 500,
            hidden: true
        });
        var Bigupform = new Ext.form.Panel({
            title: '断点续上传',
            border: false,
            fieldDefaults: {
                width: 500
            },
            defaultType: 'textfield',
            bodyPadding: 5,
            items: [{
                    id: 'txt_upload_key',
                    name: 'txt_upload_key',
                    allowBlank: false,
                    emptyText:'可选，若不指定则自动生成',
                    fieldLabel: 'key'
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'upToken',
                    width: 500,
                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',
                    defaults: {
                        hideLabel: 'true'
                    },
                    items: [{
                        name: 'txt_upload_token',
                        id: 'txt_upload_token',
                        xtype: 'textarea',
                        readOnly:true,
                        emptyText: '填写key后点击右边按钮生成,key可以为空',
                        width: 310,
                        height: 80,
                        allowBlank: false
                    }, {
                        xtype: "button",
                        margins: '0 0 0 6',
                        text: "生成token",
                        handler: function() {
                            var policy = new Object();
                            policy.scope = App.Bucket;
                            var key = Ext.getCmp("txt_upload_key").getValue();
                            if (key) {
                                policy.scope += (":" + key);
                            }
                            var deadline = Math.round(new Date().getTime() / 1000) + 2 * 3600
                            policy.deadline = deadline;
                            var token = genToken(App.AK, App.SK, policy);
                            Ext.getCmp("txt_upload_token").setValue(token);
                        }
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: '路径',
                    width: 500,
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        hideLabel: 'true'
                    },
                    items: [{
                        xtype: 'filefield',
                        name: 'photo',
                        msgTarget: 'side',
                        width: 345,
                        allowBlank: false,
                        buttonText: '选择文件',
                        id: "fileselect"
                    }, {
                        xtype: "button",
                        margins: '0 0 0 6',
                        text: "上传",
                        handler: function() {
                            if (!Bigupform.isValid()) {
                                return;
                            }
                            var token = Ext.getCmp("txt_upload_token").getValue().trim();
                            var key = Ext.getCmp("txt_upload_key").getValue().trim();

                            var up_result = Ext.getCmp("up_result");
                            up_result.hide();
                            Q.addEvent("progress", function(p, s) {
                                progressbar.updateProgress(p / 100.0, s, true);
                            });
                            //上传完成回调
                            //fsize:文件大小(MB)
                            //res:上传返回结果，默认为{hash:<hash>,key:<key>}
                            Q.addEvent("putFinished", function(fsize, res, taking) {
                                uploadSpeed = 1024 * fsize / (taking * 1000);
                                if (uploadSpeed > 1024) {
                                    formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
                                } else {
                                    formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                                };
                                progressbar.hide();
                                up_result.show();
                                var tpl = new Ext.XTemplate(
                                    '<ul>',
                                    '<li>文件地址:<a target="_blank" href="http://qtestbucket.qiniudn.com/{key}">http://qtestbucket.qiniudn.com/{key}<a></li>',
                                    '<li>hash值 :{hash}</li>',
                                    '<li>平均速度:{speed}</li>',
                                    '</ul>'
                                );
                                var res = {
                                    key: res.key,
                                    hash: res.hash,
                                    speed: formatSpeed
                                };
                                tpl.overwrite(up_result.body, res);
                                up_result.doLayout();
                                // up_result.update(html);
                            });
                            var o = Ext.getCmp("fileselect");
                            Q.Upload(o.fileInputEl.dom.files[0], key, token);
                            progressbar.show();
                        }
                    }]
                },
                progressbar, {
                    xtype: 'fieldset',
                    title: '上传结果',
                    collapsible: true,
                    hidden: true,
                    bodyPadding: 10,
                    width: 500,
                    id: "up_result",
                }
            ]
        });

        var htmlupform = new Ext.Panel({
            title: 'HTML表单上传',
            border: false,
            bodyPadding: 5,
            html: '<iframe width="800px" height="400px" src="http://qtestbucket.qiniudn.com/demo/formupload.html"> </iframe><div>HTML表单上传可以演示Callback与returnBack</div>'
        });

        this.items = [Bigupform, htmlupform];
        this.callParent();
    },
    initEvents: function() {},
    onSelectionChange: function(model, records) {},
    renderStatus: function(val) {},
    renderType: function(val) {},
    renderContact: function(val) {},
    listeners: {
        beforeshow: function(thiz, opts) {}
    },
    reload: function(argument) {}
});
