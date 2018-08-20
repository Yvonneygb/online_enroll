// pages/enroll_form/enroll_form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:'',
    flag_top: 0,
    flag_img:0,
    tempFilePaths:'',
    tempFilePaths: '',
    src:'',
    height_top:172,
    allow_enroll: 1,
    have_entoll_num: 5,//已经报名的人数，从【报名】表中读取行数
    enroll_num: 10,
    is_submit:false,
    is_post:true,
    enroll_need:[
      // ['name','姓名', 'required','single_line_input'],
      // ['sex', '性别', 'required','single_selection',
      //   ['','男','女']
      // ],
      // ['born_date', '出生日期', 'required', 'date'],
      // ['time', '到场时间', 'required', 'time'],
      // ['age', '年龄', 'required', 'single_lisne_input'],
      // ['province', '籍贯', 'required', 'province'],
      // ['telephone', '手机', 'required', 'single_line_input'],
      // ['company_name', '公司名称', 'required', 'single_line_input'],
      // ['apartment', '部门', 'required', 'single_line_input'],
      // ['position', '职位', 'required', 'single_line_input'],
      // ['education', '学历', 'choose','single_selection',
      //   ['','大学本科', '专科']
      // ],
      // ['address','定位','choose','address'],
      // ['remarks', '备注', 'choose', 'multiline_input'],
      // ['identity', '身份证', 'choose', 'single_line_input'],
      // ['hobit', '爱好', 'choose', 'checkbox',
      //   [
      //     ['游泳', false],
      //     ['画画', false],
      //     ['足球', false]
      //   ]
      // ],
      // ['avatar', '照片', 'choose', 'image'],
      // ['hand_writing', '手写签名', 'choose','hand_writing']    
    ],
    save_data:[],
    save_data_2:'',
    flag_data:0,
    save_data_jzd:'',
    end:[],
    date:'',
    time:'',
    index: 0,
    isShow:'none',
    arr_img:[
      ['add', 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/add.png' , 'hide'],
    ],
    action:'',   //该页面的主要操作：报名 或  修改/取消报名
    img_info:[]  //照片的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var that = this;

    console.log("7777777777777777");
    console.log(getApp().globalData.flag_enroll_form);
    if (getApp().globalData.flag_enroll_form == 0) 
    {
      this.setData({
        activity_id: options.activity_id,
        action: options.action
      })

      console.log("主页传过来的活动id:");
      console.log(this.data.activity_id);
      console.log("主页传过来的动作:");
      console.log(this.data.action);

      //取所需要填的项目以及类型等
      wx.request({
        url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/get_enroll_form_item',
        method: 'GET',
        data: {
          activity_id: that.data.activity_id,
          action: that.data.action,
          openid: getApp().globalData.openid
        },
        success: function (obj) {
          console.log(obj);
          that.setData({
            enroll_need: obj.data
          })

          for (var i = 0; i < that.data.enroll_need.length; i++) 
          {
            if (that.data.enroll_need[i]['type'] == 'image') 
            {
              console.log("有照片");
              var flag = 'enroll_need[' + i + '].flag';
              var view_height = 'enroll_need[' + i + '].view_height';

              if (that.data.enroll_need[i]['value'][0 ]!= '')
              {
                that.setData({
                  [flag]:1,
                  [view_height]: 326
                })
              }
              else
              {
                that.setData({
                  [flag]: 0,
                  [view_height]:172
                })
              }
            
              
            }
            else if (that.data.enroll_need[i]['type'] == 'hand_writing')
            {
              var flag = 'enroll_need[' + i + '].flag';
              var view_height = 'enroll_need[' + i + '].view_height';

              if (that.data.enroll_need[i]['value'] != '')
              {
                that.setData({
                  [flag]: 1,
                  [view_height]:326
                })
              }
              else
              {
                that.setData({
                  [flag]: 0,
                  [view_height]: 172
                })
              }
                
              
              
            }

            if (that.data.action == 'add')
            {
              var show = 'enroll_need[' + i + '].show';
              var is_null = 'enroll_need[' + i + '].is_null';
              that.setData({
                [show]: 'none',
                [is_null]: true
              })
            }
            else
            {
              var show = 'enroll_need[' + i + '].show';
              var is_null = 'enroll_need[' + i + '].is_null';
              that.setData({
                [show]: 'none',
                [is_null]: false
              })
            }
          }

          console.log("添加完后的数组");
          console.log(that.data.enroll_need);
        },
        header: {
          'Content-type': 'application/json'
        }
      })
    }

   


    if (getApp().globalData.flag_enroll_form == 1) 
    {
      console.log("改过后传回来的数据：");
      console.log(options.url);

      that.setData({
        action:options.action,
        activity_id: options.activity_id
      })
      
      //  找出手写签名的位置
      var index_of_hand_writing = 0;
      for (var i = 0; i < getApp().globalData.save_enroll_form.length ; i++)
      {
        if (getApp().globalData.save_enroll_form[i]['ch_discribtion'] == '手写签名')
        {
          index_of_hand_writing = i;
        }
      }

      var ping = "enroll_need[" + index_of_hand_writing + "].value";
      that.setData({
        enroll_need: getApp().globalData.save_enroll_form,
        [ping]: options.url,
      })

      console.log("传回来之后存进去之后的数组：");
      console.log(this.data.enroll_need);

      //进行一系列照片的变化
      if (this.data.enroll_need[index_of_hand_writing]['value'] != undefined) 
      {
        console.log("手写签名不为空");
        var flag = 'enroll_need[' + index_of_hand_writing + '].flag';
        var view_height = 'enroll_need[' + index_of_hand_writing + '].view_height';

        this.setData({
          [flag]: 1,
          [view_height]: 326
        })


         
      }


      //手写签名回来，根据是否为空赋值is_null
      for (var i = 0; i < this.data.enroll_need.length; i++)
      {
        //对于多选框，只要有一项的checked是true，就设置为不为空
        if (that.data.enroll_need[i]['type'] == 'checkbox') {
          var flag = 0;
          for (var b = 0; b < that.data.enroll_need[i]['option'].length; b++) {
            if (that.data.enroll_need[i]['option'][b]['checked'] == true) {
              flag = 1;
            }
          }
          if (flag == 1) 
          {
            var is_null = "enroll_need[" + i + "].is_null";
            that.setData({
              [is_null]: true
            })
          }
        }    
        else if(this.data.enroll_need[i]['value'] != '')
        {
          var is_null = "enroll_need[" + i + "].is_null";
          var show = 'enroll_need[' + i + '].show';
          that.setData({
            [is_null]: false,
            [show]:'none'
          })
        }

          
      }

      console.log("手写签名回来，根据是否为空赋值is_null");
      console.log(that.data.enroll_need);

      // 如果从手写签名传过来的数不为空
      // if (getApp().globalData.save_enroll_form != undefined) {
      //   console.log("手写签名传过来的数据不为空");
      //   this.setData({
      //     flag_data: 1
      //   })
       
      //   var end = [];
      //   var flag_have = 0;
      //   var big_array = [];
      //   for (var i = 0; i < this.data.enroll_need.length; i++) 
      //   {
      //     console.log("次数");
      //     for (var j = 0; j < getApp().globalData.save_enroll_form.length; j++) 
      //     {
      //       if (this.data.enroll_need[i][0] == getApp().globalData.save_enroll_form[j][0]) 
      //       {
      //         flag_have = 1;
      //         end.push([getApp().globalData.save_enroll_form[j][0], getApp().globalData.save_enroll_form[j][1], this.data.enroll_need[i][2], this.data.enroll_need[i][3], this.data.enroll_need[i][1]]);

      //         // 对顶部照片做处理
      //         if (this.data.enroll_need[i][0] == "avatar") {
      //           console.log("对照片进行操作");
      //           that.setData({
      //             flag_img: 1,
      //             height_other: 326,
      //             tempFilePaths: end[i][1]
      //           })
      //         }
      //       }
      //     }
      //     console.log(flag_have);
      //     if (flag_have == 0) {
      //       console.log("没有提交");
      //       end.push([this.data.enroll_need[i][0], '', this.data.enroll_need[i][2], this.data.enroll_need[i][3], this.data.enroll_need[i][1]]);
      //     }
      //     flag_have = 0;
      //   }
      //   this.setData({
      //     end: end
      //   })
      // }

      // console.log("最后的end");
      // console.log(this.data.end);
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




  // 跳转到手写签名，并保存已经填写的数据
  add_top_img: function (e) {
    var that = this;

    // 保存已填数据
    getApp().globalData.save_enroll_form = this.data.enroll_need;

      wx.navigateTo({
        url: '/pages/hand_writing/hand_writing?action=' + that.data.action + '&activity_id=' + that.data.activity_id,
      })  

  },
  // change_height_top: function () {
  //   console.log("改高度");
  //   this.setData({
  //     height_top: 326
  //   })
  // },
  // delete_change_height_top: function () {
  //   this.setData({
  //     height_top: 172
  //   })
  // },
  delete_preview_top: function (e) {
    // this.setData({
    //   flag_top: 0
    // })
    console.log("删除手写签名");
    console.log(e);
    var item_index = e.currentTarget.dataset.current;

    var ping = "enroll_need[" + item_index + "].value";
    var flag = "enroll_need[" + item_index + "].flag";
    var view_height = "enroll_need[" + item_index + "].view_height";

    this.setData({
      [ping]: '',
      [flag]: 0,
      [view_height]: 172
    })


      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
  },

  

  //input绑定函数
  bindKeyInput: function (e) {
    console.log("input引发的函数");
    console.log(e);
    var that = this;

    var value = e.detail.value;   
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "enroll_need[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if(value != '')
    {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else 
    {
      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }
  },



  // 选中省市区，显示
  bindProvinceChange: function (e) {
    console.log("选中省市区");
    console.log(e);
    var that = this;

    var value = e.detail.value;

    //数组转字符串
    value = value.join();
   
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "enroll_need[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if (value != '') {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else {
      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }

    console.log(this.data.enroll_need);
    // var name = e.currentTarget.dataset.name;
    // var value = e.detail.value;
    // that.build_save_data(e, name, value);
  },





  // 选中日期，显示
  bindDateChange: function (e) {
    console.log("选中日期");
    console.log(e);
    var that = this;

    var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "enroll_need[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if (value != '') {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else {
      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }

    console.log(this.data.enroll_need);
    // var name = e.currentTarget.dataset.name;
    // var value = e.detail.value;
    // that.build_save_data(e, name, value);
  },


  // 选中时间，显示
  bindTimeChange:function(e)
  {
    console.log("选中时间");
    console.log(e);
    var that = this;

    var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var a = "enroll_need[" + item_index + "].value";
    this.setData({
      [a]: value
    })

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if (value != '') {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else {
      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = 'enroll_need[' + item_index + '].show';
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }

  },

  // 多选框保存数据
  listenCheckboxChange:function(e)
  {   
    var that = this;

    console.log("多选框：");
    console.log(e);

    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

    var select = [];
    select = e.detail.value;   //获取选中的项的文本值
    console.log("select:");
    console.log(select);
    var non_select = [];

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if (select != '') {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = "enroll_need[" + item_index + "].show";
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else
    {
      //可能之前选中之后已经设置为false，但是后来可能全部取消
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = "enroll_need[" + item_index + "].show";
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }

    for (var i = 0; i < this.data.enroll_need[item_index]['option'].length ; i++)
    {      
      var flag = 0;
      for (var j = 0; j < select.length; j++)
      {
        //如果相同
        if (this.data.enroll_need[item_index]['option'][i]['option'] == select[j])
        {
          //设置为true
          flag = 1;
          var ping = "enroll_need[" + item_index + "].option[" + j + "].checked";
          that.setData({
            [ping] : true
          })
        }           
      } 

      if (flag == 1)  
      {
        //在选中的数组中
      }   
      else{
        //不在选中的数组中
        non_select.push(this.data.enroll_need[item_index]['option'][i]['option']);
      }              
    } 

    console.log(non_select);
    for(var i = 0 ; i < non_select.length ; i++)
    {
      //设置为true
      var ping = "enroll_need[" + item_index + "].option[" + j + "].checked";
      that.setData({
        [ping]: false
      })
    }
    console.log("多选框选中之后：");
    console.log(this.data.enroll_need); 
  },





  // // 上传照片
  add_other_img: function (e) {
    console.log("添加照片");
    console.log(e);
    var that = this;

    // var value = e.detail.value;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法

   

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          // flag_img: 1,
          tempFilePaths: tempFilePaths
        })

        //如果进入成功函数
        //设置其是否为空属性为false
          var is_null = "enroll_need[" + item_index + "].is_null";
          var show = "enroll_need[" + item_index + "].show";
          that.setData({
            [is_null]: false,
            [show]:'none'
          })
       


        
        var ping = "enroll_need[" + item_index + "].value";
        var flag = "enroll_need[" + item_index + "].flag";
        var view_height = "enroll_need[" + item_index + "].view_height";
        var arr_img = [];
        var a = JSON.stringify(tempFilePaths[0]);
        //将双引号去掉
        a = a.substring(1);
        var index = a.indexOf('"');
        a = a.substring(0 , index);


        arr_img.push(a);
        that.setData({
          [ping]: arr_img,
          [flag]:1,
          [view_height]:326
        })

        console.log(that.data.enroll_need);
      }
    })
    
  },

  delete_preview_other: function (e) 
  {
    var item_index = e.currentTarget.dataset.current;

    var ping = "enroll_need[" + item_index + "].value";
    var flag = "enroll_need[" + item_index + "].flag";
    var view_height = "enroll_need[" + item_index + "].view_height";


    this.setData({
      [ping]: '',
      [flag]: 0,
      [view_height]: 172
    })

    //若图片删除，将其是否为空属性值设置回true
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = "enroll_need[" + item_index + "].show";
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
  },



  // picker触发的函数
  bindChange:function(e){
    console.log("picker触发的函数");
    var that = this;
    var item_index = e.target.dataset.current;    //获取是在渲染第几个item的时候触发的方法
    var index = e.detail.value;   //获取第几个被选中
    var select = this.data.enroll_need[item_index]['option'][index];

    var a = "enroll_need[" + item_index + "].value";
    this.setData({
      [a] :select
    })

    //如果所填不为空，即该函数被触发
    //设置其是否为空属性为false
    if (select != '') {
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = "enroll_need[" + item_index + "].show";
      this.setData({
        [is_null]: false,
        [show]:'none'
      })
    }
    else {
      //可能之前填了，但是后来全部删除
      var is_null = "enroll_need[" + item_index + "].is_null";
      var show = "enroll_need[" + item_index + "].show";
      this.setData({
        [is_null]: true,
        [show]:'none'
      })
    }
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
  formSubmit: function (e) 
  {
    var that = this;

    //获取当前时间
    var add_time = that.CurentTime();



    //把照片类型、手写签名的flag和view_height删除
    for (var i = 0; i < that.data.enroll_need.length; i++) 
    {
      if (that.data.enroll_need[i]['type'] == 'image' || that.data.enroll_need[i]['type'] == 'hand_writing') 
      {
        delete that.data.enroll_need[i]['flag'];
        delete that.data.enroll_need[i]['view_height'];
      }
    }

    console.log("删除后的数组");
    console.log(that.data.enroll_need);

    var is_finish = true;
    for (var i = 0; i < that.data.enroll_need.length ; i++)
    {
      console.log("进来");
      //必填但是没填
      if (that.data.enroll_need[i]['propery'] == 'required' && that.data.enroll_need[i]['is_null'] == true)
      {
        console.log("没填")
        is_finish = false;

        //将警示的红字显示出来
        var ping = 'enroll_need[' + i + '].show';
        that.setData({
          [ping] : ''
        })
      }
    }

    if(is_finish == true)
    {
      //全部合格
      for (var i = 0; i < that.data.enroll_need.length; i++)
       {
        delete that.data.enroll_need[i]['is_null'];
        delete that.data.enroll_need[i]['show'];
      }

       if(this.data.action == 'add')
      {
        // 提交表单到后台
        //成功则进入回调函数，跳转回该活动主页面
        //取所需要填的项目以及类型等

        //找到签到那一项的位置
        var index = '';
        for (var i = 0; i < that.data.enroll_need.length ; i++)
        {
          if (that.data.enroll_need[i]['ch_discribtion'] == '签到')
          {
            index = i;
          }
        }
        if(index != '')
        {
          var ping = 'enroll_need[' + index + '].value';
          that.setData({
            [ping]: '否'
          })
        }



        console.log(that.data.enroll_need);
        wx.request({
          url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/save_enroll',
          method: 'GET',
          data: {
            activity_id: that.data.activity_id,
            openid: getApp().globalData.openid,
            time: add_time,
            data: that.data.enroll_need
          },
          success: function (obj) {
            console.log(obj);
            if (obj.data == '您已报名') {
              //报名成功
              wx.showToast({
                title: '您已报名',
                image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
                duration: 2000
              })
            }
            else {
              //报名成功
              wx.showToast({
                title: '报名成功',
                duration: 2000
              })
            }

            //跳转回活动详细页
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_id + '&openid=' + getApp().globalData.openid,
              })
            }, 2000)

          },
          fail: function (obj) {
            console.log('cuowu' + ':' + obj)
          },
          header: {
            'Content-type': 'application/json'
          }
        })
      }
      else if(this.data.action == 'modify')
      {
        wx.request({
          url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/modify',
          method: 'GET',
          data: {
            activity_id: that.data.activity_id,
            openid: getApp().globalData.openid,
            time: '2018-12-12 12:00',
            data: that.data.enroll_need
          },
          success: function (obj) 
          {
            console.log(obj);
            if (obj.data == '您还为报名') 
            {
              //修改失败
              wx.showToast({
                title: '您还为报名',
                image: 'https://mirror.playingfootball.com.cn/uploadfiles/lms/68/201704/enroll_fail.png.png',
                duration: 2000
              })
            }
            else if (obj.data == '修改成功')
            {
              //修改成功
              wx.showToast({
                title: '修改成功',
                duration: 2000
              })

              //将是否从手写签名跳回来的标志置0，
              //否则修改成功后返回详情页，再点进来修改，手写签名的url要取自从手写签名页传回来的url，那么就会是空
              getApp().globalData.flag_enroll_form = 0;
            }

            //跳转回活动详细页
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_id + '&openid=' + getApp().globalData.openid,
              })
            }, 2000)

          },
          fail: function (obj) {
            console.log('cuowu' + ':' + obj)
          },
          header: {
            'Content-type': 'application/json'
          }
        })
      }


    }

      

  

   

   
  },


  //修改报名
  modify:function()
  {
    //调用表单提交函数
    this.formSubmit();
  },


  //取消报名
  quit:function()
  {
    var that = this;
    wx.request({
      url: getApp().globalData.url +'enroll/index.php/SrtEnrollController/quit',
      method: 'GET',
      data: {
        activity_id: that.data.activity_id,
        openid: getApp().globalData.openid,
      },
      success: function (obj) 
      {
          wx.showToast({
            title: '取消成功',
            duration: 2000
          })

          //将是否从手写签名跳回来的标志置0，
          getApp().globalData.flag_enroll_form = 0;

        //跳转回活动详细页
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/srt_show_activity/srt_show_activity?id=' + that.data.activity_id + '&openid=' + getApp().globalData.openid,
          })
        }, 2000)
        
      },
      header: {
        'Content-type': 'application/json'
      }
    })
  },




})



//要做
//“您已报名”的提示图片
//添加照片：前端改动
//"您还可以报名几次"：问浩辉，是不是都是一次
//活动详细页查询是否已经报名：若是，改成“分享”，“运营”，“管理”，“修改、取消报名”
