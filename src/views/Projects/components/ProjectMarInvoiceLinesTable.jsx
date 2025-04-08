import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import SelectArticleDialog from './SelectArticleDialog'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import RowTableCell from 'src/components/RowTableCell'
import TotalCard from './InvoiceTotalCard'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { totalHT, totalTVA } from './ProjectInvoiceCalculator'
import { useGetMarScales } from 'src/services/settings.service'
import { marAmount } from 'src/views/simulator/simulateCalculator'
import { locale } from 'moment'
import { set } from 'nprogress'
import InputNumberWithComma from 'src/components/InputNumberWithComma'
import CustomCurrencyInputV2 from 'src/components/CustomCurrencyInputV2'

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
  TextField,
  InputAdornment
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

const ProjectMarInvoiceLinesTable = props => {
  const theme = useTheme()

  const {
    listArticles,
    localeRows = [],
    setLocaleRows = () => {},
    hideButtons = false,
    setTotalHt,
    scenario,
    anahAmounts,
    allAmounts,
    company,
    setAllAmounts,
    detailsProject
  } = props

  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)

  const handleAddArticleButtonClick = (row = null, type) => {
    setIsArticleDialogOpen(true)
  }
  const isDisabled = detailsProject.isEditable

  const handleDeleteClick = index => {
    const newRows = localeRows.filter((row, i) => i !== index)
    const totalTva = totalTVA(newRows)
    const totalHt = totalHT(newRows)
    const totalTTC = totalTva + totalHt

    setAllAmounts({
      totalHt: totalHt,
      totalTva: totalTva,
      totalTTC: totalTTC
    })
    setLocaleRows(newRows)
  }

  const addArticle = article => {
    const newRows = [
      ...localeRows,
      {
        id: null,
        d_article_id: article.id,
        designation: article.designation,
        qty: 1,
        unit_price_HT: article.unit_price,
        amount_HT: article.unit_price,
        tva: company?.tva,
        amount_TVA: article.unit_price * company?.tva,
        amount_TTC: article.unit_price + article.unit_price * company?.tva,
        type: article?.type,
        d_work_id: article?.works?.id ? article?.works?.id : null
      }
    ]
    const totalTva = totalTVA(newRows)
    const totalHt = totalHT(newRows)
    const totalTTC = totalTva + totalHt

    setAllAmounts({
      totalHt: totalHt,
      totalTva: totalTva,
      totalTTC: totalTTC
    })
    setLocaleRows(newRows)
  }

  const handleChange = (index, key, value) => {
    setLocaleRows(prevRows => {
      const newRows = prevRows.map((row, i) => {
        if (i === index) {
          const updatedRow = {
            ...row,
            [key]: value
          }

          const updatedRowQty = parseFloat(String(updatedRow.qty).replace(',', '.'))
          const updatedRowUnitPriceHTy = parseFloat(String(updatedRow.unit_price_HT).replace(',', '.'))

          updatedRow.amount_HT = updatedRowQty * updatedRowUnitPriceHTy
          updatedRow.amount_TVA = updatedRowQty * updatedRowUnitPriceHTy * updatedRow.tva
          updatedRow.amount_TTC =
            updatedRowQty * updatedRowUnitPriceHTy + updatedRowQty * updatedRowUnitPriceHTy * updatedRow.tva

          return updatedRow
        }

        return row
      })

      const totalTva = totalTVA(newRows)
      const totalHt = totalHT(newRows)
      const totalTTC = totalTva + totalHt

      setAllAmounts({
        totalHt: totalHt,
        totalTva: totalTva,
        totalTTC: totalTTC
      })

      return newRows
    })
  }

  const handleDeleteArticle = article => {
    const newRows = localeRows.filter(row => row.d_article_id !== article.id)
    const totalTva = totalTVA(newRows)
    const totalHt = totalHT(newRows)
    const totalTTC = totalTva + totalHt

    setAllAmounts({
      totalHt: totalHt,
      totalTva: totalTva,
      totalTTC: totalTTC
    })
    setLocaleRows(newRows)
  }

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
              disabled={isDisabled}
            >
              Ajouter une prestation
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
                  <CustomTableCellHeader width={500} align='center'>
                    Libellé
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={150} align='center'>
                    QUANTITÉ
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={150} align='center'>
                    PRIX UNIT
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'>
                    TVA
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'>
                    MONTANT HT
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'>
                    MONTANT TVA
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'>
                    MONTANT TTC
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={100} align='center' />
                </TableRow>
              </TableHead>
              <TableBody>
                {localeRows?.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <RowTableCell>
                        <Typography> {row?.designation}</Typography>
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <InputNumberWithComma
                          value={row?.qty}
                          onChange={value => handleChange(index, 'qty', value)}
                          disabled={isDisabled}
                        />
                        {/* <CustomInput
                          type='number'
                          value={row?.qty}
                          onChange={e => handleChange(index, 'qty', e.target.value)}
                          variant='standard'
                        /> */}
                      </RowTableCell>
                      <RowTableCell align='center'>
                        {/* <CustomCurrencyInput
                          custom={true}
                          onChange={e => handleChange(index, 'unit_price_HT', e.floatValue)}
                          value={row?.unit_price_HT}
                        /> */}
                        <CustomCurrencyInputV2
                          onChange={e => handleChange(index, 'unit_price_HT', e)}
                          value={row?.unit_price_HT}
                        />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput
                          type='number'
                          value={row?.tva * 100}
                          onChange={e => {
                            const tva = e.floatValue / 100
                            handleChange(index, 'tva', tva)
                          }}
                          variant='standard'
                          decimalScale={1}
                          custom={true}
                          suffix=' %'
                        />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_HT} />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_TVA} />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_TTC} />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          {!hideButtons ? (
                            <>
                              <IconButton color='error' onClick={() => handleDeleteClick(index)} disabled={isDisabled}>
                                <IconifyIcon icon='mdi:minus' />
                              </IconButton>
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
                  <CustomTableCellHeader width={500}></CustomTableCellHeader>
                  <CustomTableCellHeader width={150} align='center'></CustomTableCellHeader>
                  <CustomTableCellHeader width={150} align='center'></CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'></CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'></CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'></CustomTableCellHeader>
                  <CustomTableCellHeader width={100} align='center'></CustomTableCellHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <RowTableCell align='right' colSpan={3}>
                    <Typography variant='h6'>TOTAL</Typography>
                  </RowTableCell>

                  <RowTableCell align='center'>
                    <CustomCurrencyInput allowNegative={true} displayType='text' value={allAmounts?.totalHt} />
                  </RowTableCell>
                  <RowTableCell align='center'>
                    <CustomCurrencyInput allowNegative={true} displayType='text' value={allAmounts?.totalTva} />
                  </RowTableCell>
                  <RowTableCell align='center'>
                    <CustomCurrencyInput displayType='text' value={allAmounts?.totalTTC} />
                  </RowTableCell>
                  <RowTableCell align='center'></RowTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {isArticleDialogOpen && (
        <SelectArticleDialog
          isDialogOpen={isArticleDialogOpen}
          listArticles={listArticles}
          selectedArticles={localeRows}
          closeDialog={() => setIsArticleDialogOpen(false)}
          onSelectArticle={addArticle}
          onDeleteArticle={handleDeleteArticle}
        />
      )}
    </>
  )
}

export default ProjectMarInvoiceLinesTable
