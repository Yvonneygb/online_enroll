// pages/enrolled_excel/enrolled_excel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_array:[],
    isShow:'none',
    activity_id :'',
    //从数据库取出来enroll_need的中文，保存进该数组
    enroll_need_title:[
      // '编号',
      // '微信',
      // '姓名',
      // '性别',
      // '年龄',
      // '手机',
      // '公司名称',
      // '部门',
      // '职位',
      // '学历',
      // '定位',
      // '备注',
      // '身份证',
      // '手写签名',
      // '签到',
      // '报名时间'
    ],
    choose_id:'', ///长按的时候选中第几条记录,
    modal_sign_word:'',  //模态层中签到一项的文字
    img_src:'' ,    //显示照片时的照片路径
    is_show_img:false,  //点击看图的image标签内容是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    this.setData({
      activity_id: options.activity_id,
    })

    wx.request({
      url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/get_enroll_excel',
      method: 'GET',
      data: {
        activity_id:that.data.activity_id
      },
      success: function (obj) {

        console.log(obj);
        var ch_discribtion = [];

        //在中文描述的数组的第一位插入“编号”
        ch_discribtion.unshift('编号');
        for (var i = 0; i < obj.data[0].length ; i++)
        {
          ch_discribtion.push(obj.data[0][i]['ch_discribtion']);
        }

        that.setData({
          info_array: obj.data[1],   
          enroll_need_title: ch_discribtion           
        })

        console.log("数据：");
        console.log(that.data.info_array);
        console.log("描述：");
        console.log(that.data.enroll_need_title);
      },
      header: {
        'Content-type': 'application/json'
      }
    })


    console.log("rrrrrrrrrrrrrrrrrrrrrrrrr");
    console.log(this.data.info_array);
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


  //长按显示模态层
  show_module:function(e)
  {
      
    this.setData({
      isShow:'',
      choose_id: e.currentTarget.dataset.index //长按的报名信息条的id
    })

    //找出该条记录中“签到”一项的在value中的位置
    var index = 0;
    for (var i = 0; i < this.data.info_array[this.data.choose_id]['value'].length; i++) {
      if (this.data.info_array[this.data.choose_id]['value'][i][0] == '签到') {
        index = i;
      }
    }

    var is_sign = this.data.info_array[this.data.choose_id]['value'][index][1];
    if(is_sign == "是")
    {
      this.setData({
        modal_sign_word : "取消签到"
      })
    }
    else{
      this.setData({
        modal_sign_word: "代签到"
      })
    }
  },



  //删除本条记录
  delete_enroll:function()
  {
    var that = this;
    console.log(this.data.choose_id);
    console.log(this.data.info_array[choose_id]);
    //取该报名信息的id，以及活动id，传到后台删除数据库，再刷新（跳转回本页面）
    var choose_id = this.data.choose_id;
    var user_id = this.data.info_array[choose_id]['user_id'];
    console.log("选中的条记录的user_id:");
    console.log(user_id);

    wx.request({
      url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/delete_enroll_excel',
      method: 'GET',
      data: {
        activity_id:that.data.activity_id,
        user_id:user_id        
      },
      success: function (obj) {

        console.log(obj);
        that.setData({
          info_array: obj.data[1],
          isShow: 'none',
        }) 

        console.log("删除后数据：");
        console.log(that.data.info_array);
      },
      header: {
        'Content-type': 'application/json'
      }
    })
    
    
  },

  //代签到
  sign_in: function () {
    var that = this;

    //取该报名信息的id，以及活动id，传到后台将签到字段值改了，再刷新（跳转回本页面）
    var choose_id = this.data.choose_id;
    var user_id = this.data.info_array[choose_id]['user_id'];

    var set_data = '';
    if (this.data.modal_sign_word == '代签到')
    {
      console.log("代签到");
      set_data = '是';
    }
    else if (this.data.modal_sign_word == '取消签到')
    {
      console.log('取消签到');
      set_data = '否';
    }
    wx.request({
      url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/sign_in',
      method: 'GET',
      data: {
        activity_id: that.data.activity_id,
        user_id: user_id,
        state: 'excel',
        set_data: set_data
      },
      success: function (obj) {

        console.log(obj);
        that.setData({
          info_array: obj.data[1],
          isShow: 'none',
        })

        console.log("签到数据：");
        console.log(that.data.info_array);
      },
      header: {
        'Content-type': 'application/json'
      }
    })


  },




  //点击看图
  show_img:function(e){
    console.log(e);
    var num = e.currentTarget.dataset.num;   //大数组
    var current = e.currentTarget.dataset.current;   //小数组


    var web_address = '';

    if (this.data.info_array[num]['value'][current][0] == '手写签名')
    {
      web_address = this.data.info_array[num]['value'][current][1];
    }
    else
    {
      web_address = this.data.info_array[num]['value'][current][1];    
    }

    this.setData({
      is_show_img: true,
      img_src: web_address
      })
    
  },



  //点击照片取消显示
  quit_show:function()
  {
    this.setData({
      is_show_img: false,

    })
  },


  //点击模态层取消显示
  quit_cover:function()
  {
    this.setData({
      isShow: 'none',

    })
  }


  

}) 