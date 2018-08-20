 //index.js
//获取应用实例s

Page({
  data: {
    activity_id:'',
    switch1Checked:false,
    switch2Checked:false,
    switch3Checked:false,
    switch4Checked: false,
    switch5Checked: false,
    flag_top:0,
    flag_other:0,
    height_top:172 , 
    height_other:172,
    tempFilePaths:'',
    tempFilePaths_other:'',
    isShow:'none',
    other_img:[],
    new_activity_form:[
      {
        ch_discribtion:'活动标题',
        value:''
      },
      {
        ch_discribtion: '活动地址',
        value: ''
      },
      {
        ch_discribtion: '活动开始日期',
        value: '年-月-日'
      },
      {
        ch_discribtion: '活动开始时间',
        value: '00:00'
      },
      {
        ch_discribtion: '活动结束日期',
        value: '年-月-日'
      },
      {
        ch_discribtion: '活动结束时间',
        value: '00:00'
      },
      {
        ch_discribtion: '报名开始日期',
        value: '年-月-日'
      },
      {
        ch_discribtion: '报名开始时间',
        value: '00:00'
      },
      {
        ch_discribtion: '报名结束日期',
        value: '年-月-日'
      },
      {
        ch_discribtion: '报名结束时间',
        value: '00:00'
      },
      {
        ch_discribtion: '活动介绍',
        value: ''
      },
      {
        ch_discribtion: '顶部照片',
        value: ''
      },
      {
        ch_discribtion: '相关照片',
        value: {}
      },
      {
        ch_discribtion: '一个微信号可报名次数',
        value: '1'
      },
      {
        ch_discribtion: '报名人数上限',
        value: ''
      },
      {
        ch_discribtion: '超过人数上限后是否允许排队',
        value: false
      },
      {
        ch_discribtion: '只有发起者和管理员可以分享活动',
        value: false
      },
      {
        ch_discribtion: '报名用户可以查看报名名单',
        value: false
      },
      {
        ch_discribtion: '未报名也可看报名名单',
        value: false
      },
      {
        ch_discribtion: '使用签到功能',
        value: false
      }
    ],
    enroll_item:[
      {
        ch_discribtion: '姓名',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special:'false'
      },
      {
        ch_discribtion: '性别',
        propery: '',
        item_type: 'single_selection',
        checked: false,
        special: 'false',
        option:['男' , '女']
      },
      {
        ch_discribtion: '年龄',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '手机',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '公司名称',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '部门',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '职位',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '学历',
        propery: '',
        item_type: 'single_selection',
        checked: false,
        special: 'false',
        option:['博士','硕士', '本科' , '大专' , '中专' , '其他']
      },
      {
        ch_discribtion: '定位',
        propery: '',
        item_type: 'address',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '备注',
        propery: '',
        item_type: 'multiline_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '身份证',
        propery: '',
        item_type: 'single_line_input',
        checked: false,
        special: 'false'
      },
      {
        ch_discribtion: '手写签名',
        propery: '',
        item_type: 'hand_writing',
        checked: false,
        special: 'false'
      },
    ],
    have_choose_enroll_item:[],
    have_choose_enroll_item_string:'',
    flag_new_entoll_need: 0,
    new_enroll_need: [],
    save_new_activaty:[],   
    current:0,
    choose_type:"",
    action_word:'发布',
    action:'add',
    date_now:'',   //当前日期
    time_now:''  //当前时间
  }, 
  //事件处理函数
  onLoad: function (options) {
    var that = this;

    var clock = that.CurentTime();
   
    //获取当前时间
    that.setData({
      date_now:clock.substring(0 , 10),
      time_now: clock.substring(11 , 16),
     
    })

    //所有日期picker默认值是今天
    that.setData({
      'new_activity_form[2].value': that.data.date_now,
      'new_activity_form[4].value': that.data.date_now,
      'new_activity_form[6].value': that.data.date_now,
      'new_activity_form[8].value': that.data.date_now,
    })

    

    console.log(that.data.date_now);
    console.log(that.data.new_activity_form);
    // console.log(that.data.time_now);



    //修改活动
    if (getApp().globalData.flag_new_entoll_need == 0 && options.action == 'modify')
    {
      that.setData({
        action: options.action,
        action_word:'修改',
        activity_id: options.activity_id
        })
      //获取该活动报名上传的所有信息
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/get_activity',
        method: 'GET',
        data: {
          activity_id: that.data.activity_id,
        },
        success: function (obj) {
          console.log("取回来的活动所有信息：");
          console.log(obj);

          //第一部分
          //将取回来的基本信息添加到new_activity_form数组的每个value中去
          for(var i = 0 ; i < obj.data[0].length ; i++)
          {
            console.log(that.data.new_activity_form[i]['ch_discribtion']);
            if (that.data.new_activity_form[i]['ch_discribtion'] == '相关照片') 
            {
              //如果该数组长度不为空，即有上传相关照片
              if (obj.data[0][i][0] != '') {
                that.setData({
                  flag_other: 1,
                  height_other: 326,
                })
              }
            }
           
            if (that.data.new_activity_form[i]['ch_discribtion'] == '顶部照片') 
            {
              console.log("顶部图片");
              //如果该数组长度不为空，即有上传顶部图片
              if (obj.data[0][i] != '')
               {
                that.setData({
                  flag_top: 1,
                  height_top: 326,
                })
              }
            }
  
            var ping = 'new_activity_form[' + i + '].value'
            that.setData({
              [ping]: obj.data[0][i]
            })          
          }





          //第二部分
          //将报名所需填写的项目
          for (var i = 0; i < obj.data[1].length; i++) 
          {
            //不是自定义
            if (obj.data[1][i]['special'] == 'false')
            {
              var flag = 0;
              for (var j = 0; j < that.data.enroll_item.length; j++) 
              {
                if (obj.data[1][i]['ch_discribtion'] == that.data.enroll_item[j]['ch_discribtion'] )
                {
                  var checked = 'enroll_item[' + j + '].checked';
                  var propery = 'enroll_item[' + j + '].propery';
                  that.setData({
                    [checked]: true,
                    [propery]: obj.data[1][i]['propery']
                  })

                  // 将已经选了的项目，添加到have_choose_enroll_item数组中去，以便在前端显示
                  that.data.have_choose_enroll_item.push(that.data.enroll_item[j]['ch_discribtion']);

                  // 将数组转换成字符串，join()函数，自动分隔符为逗号
                  var str = that.data.have_choose_enroll_item.join();
                  that.setData({
                    have_choose_enroll_item_string: str
                  })
                }
              }  
            }           
            else if (obj.data[1][i]['special'] == 'true')
            {
              //是自定义
              console.log("知自定义的");
              var enroll_item_copy = [];
              var arr = {};

              enroll_item_copy = that.data.enroll_item;

              arr['ch_discribtion'] = obj.data[1][i]['ch_discribtion'];
              arr ['propery'] =  obj.data[1][i]['propery'];
              arr['item_type'] =  obj.data[1][i]['type'];
              arr['checked'] =  true;
              arr['special'] =  obj.data[1][i]['special'];

              if (obj.data[1][i]['type'] == 'checkbox' || obj.data[1][i]['type'] == 'single_selection')
              {
                // arr['option'] = obj.data[1][i]['option'];
                arr['option'] = [];
                for (var k = 0; k < obj.data[1][i]['option'].length ; k++)
                {
                  arr['option'].push(obj.data[1][i]['option'][k]['option']);
                }
              }

              enroll_item_copy.push(arr);

              that.setData({
                enroll_item: enroll_item_copy
              })


              // 将已经选了的项目，添加到have_choose_enroll_item数组中去，以便在前端显示
              that.data.have_choose_enroll_item.push(obj.data[1][i]['ch_discribtion']);

              // 将数组转换成字符串，join()函数，自动分隔符为逗号
              var str = that.data.have_choose_enroll_item.join();
              that.setData({
                have_choose_enroll_item_string: str
              })
            }
           

          }
          // console.log("赋值后的new_activity_form");
          // console.log(that.data.new_activity_form);   
          console.log("赋值后的enroll_item");
          console.log(that.data.enroll_item);         
        }


        
      })

    }




    //从定位页面回来
    if (getApp().globalData.flag_address == 1) 
    {
      var a = "new_activity_form[1].value";
      that.setData({
        new_activity_form: getApp().globalData.save_new_activaty,
        enroll_item: getApp().globalData.save_enroll_item,
        // 定位的文本
        [a]: getApp().globalData.new_address
      })
    }
    


    //从自定义页面跳转回来
    if (getApp().globalData.flag_new_entoll_need == 1) 
    {
      that.setData({
        new_activity_form: getApp().globalData.save_new_activaty,
        enroll_item: getApp().globalData.save_enroll_item,
        action: options.action,
        activity_id: options.activity_id
      })
    }



    //从定位页面回来 || 从自定义页面跳转回来
    if (getApp().globalData.flag_address == 1 || getApp().globalData.flag_new_entoll_need == 1)
    {

      for (var i = 0; i < that.data.new_activity_form.length; i++) {
        //顶部照片的值不为空，即跳转之前曾上传
        if (that.data.new_activity_form[i]['ch_discribtion'] == '顶部照片' && that.data.new_activity_form[i]['value'] != '') {
          that.setData({
            flag_top: 1,
            height_top: 326,
          })
        }
        //相关照片的值不为空，即跳转之前曾上传
        else if (that.data.new_activity_form[i]['ch_discribtion'] == '相关照片' && that.data.new_activity_form[i]['value'] != '') {
          that.setData({
            flag_other: 1,
            height_other: 326,
          })
        }
      }
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

  },



  //定位
  get_address:function(e)
  {
    //保存已填项目
    this.save_already();

    wx.navigateTo({
      url: '/pages/location/location?',
    })  
  },


  //input绑定事件
  get_input: function (e) {
    console.log("input绑定事件：");
    console.log(e);

    var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "new_activity_form[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    console.log("赋值后的new_activity_form数组：");
    console.log(this.data.new_activity_form);
  },




  //picker绑定事件
  bind_change: function (e)
  {
    console.log("picker绑定事件");
    console.log(e);

    var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "new_activity_form[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    console.log("picker赋值后数组：");
    console.log(this.data.new_activity_form);

  },



  //switch绑定事件
  bind_switch:function(e)
  {
    console.log("switch绑定事件");
    console.log(e);

    var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "new_activity_form[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    console.log("switch赋值后数组：");
    console.log(this.data.new_activity_form);

  },
  

  // // 活动开始日期
  // bind_change_activity_begin_date:function(e)
  // {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  //   this.bind_change_activity_begin_time();
  // },


  // // 活动开始时间
  // bind_change_activity_begin_time: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },

  // // 活动结束日期
  // bind_change_activity_finish_date: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },



  // // 活动结束时间
  // bind_change_activity_finish_time: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },

  // // 报名开始日期
  // bind_change_enroll_begin_date: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },

  // // 报名开始时间
  // bind_change_enroll_begin_time: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },

  // // 报名结束日期
  // bind_change_enroll_finish_date: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },

  // // 报名结束时间
  // bind_change_enroll_finish_time: function (e) {
  //   console.log("picker绑定事件");
  //   console.log(e);

  //   var value = e.detail.value;
  //   var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

  //   this.bind_change(value, item_index);
  // },



















  // 添加顶部横幅图片
  add_top_img:function(e)
  {
    console.log("添加顶部横幅图片");

    var a = '';
    var that = this;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath 

        var tempFilePaths = res.tempFilePaths
        that.setData({
          flag_top:  1,
        })

        var ping = "new_activity_form[" + item_index + "].value";

        var a = JSON.stringify(tempFilePaths[0]);

        //将双引号去掉
        a = a.substring(1);
        var index = a.indexOf('"');
        a = a.substring(0, index);

        that.setData({
          [ping]: a
        })
      }
    })
    console.log("添加顶部横幅图片后数组");
    console.log(this.data.new_activity_form) ;   
  },
  change_height_top:function()
  {
    this.setData({
      height_top:326
    })
  },
  delete_change_height_top:function()
  {
    this.setData({
      height_top: 172
    })
  },
  delete_preview_top:function()
  {
    this.setData({
      flag_top: 0
    })
  },
  delete_change_height_top:function()
  {
    this.setData({
      height_top:172
    })
  },




  // // 添加其他相关图片
  add_other_img: function (e) {
    console.log("添加其他相关图片");
    var a = '';
    var that = this;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          flag_other: 1
        })

        var ping = "new_activity_form[" + item_index + "].value";

        var a = JSON.stringify(tempFilePaths[0]);

        //将双引号去掉
        a = a.substring(1);
        var index = a.indexOf('"');
        a = a.substring(0, index);

        that.data.other_img.push(a);

        that.setData({
          [ping]:  that.data.other_img
        })
      }
    })

    console.log("添加其他图片后数组");
    console.log(this.data.new_activity_form); 
  },
  change_height_other: function () {
    this.setData({
      height_other: 326
    })
  },
  delete_change_height_other: function () {
    this.setData({
      height_other: 172
    })
  },
  delete_preview_other: function () {
    this.setData({
      flag_other: 0
    })
  },
  delete_change_height_other: function () {
    this.setData({
      height_other: 172
    })
  },




  // 点击某一“报名所需项目”时显示模态层，并获取当前点击的是enroll_item数组中的第几个的信息
  show_modal:function(e)
  {
     this.setData({
       isShow:'',
       current: e.currentTarget.dataset.current ,
     })

  },


  // 设置为必填项
  set_require:function(e)
  {
    console.log("设置为必选项");

    var checked = 'enroll_item[' + this.data.current + '].checked';
    var propery = 'enroll_item[' + this.data.current + '].propery';
    var name = this.data.enroll_item[this.data.current]['ch_discribtion'];

    console.log(checked);
    
    this.setData({
      isShow: 'none',
      [checked]: true,    
      [propery]: 'required'
    });

    console.log("当前的已选项目字符串");
    console.log(this.data.have_choose_enroll_item);

    // // 将已经选了的项目，添加到have_choose_enroll_item数组中去，以便在前端显示
    // this.data.have_choose_enroll_item.push(name);

    // // 将数组转换成字符串，join()函数，自动分隔符为逗号
    // var str = this.data.have_choose_enroll_item.join();
    // this.setData({
    //   have_choose_enroll_item_string : str
    // })

    console.log("设置为必填后的数组");
    console.log(this.data.enroll_item);

  },




  // 设置为选填项
  set_choose:function()
  {
    console.log("设置为选填项");
    var checked = "enroll_item[" + this.data.current + "].checked";
    var propery = "enroll_item[" + this.data.current + "].propery";
    var name = this.data.enroll_item[this.data.current]['ch_discribtion'];


    this.setData({
      isShow: 'none',
      [checked]: true,
      [propery]: "choose"
    })  

    console.log("当前的已选项目字符串");
    console.log(this.data.have_choose_enroll_item);

    // // 将已经选了的项目，添加到have_choose_enroll_item数组中去，以便在前端显示
    // this.data.have_choose_enroll_item.push(name);

    // // 将数组转换成字符串，join()函数，自动分隔符为逗号
    // var str = this.data.have_choose_enroll_item.join();
    // this.setData({
    //   have_choose_enroll_item_string: str
    // })

    console.log("设置为选填后的数组"); 
    console.log(this.data.enroll_item);
    
  },




  //取消选中
  quit_choose:function()
  {
    console.log("取消选中");
    var checked = "enroll_item[" + this.data.current + "].checked";
    var propery = "enroll_item[" + this.data.current + "].propery";
    var name = this.data.enroll_item[this.data.current]['ch_discribtion'];


    this.setData({
      isShow: 'none',
      [checked]: false,
      [propery]: ""
    })

    console.log("当前的已选项目字符串");
    console.log(this.data.have_choose_enroll_item);

    // // 将已经选了的项目，添加到have_choose_enroll_item数组中去，以便在前端显示
    // this.data.have_choose_enroll_item.push(name);

    // // 将数组转换成字符串，join()函数，自动分隔符为逗号
    // var str = this.data.have_choose_enroll_item.join();
    // this.setData({
    //   have_choose_enroll_item_string: str
    // })

    console.log("取消选中后的数组");
    console.log(this.data.enroll_item);
  },


  //跳转到别的页面时，将已填的项目保存
  save_already:function()
  {
    getApp().globalData.save_have_choose = this.data.have_choose_enroll_item;
    getApp().globalData.save_new_activaty = this.data.new_activity_form;
    getApp().globalData.save_enroll_item = this.data.enroll_item; 
  },


  // 添加自定义
  add_diy:function(e)
  {
    getApp().globalData.save_have_choose = this.data.have_choose_enroll_item;
    getApp().globalData.save_new_activaty = this.data.new_activity_form;  
    getApp().globalData.save_enroll_item = this.data.enroll_item; 

    wx.navigateTo({
      url: '/pages/custom_item/custom_item?action='+this.data.action + '&activity_id='+
      this.data.activity_id,
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




  // 表单提交
  formSubmit:function(e)
  {
    console.log("表单提交");
    console.log(e);

    var that = this;

    //获取当前时间
    var add_time = that.CurentTime();
    console.log("当前时间");
    console.log(add_time);

    //如果选择了使用签到功能
    //则在表单提交时给数组添加一项
    if (that.data.new_activity_form[19]['value'] == true)
    {
      var a = {};
      a['ch_discribtion'] = '签到';
      a['checked'] = true;
      a['item_type'] = 'boolean';
      a['propery'] = 'required';
      a['special'] = 'sign';
    }

    that.data.enroll_item.push(a);

    console.log("添加签到后的数组");
    console.log(that.data.enroll_item);
    console.log("此时的基本信息数组");
    console.log(that.data.new_activity_form);

    // 提交表单到后台
    //成功则进入回调函数，后台返回一个活动id，跳转到添加成功页面，并传递id
    if(this.data.action == 'add')
    {
      console.log("add");
      console.log(getApp().globalData.openid);
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/save_new_activity',
        method: 'GET',
        data: {
          new_activity_form: that.data.new_activity_form,
          enroll_item: that.data.enroll_item,
          openid: getApp().globalData.openid,
          add_time: add_time,
        },
        success: function (obj) {
          console.log(obj);

          wx.showToast({
            title: '创建成功',
            duration: 2000
          })

          //跳转回活动详细页
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/srt_activity_main/srt_activity_main',
            })
          }, 2000)
          
        },
        header: {
          'Content-type': 'application/json'
        }
      })
    }
    else if(this.data.action =='modify')
    {
      console.log("现在的活动id");
      console.log(that.data.activity_id);
      console.log("即将修改，现在的enroll_item");
      console.log(that.data.enroll_item);
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/modify_activity',
        method: 'GET',
        data: {
          activity_id: that.data.activity_id,
          new_activity_form: that.data.new_activity_form,
          enroll_item: that.data.enroll_item,
          openid: getApp().globalData.openid,
          add_time: add_time,
        },
        success: function (obj) {
          console.log(obj);

          wx.showToast({
            title: '修改成功',
            duration: 2000
          })

          //跳转回活动详细页
          setTimeout(function () {
            // wx.switchTab({
            //   url: '/pages/srt_activity_main/srt_activity_main',
            // })
            wx.navigateTo({
              url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_id + '&openid=' + getApp().globalData.openid,
            })
          }, 2000)


        },
        header: {
          'Content-type': 'application/json'
        }
      })
    }
  },




  //点击模态层取消显示
  quit_cover: function () {
    this.setData({
      isShow: 'none',

    })
  },




  //改变view高度
  change_height:function(e)
  {
    console.log("改变高度");
    console.log(e);
  }
})



