/* eslint-disable no-console */

import Engine from '../Engine'
import I18n from './I18N'
import _ from './libs/underscore'

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

const lastRequestTaskMarkedAbort = {}

const defaultConfig = {
  ignoreLoading: false,
  showToast: false,
  requestName: '',
  baseUrl: '',
}

export default class Rest {
  static get = (url, params, config = defaultConfig) => Rest.request(Method.GET, url, params, config)
  static post = (url, params, config = defaultConfig) => Rest.request(Method.POST, url, params, config)
  static put = (url, params, config = defaultConfig) => Rest.request(Method.PUT, url, params, config)
  static delete = (url, params, config = defaultConfig) => Rest.request(Method.DELETE, url, params, config)

  static formatParams = (url, method, data) => {
    if (method !== Method.GET) {
      return url
    }

    const arrayParams = []
    for (const key in data) {
      if (_.isArray(data[key]) && data[key].length) {
        arrayParams.push(`${key}=${data[key].join(',')}`)
        delete data[key]
      }
    }

    if (arrayParams.length) {
      return `${url}?${arrayParams.join('&')}`
    }

    return url
  }

  static request = (method, url, data = {}, config) => {
    const { ignoreLoading = false, showToast, requestName = '' } = config
    let formatedUrl = Rest.formatParams(url, method, data)
    if (!ignoreLoading) {
      wx.showLoading({
        mask: true,
        title: I18n.i18n('globalMessage', 'loading'),
      })
    }

    return new Promise((resolve, reject) => {
      if (!/https/.test(formatedUrl)) {
        const baseUrl = config.baseUrl || Engine.getDomain()
        formatedUrl = `${baseUrl}${formatedUrl}`
      }

      if (requestName && lastRequestTaskMarkedAbort[requestName]) {
        lastRequestTaskMarkedAbort[requestName].abort()
      }

      const header = Rest.getHeader()

      const requestTask = wx.request({
        url: formatedUrl,
        data,
        header,
        method,
        success: function (response) {
          Rest.onHandleResponse({ url, method, data }, response, resolve, reject)
        },
        fail: function (res) {
          switch (res.errMsg) {
            case 'request:fail abort':
              res.isAbort = true
              break
            case 'request:fail 请求超时。':
            case 'request:fail timeout':
            case 'request:fail 似乎已断开与互联网的连接。':
            case 'request:fail The Internet connection appears to be offline.':
              res.isTimeOut = true

              if (showToast) {
                wx.showToast({
                  title: '连接超时',
                  icon: 'none',
                  duration: 2000,
                })
              }

              break
            default:
              break
          }

          reject(res)
        },
        complete: function () {
          if (!ignoreLoading) {
            wx.hideLoading()
          }

          // eslint-disable-next-line
          console.debug('request complete', {
            url: formatedUrl,
            data,
            header,
            method,
          })
        },
      })

      if (requestName) {
        lastRequestTaskMarkedAbort[requestName] = requestTask
      }
    })
  }

  static mockRequest = (method, url, params) => {
    return {
      returns: (result) => {
        console.warn('mock method', method, url)
        console.warn('mock request params', params)
        console.warn('mock response result', result)

        return result
      },
    }
  }

  static mock = {
    get: (url, params) => Rest.mockRequest(Method.GET, url, params),
    post: (url, params) => Rest.mockRequest(Method.POST, url, params),
    delete: (url, params) => Rest.mockRequest(Method.DELETE, url, params),
    put: (url, params) => Rest.mockRequest(Method.PUT, url, params),
  }


  static onHandleResponse = (request, response, resolve, reject) => {
    if (response.statusCode < 400) {
      resolve(response.data)
      return
    }

    switch (response.statusCode) {
      case 401:
        Engine.relogin()
        break
      case 500:
      case 502:
      case 503:
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 2000,
        })
        break
      default:
        break
    }
    reject({ request, response })

    console.error({ request, response })
  }

  static getHeader = () => {
    const header = {
      'x-account-id': Engine.getAccountId(),
      'x-access-token': Engine.getAccessToken(),
    }

    return header
  }
}
