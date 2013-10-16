var safe64 = function(base64) {
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
}

genToken = function(accessKey, secretKey, putPolicy) {

    var setStep = function(id, val) {
        Ext.getCmp(id).setValue("<div style=\"color:blue;word-break: break-all;font-size:18px;line-height:28px;\"><b>" + val + "</b></div>");
    }
    //SETP 2
    var put_policy = JSON.stringify(putPolicy);
    console.log("put_policy = ", put_policy);
    setStep("disp_step2", put_policy);

    //SETP 3
    var encoded = base64encode(utf16to8(put_policy));
    console.log("encoded = ", encoded);
    setStep("disp_step3", encoded);

    //SETP 4
    var hash = CryptoJS.HmacSHA1(encoded, secretKey);
    var encoded_signed = hash.toString(CryptoJS.enc.Base64);
    setStep("disp_step4", encoded_signed);

    //SETP 5
    var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
    setStep("disp_step5", upload_token);

    return upload_token;
};

var tokenPanel_policy = new Ext.form.Panel({
    region: 'center',
    fieldDefaults: {
        labelWidth: 100
    },
    defaultType: 'textfield',
    bodyPadding: 10,
    items: [{
        id: 'txt_accessKey',
        fieldLabel: 'accessKey',
        width: 500,
        allowBlank: false,
        value: 'iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV',
        name: 'accessKey'
    }, {
        id: 'txt_secretKey',
        fieldLabel: 'secretKey',
        width: 500,
        allowBlank: false,
        value: '6QTOr2Jg1gcZEWDQXKOGZh5PziC2MCV5KsntT70j',
        name: 'secretKey'
    }, {
        id: 'txt_bucketName',
        fieldLabel: 'bucketName',
        width: 500,
        allowBlank: false,
        value: 'qtestbucket',
        name: 'bucketName'
    }, {
        id: 'txt_key',
        fieldLabel: 'key',
        emptyText: '可选',
        width: 500,
        name: 'key'
    }, {
        id: 'adgp_type',
        xtype: 'radiogroup',
        width: 500,
        fieldLabel: 'Back类型',
        columns: 3,
        defaults: {
            name: 'type'
        },
        items: [{
            inputValue: 'none',
            id: 'rdo_nonetype',
            checked: true,
            boxLabel: '不使用'
        }, {
            inputValue: 'return',
            id: 'rdo_backtype',
            boxLabel: '使用returnBack'
        }, {
            inputValue: 'callback',
            boxLabel: '使用CallBackUrl'
        }],
        listeners: {
            change: function(thiz, newv, old, eopts) {
                switch (newv.type) {
                    case "return":
                        {
                            Ext.getCmp("txt_returnUrl").show();
                            Ext.getCmp("txt_returnBody").show();
                            Ext.getCmp("txt_callbackUrl").hide();
                            Ext.getCmp("txt_callbackBody").hide();
                        }
                        break;
                    case "callback":
                        {
                            Ext.getCmp("txt_returnUrl").hide();
                            Ext.getCmp("txt_returnBody").hide();
                            Ext.getCmp("txt_callbackUrl").show();
                            Ext.getCmp("txt_callbackBody").show();
                        }
                        break;
                    default:
                        {
                            Ext.getCmp("txt_returnUrl").hide();
                            Ext.getCmp("txt_returnBody").hide();
                            Ext.getCmp("txt_callbackUrl").hide();
                            Ext.getCmp("txt_callbackBody").hide();
                        }
                }
            }
        }
    }, {

        fieldLabel: 'returnUrl',
        id: 'txt_returnUrl',
        width: 500,
        hidden: true,
        vtype: 'url',
        name: 'returnUrl'
    }, {
        id: 'txt_returnBody',
        fieldLabel: 'returnBody',
        hidden: true,
        width: 500,
        emptyText:'json格式字符串,如:{"name":"qiniu"}',
        name: 'returnBody'
    }, {
        fieldLabel: 'callbackUrl',
        id: 'txt_callbackUrl',
        width: 500,
        hidden: true,
        vtype: 'url',
        name: 'callbackUrl'
    }, {
        id: 'txt_callbackBody',
        fieldLabel: 'callbackBody',
        emptyText:'格式为a=1&b=2&c=3',
        hidden: true,
        width: 500,
        name: 'callbackBody'
    }, {
        id: 'txt_asyncOpt',
        fieldLabel: 'asyncOps',
        emptyText: '可选',
        width: 500,
        name: 'asyncOps'
    }, {
        id: 'txt_endUser',
        fieldLabel: 'endUser',
        width: 500,
        emptyText: '可选',
        name: 'endUser'
    }, {
        id: 'txt_deadline',
        xtype: 'combobox',
        fieldLabel: 'deadline',
        displayField: 'expiretxt',
        valueField: 'expire',
        emptyText: '下拉选择',
        queryMode: 'local',
        allowBlank: false,
        margins: '0 6 0 0',
        store: new Ext.data.Store({
            fields: ['expiretxt', 'expire'],
            data: (function() {
                var data = [];
                for (i = 1; i < 13; i++) {
                    data[i - 1] = {
                        'expiretxt': i + '小时后',
                        'expire': i
                    };
                }
                return data;
            })()
        }),
        // forceSelection: true
    }, {
        xtype: 'displayfield',
        value: '<b><h2>完成后点击右下角按钮演示</h2></b>'
    }, {
        xtype: 'displayfield',
        value: '文档地址：<a href="http://docs.qiniu.com/api/v6/put.html#uploadToken">http://docs.qiniu.com/api/v6/put.html#uploadToken</a><b</b>'
    }],
    buttons: [{
        text: '生成Uptoken',
        handler: function(btn) {
        	if(!tokenPanel_policy.isValid()){
        		Ext.Msg.alert("错误", "上传策略填写不完整");
        		return;
        	}
            var policy = new Object();
            var bucketName = Ext.getCmp("txt_bucketName").getValue();
            var accessKey = Ext.getCmp("txt_accessKey").getValue();
            var secretKey = Ext.getCmp("txt_secretKey").getValue();
            policy.scope = bucketName;
            var key = Ext.getCmp("txt_key").getValue();
            if (key) {
                policy.scope += (":" + key);
            }
            var type = Ext.getCmp("adgp_type").getValue();
            switch (type.type) {
                case "return":
                    {
                        var returnUrl = Ext.getCmp("txt_returnUrl").getValue();
                        var returnBody = Ext.getCmp("txt_returnBody").getValue();
                        if (returnUrl) {
                            if (!returnBody || !Ext.JSON.decode(returnBody, true)) {
                                Ext.Msg.alert("错误", "returnBody格式不正确，请参考文档")
                                return
                            }
                            policy.returnUrl = returnUrl;
                            policy.returnBody = safe64(returnBody);
                        }
                    }
                    break;
                case "callback":
                    {
                        var callbackUrl = Ext.getCmp("txt_callbackUrl").getValue();
                        var callbackBody = Ext.getCmp("txt_callbackBody").getValue();
                        if (callbackUrl) {
                            if (!callbackBody) {
                                Ext.Msg.alert("错误", "callbackBody不能为空，格式为a=1&b=2&c=3")
                                return
                            }
                            policy.callbackUrl = callbackUrl;
                            policy.callbackBody = callbackBody;
                        }

                    }
                    break;
            }
            // var   = Ext.getCmp("txt_bucketName").getValue();
            var async = Ext.getCmp("txt_asyncOpt").getValue();
            if (async) {
                policy.async = async;
            }
            var endUser = Ext.getCmp("txt_endUser").getValue();
            if (endUser) {
                policy.endUser = endUser;
            }
            var expire = Ext.getCmp("txt_deadline").getValue();
            var deadline = Math.round(new Date().getTime() / 1000) + expire * 3600
            policy.deadline = deadline;
            var token = genToken(accessKey, secretKey, policy);
            Ext.getCmp("token_res").expand()
            console.log("token=", token);
        }
    }]

});

var tokenPanel = Ext.create('Ext.panel.Panel', {
    layout: 'border',
    region: 'center',
    items: [tokenPanel_policy, {
        xtype: 'form',
        id:"token_res",
        split: true,
        collapsible: true,
        collapsed :true,
        title: '结果',
        region: "east",
        width: 600,
        ext: 2,
        defaultType: 'displayfield',
        bodyPadding: 10,
        items: [{
            fieldLabel: "第一步",
            value: '确定上传策略'
        }, {
            fieldLabel: "第二步",
            value: '将上传策略序列化成为json格式:'
        }, {
            id: "disp_step2",
        }, {
            fieldLabel: "第三步",
            value: '对json序列化后的上传策略进行URL安全的Base64编码,得到如下encoded:'
        }, {
            id: "disp_step3",
        }, {
            fieldLabel: "第四步",
            value: '用SecretKey对编码后的上传策略进行HMAC-SHA1加密，并且做URL安全的Base64编码,得到如下的encoded_signed:'
        }, {
            id: "disp_step4",
        }, {
            fieldLabel: "第五步",
            value: '将 AccessKey、encode_signed 和 encoded 用 “:” 连接起来,得到如下的UploadToken:'
        }, {
            id: "disp_step5",
            anchor: "100%"
        }]
    }]
});

Ext.define('EP.view.qiniu.Qtoken', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.Qtoken',
    layout: 'border',
    glyph: 42,
    items: [
        tokenPanel
    ]
});
Ext.QuickTips.init();
