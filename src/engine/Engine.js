const StorageKey = {
  DEVICE_ID: 'TDSDK_deviceId',
  AUTH: 'auth',
}

const supportedEnv = {
  dev: 'dev',
  prod: 'prod',
  production: 'prod',
}

export default class Engine {
  static _configs = {}
  static _profiles = {}
  static _setting = {}
  static _mockStorage = {} // 某些设备不能setStorage， 用_mockStorage代替

  static init = ({ configs }) => {
    Engine._configs = configs
  }

  static setEnv = (env) => {
    env = supportedEnv[env] || Engine._configs.env || Engine._configs.defaultEnv
    if (env !== Engine._configs.env) {
      Engine._profiles = {}
      Engine._configs.env = env
      Engine._configs = { ...Engine._configs, ...Engine._configs[env] }
      Engine._profiles.auth = Engine.getStorage(StorageKey.AUTH)
    }
  }

  static getEndPoint = () => {
    return Engine._configs.apiEndpoint
  }

  static getEnv = () => {
    return Engine._configs.env
  }

  static getToken = () => {
    return Engine._profiles.auth && Engine._profiles.auth.token
  }

  static getVersion = () => {
    return Engine._configs.version
  }

  static getDeviceId = () => {
    if (!Engine._profiles.deviceId) {
      Engine._profiles.deviceId = wx.getStorageSync(StorageKey.DEVICE_ID)
    }

    return Engine._profiles.deviceId
  }

  static getApiVersion = () => {
    return Engine._configs.apiVersion
  }

  static getWeAppId = () => {
    return Engine._configs.weAppId || ''
  }

  static getSessionKey = () => {
    return (Engine._profiles.auth && Engine._profiles.auth.sessionKey) || ''
  }

  static getOpenId = () => {
    return (Engine._profiles.auth && Engine._profiles.auth.user.openId) || ''
  }

  static getAuth = () => {
    return Engine._profiles.auth
  }

  static setSetting = (setting) => {
    if (!setting) {
      return
    }

    Engine._setting = setting
  }

  static getSetting = () => {
    return Engine._setting
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
      Engine._profiles.auth.token = auth.token
    } else {
      Engine._profiles.auth = auth
    }

    Engine.setStorage(StorageKey.AUTH, Engine._profiles.auth)
  }

  static clearToken = () => {
    delete Engine._profiles.auth
    Engine.removeStorage(StorageKey.AUTH)
  }

  // expiresIn 单位秒
  static setStorage = (key, data, { scoped = true, expiresIn } = {}) => {
    let storageKey = key
    if (scoped) {
      storageKey = `${Engine.getEnv()}-${Engine._configs.storageVersion}-${key}`
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
      storageKey = `${Engine.getEnv()}-${Engine._configs.storageVersion}-${key}`
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
      storageKey = `${Engine.getEnv()}-${Engine._configs.storageVersion}-${key}`
    }

    delete Engine._mockStorage[storageKey]
    wx.removeStorageSync(storageKey)
    wx.removeStorageSync(`${storageKey}-expired-at`)
  }
}
