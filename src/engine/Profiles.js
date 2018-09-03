import Engine from './Engine'
import regeneratorRuntime from './utils/regenerator'
import Rest from './utils/Rest'
import Weixin from './utils/Weixin'

const checkSessionInterval = 100
let resolveAuthPromise = null

export default class Profiles {
  static checkSession = async (options, retry = 0) => {
    if (!Page.checkAuthPromise) {
      Page.checkAuthPromise = new Promise(async (resolve) => {
        resolveAuthPromise = resolve
      })
    }

    try {
      await Profiles._checkAuth()
      resolveAuthPromise()
      Page.checkAuthPromise = null
    } catch (e) {
      // eslint-disable-next-line
      console.warn(e)
      setTimeout(
        () => Profiles.checkSession(options, retry + 1),
        Math.min(checkSessionInterval * retry, 60000)
      )
    }
  }

  static _checkAuth = async () => {
    let needAuth = false
    if (Engine.getToken()) {
      needAuth = !await Weixin.checkSession()
    } else {
      needAuth = true
    }

    if (needAuth) {
      const { code } = await Weixin.login()
      const params = { code }
      if (Engine.getWeAppId()) {
        params.appId = Engine.getWeAppId()
      }

      // TODO: login
      // const auth = await Rest.post('', { ...params, ignoreLoading: true })
      // Engine.login(auth)
    }
  }
}
