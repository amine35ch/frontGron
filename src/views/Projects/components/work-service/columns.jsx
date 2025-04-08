import { IconButton, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { round } from 'src/@core/utils/utilities'
import CustomInputSirenSiretNumber from 'src/components/CustomInputSirenSiretNumber'
import CustomCurrencyInput, { CustomInput } from 'src/components/CustomeCurrencyInput'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'
import ServiceDialog from './ServiceDialog'
import { useGetArticles } from 'src/services/articles.service'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import InputTva from 'src/components/CustomInputTva'
import toast from 'react-hot-toast'
import CustomCurrencyInputV2 from 'src/components/CustomCurrencyInputV2'
import InputNumberWithComma from 'src/components/InputNumberWithComma'

const WorkServiceColumns = (
  theme,
  step,
  shab,
  setLocalWorkList,
  totals,
  setTotals,
  user,
  localWorkList,
  handleAddSousService,
  handleDeleteSousArticle,
  serviceModalSousService,
  setServiceModalSousService,
  setArticlesWork,
  setrowTable,
  handleDeleteArticleFromTable,
  articlesDataList,
  listUnit,
  disabled = false
) => {
  const [isToastActive, setIsToastActive] = useState(false)

  const handleChangeRowSimulator = (key, initVal, index) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[index]

    const localCostHT = totals.amount_ht - parseFloat(row['cost_ht_simulation'])
    const localCostTTC = totals.amount_TTC - parseFloat(row['cost_ttc_simulation'])

    // const value = parseFloat(initVal) || 0
    const value = initVal
    row[key] = value

    const parsedQty = parseFloat(String(row['qty_simulation']).replace(',', '.'))
    const parsedPriceUnit = parseFloat(String(row['price_unit_ht_simulation']).replace(',', '.'))

    row['cost_ht_simulation'] = parsedPriceUnit * parsedQty
    row['cost_ttc_simulation'] =
      parseFloat(row['cost_ht_simulation']) + parseFloat(row['cost_ht_simulation']) * parseFloat(row['tva'])

    setLocalWorkList(newWorksList)
    setTotals(prev => {
      return {
        ...prev,
        amount_ht: localCostHT + parseFloat(row['cost_ht_simulation']),
        amount_ttc: localCostTTC + parseFloat(row['cost_ttc_simulation'])
      }
    })
  }

  const handleChangeRowInvoice = (key, initVal, index) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[index]
    const localCostHT = totals.amount_ht - parseFloat(row['cost_invoice_ht'])
    const localCostTTC = totals.amount_TTC - parseFloat(row['cost_invoice_ttc'])

    const value = initVal
    row[key] = value
    const parsedQty = parseFloat(String(row['qty']).replace(',', '.'))
    const parsedPriceUnit = parseFloat(String(row['price_unit_ht']).replace(',', '.'))
    row['cost_invoice_ht'] = parsedPriceUnit * parsedQty

    row['cost_invoice_ttc'] =
      parseFloat(row['cost_invoice_ht']) + parseFloat(row['cost_invoice_ht']) * parseFloat(row['tva'])
    if (row['cost_ht_simulation'])
      if (user?.profile !== 'MAR' && row['cost_invoice_ht'] > row['cost_ht_simulation'] && row['cost_ht_simulation']) {
        toast.dismiss()
        toast.error('Le montant HT ne doit pas dépasser le montant HT de la simulation', {
          duration: 5000
        })

        return false
      }
    setLocalWorkList(newWorksList)
    setTotals(prev => {
      return {
        ...prev,
        amount_ht: localCostHT + parseFloat(row['cost_invoice_ht']),
        amount_ttc: localCostTTC + parseFloat(row['cost_invoice_ttc'])
      }
    })

    return true
  }

  const handleChangeTva = (key, initVal, index) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[index]

    const value = initVal
    row[key] = value

    setLocalWorkList(newWorksList)

    // setTotals(prev => {
    //   return {
    //     ...prev,
    //     amount_ht: localCostHT + parseFloat(row['cost_invoice_ht']),
    //     amount_ttc: localCostTTC + parseFloat(row['cost_invoice_ttc'])
    //   }
    // })
  }

  const handleChangeRowTextFields = (key, value, index) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[index]

    row[key] = value
    setLocalWorkList(newWorksList)
  }

  const RowOption = ({ row }) => {
    const [serviceModal, setServiceModal] = useState(false)

    // const {
    //   data: articlesData,
    //   isLoading: isLoadingArticles,
    //   isSuccess: isSuccessArticles
    // } = useGetArticles({ work: row?.d_work_id, state: 1 })

    const handleOpenModalArticles = () => {
      setrowTable(row)
      setServiceModalSousService(true)
    }

    return (
      <>
        <IconButton disabled={disabled} onClick={() => handleOpenModalArticles()}>
          <IconifyIcon style={{ cursor: 'pointer' }} icon='mdi:plus' />
        </IconButton>
      </>
    )
  }

  if (step === 'simulation') {
    return [
      {
        field: 'entitled',
        label: 'Libellé',
        width: 300,
        align: 'center'
      },

      {
        field: 'qte',
        label: 'QTE',
        width: 50,
        align: 'center',
        renderCell: ({ row, index }) => (
          <InputNumberWithComma
            value={row?.qty_simulation}
            onChange={event => handleChangeRowSimulator('qty_simulation', event, index)}
          />

          // <CustomInput
          //   value={row?.qty_simulation}
          //   size='small'
          //   variant='standard'
          //   onChange={event => handleChangeRowSimulator('qty_simulation', event?.target?.value, index)}
          //   placeholder='M²'
          //   sx={{
          //     fontSize: '10px !important',
          //     '& .MuiOutlinedInput-input': {
          //       width: '250px'
          //     }
          //   }}
          // />
        )
      },
      {
        field: 'PrixUnit',
        label: 'PRIX UNIT HT',
        width: 150,
        align: 'center',
        renderCell: ({ row, index }) => {
          return (
            <div className=' justify-center'>
              {/* <CustomCurrencyInput
                onChange={value => handleChangeRowSimulator('price_unit_ht_simulation', value?.value, index)}
                custom={true}
                value={row?.price_unit_ht_simulation}
              /> */}
              <CustomCurrencyInputV2
                value={row?.price_unit_ht_simulation}
                onChange={value => handleChangeRowSimulator('price_unit_ht_simulation', value, index)}
              />
            </div>
          )
        }
      },
      {
        field: 'unit',
        label: 'Unité',
        width: 150,
        align: 'center',
        renderCell: ({ row, index }) => (
          <CustomeAutoCompleteSelect
            option={'type'}
            value={row?.unit}
            onChange={value => handleChangeRowSimulator('unit', value, index)}
            data={listUnit}
            displayOption={'entitled'}
            formError={{}}

            // helperText={renderArrayMultiline(formErrors?.unit)}

            // error={formErrors?.unit}
          />
        )
      },
      {
        field: 'amount_HT',
        label: 'MONTANT HT',
        width: 150,
        align: 'center',
        renderCell: ({ row, index }) => {
          return (
            <div>
              <CustomCurrencyInput displayType='text' value={row?.cost_ht_simulation || row.cost_invoice_ht} />
            </div>
          )
        }
      },
      {
        id: 'tva',
        label: 'TVA',
        minWidth: 80,
        align: 'center',
        renderCell: ({ row, index }) => {
          return (
            <div className=''>
              <CustomCurrencyInput
                custom={true}
                value={row?.tva * 100}
                onChange={event => {
                  handleChangeRowSimulator('tva', event.floatValue / 100, index)
                }}
                suffix={' %'}
                decimalScale={2}
              />
            </div>
          )
        }
      },
      {
        id: 'montant_TTC',
        label: 'Montant TTC',
        align: 'center',
        minWidth: 300,
        renderCell: ({ row, index }) => {
          return (
            <div className=''>
              <CustomCurrencyInput displayType='text' value={row?.cost_ttc_simulation || row.cost_invoice_ttc} />
            </div>
          )
        }
      },
      {
        field: 'Action',
        label: '',
        width: 50,
        align: 'center',
        renderCell: ({ row, index }) => {
          return row?.d_work_id ? (
            <RowOption row={row} />
          ) : (
            <IconButton disabled={disabled} color='error' onClick={() => handleDeleteArticleFromTable(row)}>
              <IconifyIcon icon='mdi:minus' />
            </IconButton>
          )
        }
      }
    ]
  }

  return [
    {
      field: 'entitled',
      label: 'Libellé',
      width: 500,
      align: 'center'
    },

    {
      field: 'qte',
      label: 'QTEe',
      width: 100,
      align: 'center',
      renderCell: ({ row, index }) => (
        <InputNumberWithComma onChange={event => handleChangeRowInvoice('qty', event, index)} value={row?.qty} />

        // <CustomInput
        //   value={row?.qty}
        //   size='small'
        //   variant='standard'
        //   onChange={event => handleChangeRowInvoice('qty', event?.target?.value, index)}
        //   placeholder='M²'
        //   sx={{
        //     fontSize: '10px !important',
        //     '& .MuiOutlinedInput-input': {
        //       width: '100px'
        //     }
        //   }}
        //   disabled={disabled}

        //   // error={formError?.[`works.${index}.qty`]}
        //   // helperText={formError?.[`works.${index}.qty`]}
        // />
      )
    },
    {
      field: 'PrixUnit',
      label: 'PRIX UNIT HT',
      width: 150,
      align: 'center',
      renderCell: ({ row, index }) => {
        return (
          <div className='flex justify-center'>
            <CustomCurrencyInputV2
              onBeforeInput={e => {
                const input = e.target
                const currentValue = input.value
                const cursorPosition = input.selectionStart
                const selectionEnd = input.selectionEnd

                const newValue = currentValue.slice(0, cursorPosition) + e.data + currentValue.slice(selectionEnd)

                const sanitizedNewValue = newValue.replace(/[^0-9,]/g, '')

                if (row?.cost_ht_simulation !== 0 && parseFloat(sanitizedNewValue) > row?.cost_ht_simulation) {
                  e.preventDefault()

                  //   input.value = currentValue
                  //   input.setSelectionRange(cursorPosition, cursorPosition)

                  //   if (!isToastActive) {
                  //     setIsToastActive(true)
                  toast.dismiss()
                  toast.error('Le montant HT ne doit pas dépasser le montant HT de la simulation', {
                    duration: 5000
                  })

                  //   }
                }
              }}
              onChange={value => {
                handleChangeRowInvoice('price_unit_ht', value, index)
              }}
              custom={true}
              value={row?.price_unit_ht}
              disabled={disabled}
            />
          </div>
        )
      }
    },
    {
      field: 'unit',
      label: 'Unité',
      width: 150,
      align: 'center',
      renderCell: ({ row, index }) => (
        <CustomeAutoCompleteSelect
          option={'type'}
          value={row?.unit}
          onChange={value => handleChangeRowInvoice('unit', value, index)}
          data={listUnit}
          displayOption={'entitled'}
          formError={{}}
          disabled={disabled}

          // helperText={renderArrayMultiline(formErrors?.unit)}

          // error={formErrors?.unit}
        />

        // <CustomInput
        //   value={row?.unit}
        //   size='small'
        //   variant='standard'
        //   onChange={event => handleChangeRowInvoice('unit', event?.target?.value, index)}
        //   placeholder='M²'
        //   sx={{
        //     fontSize: '10px !important',
        //     '& .MuiOutlinedInput-input': {
        //       width: '100px'
        //     }
        //   }}
        // />
      )
    },
    {
      field: 'amount_HT',
      label: 'MONTANT HT',
      width: 290,
      align: 'center',
      renderCell: ({ row, index }) => {
        return (
          <Stack>
            <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
              <CustomCurrencyInput displayType='text' value={row?.cost_invoice_ht} />
              {row?.cost_invoice_ht > row?.cost_ht_simulation && (
                <IconifyIcon icon='prime:exclamation-circle' color={theme.palette.warning.main} />
              )}
            </Stack>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
              <Typography variant='body2'>Simulation: </Typography>
              <CustomCurrencyInput
                displayType='text'
                style={{ fontSize: '11px', color: '#9c9fbb' }}
                value={row?.cost_ht_simulation}
              />
            </Stack>
          </Stack>
        )
      }
    },
    {
      id: 'tva',
      label: 'TVA',
      width: 120,
      renderCell: ({ row, index }) => {
        return (
          <div className=''>
            <CustomCurrencyInput
              custom={true}
              value={row?.tva * 100}
              onChange={event => {
                handleChangeRowInvoice('tva', event.floatValue / 100, index)
              }}
              suffix={' %'}
              decimalScale={2}
              disabled={disabled}
            />
          </div>
        )
      }
    },
    {
      id: 'montant_TTC',
      label: 'TTC',
      width: 300,
      align: 'center',
      renderCell: ({ row, index }) => {
        return (
          <div className=''>
            <CustomCurrencyInput displayType='text' value={row?.cost_invoice_ttc} />
          </div>
        )
      }
    },

    {
      field: 'Action',
      label: '',
      width: 50,
      align: 'center',
      renderCell: ({ row, index }) => {
        return row?.d_work_id ? (
          <RowOption row={row} />
        ) : (
          <IconButton disabled={disabled} color='error' onClick={() => handleDeleteArticleFromTable(row)}>
            <IconifyIcon icon='mdi:minus' />
          </IconButton>
        )
      }
    }
  ]
}

export default WorkServiceColumns
