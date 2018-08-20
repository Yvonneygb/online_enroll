// pages/srt_show_activity/srt_show_activity.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:0,
    openid:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowaa:'none',
    is_authSetting:false,    //是否已经授权
    isAttention: false,
    info_array:[],
    is_top_img:false,
    top_img:'',
    state_src: '',
    comments_num :0, 
    comments:[
      
    ],
    enroll_num:0 ,   //允许报名的人数
    have_enroll_num:0,   //已经报名的人数
    identify:'',
    is_can:false,   //是否有权限
    is_enroll:false,
    is_use_sign:true , //是否使用签到功能
    is_sign:false,    //是否已经签到
    isShow:'none ',  //管理模态层
    isShareShow:'none',   //分享模态层
    is_show_img:false , //展示二维码的view是否显示
    isSharePicShow: 'none',  //绘制成的带有活动信息二维码是否显示
    img_src:'',    //二维码路径
    is_show_save_btn:'none',   //保存图片按钮
    is_show_save_info_btn: 'none',   //保存有活动信息的按钮
    is_show_info_code:false , //带有活动信息的二维码是否显示
    share_limit:false,   //只有管理员和发起人才可以分享
    can_check:true ,  //该用户是否可以查看报名名单
    shareTempFilePath:'',   //图片临时路径
    code_pain_path:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

   

    if (this.data.canIUse) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log("用户已经授权过");
                console.log(res.userInfo)

                //用户已经授权过
                that.setData({
                  isShowaa: 'none',
                  is_authSetting: true
                })
              }
            })
          }
          else {
            that.setData({
              isShowaa: ''
            })
          }
        }
      })

    }
    else {
      //低版本没有button.open-type.getUserInfo的兼容处理
      wx.getUserInfo({
        success: res => {
          getApp().globalData.userInfo = res.userInfo
        }
      })
    }




    setTimeout(function () 
    {
      
      //是否扫码进来的
      var scene = decodeURIComponent(options.scene);
      console.log("获取扫码传的参数");
      console.log(scene);    //undefine
      if (scene != 'undefined') 
      {
        console.log("的确是扫码进来的");
        var activity_id = options.scene;
      }
      else
      {
       
          var activity_id = options.id;
      }

      var openid = getApp().globalData.openid;

      console.log("openid和activity_id信息");
      console.log(openid);
      console.log(activity_id);

      that.setData({
        activity_id: activity_id,
        openid: openid
      })

    },1000)

    
    setTimeout(function () 
    {
        console.log("已经可以获取资料");
        // 获取基本信息
        wx.request({
          url: getApp().globalData.url + 'enroll/index.php/SrtEnrollController/show_get_info',
          method: 'GET',
          data: {
            openid: that.data.openid,
            activity_id: that.data.activity_id
          },
          success: function (obj) {
            console.log("获取信息成功");
            console.log(obj);

            that.setData({
              info_array: obj.data,
              have_enroll_num: that.data.info_array['have_enroll_num'],
              enroll_num: that.data.info_array['enroll_num'],
            })

            console.log("获取信息后的数组");
            console.log(that.data.info_array);

            that.setData({
              'info_array.enroll_begin': that.data.info_array['enroll_begin'].substring(0,16),
              'info_array.enroll_finish': that.data.info_array['enroll_finish'].substring(0, 16),
              'info_array.activity_begin': that.data.info_array['activity_begin'].substring(0, 16),
              'info_array.activity_finish': that.data.info_array['activity_finish'].substring(0, 16)
            })

            console.log("mmmmmmmmmmmmmmmmmmmmmmmmm");
            console.log(that.data.info_array['enroll_begin']);

           
           
           //查找该用户是否已经报名，以及身份
            wx.request({
              url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/check_and_identify',
              method: 'GET',
              data: {
                activity_id: that.data.info_array['id'],
                openid: getApp().globalData.openid
              },
              success: function (obj) {
                console.log(obj);
                that.setData({
                  identify: obj.data.identify,
                  is_enroll: obj.data.check,
                  is_sign: obj.data.sign
                })

                //是管理员或发起者，享有所有权限
                if (that.data.identify == 'manager' || that.data.identify == 'add') {
                  that.setData({
                    is_can: true
                  })
                }

                console.log("设置权限变量后的值");
                console.log(that.data.is_can);
              }
            })





            //查找是否已经关注
            wx.request({
              url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/check_attention',
              method: 'GET',
              data: {
                activity_id: that.data.info_array['id'],
                openid: getApp().globalData.openid
              },
              success: function (obj) {
                console.log(obj);

                that.setData({
                  isAttention: obj.data
                })


                console.log("是否关注");
                console.log(that.data.isAttention)
              }
            })




            //只有管理员和发起人才可以分享 且 该用户是管理员
            if (that.data.info_array['share_limit'] == 1 && that.data.is_can ) 
            {
              console.log("只有管理员和发起人才可以分享 且 该用户是管理员");
              that.setData({
                share_limit: true
              })
            }
            else if (that.data.info_array['share_limit'] == 0)
            {
              console.log("分享没有限制");
              //分享没有限制
              that.setData({
                share_limit: true
              })
            }





            if (that.data.info_array['top_img'] != '') 
            {
              that.setData({
                is_top_img: true,
                top_img: that.data.info_array['top_img'] 
              })
            }


            //如果不使用签到功能
            console.log("是否使用签到");
            console.log(that.data.info_array['sign']);
            if (that.data.info_array['sign'] == 0)
            {
              that.setData({
                is_use_sign: false,
              })
            }

            console.log(that.data.info_array);

           // 向服务器请求该活动的全部评论信息
                wx.request({
                  url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/get_activity_comment',
                  method: 'GET',
                  data: {
                    activity_id: that.data.info_array['id']
                  },
                  success: function (obj) {
                    console.log("评论：");
                    console.log(obj.data);

                    that.setData({ 
                      comments: obj.data,
                      comments_num : obj.data.length
                    })



                    //根据评论内容的长短，调整高度
                    for (var i = 0; i < that.data.comments.length ; i++)
                    {
                      console.log("评论长度");
                      console.log(that.data.comments[i]['content'].length);

                      that.data.comments[i]['height'] = 52 + 'px';
                      that.data.comments[i]['box_height'] = 220 + 'px';

                      var _height = 0;
                      var num = that.data.comments[i]['content'].length;

                      //一行18个汉字，一行高度52 ，算出需要几行，高度 = 行数 * 52
                      //保留两位小数
                      _height = (num/18).toFixed(2);  

                      //不够一行
                      if (_height < 1 || _height == 1)
                      {
                        _height = 52;
                        var  _box_height = 220;
                      }
                      else
                      {
                        _height = _height * 52 * 1.06;
                        _height = _height.toFixed(2);

                        var _box_height = (_height + 52 + 40 + 60) * 1.5;
                      }

                      var ping = 'comments[' + i +'].height';
                      var  box_height = 'comments[' + i + '].box_height';
                      that.setData({
                        [ping]: _height + 'rpx',
                        [box_height]: _box_height + 'rpx'
                      })
                    }


                    console.log(that.data.comments);
                  }
                })
          },
          header: {
            'Content-type': 'application/json'
          }
        })
    },1100)

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
    console.log("进来");
  },


  

  //管理函数
  manage:function(e)
  {
    console.log("管理函数");
    console.log(this.data.is_can);
    //如果该用户身份是管理者
    if(this.data.is_can == true)
    {
      this.setData({
        isShow: ''
      })
    }
    else
    {
      wx.showToast({
        title: '您没有权限',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
   
  },



  //点击转发
  share:function()
  {
    //share_limit == true , 即只有管理员和发起人可以分享，且该用户是管理员
    if(this.data.share_limit == true)
    {
      //分享
      console.log("可以分享");
      this.onShareAppMessage();
    }
    else
    {
      wx.showToast({
        title: '您没有权限',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }

    this.setData({
      isShareShow: 'none'
    })
  },



  //生成页面二维码
  produce_code:function()
  {
    var that = this;
    wx.request({
      url: getApp().globalData.url + 'enroll/index.php/SrtEnrollController/get_qrcode',
      method: 'POST',
      data: {
        activity_id: that.data.info_array['id']
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (obj) {
        console.log("生成二维码");
        console.log(obj);


        that.setData({
          img_src: getApp().globalData.url + 'enroll/' + that.data.activity_id + '.jpg'
        })
      }
    })

  },



  //生成普通二维码
  produce_normal_code:function()
  {
    var that = this;

    that.produce_code();

    that.setData({
      isShareShow: 'none',
      is_show_img: true,
    })
  },


  //生成带有活动信息二维码
  produce_info_code:function()
  {
    var that = this;
    
    that.produce_code();
    that.setData({
      isShareShow: 'none',
      is_show_info_code: true,
    })

  },

  //点击分享，模态层出现
  use_share:function()
  {
      this.setData({
        isShareShow:''
      })
  },


  quit_cover_share:function()
  {
    this.setData({
      isShareShow: 'none'
    })
  },


  //点击取消显示二维码模态层(普通二维码)
  quit_show:function()
  {
    if (this.endTime - this.startTime < 350) {
      this.setData({
        is_show_img: 'none'
      })
    }

    
  },



  //点击取消显示二维码模态层（带有活动信息二维码）
  quit_show_info_code:function()
  {
    if (this.endTime - this.startTime < 350) {
      console.log("取消显示带有活动信息二维码");
      this.setData({
        is_show_info_code: 'none'
      })
    }
    
  },


  //签到
  sign_in:function()
  {
    var that = this;
    if (that.data.info_array['state'] == 0)
    {
      //活动未开始
      wx.showToast({
        title: '还未开始报名',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 2)
    {
      //报名已结束
      wx.showToast({
        title: '报名已结束',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 1)
    {
      //报名中
      //该用户还没用报名
      if (this.data.is_enroll == false) {
        wx.showToast({
          title: '请先报名',
          image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
          duration: 2000
        })
      }
      else {
        var set_data = '';
        if (this.data.is_sign == false) {
          console.log("签到");
          set_data = '是';
        }
        else if (this.data.is_sign == true) {
          console.log('取消签到');
          set_data = '否';
        }


        console.log(set_data);
        wx.request({
          url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/sign_in',
          method: 'GET',
          data: {
            activity_id: that.data.info_array['id'],
            openid: getApp().globalData.openid,
            state: 'show',
            set_data: set_data
          },
          success: function (obj) {

            console.log(obj);
            if (set_data == '是') {
              that.setData({
                is_sign: true,
              })
            }
            else if (set_data == '否') {
              that.setData({
                is_sign: false,
              })
            }


            wx.showToast({
              title: '成功',
              duration: 2000
            })
          },
          header: {
            'Content-type': 'application/json'
          }
        })
      }
    }
   
  },

  //修改活动
  modify_activity:function()
  {
    var that = this;
    
    console.log("即将传过去的id");
    console.log(that.data.info_array['id']);
   
    wx.navigateTo({
      url: '/pages/srt_new_activity/srt_new_activity?activity_id=' + that.data.info_array['id'] + '&action=modify',
    })
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


  // 关注按钮
  attention : function()
  {
    var that = this;

    var attention_time = that.CurentTime();
    console.log("当前时间");
    console.log(attention_time);

    //没关注，点击则：添加关注
    if (this.data.isAttention == false)
    { 
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/add_attention',
        method: 'GET',
        data: {
          activity_id: that.data.info_array['id'],
          openid: getApp().globalData.openid,
          attention_time: attention_time
        },
        success: function (obj) {     
          that.setData({
            isAttention: true
          })  
        }
      })
      
    }
    else
    {
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/quit_attention',
        method: 'GET',
        data: {
          activity_id: that.data.info_array['id'],
          openid: getApp().globalData.openid,
        },
        success: function (obj) {
          that.setData({
            isAttention: false
          })
        }
      })
    }
  },


  // 查看报名表
  check_enroll_excel:function()
  {
    var that = this;
    var activity_id = this.data.info_array['id'];

      console.log("1111111111111111111111111111111111");
    console.log(this.data.info_array['enroll_check_limit']);
    console.log(this.data.info_array['not_enroll_check_limit']);
    console.log(that.data.is_enroll);
    console.log(that.data.identify);
   //报名用户可以查看报名名单  且 非报名用户也可以查看报名名单
   if (this.data.info_array['enroll_check_limit'] == 1 && this.data.info_array['not_enroll_check_limit'] == 1) {
     console.log("所有人可以查看报名名单");
     that.setData({
       can_check: true
     })
   }
   else if (this.data.info_array['enroll_check_limit'] == 1 && this.data.info_array['not_enroll_check_limit'] == 0 && that.data.is_enroll == true) 
   {
     //报名用户可以查看报名名单  且 非报名用户不可以查看报名名单  且该用户已报名
     console.log("报名用户可以查看报名名单  且 非报名用户不可以查看报名名单  且该用户已报名");
     that.setData({
       can_check: true
     })
   }
   else if (this.data.info_array['enroll_check_limit'] == 1 && this.data.info_array['not_enroll_check_limit'] == 0 && that.data.identify == 'manager') 
   {
     //报名用户、非报名用户都不可以查看报名名单  且 该用户hi管理员
     console.log("报名用户可以查看报名名单  且 非报名用户不可以查看报名名单  但该用户是管理员");
     that.setData({
       can_check: true
     })
   }
   else if (this.data.info_array['enroll_check_limit'] == 0 && this.data.info_array['not_enroll_check_limit'] == 0 && that.data.identify == 'manager')
   {
     //报名用户、非报名用户都不可以查看报名名单  且 该用户hi管理员
     that.setData({
       can_check: true
     })
   }
   else
   {
     that.setData({
       can_check: false
     })
   }


   if (that.data.can_check == true)
   {
     wx.navigateTo({
       url: '/pages/enrolled_excel/enrolled_excel?activity_id=' + activity_id,
     })
   }
   else
   {
     
   }
    
  },


  // 我要报名
  enroll:function()
  {
    var that = this;
    var activity_id = this.data.info_array['id'];

    console.log(this.data.enroll_num);
    console.log(this.data.have_enroll_num);

    if (that.data.info_array['state'] == 0) {
      //活动未开始
      wx.showToast({
        title: '还未开始报名',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 2) {
      //报名已结束
      wx.showToast({
        title: '报名已结束',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 1)
    {
      
      if (this.data.info_array['enroll_num'] == 0)
      {
        //不限报名人数
        console.log("不限报名人数");
        wx.navigateTo({
          url: '/pages/enroll_form/enroll_form?activity_id=' + activity_id + '&action=add',
        })
      }
      else if (this.data.info_array['enroll_num'] > this.data.info_array['have_enroll_num']) 
      {
        //允许报名的人数 > 已经报名的人数
        wx.navigateTo({
          url: '/pages/enroll_form/enroll_form?activity_id=' + activity_id + '&action=add',
        })
      }
      else {
        wx.showToast({
          title: '报名人数已满',
          image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
          duration: 2000
        })
      }
    }

   
   
  },



  //修改、取消报名
  modify:function()
  {
    var that = this;
    if (that.data.info_array['state'] == 0) {
      //活动未开始
      wx.showToast({
        title: '还未开始报名',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 2) {
      //报名已结束
      wx.showToast({
        title: '报名已结束',
        image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
        duration: 2000
      })
    }
    else if (that.data.info_array['state'] == 1)
    {
      wx.navigateTo({
        url: '/pages/enroll_form/enroll_form?activity_id=' + this.data.info_array['id'] + '&action=modify',
      })
    }
    
  },



  //删除活动
  delete_activity:function()
  {
    var that = this;
    wx.request({
      url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/delect_activity',
      method: 'GET',
      data: {
        activity_id: that.data.info_array['id']
      },
      success: function (obj) {

        that.setData({
          isShow: 'none',
        })

        wx.showToast({
          title: '删除成功',
          duration: 2000
        })
        
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/srt_activity_main/srt_activity_main',
            success: function (e) {
              let page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();    //跳转回去重新刷新
            }
          })
        } , 2000)

        
      }
    })
  },




  //跳转到评论页面
  comment:function()
  {
    //传值activity_id ， user_id
    wx.navigateTo({
      url: '/pages/add_comment/add_comment?activity_id=' + this.data.info_array['id'],
    })
  },



  //点击模态层取消显示
  quit_cover: function () {
    this.setData({
      isShow: 'none',

    })
  },



  bindGetUserInfo: function (e) {
    var that = this;

    console.log("点击授权");
    console.log(e);

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      getApp().globalData.userInfo = e.detail.userInfo;

      that.setData({
        isShowaa: 'none',
        is_authSetting: true
      })


      console.log("111111111111");
      console.log(getApp().globalData.openid);
      console.log(getApp().globalData.userInfo);

      if (getApp().globalData.openid != '' && getApp().globalData.userInfo != null) {
        console.log("保存用户信息");
        // 保存用户信息
        wx.request({
          url: getApp().globalData.url + 'enroll/index.php/SrtEnrollController/save_user',
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
        isShowaa: 'none',
        is_authSetting: false
      })
    }
  },



  //长按显示保存按钮
  show_save_btn:function()
  {
    console.log("长按");
    this.setData({
      is_show_save_btn:''
    })
  },


  show_save_info_btn:function()
  {
    console.log("长按了");
    this.setData({
      is_show_save_info_btn: ''
    })
  },



  //长按保存图片
  save_img:function(e)
  {
    var that = this;

    console.log("保存普通图片");
    wx.getSetting({
     success: function (res) {
       　wx.authorize({
         scope: 'scope.writePhotosAlbum',
         success: function (res) {
           console.log("授权成功保存");        

           var imgUrl = that.data.img_src;//图片地址

             wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
               url: imgUrl,
               success: function (res) {
                 console.log(res);
                 // 下载成功后再保存到本地
                 wx.saveImageToPhotosAlbum({
                   filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                   success: function (res) {
                     console.log("保存到本地成功");
                     that.setData({
                       is_show_save_btn: 'none'
                     })
                   }
                 })
               }
             })
         }
       })
     }
    })
   },


   //保存带有活动信息的二维码图片
  save_info_img:function()
  {
    console.log("保存带有活动信息的二维码图片");
    var that = this;

    // 获取当前屏幕宽度
    var w_width =  wx.getSystemInfoSync().windowWidth;

    //求得当前屏幕宽度与320标准宽度的比例
    var ratio = w_width/320;

    console.log("比例");
    console.log(ratio);

    //保存按钮隐藏
    //绘制成的图片图层显示
    that.setData({
      is_show_save_info_btn: 'none',
      isSharePicShow:''
    })

    that.produce_info_code();


    wx.getImageInfo({
      src: getApp().globalData.url + 'enroll/' + that.data.activity_id + '.jpg',
      success: function (res) {
        console.log("获取二维码");
        console.log(res);
        // console.log(ctx);

        that.setData({
          code_pain_path: res.path
        })

      }
    })



    setTimeout(function () {
      wx.getImageInfo({
        src: 'https://mirror.playingfootball.com.cn/uploadfiles//lms/68/201704/info_code_bkg.jpg',
        success: function (res) {
          console.log("获取背景图");
          console.log(res);

          //背景图
          const ctx = wx.createCanvasContext('info');
          ctx.drawImage(res.path, 0, 0, 400 * ratio, 400 * ratio)

          //标题
          ctx.setFontSize(18);        // 文字字号：22px
          ctx.setTextAlign('center');
          ctx.setFillStyle('#ffffff');   // 文字居中
          ctx.fillText(that.data.info_array['name'], 150 * ratio, 30 * ratio);

          //二维码+时间 框
          ctx.setStrokeStyle('red');
          ctx.setFillStyle('#ffffff');
          ctx.fillRect(48 * ratio, 50 * ratio, 224 * ratio, 235 * ratio);

          ctx.drawImage(that.data.code_pain_path, 75 * ratio, 60 * ratio, 170 * ratio, 170 * ratio);




          //时间
          ctx.setFillStyle('#a6a6a6');
          ctx.setFontSize(10);        // 文字字号：22px
          ctx.setTextAlign('center');    // 文字居中
          ctx.fillText('活动开始时间：' + that.data.info_array['activity_begin'], 160 * ratio, 240 * ratio);
          ctx.fillText('活动结束时间：' + that.data.info_array['activity_finish'], 160 * ratio, 255 * ratio);
          ctx.fillText('报名截止时间：' + that.data.info_array['enroll_finish'], 160 * ratio, 270 * ratio);


          //提示
          ctx.setFontSize(16);        // 文字字号：22px
          ctx.setTextAlign('center');
          ctx.setFillStyle('#ffffff');   // 文字居中
          ctx.fillText('长按识别小程序二维码报名', 160 * ratio, 310 * ratio);

        

          ctx.draw(true, setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'info',
              success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log("转化成功");
                console.log(tempFilePath);
                that.setData({
                  shareTempFilePath: res.tempFilePath
                })



                wx.getSetting({
                  success: function (res) {
                
                    console.log("aaaaaaaaaaaaa");
                    console.log(res);

                  

                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success: function (res) {
                        console.log("授权成功");
                        console.log(that.data.shareTempFilePath);


                        var imgUrl = that.data.shareTempFilePath;//图片地址

                        // wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                        //   url: that.data.shareTempFilePath,
                        //   success: function (res) {
                        //     console.log("下载成功");
                        //     console.log(res);

                            // 下载成功后再保存到本地
                            wx.saveImageToPhotosAlbum({
                              // filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                              filePath:that.data.shareTempFilePath,
                              success: function (res) {
                                console.log("保存到本地成功");

                                that.setData({
                                  is_show_save_info_btn: 'none'
                                })

                                that.setData({
                                  isSharePicShow: 'none'
                                })

                              },
                              fail:function(res)
                              {
                                console.log("保存失败");
                                console.log(res);
                              }
                            })
                        //   },
                        //   fail:function(res)
                        //   {
                        //     console.log("下载失败");
                        //     console.log(res);
                        //   }
                        // })
                      },
                      fail: function (res) {
                        console.log(res);

                        wx.openSetting({
                          success(settingdata) {
                            console.log(settingdata);
                            if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                              console.log("获取权限成功，再次点击图片保存到相册");

                              that.setData({
                                isSharePicShow: 'none'
                              })

                              wx.showModal({
                                title: '提示',
                                content: '再次长按保存图片',
                                success: function (res) {
                                  if (res.confirm) {
                                    console.log('用户点击确定')
                                  } else {
                                    console.log('用户点击取消')
                                  }

                                }
                              })

                             

                              var imgUrl = that.data.shareTempFilePath;//图片地址

                              wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                                url: that.data.shareTempFilePath,
                                success: function (res) {
                                  console.log(res);

                                  // 下载成功后再保存到本地
                                  wx.saveImageToPhotosAlbum({
                                    filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                                    success: function (res) {
                                      console.log("保存到本地成功");

                                      that.setData({
                                        is_show_save_info_btn: 'none'
                                      })

                                      that.setData({
                                        isSharePicShow: 'none'
                                      })

                                    }
                                  })
                                }
                              })
                            }
                            else {
                              console.log("获取权限失败");
                            }
                          }
                        })
                      }
                    })
                  }
                })


              },
              fail: function (res) {
                console.log(res);
              }
            }, this)
          }, 1000));


        }
      })



    // wx.getSetting({
    //   success: function (res) {
    //     wx.authorize({
    //       scope: 'scope.writePhotosAlbum',
    //       success: function (res) {
    //         console.log("授权成功");
    //         console.log(that.data.shareTempFilePath);

    //         var imgUrl = that.data.shareTempFilePath;//图片地址

    //         wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
    //           url: that.data.shareTempFilePath,
    //           success: function (res) {
    //             console.log(res);
    //             // 下载成功后再保存到本地
    //             wx.saveImageToPhotosAlbum({
    //               filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
    //               success: function (res) {
    //                 console.log("保存到本地成功");
    //                 that.setData({
    //                   is_show_save_info_btn: 'none'
    //                 })
    //               }
    //             })
    //           }
    //         })
    //       }
    //     })
    //   }
    // })

    },1000)
    
  },




  quit_cover_share_pic:function()
  {
    this.setData({
      isSharePicShow: 'none'
    })
  },




  // 定位
  location:function(e)
  {
    var that = this;
    var address = this.data.info_array['address'];

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'UDABZ-WM5KQ-WA25Q-GFSSX-4BXP6-XAFUP' // 必填
    });

    qqmapsdk.geocoder({
      address: '北京大学',
      success: function (res) {
        var latitude = res.result.location.lat;
        var longitude = res.result.location.lng;

        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
        })
      },
      fail: function (res) {
        console.log("地址转坐标失败");
        console.log(res);
      }
    })
  }


})