export default class Configs {
  static version = 'v0.1.0'
  static apiVersion = 'v0.1.0'
  static defaultEnv = 'develop'
  static weAppId = 'template-weapp'
  static storageVersion = 1
  static buildTime = ''

  static develop = {
    apiEndpoint: 'https://dev-template-weapp',
  }

  static staging = {
    apiEndpoint: 'https://staging-template-weapp',
  }

  static production = {
    apiEndpoint: 'https://template-weapp',
  }
}
