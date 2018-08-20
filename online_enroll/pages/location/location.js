// pages/location/location.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Height:0,
    latitude:0,
    longitude:0,
    near_latitude:0,
    near_longitude:0,
    address:'',
    name:'',
    arr:[],
    choose_index:0  , //当前选中的地址条
    search_content:'',  //搜索框中输入的内容
    search_result:[]  ,  //输入关键词后匹配的结果  
    final_address : '' ,   //最后确定的地址
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'UDABZ-WM5KQ-WA25Q-GFSSX-4BXP6-XAFUP' // 必填
    });

    var that = this;    
    // that.openMap();
    

    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {

        that.setData({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬  
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经   
        })



        //2、
        //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        
        that.get_near();
        // var i = 0 ; 
        // var j = 0;
        // var flag = true;

        // //每隔半分钟执行一次
        // setInterval(function(){
        //   if (flag && i < 0.005) {

        //     console.log("进来了");
        //     flag = false;

        //     var q_latitude = that.data.latitude - i;
        //     var q_longitude = that.data.longitude - i;

        //     qqmapsdk.reverseGeocoder({
        //       location: {
        //         latitude: q_latitude,
        //         longitude: q_longitude
        //       },
        //       success: function (addressRes) {

        //         console.log("坐标转地址成功");
        //         console.log(addressRes);

        //         var address = 'arr[' + j + '].address';
        //         var name = 'arr[' + j + '].name';
        //         var choose = 'arr[' + j + '].choose';

        //         that.setData({
        //           [address]: addressRes.result.address,
        //           [name]: addressRes.result.formatted_addresses.recommend
        //         })

        //         if(j == 0)
        //         {
        //           that.setData({
        //             [choose]: true,
        //           })
        //         }
        //         else
        //         {
        //           that.setData({
        //             [choose]: false,
        //           })
        //         }

        //         flag = true;

        //         i = i + 0.0004
        //         j = j + 1;
        //       }

        //     })
        //   }
        // },500)
        
        

        


      }
      
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
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });
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





  //获取附近地址，赋值给数组
  get_near:function()
  {
    var that = this;

    var i = 0;
    var j = 0;
    var flag = true;

    //每隔半分钟执行一次
    setInterval(function () {
      if (flag && i < 0.005) {

        console.log("进来了");
        flag = false;

        var q_latitude = that.data.latitude - i;
        var q_longitude = that.data.longitude - i;

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: q_latitude,
            longitude: q_longitude
          },
          success: function (addressRes) {

            console.log("坐标转地址成功");
            console.log(addressRes);

            var address = 'arr[' + j + '].address';
            var name = 'arr[' + j + '].name';
            var choose = 'arr[' + j + '].choose';

            that.setData({
              [address]: addressRes.result.address,
              [name]: addressRes.result.formatted_addresses.recommend
            })

            if (j == 0) {
              that.setData({
                [choose]: true,
              })
            }
            else {
              that.setData({
                [choose]: false,
              })
            }

            flag = true;

            i = i + 0.0004
            j = j + 1;
          }

        })
      }
    }, 500)
  },




 



  //点击某个地址条，设置为选中，之前选中的取消选中
  set_choose:function(e)
  {
    var current = e.currentTarget.dataset.current;     //当前点击的地址条

    var old_choose = 'arr[' + this.data.choose_index + '].choose';   //点击事件之前，选中的地址条
    var new_choose = 'arr[' + current + '].choose';   //点击事件之前，选中的地址条
   

    this.setData({
      [old_choose] :false,
      [new_choose] : true,
      choose_index: current,
      final_address: this.data.arr[current].name
    })
  },




  // 获取搜索框内容
  search_content:function(e)
  {
      console.log(e);

      var that = this;

      // 实例化腾讯地图API核心类
      qqmapsdk = new QQMapWX({
        key: 'UDABZ-WM5KQ-WA25Q-GFSSX-4BXP6-XAFUP' // 必填
      });


      this.setData({
        search_content: e.detail.value
      })

      qqmapsdk.getSuggestion({
        keyword: e.detail.value,
        success: function (res) {
          console.log("关键词搜索结束");
          console.log(res);


          // 将搜索结果赋值给一个数组
          that.setData({
            search_result:res.data
          })


        },
        fail: function (res) {
          console.log(res);
        }
      });
  },


  // 搜索地点
  search:function(e)
  {
    var that = this;

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'UDABZ-WM5KQ-WA25Q-GFSSX-4BXP6-XAFUP' // 必填
    });


    //获取该关键词搜索结果的第一个结果，取其经纬度
    var latitude = that.data.search_result[0].location.lat;
    var longitude = that.data.search_result[0].location.lng;

    //赋值给经纬度变量，用于在前端map控件根据经纬度值显示地址
    that.setData({
      latitude: latitude,
      longitude: longitude
    })


    //将附近地址的数组替换掉
    this.get_near();

    //下拉列表不显示：
    //将搜索结果数组置空
    var arr = [];
    that.setData({
      search_result: arr
    })
  },




  //打开地图
  //地址转坐标
  openMap: function (address) {
    var that = this;

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'UDABZ-WM5KQ-WA25Q-GFSSX-4BXP6-XAFUP' // 必填
    });

    qqmapsdk.geocoder({
      address: address,
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
  },






  //在搜索结果中点击某一地址
  //以该地址的经纬度，打开地图
  choose_address:function(e)
  {
    console.log(e);

    //获取是第几个搜索结果触发了点击事件
    var index = e.currentTarget.dataset.current;

    // //获取该地址的经纬度
    var latitude = this.data.search_result[index]['location']['lat'];
    var longitude = this.data.search_result[index]['location']['lng'];

    //获取选中的地址的文本
    var choose_address = this.data.search_result[index]['title'];

    //赋值给经纬度变量，用于在前端map控件根据经纬度值显示地址
    this.setData({
      latitude:latitude,
      longitude: longitude
    })

    //将附近地址的数组替换掉
    this.get_near();

    //1将选中的地址的全称显示在搜索框内
    this.setData({
      searchValue: choose_address
    })


    //下拉列表不显示：
    //将搜索结果数组置空
    var arr = [];
    this.setData({
      search_result: arr
    })
  },




  //点击完成
  complete:function(e)
  {
    //跳转回本来页面
    //传递选中的地址条的文本
    if (this.data.arr[0].choose == true)
    {
      //如果第一个地址条被选中
      getApp().globalData.new_address = this.data.arr[0].name;
    }
    else
    {
      //如果第一个地址条未被选中，则肯定点击了其他地址条，即触发了set_choose函数
      //则final_address被赋值为选中的地址文本
      getApp().globalData.new_address = this.data.final_address;
    }
    
    //置位标志位为1，表示是从定位页面回来
    getApp().globalData.flag_address = 1;

    wx.navigateTo({
      url: '/pages/srt_new_activity/srt_new_activity',
    }) 
  }

})