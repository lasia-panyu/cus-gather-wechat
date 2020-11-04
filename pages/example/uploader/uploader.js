Page({
    mixins: [require('../../mixin/themeChanged')],
    data: {
        files: [],//文件列表
        accounts: ["通用文字", "身份证","银行卡", "营业执照","增值税发票"],
        accountIndex: 0,
        orccontent: '' ,
        orccontenttips: '请等待识别结果',
        loading:true


    },
    bindAccountChange: function(e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);

        this.setData({
            accountIndex: e.detail.value
        })
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(res)
                console.log(res.tempFiles)
                that.setData({
                    //files: that.data.files.setData(res.tempFilePaths)
                    files: res.tempFilePaths,
                    orccontent:''
                });
                wx.uploadFile({
                  url: 'http://localhost:8080/XWD/S',
                  filePath: res.tempFilePaths[0],
                  name: 'orcfile',
                  formData: {
                      'type': that.data.accounts[that.data.accountIndex]
                  },
                  success (res) {
                    var jsonText = JSON.parse(res.data);
                    if(jsonText.TextDetections != undefined){
                    for(var orcdata in jsonText.TextDetections){
                        console.log(orcdata)
                        that.setData({  
                            orccontenttips:'',
                            orccontent:that.data.orccontent.concat(jsonText.TextDetections[orcdata].DetectedText+'\n')
                        });
                    } 

                    console.log(that.data.orccontent)
                    }else{
                        that.setData({  
                            orccontent:"识别失败"
                        });
                    }
                    that.setData({  
                        loading:false
                    })
                  }
                })
                
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    }
});