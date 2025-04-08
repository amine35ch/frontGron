import { IconButton, Stack, TextField, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { round } from 'src/@core/utils/utilities'
import CustomCurrencyInput, { CustomInput } from 'src/components/CustomeCurrencyInput'
import CustomReactQuill from 'src/components/CustomReactQuill'
import OnlyNumbersInput from 'src/components/OnlyNumbersInput'

const WorkServiceColumnsChildren = (
  theme,
  type,
  shab,
  setLocalWorkList,
  totals,
  setTotals,
  user,
  localWorkList,
  handleDeleteSousArticle,
  handleDeleteSousArticleFromTable
) => {
  const handleChangeRowInvoice = (key, initVal, index, rowIndex, keyIndex) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[keyIndex]
    const newChildrenList = row?.children
    const childrenRow = newChildrenList[index]
    const localCostHT = totals.amount_ht - parseFloat(row['unit_price_HT'])
    const localCostTTC = totals.amount_TTC - parseFloat(row['unit_price_TTC'])

    const value = parseFloat(initVal) || 0
    childrenRow[key] = Math.round(parseFloat(value) * 10 ** user?.company?.decimals) / 10 ** user?.company?.decimals
    childrenRow['amount_HT'] = parseFloat(childrenRow['unit_price_HT']) * parseFloat(childrenRow['qty'])

    childrenRow['amount_TTC'] =
      parseFloat(childrenRow['amount_HT']) + parseFloat(childrenRow['amount_HT']) * parseFloat(childrenRow['tva'])
    childrenRow['amount_TVA'] = childrenRow['amount_TTC'] - childrenRow['amount_HT']
    setLocalWorkList(newWorksList)

    setTotals(prev => {
      return {
        ...prev,
        amount_HT: localCostHT + parseFloat(childrenRow['unit_price_HT']),
        amount_TTC: localCostTTC + parseFloat(childrenRow['amount_TTC'])
      }
    })
  }

  const handleChangeRowDescription = (key, initVal, index, rowIndex, keyIndex) => {
    const newWorksList = [...localWorkList]
    const row = newWorksList[keyIndex]
    const newChildrenList = row?.children
    const childrenRow = newChildrenList[index]

    childrenRow.description = initVal

    setLocalWorkList(newWorksList)
  }

  return [
    {
      field: 'entitled',
      label: 'Libellé',
      width: 500,
      align: 'center',
      renderCell: ({ item, row }) => <Typography variant='body2'>{item?.designation} </Typography>
    },
    {
      field: 'entitled',
      label: 'Description',
      width: 500,
      align: 'center',
      renderCell: ({ item, row, index, rowIndex }) => (
        <div className='!w-full'>
          <CustomReactQuill
            value={item?.description}
            height={'1rem'}
            handleChange={value => handleChangeRowDescription('description', value, index, row, rowIndex)}
          />
          {/* <TextField
            className='!w-full !border-none'
            sx={{
              width: '100%',
              fontSize: '13px',
              border: 'none',
              '& .MuiInputBase-input': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                border: 'none'
              }
            }}
            variant='standard'
            value={item?.description}
            onChange={event => handleChangeRowDescription('description', event?.target?.value, index, row, rowIndex)}
          /> */}
        </div>

        // <Typography variant='body2'>{row?.description} </Typography>
      )
    },
    {
      field: 'qte',
      label: 'QUANTITÉ',
      width: 150,
      align: 'center',
      renderCell: ({ item, row, index, rowIndex }) => (
        <CustomInput
          type='number'
          value={item?.qty}
          size='small'
          min={1}
          variant='standard'
          onChange={event => handleChangeRowInvoice('qty', event?.target?.value, index, row, rowIndex)}
          placeholder='M²'
          sx={{
            fontSize: '10px !important',
            '& .MuiOutlinedInput-input': {
              width: '100px'
            }
          }}

          // error={formError?.[`works.${index}.qty`]}
          // helperText={formError?.[`works.${index}.qty`]}
        />
      )
    },
    {
      field: 'PrixUnit',
      label: 'PRIX UNIT',
      width: 150,
      align: 'center',
      renderCell: ({ item, row, index, rowIndex }) => {
        return (
          <div className='flex justify-center'>
            <CustomCurrencyInput
              onChange={value => handleChangeRowInvoice('unit_price_HT', value?.value, index, row, rowIndex)}
              custom={true}
              value={item?.unit_price_HT}
            />
          </div>
        )
      }
    },
    {
      field: 'amount_HT',
      label: 'MONTANT HT',
      width: 290,
      align: 'center',
      renderCell: ({ item, row }) => {
        return (
          <Stack>
            <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
              <CustomCurrencyInput displayType='text' value={item?.amount_HT} />
            </Stack>
          </Stack>
        )
      }
    },
    {
      id: 'tva',
      label: 'TVA',
      minWidth: 50,
      align: 'center',
      renderCell: ({ item, row, index, rowIndex }) => {
        return (
          <div className=''>
            <OnlyNumbersInput
              sx={{
                '& .MuiInputBase-root': {
                  '& input': {
                    textAlign: 'center'
                  }
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 'none'
                },

                // remove focus underline
                '& .MuiInput-underline:after': {
                  borderBottom: 'none'
                },

                // remove hover underline
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none'
                }
              }}
              variant='standard'
              max={100}
              min={0}
              value={round(item?.tva * 100 || 0, user.company.decimals)}
              onChange={event => {
                handleChangeRowInvoice('tva', event.target.value / 100, index, row, rowIndex)
              }}
            />
          </div>
        )
      }
    },
    {
      id: 'montant_TTC',
      label: 'Montant TTC',
      minWidth: 300,
      align: 'center',
      renderCell: ({ item, row }) => {
        return (
          <Stack>
            <Stack flexDirection={'row'} justifyContent={'center'} gap={1}>
              <CustomCurrencyInput displayType='text' value={item?.amount_TTC} />
            </Stack>
          </Stack>
        )
      }
    },
    {
      id: '',
      label: ' ',
      minWidth: 300,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <>
            <IconButton color='error' onClick={() => handleDeleteSousArticleFromTable(row)}>
              <IconifyIcon icon='mdi:minus' />
            </IconButton>
          </>
        )
      }
    }
  ]
}

export default WorkServiceColumnsChildren
