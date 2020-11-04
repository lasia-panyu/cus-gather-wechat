var app=getApp()
Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
      files: [],//文件列表
      accounts: ["通用文字", "身份证","银行卡", "营业执照"],
      accountstype:["cusImage","cusIDcard","cusBankcard","cusLicense"],
      accountIndex: 0,
      orccontent: '' ,
      orccontenttips: '请等待识别结果',
      loading:false,
      chooseflag:false,
      imageurl:'',
      cus:{
      },
      imageList:[],
      


  },
  onLoad: function(option){
      var that=this
      wx.showLoading({
        title: '加载中',
      })
      
      that.setData({
            cus:wx.getStorageSync('cus')
      })
      wx.hideLoading();
  },
  bindAccountChange: function(e) {
      console.log('picker account 发生选择改变，携带值为', e.detail.value);
      this.setData({
        accountIndex: e.detail.value
      })
      console.log(this.data.accountstype[this.data.accountIndex])
     
  },
  chooseImage: function (e) {
      var that = this;
      that.setData({
        chooseflag:true,
        loading:true
      })
      wx.showLoading({
        title: '查询中',
     })
      wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {  
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              wx.showLoading({
                title: '上传中',
             })
              console.log(res)
              console.log(res.tempFiles)
              that.setData({
                  //files: that.data.files.setData(res.tempFilePaths)
                  //imageurl:res.tempFilesPaths
                  imageurl:res.tempFilePaths[0],
                  files: res.tempFilePaths
              });
              wx.uploadFile({
                url: app.globalData.urlc+'quickStep3',
                filePath: res.tempFilePaths[0],
                name:'orcfile',
                formData: {
                    'imagetype': that.data.accounts[that.data.accountIndex],   
                    'cus':JSON.stringify(that.data.cus),
                    imageurl:res.tempFilePaths[0]
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success (res) {
                  console.log(res.data)
                  that.setData({  
                      cus:JSON.parse(res.data),
                      loading:false,
                      chooseflag:false
                  }),
                  wx.hideLoading()
                }
             
              })
              
          },
          fail:function(e){
            that.setData({  
              loading:false,
              chooseflag:false
          }),
          wx.hideLoading()
          }
      })
     
  },
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
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
                that.setData({
                    ["cus.cusAddress"]:res.address,
                    ["cus.cusLatitude"]:res.latitude,
                    ["cus.cusLongitude"]:res.longitude
                })
            }
          })
        }
       })
  },
  saveall:function(){
       
    var that=this
    wx.showLoading({
        title: '保存中',
    });
    console.log(that.data.cus)
    wx.request({
        url: app.globalData.urlc+'quickStep4',
        method:'POST',
        data: JSON.stringify(that.data.cus),
        
        header: {
            'content-type': 'application/json' // 默认值
        },
        success (res) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功！',
            });
            wx.redirectTo({
              url: '/pages/index/index'
            })
        },
    });


  },
  updateValue(e) {
    console.log(e)
   if(e.currentTarget.id=='address'){
        this.setData({
          ["cus.address"]:e.detail.value
        })
    }else if(e.currentTarget.id=='desc'){
        this.setData({
          ["cus.cusdesc"]:e.detail.value
    })}else if(e.currentTarget.id=='name'){
        this.setData({
          ["cus.name"]:e.detail.value
           })
    }
  }
});