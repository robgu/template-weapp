import Engine from '../Engine'
import I18N from './I18N'

const originalPage = Page // 小程序默认 Page

Page = function (config) {
  const { onReady } = config
  config.onReady = function (options) {
    if (onReady) {
      onReady.call(this, options)
    }

    if (config.onShareAppMessage) {
      wx.showShareMenu({ withShareTicket: true })
    }

    const i18n = I18N.getI18NRes(this.route)
    this.setData({ i18n })
  }

  if (config.onLoad) {
    const { onLoad } = config
    config.onLoad = function (options) {
      if (Page.checkAuthPromise) {
        Page.checkAuthPromise.then(() => {
          onLoad.call(this, options)
        })
      } else {
        onLoad.call(this, options)
      }
    }
  }

  return originalPage(config)
}

Page.checkAuthPromise = null
export default Page

const originComponent = Component
Component = function (config) {
  const { attached } = config
  config.attached = function () {
    const i18n = I18N.getI18NRes(this.is)
    this.setData({ i18n })

    if (attached) {
      attached.call(this)
    }
  }

  return originComponent(config)
}