import './engine/utils/EnhancedPage'

import configs from './configs'
import { Engine, I18N } from './engine/index'

App({
  onLaunch: function (options = {}) {
    const params = options.query
    Engine.init({ configs })
    Engine.setEnv(params.env)
  },

  onShow: function (options) {
    // eslint-disable-next-line
    console.warn('app.onShow', options)
  },

  i18n: (...args) => {
    return I18N.i18n(...args)
  },
})
