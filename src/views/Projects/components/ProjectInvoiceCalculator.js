export const totalHT = lines => {
  return lines.reduce((acc, line) => {
    return acc + line.amount_HT
  }, 0)
}

export const totalTVA = lines => {
  return lines.reduce((acc, line) => {
    return acc + line.amount_TVA
  }, 0)
}

export const tvaAmount = (totalHT, tva) => {
  return totalHT * tva
}

export const totalTTC = () => {
  return
}

export const plafonPrime = () => {
  return
}

export const bonification = () => {
  return
}

export const primeRenov = () => {
  return
}

export const primeRenovBonification = () => {
  return
}
