import query from './libs/querystringfy'

function promisify(func, obj = {}, ...args) {
  return new Promise((resolve, reject) => {
    func({
      ...obj,
      success: function (res) {
        resolve(res)
        if (obj.success) {
          obj.success(res)
        }
      },
      fail: function (res) {
        reject(res)
        if (obj.fail) {
          obj.fail(res)
        }
      },
    }, ...args)
  })
}

const methods = [
  'canvasToTempFilePath',
  'showToast',
  'showModal',
  'showActionSheet',
  'stopPullDownRefresh',
  'setNavigationBarTitle',
  'setNavigationBarColor',
  'setTopBarText',
  'switchTab',
  'navigateTo',
  'redirectTo',
  'login',
  'checkSession',
  'authorize',
  'getUserInfo',
  'requestPayment',
  'chooseImage',
  'previewImage',
  'getImageInfo',
  'saveImageToPhotosAlbum',
  'uploadFile',
  'downloadFile',
  'startRecord',
  'playVoice',
  'getBackgroundAudioPlayerState',
  'playBackgroundAudio',
  'seekBackgroundAudio',
  'chooseVideo',
  'saveVideoToPhotosAlbum',
  'saveFile',
  'getFileInfo',
  'getSavedFileList',
  'getSavedFileInfo',
  'removeSavedFile',
  'openDocument',
  'setStorage',
  'getStorage',
  'getStorageInfo',
  'removeStorage',
  'getLocation',
  'chooseLocation',
  'openLocation',
  'getSystemInfo',
  'getNetworkType',
  'startAccelerometer',
  'stopAccelerometer',
  'startCompass',
  'stopCompass',
  'makePhoneCall',
  'scanCode',
  'setClipboardData',
  'getClipboardData',
  'openBluetoothAdapter',
  'closeBluetoothAdapter',
  'getBluetoothAdapterState',
  'startBluetoothDevicesDiscovery',
  'stopBluetoothDevicesDiscovery',
  'getBluetoothDevices',
  'getConnectedBluetoothDevices',
  'createBLEConnection',
  'closeBLEConnection',
  'getBLEDeviceServices',
  'startBeaconDiscovery',
  'stopBeaconDiscovery',
  'getBeacons',
  'setScreenBrightness',
  'getScreenBrightness',
  'setKeepScreenOn',
  'vibrateLong',
  'vibrateShort',
  'addPhoneContact',
  'getHCEState',
  'startHCE',
  'stopHCE',
  'sendHCEMessage',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'setWifiList',
  'getConnectedWifi',
  'getExtConfig',
  'showShareMenu',
  'hideShareMenu',
  'updateShareMenu',
  'getShareInfo',
  'chooseAddress',
  'addCard',
  'openCard',
  'openSetting',
  'getSetting',
  'getWeRunData',
  'navigateToMiniProgram',
  'navigateBackMiniProgram',
  'chooseInvoiceTitle',
  'checkIsSupportSoterAuthentication',
  'startSoterAuthentication',
  'checkIsSoterEnrolledInDevice',
]

for (const method of methods) {
  const originMethod = wx[method]
  Object.defineProperty(wx, method, {
    value: (...args) => {
      return promisify(originMethod, ...args)
    },
  })
}

[
  { method: 'navigateTo', key: 'url' },
  { method: 'reLaunch', key: 'url' },
  { method: 'redirectTo', key: 'url' },
  { method: 'navigateToMiniProgram', key: 'path' },
].forEach((item) => {
  const originMethod = wx[item.method]
  Object.defineProperty(wx, item.method, {
    value: (options) => {
      if (options.query) {
        options[item.key] = query.stringify(options.query, `${options[item.key]}?`)
      }

      originMethod(options)
    },
  })
})
