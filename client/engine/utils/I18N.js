export default class I18N {
  static translations = null

  static loadLang = (translations, lang) => {
    I18N.translations = translations
    if (translations[lang]) {
      I18N.language = lang
    } else {
      I18N.language = Object.keys(translations)[0]
    }
  }

  static i18n = (path, key, ...args) => {
    const localTranslations = I18N.translations[I18N.language]
    const value = localTranslations[path] || {}
    let res = value[key]
    if (!res) {
      // eslint-disable-next-line
      console.error(`${path}.${key} is not a valid path`)
      return ''
    }

    for (let index = 0; index < args.length; index++) {
      const regex = new RegExp(`\\{${index}\\}`, 'g')
      res = res.replace(regex, args[index])
    }

    return res
  }

  static getI18NRes = (path) => {
    const localTranslations = I18N.translations[I18N.language]
    return localTranslations[path] || {}
  }
}
