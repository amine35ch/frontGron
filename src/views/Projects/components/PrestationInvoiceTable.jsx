import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import RowTableCell from 'src/components/RowTableCell'
import SelectArticleDialog from './SelectArticleDialog'
import { useState } from 'react'

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

const PrestationInvoiceTable = ({ prestations, hideButtons = false }) => {
  const [localeRows, setLocaleRows] = useState([])
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)

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
              color='secondary'
              startIcon={<IconifyIcon icon='ic:round-add' />}
              onClick={() => handleAddArticleButtonClick({ d_work_id: null }, 1)}
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
                    MONTANT HT
                  </CustomTableCellHeader>
                  <CustomTableCellHeader width={290} align='center'>
                    TVA
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
                        <CustomInput
                          type='number'
                          value={row?.qty}
                          onChange={e => handleChange(index, 'qty', e.target.value)}
                          variant='standard'
                        />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput
                          custom={true}
                          onChange={e => handleChange(index, 'unit_price_HT', e.value)}
                          value={row?.unit_price_HT}
                        />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_HT} />
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_TVA} />
                        {/* {row?.total} */}
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <CustomCurrencyInput displayType='text' value={row?.amount_TTC} />
                        {/* {row?.total} */}
                      </RowTableCell>
                      <RowTableCell align='center'>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          {!hideButtons ? (
                            <>
                              <IconButton color='error' onClick={() => handleDeleteClick(index)}>
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

export default PrestationInvoiceTable
