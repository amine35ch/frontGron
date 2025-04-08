export const returnFieldAfterChange = (type, ligne, fieldIndex, event) => {
  const field = ligne?.fields[fieldIndex]
  switch (type) {
    case 1:
      ligne?.fields?.forEach(item => (item.value = 0))
      field.value = event.target.checked ? 1 : 0
      break
    case 3:
      field.value = event.target.value
      break
    case 4:
      field.value = event.target.checked ? 1 : 0
      break
    case 6:
      if (!event.target.checked) {
        field.ajout?.forEach(subItem => {
          if (subItem?.type === 1 || subItem?.type === 4) {
            subItem?.fields?.forEach(subSubItem => (subSubItem.value = 0))
          } else {
            subItem?.fields?.forEach(subSubItem => (subSubItem.value = ''))
          }
        })
      }
      field.value = event.target.checked ? 1 : 0
      break
    case 8:
      field.value = event
      break
    case 9:
      ligne?.fields?.forEach(item => {
        item.value = 0
        item.ajout?.forEach(subItem => {
          if (subItem?.type === 1 || subItem?.type === 4) {
            subItem?.fields?.forEach(subSubItem => (subSubItem.value = 0))
          } else {
            subItem?.fields?.forEach(subSubItem => (subSubItem.value = ''))
          }
        })
      })
      field.value = event.target.checked ? 1 : 0
      break
    default:
      break
  }

  return field
}
