// pages/srt_activity_main/srt_activity_main.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow:'none',
    is_authSetting :'none',  //是否已经授权，授权了就为none
    // canIUse:false,
    nickName:'',
    avatarUrl:'',
    state_src:'',
    str:[],
    is_join_choose:false,
    is_attention_choose:false,
    is_organize_choose:false,
    is_manage_choose:false,
    identify:'',   //用户的此刻身份
    activity_info_all :[
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    
    if (this.data.canIUse)
    {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log("用户已经授权过");
                console.log(res.userInfo)

                //用户已经授权过
                setTimeout(function () {
                  console.log(getApp().globalData.openid);
                  that.render_join();
                },1000)
                
              }
            })
          }
          else {
            that.setData({
              isShow: ''
            })
          }
        }
      })
    }
    else
    {
      //低版本没有button.open-type.getUserInfo的兼容处理
      wx.getUserInfo({
        success : res=>{
          getApp().globalData = res.userInfo
        }
      })
    }

    

    
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
    console.log("分享");
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

    console.log(urlWithArgs);
  },

  // 发起request请求，向服务器获取每个状态的活动信息
  add_request:function()
  {
    var that = this;
    
    wx.request({
      url: getApp().globalData.url+'enroll/index.php/SrtEnrollController/get_activity_info',
      method: 'GET',
      data: {
        openid: getApp().globalData.openid,
        identify:this.data.identify
      },
      success: function (obj) {
        console.log(obj.data);
        that.setData({
          activity_info_all: obj.data
        })

        console.log(typeof (that.data.activity_info_all));
        console.log(that.data.activity_info_all);

        for (var i = 0; i < that.data.activity_info_all.length; i++) {
          var address_of_blank = that.data.activity_info_all[i]['enroll_finish'].indexOf(" ");
          var after_sustring = that.data.activity_info_all[i]['enroll_finish'].substring(0, address_of_blank);
          var ping = 'activity_info_all[' + i + '].enroll_finish';

          that.setData({
            [ping]: after_sustring
          })

          // 根据state改变状态图标的图片路径
          switch (that.data.activity_info_all[i]['state']) {
            case 0:
              console.log('未开始');
              var color = 'activity_info_all['+i+'].color';
              var word = 'activity_info_all[' + i + '].word';
              that.setData({
                [color]: '#dbdbdb',
                [word] :'未开始'
              })
              
              break;

            case 1:
              console.log("报名中");
              var color = 'activity_info_all[' + i + '].color';
              var word = 'activity_info_all[' + i + '].word';
              that.setData({
                [color]: '#4fdfe0',
                [word]:'报名中'
              })
              break;

            case 2:
              console.log("已经结束");
              var color = 'activity_info_all[' + i + '].color';
              var word = 'activity_info_all[' + i + '].word';
              that.setData({
                [color]: '#dbdbdb',
                [word]: '已结束'
              })
              break;
          }
        }
        console.log("00000000000000000000000000");
        console.log(that.data.activity_info_all);
      },
      header: {
        'Content-type': 'application/json'
      }
    })

   





    // 截断日期+时间的字符串
    console.log(that.data.activity_info_all.length);
    for (var i = 0; i < this.data.activity_info_all.length; i++) {
      console.log("截断日期");
      var address_of_blank = this.data.activity_info_all[i]['enroll_finish'].indexOf(" ");
      var after_sustring = this.data.activity_info_all[i]['enroll_finish'].substring(0, address_of_blank);
      var ping = 'activity_info_all[' + i + '].enroll_finish';

      this.setData({
        [ping]: after_sustring 
      })
    }
  },

  // 渲染 “我参加的” 页面
  render_join: function () {
    
    this.setData({
      is_join_choose: true,
      is_attention_choose: false,
      is_organize_choose: false,
      is_manage_choose: false,
      identify:'join'
    })

    this.add_request();
  },

  // 渲染 “我关注的” 页面
  render_attention: function () {
    console.log("444444444444444444444444");
    this.setData({
      is_join_choose: false,
      is_attention_choose: true,
      is_organize_choose: false,
      is_manage_choose: false,
      identify: 'attention'
    })
    this.add_request();
  },

  // 渲染 “我发起的” 页面
  render_organize: function () {
    this.setData({
      is_join_choose: false,
      is_attention_choose: false,
      is_organize_choose: true,
      is_manage_choose: false,
      identify: 'add'
    })
    this.add_request();
  },

  // 渲染 “我管理的” 页面
  render_manage: function () {
    this.setData({
      is_join_choose: false,
      is_attention_choose: false,
      is_organize_choose: false,
      is_manage_choose: true,
      identify: 'manage'
    })
    this.add_request();
  },


  // 发起活动页面跳转
  organize_activity:function()
  {
    wx.navigateTo({
      url: '/pages/srt_new_activity/srt_new_activity',
    })  
  },


  // 点击某一活动，跳转到具体页面，并传值
  show_detail:function(e)
  {
    var that = this;
    console.log(e);
    console.log("哈哈哈哈哈哈");
    console.log(getApp().globalData.openid);
    //新的，
    var index = e.currentTarget.dataset.current;     //第几个活动被点击
    getApp().globalData.show_activity_info = this.data.activity_info_all[index];
    wx.navigateTo({
      url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_info_all[index]['id'] + '&openid=' + getApp().globalData.openid,
    })  
  },




  
  bindGetUserInfo: function (e) {
    var that = this;

    console.log("点击授权");
    console.log(e);

    if (e.detail.userInfo) 
    {
      //用户按了允许授权按钮
      getApp().globalData.userInfo = e.detail.userInfo;

      that.setData({
        isShow: 'none',
        is_authSetting: 'none'
      })

      that.render_join();


      console.log("111111111111");
      console.log(getApp().globalData.openid);
      console.log(getApp().globalData.userInfo);

      if (getApp().globalData.openid != '' && getApp().globalData.userInfo != null) {
        console.log("保存用户信息");
        // 保存用户信息
        wx.request({
          url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/save_user',
          method: 'GET',
          data: {
            openid: getApp().globalData.openid,
            user_info: getApp().globalData.userInfo
          },
          success: function (obj) {
            console.log("存用户信息成功");
            console.log(obj);

          },
          header: {
            'Content-type': 'application/json'
          }
        })
      }


    } else {
      //用户按了拒绝按钮
      that.setData({
        isShow: 'none',
        is_authSetting:''
      })
    }
  }

})