Page({
  onLoad: function () {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      complete: res => {
        console.log('callFunction test result: ', res)
      }
    })

    wx.cloud.database().collection('todos').get().then((res)=>{
      console.warn(res)
    })
  },
})
