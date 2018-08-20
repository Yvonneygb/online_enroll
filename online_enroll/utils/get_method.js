/**
 * get方式的请求都在这里
 */
function myRequestByGet(url, data, callback) {
  console.log(data);
  wx.request({
    url: url,
    data: {
      jsonData: data
    },
    success: function (obj) {
      callback(obj);
    },
    header: {
      'Content-type': 'application/json'
    }
  })
}

module.exports = {
   myRequestByGet: myRequestByGet
}