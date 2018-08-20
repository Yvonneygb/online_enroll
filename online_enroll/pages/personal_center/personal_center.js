// pages/personal_center/personal_center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:'none',
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    setTimeout(function () {
      that.setData({
        userInfo: getApp().globalData.userInfo
      })
    }, 2000)
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  //查看二维码
  show_code:function()
  {
    this.setData({
      isShow:''
    })
  },

  //点击二维码取消显示
  quit_cover: function () {
    this.setData({
      isShow: 'none',

    })
  }
})