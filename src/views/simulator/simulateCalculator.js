export const classEnergitique = {
  passoire: [5, 6]
}

export const incomeClass = {
  classique: 3
}

export const operationUnitPrice = (operation, shab) => {
  let price = 0
  operation?.pricing_list?.forEach(element => {
    // string to js code
    const condition = element.condition.replace(/(>=|<=|<|>)/g, ' $1 ')
    try {
      if (eval(shab + condition)) price = element.price_unit_ht
    } catch (error) {}
  })

  return price
}

export const operationPrice = (operations, shab, type, value) => {
  let price = 0
  operations
    ?.find(operation => operation?.type === type)
    ?.pricing_list.forEach(element => {
      // string to js code
      const condition = element.condition.replace(/(>=|<=|<|>)/g, ' $1 ')
      try {
        if (eval(shab + condition)) price = element.price_unit_ht
      } catch (error) {}
    })

  return value * price
}

export const bonusAmount = (nbSauteClasse, bonusList, clientClass, energyClass) => {
  const bonus = bonusList?.find(item => {
    if (classEnergitique.passoire.includes(energyClass) && incomeClass.classique === clientClass) {
      if (
        item.type === 0 &&
        item.skip_count === nbSauteClasse &&
        item.energy_classe === energyClass &&
        item.income_classe === clientClass
      ) {
        return item
      }
    } else {
      if (item.type === 0 && item.skip_count === nbSauteClasse && item.income_classe === clientClass) return item
    }
  })

  return {
    percentage: bonus?.bonus_percentage || 0,
    cap: bonus?.bonus_cap || 0
  }
}

export const passoire = (bonusList, energyClass) => {
  const bonus = bonusList?.find(item => item.type === 1 && item.energy_classe === energyClass)

  return {
    percentage: bonus?.bonus_percentage || 0,
    cap: bonus?.bonus_cap || 0
  }
}

export const marAmount = (incomeClass, marScaleList) => {
  const amount = marScaleList?.find(mar => mar.income_classe == incomeClass)

  return amount?.mar_scale * amount?.mar_cap || 0
}

export const restMar = (incomeClass, marScaleList) => {
  const amount = marScaleList?.find(mar => mar.income_classe == incomeClass)
  const flouss = amount?.mar_scale * amount?.mar_cap || 0

  return amount?.mar_cap - flouss
}
