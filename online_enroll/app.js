//app.js
App({
  data:{
    address:'',
    name:'',
    code:'',
    openid:''
  },
  onLaunch: function () { 
    var that = this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   




    //登录
              wx.login({
                success: res => {
                  console.log("登录成功");
                  wx.request({
                    url: getApp().globalData.url +'enroll/index.php/enrLoginController/getOpenid',
                    method: 'GET',
                    data: {
                      code: res.code
                    },
                    success: function (obj) {

                      //获取openid成功
                      console.log("获取openid成功");
                      getApp().globalData.openid = obj.data.openid;
                      that.globalData.session_key = obj.data.session_key;
                      that.globalData.login_status = 1;

                      console.log(getApp().globalData.openid);
                      
                      if (this.openidfoReadyCallback) {
                        console.log("回调openid函数");
                        this.openidfoReadyCallback(res);   //调用main页面中定义的userInfoReadyCallback，返回参数res

                      }
                    },
                    header: {
                      'Content-type': 'application/json'
                    }
                  })

                  if (this.userInfoReadyCallback) 
                  {
                    console.log("回调函数");
                    this.userInfoReadyCallback(res);   //调用main页面中定义的userInfoReadyCallback，返回参数res

                  }
                }
              })


              
  

   

    
    // wx.checkSession({
    //   success: function (res) {

    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log("处于登录状态"); 

    //     that.globalData.login_status = 1;    
    //   },
    //   fail: function () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     console.log("重新登录");

    //     // // 登录
    //     // wx.login({
    //     //   success: res => {
    //     //     console.log("登录凭证");
    //     //     console.log(res.code);

    //     //     wx.request({
    //     //       url: 'https://mirror.playingfootball.com.cn/enroll/index.php/enrLoginController/getOpenid',
    //     //       method: 'GET',
    //     //       data: {
    //     //         code: res.code
    //     //       },
    //     //       success: function (obj) {
    //     //         console.log(obj);
    //     //         that.globalData.openid = obj.data.openid;
    //     //         that.globalData.session_key = obj.data.session_key;
    //     //         that.globalData.login_status = 1;
      
    //     //       },
    //     //       header: {
    //     //         'Content-type': 'application/json'
    //     //       }
    //     //     })


            

    //     //   }
    //     // })
    //   }
    // })



  },
  globalData: {
    url:'https://mirror.playingfootball.com.cn/',
    userInfo: null,
    login_status:0,
    // openid:'o8zw65DnghYC_6lUaUBTcmlWoSQc',
    openid:'',
    session_key:'',  
    show_activity_info :[],  //活动详细页中，活动的信息数组
    save_new_activaty: [],  //创建新活动时，添加“报名所需项目”跳转时，保存已填项目
    save_enroll_item: [],  //创建新活动时，添加“报名所需项目”跳转时，保存"报名所需项目"的选中情况
    save_have_choose: [],  //创建新活动时，添加“报名所需项目”跳转时，保存由选中的报名所需项目的中文描述组成的数组，该数组用于将数组转换成字符串，在“已选项目”中显示
    new_enroll_need:[],    //单独添加的一个报名所需项目
    flag_new_entoll_need: 0 , //标志是否有添加“报名所需项目”
    save_enroll_form:[],   //填写报名表时，跳转到“手写签名”时，保存已填写项目
    flag_enroll_form:0,   //标志是否是从类似“手写签名”这样的页面跳转回来的，即是否曾经填写过
    new_address:'' ,      //创建新活动时，定位的地址
    flag_address:0,      //标志位：是否从定位页面返回
  }
})