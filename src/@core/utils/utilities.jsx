import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import moment from 'moment'

export default function renderArrayMultiline(arr = []) {
  if (!arr || !Array.isArray(arr)) {
    return
  }

  return arr?.map(e => {
    return (
      <>
        {e}
        <br />
      </>
    )
  })
}

export function getDateInFormat(v, dateFormat, locale) {
  let d = new Date()

  try {
    d = format(new Date(v), dateFormat, {
      locale: enGB
    })
  } catch (error) {
    console.log(error)
  }

  return d
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}

export const returnEqualValuesInArray = (a, b) => {
  const t = []

  a.forEach(aElement => {
    b.forEach(bElement => {
      if (aElement?.id === bElement?.id) {
        t.push(aElement)
      }
    })
  })

  return t
}

export const returnEqualValuesDynamiqueAttributeInArray = (a, b, attribute) => {
  const t = []

  a.forEach(aElement => {
    b.forEach(bElement => {
      if (aElement?.id === bElement[attribute]) {
        t.push(aElement)
      }
    })
  })

  return t
}

export const dateFormater = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format)
}

export const dateFormaterWithTime = (date, format = 'DD/MM/YYYY HH:mm') => {
  return moment(date).format(format)
}

export const dateFormat = 'dd/MM/yyyy'

export const dateFormatWithTime = 'dd/MM/yyyy HH:mm'

export const convertBase64ToFile = async (base64, filename = 'file') => {
  const response = await fetch(`${base64}`)
  const blob = await response.blob()

  // Get the file extension from the base64 string
  const extension = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';'))

  return new File([blob], `${filename}.${extension}`, { type: blob.type })
}

export const convertAllBase64ToFiles = async parois => {
  const promises = parois.map(async (element, index) => {
    const file = await convertBase64ToFile(element.image, `file${index}`)

    return { file }
  })

  return Promise.all(promises)
}

export const round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

export function hasCommonValue(arrayA, arrayB) {
  const setA = new Set(arrayA)
  for (const value of arrayB) {
    if (setA.has(value)) {
      return true
    }
  }

  return false
}

export const findLastIndex = (array, predicate) => {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return i
    }
  }

  return -1
}
