import { useContext } from 'react'
import { TranslationsContext } from '../contexts/Localisation/translationsContext'

const variableRegex = /%(.*?)%/

const replaceDynamicString = (foundTranslation, fallback) => {
  const stringToReplace = variableRegex.exec(foundTranslation)[0]
  // const indexToReplace = foundTranslation.split(' ').indexOf(stringToReplace)
  const fallbackValueAtIndex = fallback.split(' ')[0]
  return foundTranslation.replace(stringToReplace, fallbackValueAtIndex)
}

const getTranslation = (translations, translationId, fallback) => {
  const foundTranslation = translations.find((translation) => {
    return translation.data.stringId === translationId
  })
  if (foundTranslation) {
    const translatedString = foundTranslation.data.text
    const includesVariable = translatedString.includes('%')
    if (includesVariable) {
      return replaceDynamicString(translatedString, fallback)
    }
    return translatedString
  }
  return fallback
}

// TODO: Replace instances where this is called directly with the "useI18n" hook.
// Using this directly can lead to errors because "useContext" is not preserved between renders
// @see https://reactjs.org/docs/hooks-rules.html
const TranslateString = (translationId, fallback) => {
  const { translations } = useContext(TranslationsContext)
  if (translations[0] === 'error') {
    return fallback
  }
  if (translations.length > 0) {
    return getTranslation(translations, translationId, fallback)
  }
  return fallback
}

export default { getTranslation, TranslateString }
