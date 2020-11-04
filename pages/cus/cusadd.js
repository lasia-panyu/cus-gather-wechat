const app = getApp()

var util = require('../../utils/util.js');


Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
      files: [],//文件列表
      accounts: ["通用文字", "身份证","银行卡", "营业执照","增值税发票"],
      accountIndex: 0,
      loading:true,
      cus: {},
      toast: false,
      sloading: false,
      hideToast: false,
      hideLoading: false,
      chooseflag:false

  },
  onLoad:function(e){
      console.log("app.globalData.cus")
      console.log(app.globalData.cus)
      this.setData({
           cus:app.globalData.cus,
           ["cus.cusCounter"]:app.globalData.openid
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
              that.setData({
                  chooseflag:true,
              });

            app.globalData.cus["cusPhotoUrl"]=res.tempFilePaths[0]
            console.log(app.globalData.cus)
            //that.globalData.setData({
                //files: that.data.files.setData(res.tempFilePaths)
                //["cus.cusPhotoUrl"]: res.tempFilePaths,
                //["cus.cusName"]:''
            //});
            
            wx.uploadFile({
              url: app.globalData.urlc+'quickStep1',
              filePath: res.tempFilePaths[0],
              name: 'orcfile',
              formData: {
                  type: '通用文字',
                  cus:JSON.stringify(app.globalData.cus)
                  //filename:res.tempFilePaths[0]
              },
              success (res) {
                console.log(res.data)
                var jsonText=JSON.parse(res.data)
                if(jsonText.cusNo != undefined){
                    app.globalData.cus=jsonText
                }else{
                    app.globalData.cus["cusName"]="识别失败"
                }
                that.setData({  
                   
                    cus:app.globalData.cus,
                    loading:false
                })
              }
            })
            
        }
    })
  },
  openlocation: function () {
    var that=this;
    console.log(app.globalData.userInfo)
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          console.log(that.data.userlocation)
          wx.chooseLocation({
            latitude,
            longitude,

            success (res) {
                console.log(res)
                app.globalData.cus.cusAddress=res.address,
                app.globalData.cus.cusLatitude=res.latitude,
                app.globalData.cus.cusLongitude=res.longitude,
                that.setData({
                    cus:app.globalData.cus
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
  },
  quicksave:function(){
    var that=this
    wx.showLoading({
        title: '请求中',
    });
    wx.request({
        url: app.globalData.urlc+'quickStep2',
        method:'POST',
        data: JSON.stringify(app.globalData.cus),
        success (res) {
            console.log(app.globalData.cus)
            console.log(res.data)
            app.globalData.cus=res.data
            console.log(app.globalData.cus)
            wx.hideLoading();
            wx.showToast({
              title: '保存成功！',
            });
            wx.setStorage({
              key: "cus",
              data: app.globalData.cus
            }),
            wx.redirectTo({
              url: '/pages/cus/cusedit'
            })
        },
    });
  },
  updateValue(e) {
    var that=this
    
    if(e.currentTarget.id=='address'){
        app.globalData.cus.cusAddress=e.detail.value
        that.setData({
            cus:app.globalData.cus
    })
    }else if(e.currentTarget.id=='phone'){
        app.globalData.cus.cusPhone=e.detail.value
        that.setData({
            cus:app.globalData.cus
    })
    }else if(e.currentTarget.id=='name'){
        console.log(e)
        app.globalData.cus.cusName=e.detail.value
        console.log(app.globalData.cus)
        that.setData({
            cus:app.globalData.cus
    })

    }
    console.log(app.globalData.cus)
    console.log(that.data.cus)
   
  }
})