// pages/add_comment/add_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        activity_id: options.activity_id
      })
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


  //获取评论内容
  bindinput:function(e)
  {
    console.log(e);
    var content = e.detail.value;

    this.setData({
       content: content
    })

    console.log(this.data.content);
  },




  //获取日期
  CurentTime: function () {
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();       //秒

    var clock = year + "-";

    if (month < 10)
      clock += "0";

    clock += month + "-";

    if (day < 10)
      clock += "0";

    clock += day + " ";

    if (hh < 10)
      clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
  },



  //发表评论
  publish:function(e)
  {
    var that = this;

    //获取当前时间
    var add_time = that.CurentTime();
    console.log("当前时间");
    console.log(add_time);

    if (that.data.content.length < 6) {
      wx.showToast({
        title: '至少输入五个字',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else
    {
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/add_comment',
        method: 'GET',
        data: {
          activity_id: this.data.activity_id,
          openid: getApp().globalData.openid,
          add_time: add_time,
          content:that.data.content
      },
        success: function (obj) {
          console.log(obj);
          wx.showToast({
            title: '评论成功',
            duration: 2000
          })


          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_id + '&openid=' + getApp().globalData.openid,
            })
          }, 2000)
        }
      })
    }

    
  }
})