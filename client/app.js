import './engine/utils/EnhancedPage'
import './engine/utils/EnhancedWeixin'

import { Engine } from './engine/index'
import i18n from './i18n/index'

App({
  onLaunch: function () {
    wx.cloud.init({ env: '', traceUser: true })
    let configs = wx.getExtConfigSync()
    if (!Object.keys(configs).length) {
      // 如果不使用 ext.json 则需要创建 ext.js 配置文件
      const { ext } = require('./ext').default
      configs = ext
    }

    Engine.init({ configs, i18n })
  },

  onShow: function (options) {
    // eslint-disable-next-line
    console.debug('app.onShow', options)
  },
})
