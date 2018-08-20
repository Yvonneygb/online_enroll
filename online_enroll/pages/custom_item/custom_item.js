// pages/custom_item/custom_item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArray: ['日期', '时间', '省市区', '单行输入框', '多行输入框','单选','多选','地图定位','图片文件','手写涂鸦'],
    typeArray_english: ['date', 'time', 'province', 'single_line_input', 'multiline_input', 'single_selection', 'checkbox', 'address', 'image', 'hand_writing'],
    tipArray: ['格式如：2018-12-31', 
               '格式如：23:39', 
               '3列选择，格式如：广东省 江门市 江海区', 
               '用于输入少量文字，比如地址，学号', 
               '最多支持140个字，用于备注，详细介绍', 
               '用于从多个中选择一个，如性别，年级', 
               '用于从多个中选择多个，如爱好', 
               '定位用于让保姆者从地图中点选位置', 
               '允许报名者上传图片', 
               '报名者可以手绘图形，用于涂鸦、手写签名'],
    typeIndex: 0,
    tipIndex:0,
    save_new_activaty:[],
    // have_choose_enroll_item_string:'',  //创建活动页面，显示“已选项目”处的字符串
    action:'',   //跳转过来时，正在执行的是向创建活动还是修改活动
    activity_id:'',
    isShow: 'none',    //选项列表是否显示（display的属性值）
    option:[]   //存放单选或多选的选项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // have_choose_enroll_item_string: options.have_choose_enroll_item_string,
      action: options.action,
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
  bindChooseType: function (e) {
    var that = this;
    var index = 0;
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      typeIndex: e.detail.value,
    })


    index = e.detail.value;
    that.showTip(index);


    //如果是多项选择、单项选择，则选项列表显示
    if (that.data.typeArray[index] == '单选' || that.data.typeArray[index] == '多选')
    {
      that.setData({
        isShow : ''
      })
    }

  },
  // 显示对应的tip
  showTip: function (index)
  {
    this.setData({
      tipIndex: index
    })
  },






  //多行输入框内容的获取
  bindinput:function(e)
  {
    console.log(e);
    //将字符串形式转成数组
    var arr = [];
    var value = e.detail.value;
    //将换行符替代成别的符号
    value = value.replace(/\n/g, "&");
    var index = 0;
    var flag = 0;

    while (flag == 0) 
    {
      index = value.indexOf("&");
      if (index == -1) 
      {
        var per = value.substring(0);
        arr.push(per);
        flag = 1;
      }
      else 
      {
        var per = value.substring(0 , index);
        arr.push(per);
        index = index + 1;
        value = value.substring(index);
      }
    }  
    console.log("最后转化的数组：");
    console.log(arr);

    this.setData({
      option: arr
    })

    console.log("111111111111111");
    console.log(this.data.option);
    
     
  },

  // 表单提交
  formSubmit:function(e)
  {
    var that = this;

    var name = e.detail.value.name;
    var _type = this.data.typeArray_english[e.detail.value.type];

    var attr = {};    
    attr['ch_discribtion'] = name;
    attr['propery'] = '';
    attr['item_type'] = _type;
    attr['checked'] = false;
    attr['special'] = 'true';

    if (_type == 'checkbox' || _type == 'single_selection')
    {
      console.log("2222222222222222");
      console.log(that.data.option);
      attr['option'] = that.data.option;
    }

    

    // 设置标志位为1 ，标志有新item加入
    getApp().globalData.flag_new_entoll_need = 1;

    // 将新加入的一项，赋值给保存项目的全局变量
    getApp().globalData.save_enroll_item.push(attr);


    console.log(getApp().globalData.save_enroll_item);

    wx.showToast({
      title: '添加成功',
      duration: 2000
    })

    //跳转回活动详细页
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/srt_new_activity/srt_new_activity?action=' + that.data.action + '&activity_id=' + that.data.activity_id,
      })  
    }, 2000)

  }
})