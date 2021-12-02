//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    mixins: [require('../mixin/themeChanged')],
        list: [
            {
              id: 'form',
              name: '客户信息管理',
              open: false,
              pages: [['/pages/cus/cusadd','新增客户信息'], ['/pages/cus/cusview','客户信息查看']]
            },
            {
                id: 'layout',
                name: '证件识别',
                open: false,
                pages: [['/pages/orc/orctest?imagetype=通用文字','通用文字'],['/pages/orc/orctest?imagetype=身份证','身份证'],['/pages/orc/orctest?imagetype=银行卡','银行卡'],['/pages/orc/orctest?imagetype=营业执照','营业执照'],['/pages/orc/orctest?imagetype=增值税发票','增值税发票']]
            },
            {
                id: 'feedback',
                name: '机构管理(暂未开放)',
                open: false,
                pages: [['/pages/branch/counter','柜员机构管理']]
            },
            {
                id: 'nav',
                name: '路线规划(建设中)',
                open: false,
                pages: [['/pages/branch/counter','最短路线规划'],['/pages/branch/counter','客户分布']]
            },
            {
                id: 'search',
                name: '反馈(暂未开放)',
                open: false,
                pages: [['/pages/branch/counter','功能反馈']]
            }],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function(e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
       // 查看是否授权
       var that=this
       wx.getSetting({
         success (res){
           if (res.authSetting['scope.userInfo']) {
             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
 
             wx.login({
                 success: function(res) {
                 // 获取登录的临时凭证
                 var code = res.code;
                 // 调用后端，获取微信的session_key, secret
                 console.log(res.code)
                 wx.request({
                   url: app.globalData.urlc+"/wxLogin",
                   method: "POST",
                   data:{
                     code:res.code
                   },
                   header: {
                     'content-type': 'application/x-www-form-urlencoded'
                   },
                   success: function(result) {
                     console.log(result.data);
                     // 保存用户信息到本地缓存，可以用作小程序端的拦截器
                     app.globalData.openid=result.data
                    }
                  })  
                 }
               }),      
             
 
             wx.getUserInfo({
               success: function(e) {
                 console.log(e.userInfo)
                 app.globalData.userInfo = e.userInfo
                 that.setData({
                    userInfo: e.userInfo,
                    hasUserInfo: true
                 })
               }
             })
           }
         }
       })
  },
   kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    },
    changeTheme: function() {
        console.log(this.data);
        getApp().themeChanged(this.data.theme === 'light' ? 'dark' : 'light');
    },
    onLoad: function() {
   
    },
})
