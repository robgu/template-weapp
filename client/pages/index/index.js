Page({
  onLoad: function () {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      complete: res => {
        // eslint-disable-next-line
        console.log('callFunction test result: ', res)
      },
    })

    wx.cloud.database().collection('todos').get().then((res) => {
      // eslint-disable-next-line
      console.warn(res)
    })
  },
})
