import Engine from '../Engine'
import I18N from './I18N'
import querystringfy from './libs/querystringfy'

const originalPage = Page // 保存原来的Page

let waitPromise = null
let resolveWaitPromise = null
const { model } = wx.getSystemInfoSync()
const isIPhoneXSeries = /iPhone X/.test(model)

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
    this.setData({ i18n, isIPhoneXSeries })
  }

  if (config.onLoad) {
    const { onLoad } = config
    config.onLoad = function (options) {
      for (const key of Object.keys(options)) {
        options[key] = decodeURIComponent(options[key])
      }

      const isAsync = /regeneratorRuntime/.test(onLoad.toString())
      if (isAsync & waitPromise) {
        waitPromise.then(() => {
          onLoad.call(this, options)
        })
      } else {
        onLoad.call(this, options)
      }

      // eslint-disable-next-line
      console.debug('Page.Load', { path: this.route, options })
    }
  }

  if (config.onShareAppMessage) {
    const { onShareAppMessage } = config
    config.onShareAppMessage = function (options) {
      const {
        path,
        title,
        query = {},
        imageUrl,
      } = onShareAppMessage.call(this, options)

      query.inviterOpenId = Engine.getOpenId()
      query.inviterName = Engine.getNickName()

      const queryString = querystringfy.stringify(query, `${path}?`)
      const result = { title, imageUrl, path: queryString }

      // eslint-disable-next-line
      console.debug('onShareAppMessage result', result)
      return result
    }
  }

  return originalPage(config)
}

Page.createWaitPromise = function () {
  if (waitPromise) {
    return
  }

  waitPromise = new Promise((resolve) => {
    resolveWaitPromise = resolve
  })
}

Page.resolveWaitPromise = function () {
  resolveWaitPromise()
}

const originComponent = Component
Component = function (config) {
  const { attached } = config
  config.attached = function () {
    const i18n = I18N.getI18NRes(this.is)
    this.setData({ i18n, isIPhoneXSeries })

    if (attached) {
      attached.call(this)
    }
  }

  return originComponent(config)
}
