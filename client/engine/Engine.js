import I18N from './utils/I18N'
import querystringfy from './utils/libs/querystringfy'

const StorageKey = { AUTH: 'auth' }

export default class Engine {
  static _profiles = {}
  static _configs = {}
  // 某些设备不能setStorage， 用_mockStorage代替
  static _mockStorage = {}

  static init = ({ configs, i18n = {} }) => {
    // eslint-disable-next-line
    console.debug('ext configs', configs)
    I18N.loadLang(i18n)
    Engine._configs = configs
    Engine._profiles[StorageKey.AUTH] = Engine.getStorage(StorageKey.AUTH)
  }

  static getWeAppId = () => {
    return Engine._configs.weAppId || ''
  }

  static getDomain = () => {
    return Engine._configs.apiDomain
  }

  static getConfigs = () => {
    return Engine._configs
  }

  static getVersion = () => {
    return Engine._configs.version
  }

  static getApiVersion = () => {
    return Engine._configs.apiVersion
  }

  static login = (auth) => {
    if (!auth) {
      return
    }

    Engine._profiles.auth = auth
    Engine.setStorage(StorageKey.AUTH, auth, { expiresIn: auth.expiresIn })
  }

  static relogin = () => {
    if (Engine._profiles.auth) {
      Engine.clearToken()
    }
  }

  static updateAuth = (auth) => {
    if (Engine._profiles.auth) {
      Engine._profiles.auth.user = auth.user
      Engine._profiles.auth.accessToken = auth.accessToken
    } else {
      Engine._profiles.auth = auth
    }

    Engine.setStorage(StorageKey.AUTH, auth)
  }

  static getAccessToken = () => {
    return Engine._profiles.auth && Engine._profiles.auth.accessToken
  }

  static clearToken = () => {
    delete Engine._profiles.auth
    Engine.removeStorage(StorageKey.AUTH)
  }

  static getNickName = () => {
    const { member } = Engine._profiles.auth || {}
    return member ? member.name : ''
  }

  static getOpenId = () => {
    return Engine._profiles.auth && Engine._profiles.auth.openId
  }

  static getUnionId = () => {
    return Engine._profiles.auth && Engine._profiles.auth.unionId
  }

  // expiresIn 单位秒
  static setStorage = (key, data, { scoped = true, expiresIn } = {}) => {
    let storageKey = key
    if (scoped) {
      storageKey = `${Engine._configs.storageVersion}-${key}`
    }

    Engine._mockStorage[storageKey] = data
    wx.setStorageSync(storageKey, data)

    if (expiresIn) {
      // 减去 1 分钟防止抵消各种消耗
      const expiresAt = new Date().valueOf() + (expiresIn - 60) * 1000
      wx.setStorageSync(`${storageKey}-expired-at`, expiresAt)
    }
  }

  static getStorage = (key, { scoped = true } = {}) => {
    let storageKey = key
    if (scoped) {
      storageKey = `${Engine._configs.storageVersion}-${key}`
    }

    const value = Engine._mockStorage[storageKey]
    if (value) {
      return value
    }

    const expiredAt = wx.getStorageSync(`${storageKey}-expired-at`)
    if (expiredAt && expiredAt < new Date().valueOf()) {
      return null
    }

    return wx.getStorageSync(storageKey)
  }

  static removeStorage = (key, { scoped = true } = {}) => {
    let storageKey = key
    if (scoped) {
      storageKey = `${Engine._configs.storageVersion}-${key}`
    }

    delete Engine._mockStorage[storageKey]
    wx.removeStorageSync(storageKey)
    wx.removeStorageSync(`${storageKey}-expired-at`)
  }
}
