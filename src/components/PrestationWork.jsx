import {
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import { useGetWorks } from 'src/services/work.service'
import CustomCurrencyInput from './CustomeCurrencyInput'
import OnlyNumbersInput from './OnlyNumbersInput'
import { useAuth } from 'src/hooks/useAuth'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    '& input': {
      textAlign: 'center',
      border: 'none',
      outline: 'none'
    }
  },
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
    border: 'none',
    outline: 'none'
  },

  '& .MuiInput-underline:after': {
    border: 'none',
    outline: 'none'
  },

  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 'none',
    outline: 'none'
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    border: 'none',
    outline: 'none'
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
      outline: 'none'
    },
    '&:hover fieldset': {
      border: 'none',
      outline: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      outline: 'none'
    }
  }
}))

const PrestationWork = ({ detailsProject, children }) => {
  const { user } = useAuth()

  const [listTravaux, setListTravaux] = useState([])
  const [scenarioFromWorks, setScenarioFromWorks] = useState(null)
  const [localWorkList, setLocalWorkList] = useState([])

  // ** react query
  const {
    data: worksList,
    isLoading,
    isSuccess
  } = useGetWorks({
    state: 1
  })
  useEffect(() => {
    if (!worksList) return

    const isActiveWork = work => {
      if (detailsProject?.works?.length !== 0) {
        return detailsProject?.works.some(trav => trav.work.reference === work.reference)
      } else {
        return work.reference == 'VMC double flux'
      }
    }

    const newlistTravaux = worksList.map(work => ({
      ...work,
      active: isActiveWork(work)
    }))

    const activeWorks = newlistTravaux.filter(item => item.active)

    setListTravaux(newlistTravaux)
    displayWorks(activeWorks)
    setScenarioFromWorks(activeWorks)
  }, [worksList, detailsProject])

  const displayWorks = works => {
    let workList = []
    works?.map(work => {
      workList.push(work)
    })
    setLocalWorkList(workList)
  }
  const columns = columnsFn('simulation', user)

  return (
    <Grid container>
      <Grid
        mt={5}
        item
        pt={0}
        xs={12}
        sm={12}
        md={12}
        display={'block'}
        justifyContent={'center'}
        sx={{ textAlignLast: 'center' }}
      >
        {listTravaux?.map((work, index) => (
          <CustomChip
            skin='light'
            size='small'
            key={index}
            label={work?.reference}
            color={work?.active == true ? 'info' : 'secondary'}
            onClick={() => chooseWork(index)}
            sx={{
              height: 28,
              fontWeight: 500,
              fontSize: '0.95rem',
              alignSelf: 'flex-start',
              marginLeft: '10px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          />
        ))}
      </Grid>
      <Grid item sx={{ pt: 0 }} xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
        <Grid item pt={0} xs={5} sm={5} md={5}>
          <Divider />
        </Grid>
      </Grid>

      <Grid item pt={1} mt={1} mb={3} xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
        <Typography ml={2} sx={{ fontWeight: 700 }}>
          {scenarioFromWorks?.map((work, index) =>
            index !== scenarioFromWorks?.length - 1 ? `${work?.reference} + ` : work?.reference
          )}
        </Typography>
      </Grid>
      <Grid mt={5} item xs={12} md={12} display={'flex'} justifyContent={'end'}>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column, key) => (
                  <TableCell align='center' sx={{ padding: 2 }} key={key}>
                    <Typography fontWeight={600} fontSize={14} sx={{ padding: 0 }}>
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {localWorkList?.map((row, indexRow) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={indexRow}>
                    {columns?.map((column, index) => (
                      <TableCell sx={{ padding: '10px !important ' }} key={column.id} align='center'>
                        {column?.renderCell(row, indexRow)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid mt={5} item xs={12} md={12}>
        {children}
      </Grid>
    </Grid>
  )
}

export default PrestationWork

const columnsFn = (type, user) => {
  if (type === 'simulation') {
    return [
      {
        id: 'work',
        label: 'Geste/Prestation',
        minWidth: 10,
        renderCell: (row, index) => {
          return <div className=''>{row?.work?.reference}</div>
        }
      },

      {
        id: 'qty',
        label: 'Valeur',
        minWidth: 150,
        renderCell: (row, index) => {
          return (
            <div className=''>
              <StyledTextField
                type='number'
                variant='standard'
                onChange={event => handleChangeRow('qty', event.target.value, index)}
                value={row?.qty}
              />
            </div>
          )
        }
      },
      {
        id: 'prix_unitaire',
        label: 'Prix unitaire HT',
        minWidth: 150,
        renderCell: (row, index) => {
          return (
            <div className=''>
              <CustomCurrencyInput
                placeholder={'1.00 €'}
                onChange={event => handleChangeRow('price_unit_ht', event.value, index)}
                custom={true}
                value={row?.price_unit_ht}
              />
            </div>
          )
        }
      },
      {
        id: 'montant_hT',
        label: 'Montant HT',
        minWidth: 150,
        renderCell: (row, index) => {
          return (
            <div className=''>
              <CustomCurrencyInput displayType='text' value={row?.cost_invoice_ht} />
            </div>
          )
        }
      }
    ]
  }

  return [
    {
      id: 'work',
      label: 'Geste',
      minWidth: 10,
      renderCell: (row, index) => {
        return <div className=''>{row?.work?.reference}</div>
      }
    },
    {
      id: 'st',
      label: 'Sous-traitant',
      minWidth: 150,
      renderCell: (row, index) => {
        return (
          <div className=''>
            <StyledTextField
              variant='standard'
              onChange={event => handleChangeRowTextFields('sub_contractor_entitled', event.target.value, index)}
              value={row?.sub_contractor_entitled}
            />
          </div>
        )
      }
    },
    {
      id: 'qty',
      label: 'Siret sous-traitant',
      minWidth: 150,
      renderCell: (row, index) => {
        return (
          <div className=''>
            <StyledTextField
              variant='standard'
              onChange={event => handleChangeRowTextFields('sub_contractor_siret', event.target.value, index)}
              value={row?.sub_contractor_siret}
            />
          </div>
        )
      }
    },
    {
      id: 'qty',
      label: 'Quantité/Surface',
      minWidth: 150,
      renderCell: (row, index) => {
        return (
          <div className=''>
            <StyledTextField
              type='number'
              variant='standard'
              onChange={event => handleChangeRow('qty', event.target.value, index)}
              value={row?.qty}
            />
          </div>
        )
      }
    },
    {
      id: 'prix_unitaire',
      label: 'Prix unitaire HT',
      minWidth: 150,
      renderCell: (row, index) => {
        return (
          <div className=''>
            <CustomCurrencyInput
              placeholder={'1.00 €'}
              onChange={event => handleChangeRow('price_unit_ht', event.value, index)}
              custom={true}
              value={row?.price_unit_ht}
            />
          </div>
        )
      }
    },
    {
      id: 'montant_hT',
      label: 'Montant HT',
      minWidth: 150,
      renderCell: (row, index) => {
        return (
          <div className=''>
            <CustomCurrencyInput displayType='text' value={row?.cost_invoice_ht} />
          </div>
        )
      }
    },
    {
      id: 'tva',
      label: 'TVA',
      minWidth: 50,
      renderCell: (row, index) => {
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
              value={Math.round((row?.tva * 100 || 0) * 10 ** user.company.decimals) / 10 ** user.company.decimals}
              onChange={event => {
                handleChangeRow('tva', event.target.value / 100, index)
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
      renderCell: (row, index) => {
        return (
          <div className=''>
            <CustomCurrencyInput displayType='text' value={row?.cost_invoice_ttc} />
          </div>
        )
      }
    }
  ]
}
