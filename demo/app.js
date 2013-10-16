Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'QN',

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: {
                type: "border"
            },
            items: [{
                xtype: "tabpanel",
                headerCssClass: 'x-panel-logo',
                region: "center",
                title: '<img src="http://www.staticfile.org/static/qiniu.png" />',
                activeTab: 0,
                autoScroll:true,
                id: "tabContainer",
                items: [{
                        xtype: "imageFop",
                        title: "图片处理",
                        id: 'imageFoppnl'
                    },
                    // {
                    //     xtype: "avFop",
                    //     title: "视频处理",
                    //     id: 'avFoppnl'
                    // },
                    {
                        xtype: "Qupload",
                        title: "文件上传",
                        id: 'uploadx'
                    }, {
                        xtype: "Qtoken",
                        title: "UpToken生成演示",
                        id: 'tokenx'
                    }
                ],
                listeners: {
                    afterRender: function() {
                        Ext.getCmp("tabContainer").setActiveTab(0);
                    }
                },
            }]
        });
    }
});
