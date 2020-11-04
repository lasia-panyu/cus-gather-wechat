// pages/cus/cusview.js
const app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    page:1,
    cusname:"",
    cuslist:[],
    inputValList:[]
},
onLoad:function(){
  console.log(app.globalData.userInfo.nickName)
  var that=this
  wx.request({
    url: app.globalData.urlc+'queryS',
    method:'POST',
    data: {
        cuscounter:app.globalData.openid,
        page:that.data.page,
        cusname:that.data.cusname
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success (res) {
        console.log(res.data)
        that.setData({
             cuslist:res.data,
        });
    },
});
},
navdetail:function(e){
      var that=this
      console.log(that.data.cuslist[e.currentTarget.id])
      wx.setStorage({
        key: "cus",
        data: that.data.cuslist[e.currentTarget.id]
      }),
      wx.navigateTo({
        url: '/pages/cus/cusedit'
      })
},
navdetails:function(e){
  var that=this
  console.log(e.currentTarget)
  console.log(e.currentTarget.dataset.bean)
  wx.setStorage({
    key: "cus",
    data: e.currentTarget.dataset.bean
  }),
  wx.navigateTo({
    url: '/pages/cus/cusedit'
  })
},
search:function(e){
  console.log(app.globalData.userInfo.nickName)
  var that=this
  if(e.target.id=="more"){
    that.setData({
          page:that.data.page+1
    }); 
  }

  console.log(e)
  wx.showLoading({
    title: '查询中',
  })
  wx.request({
    url: app.globalData.urlc+'queryS',
    method:'POST',
    data: {
        cuscounter:app.globalData.openid,
        page:that.data.page,
        cusname:that.data.cusname
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success (res) {
        console.log(res.data)
        console.log(res.data.length)
        if(res.data.length>0){
        that.setData({
             cuslist:that.data.cuslist.concat(res.data),
             inputVal: ''
        });
        wx.hideLoading();
        wx.showToast({
          title: '查询成功！',
        });
      }else{
        wx.hideLoading();
        wx.showToast({
          title: '无更多数据！！',
        });
      }
    },
});
},
showInput: function () {
    this.setData({
        inputShowed: true
    });
},
hideInput: function () {
    this.setData({
        inputVal: "",
        inputShowed: false
    });
},
clearInput: function () {
    this.setData({
        inputVal: ""
    });
},
inputTyping: function (e) {
    var inputValList=[];
    var that=this;
   
    for (var i=0;i<this.data.cuslist.length;i++){
      console.log(this.data.cuslist[i])
      console.log(e.detail.value)
      if(that.data.cuslist[i].cusName.indexOf(e.detail.value ) >= 0){
        console.log("e.detail.value"+e.detail.value)
        inputValList.push(that.data.cuslist[i])
      }
    }
    console.log("inputValList"+inputValList)
    this.setData({
        inputValList:inputValList,
        inputVal: e.detail.value,
        cusname:e.detail.value
    });
}
})