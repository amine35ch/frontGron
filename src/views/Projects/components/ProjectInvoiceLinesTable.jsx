import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import SelectArticleDialog from './SelectArticleDialog'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import RowTableCell from 'src/components/RowTableCell'
import TotalCard from './InvoiceTotalCard'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { totalHT } from './ProjectInvoiceCalculator'

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  useTheme,
  Typography,
  Grid,
  Button,
  IconButton,
  Box,
  Divider,
  TextField
} = require('@mui/material')

// const CustomTableCell = styled(TableCell)(({ theme }) => ({
//   color: theme.palette.primary.main,
//   fontWeight: 'bold',
//   pl: 3,
//   whiteSpace: 'nowrap',
//   borderTopLeftRadius: 15,
//   '&.MuiTableCell-head': {
//     fontSize: 18
//   }
// }))
export const CustomInput = styled(TextField)(({ theme }) => ({
  // remove the underline
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
}))

const ProjectInvoiceLinesTable = props => {
  const theme = useTheme()

  const {
    listArticles,
    localeRows = [],
    setLocaleRows = () => {},
    hideButtons = false,
    handleAddInvoiceLine = () => {},
    company,
    setTotalHt,
    hideAll
  } = props

  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [type, setType] = useState(0)

  // const listArticles = [
  //   {
  //     id: 4,
  //     designation_article: 'Article 1',
  //     qty: 1,
  //     unit_price_HT: 100,
  //     remise: 0,
  //     unit_price_HTNet: 100,
  //     unit_price_TTC: 120
  //   },
  //   {
  //     id: 5,
  //     designation_article: 'Article 2',
  //     qty: 1,
  //     unit_price_HT: 100,
  //     remise: 0,
  //     unit_price_HTNet: 100,
  //     unit_price_TTC: 120
  //   }
  // ]

  const handleAddArticleButtonClick = (row = null, type) => {
    setIsArticleDialogOpen(true)
    setSelectedRowId(row?.id)
    setSelectedRow(row)
    setType(type)
  }

  const handleDeleteClick = index => {
    const rowToDelete = localeRows[index]
    let newRows = []
    if (rowToDelete.parent_id === null) {
      newRows = localeRows.filter((row, i) => i !== index && row?.parent_id !== rowToDelete.id)
    } else {
      newRows = localeRows.filter((row, i) => i !== index)
    }

    setLocaleRows(newRows)
  }

  const addArticle = article => {
    const items = [...localeRows]

    if (type === 0) {
      const existingItemIndex = items.findIndex(item => item?.id === selectedRowId)
      if (existingItemIndex !== -1) {
        items[existingItemIndex] = {
          ...items[existingItemIndex],
          designation: article?.designation,
          d_article_id: article?.id,
          unit_price_HT: article?.unit_price,
          unit: article?.unit,
          amount_HT: article?.unit_price * items[existingItemIndex].qty,
          description: article?.description,
          tva: company?.tva
        }
        const parent = items?.find(item => item?.id === items[existingItemIndex]?.parent_id)
        if (parent) {
          parent.amount_HT = items.reduce((acc, item) => {
            if (item.parent_id === parent.id) {
              acc += item.amount_HT
            }

            return acc
          }, 0)
        }
      }
    } else {
      const existingItemIndex = items.findIndex(item => item?.id === article?.id && item?.parent_id === selectedRowId)
      if (existingItemIndex !== -1) {
        items[existingItemIndex].qty++
      } else {
        const index = selectedRowId !== null ? items.findIndex(item => item?.id === selectedRowId) : -1
        const lastChildIndex = items.findIndex(item => item?.parent_id === selectedRowId)

        const newItem = {
          ...article,
          tva: company?.tva,
          qty: 0,
          parent_id: selectedRowId
        }
        const parent = items?.find(item => item?.id === items[existingItemIndex]?.parent_id)
        if (parent) {
          parent.amount_HT = items.reduce((acc, item) => {
            if (item.parent_id === parent.id) {
              acc += item.amount_HT
            }

            return acc
          }, 0)
        }
        if (lastChildIndex !== -1) {
          items.splice(lastChildIndex + 1, 0, newItem)
        } else if (index !== -1) {
          items.splice(index + 1, 0, newItem)
        } else {
          items.push(newItem)
        }
      }
    }

    setLocaleRows(items)
  }

  const handleChange = (index, key, value) => {
    const items = [...localeRows]
    items[index][key] = value
    if (key === 'qty' || key === 'unit_price_HT') {
      items[index].amount_HT = items[index].qty * items[index].unit_price_HT
      const parentIndex = items.findIndex(item => item.id === items[index].parent_id)
      if (parentIndex !== -1) {
        items[parentIndex].amount_HT = items.reduce((acc, item) => {
          if (item.parent_id === items[index].parent_id) {
            acc += item.amount_HT
          }

          return acc
        }, 0)
      }
    }
    setLocaleRows(items)
  }
  const totalHorsTaxe = totalHT(localeRows)
  useEffect(() => {
    setTotalHt(totalHorsTaxe)
  }, [totalHorsTaxe])

  return (
    <>
      <Grid container spacing={5}>
        {!hideButtons ? (
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <Button
              variant='outlined'
              color='primary'
              startIcon={<IconifyIcon icon='ic:round-add' />}
              onClick={() => handleAddArticleButtonClick({ d_work_id: null }, 1)}
            >
              Ajouter Article Libre
            </Button>
          </Grid>
        ) : null}
        <Grid item xs={12} md={12}>
          <TableContainer
            sx={{
              '&.MuiTableContainer-root': {
                borderRadius: 0
              }
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCellHeader width={600} align='center'>
                    DÉSIGNATION
                  </CustomTableCellHeader>
                  <CustomTableCellHeader align='center'>QUANTITÉ/SURFACE</CustomTableCellHeader>
                  <CustomTableCellHeader align='center'>PRIX UNIT</CustomTableCellHeader>
                  <CustomTableCellHeader align='center'>TVA</CustomTableCellHeader>
                  <CustomTableCellHeader align='center'>Total</CustomTableCellHeader>
                  <CustomTableCellHeader width={10} align='center' />
                </TableRow>
              </TableHead>
              <TableBody>
                {localeRows?.map((row, index) => {
                  let sx = {
                    backgroundColor: theme.palette.secondary.beige,
                    color: theme.palette.common.black
                  }
                  if (row?.parent_id != null) {
                    sx = { paddingLeft: 10 }
                  }

                  return (
                    <TableRow key={index}>
                      <RowTableCell sx={{ ...sx }}>
                        <Typography sx={{ ...sx }}> {row?.designation || 'Sélectionner une Marque/produit'}</Typography>
                        <Box>{row?.description}</Box>
                      </RowTableCell>
                      <RowTableCell sx={{ ...sx }} align='center'>
                        {/* {row?.qty} */}
                        {row?.parent_id != null && (
                          <CustomInput
                            type='number'
                            value={row?.qty}
                            onChange={e => handleChange(index, 'qty', e.target.value)}
                            variant='standard'

                            // className='w-1/3'
                          />
                        )}
                      </RowTableCell>
                      <RowTableCell sx={{ ...sx }} align='center'>
                        {/* {row?.unit_price_HT} */}
                        {row?.parent_id != null && (
                          <CustomCurrencyInput
                            custom={true}
                            onChange={e => handleChange(index, 'unit_price_HT', e.value)}
                            value={row?.unit_price_HT}
                          />
                        )}
                      </RowTableCell>
                      <RowTableCell sx={{ ...sx }} align='center'>
                        {row?.parent_id != null ? `${row?.tva * 100} %` : ''}
                      </RowTableCell>
                      <RowTableCell sx={{ ...sx }} align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_HT} />
                        {/* {row?.total} */}
                      </RowTableCell>
                      <RowTableCell sx={{ ...sx }} align='center'>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          {!hideButtons ? (
                            <>
                              <IconButton
                                color='primary'
                                onClick={() => {
                                  let type = null
                                  if (row?.parent_id !== null) {
                                    type = row?.type === 0 ? 0 : 1
                                  }
                                  handleAddArticleButtonClick(row, type)
                                }}
                              >
                                <IconifyIcon icon='mdi:plus' />
                              </IconButton>

                              {row?.d_work_id === null || row?.type !== 2 ? (
                                <IconButton color='error' onClick={() => handleDeleteClick(index)}>
                                  <IconifyIcon icon='mdi:minus' />
                                </IconButton>
                              ) : null}
                            </>
                          ) : null}
                        </Box>
                      </RowTableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {isArticleDialogOpen && (
        <SelectArticleDialog
          type={type}
          isDialogOpen={isArticleDialogOpen}
          listArticles={listArticles}
          selectedArticles={[]}
          closeDialog={() => setIsArticleDialogOpen(false)}
          onSelectArticle={addArticle}
          selectedRow={selectedRow}
        />
      )}
    </>
  )
}

export default ProjectInvoiceLinesTable
