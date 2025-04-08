export const toSnakeCase = camelCaseString => {
  return camelCaseString.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export const toQueryString = (url, params) => {
  const query = Object.keys(params)
    .map(key => {
      if (params[key] === null || params[key] === undefined) {
        return ''
      }

      return `${encodeURIComponent(toSnakeCase(key))}=${encodeURIComponent(params[key])}`
    })
    .join('&')

  return `${url}?${query}`
}
