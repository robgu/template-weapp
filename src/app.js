import './engine/utils/EnhancedPage'

import { Engine, Profiles, regeneratorRuntime, I18N } from './engine/index'
import configs from './configs'

App({
  onLaunch: function (options = {}) {
    const params = options.query
    Engine.init({ configs })
    Engine.setEnv(params.env)
  },

  onShow: async function (options) {
    // eslint-disable-next-line
    console.warn('app.onShow', options)
    const { query } = options
    await Profiles.checkSession(options)
  },

  i18n: (...args) => {
    return I18N.i18n(...args)
  }
})
