import Engine from './Engine'
import regeneratorRuntime from './utils/regenerator'
import Rest from './utils/Rest'
import Weixin from './utils/Weixin'

export default class Profiles {
  static login = async () => {
    const { code } = await Weixin.login()
    Profiles.code = code
    return Rest.mock.post(
      '/member/login',
      { code }
    ).returns({})
  }

  static reportUser = async () => {
    const { code } = await Weixin.login()
    Profiles.code = code
    const { iv, encryptedData } = await Weixin.getUserInfo()
    return Rest.mock.post(
      '/member/report-user',
      {
        code,
        iv,
        encryptedData,
      }
    ).returns({})
  }

  static reportPhone = async (iv, encryptedData) => {
    return Rest.mock.put(
      '/member/report-phone',
      {
        code: Profiles.code,
        iv,
        encryptedData,
      }
    ).returns({})
  }
}
