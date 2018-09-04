import Engine from '../Engine'

export default class Weixin {
  static _systemInfo

  static getSystemInfo = () => {
    if (!Weixin._systemInfo) {
      Weixin._systemInfo = wx.getSystemInfoSync()
    }

    return Weixin._systemInfo
  }

  static checkSession = () => {
    return new Promise((resolve) => {
      wx.checkSession({
        success: function () {
          resolve(true)
        },
        fail: function () {
          resolve(false)
        },
      })
    })
  }

  static isAndroid = () => {
    return Weixin.getSystemInfo().system.indexOf('iOS') === -1
  }

  static login = () => {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }

  static getUserInfo = (lang) => {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        lang,
        withCredentials: true,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }

  static authorize = (scope) => {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }

  static showToast = (title, duration = 1500) => {
    wx.showToast({ title, duration, icon: 'none' })
  }

  static showLoading = (option, immediately) => {
    Weixin._loadingCount++
    clearTimeout(Weixin._loadingTimer)
    if (immediately) {
      Weixin._handleLoading(option)
    } else {
      Weixin._loadingTimer = setTimeout(() => Weixin._handleLoading(option), 1000)
    }
  }

  static hideLoading = (immediately) => {
    Weixin._loadingCount--
    clearTimeout(Weixin._loadingTimer)
    if (immediately) {
      Weixin._handleLoading()
    } else {
      Weixin._loadingTimer = setTimeout(() => Weixin._handleLoading(), 1000)
    }
  }

  static chooseAddress = () => {
    return new Promise((resolve, reject) => {
      wx.chooseAddress({
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        },
      })
    })
  }

  static navigateBack = () => {
    wx.navigateBack()
  }

  static reLaunch = (url) => {
    wx.reLaunch({ url })
  }

  static redirectTo = (path, query = {}) => {
    const queryString = Engine.formatQuery(query)
    let url = path
    if (queryString) {
      url = `${url}?${queryString}`
    }

    wx.redirectTo({ url })
  }

  static navigateTo = (path, query = {}) => {
    const queryString = Engine.formatQuery(query)
    let url = path
    if (queryString) {
      url = `${url}?${queryString}`
    }

    wx.navigateTo({ url })
  }

  static request = (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        success: function (res) {
          resolve(res)
        },
        fail: function () {
          reject(err)
        },
      })
    })
  }

  static _handleLoading = (option) => {
    if (Weixin._loadingCount) {
      if (!Weixin._isLoadingShow) {
        Weixin._isLoadingShow = true
        wx.showLoading(option)
      }
    } else if (Weixin._isLoadingShow) {
      Weixin._isLoadingShow = false
      wx.hideLoading(option)
    }
  }
}
