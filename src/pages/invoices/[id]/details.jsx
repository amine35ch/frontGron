import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Typography,
  Grid,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  CardActions,
  CardHeader,
  useTheme
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import RowTableCell from 'src/components/RowTableCell'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import {
  useAddProjectToInvoice,
  useCancelInvoice,
  useGetDetailsSubscriptionInvoices,
  useRemoveProjectFromInvoice
} from 'src/services/subscription.service'

import InvoiceHeader from './InvoiceHeader'
import TotalCardInvoice from './TotalCardInvoice'
import ListProject from 'src/views/Projects/ListProject'
import { LoadingButton } from '@mui/lab'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/@core/hooks/useStates'

const Details = ({ hideButtons }) => {
  const router = useRouter()
  const theme = useTheme()
  const { getStateByModel } = useStates()
  const [detailsInvoicesState, setdetailsInvoicesState] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { id } = router.query
  const { data: detailsInvoice } = useGetDetailsSubscriptionInvoices({ id })
  const removeLineFromInvoiceMutation = useRemoveProjectFromInvoice()
  const addProjectToInvoiceMutation = useAddProjectToInvoice()
  const cancelInvoiceMutation = useCancelInvoice()

  useEffect(() => {
    detailsInvoice && setdetailsInvoicesState(detailsInvoice?.data)
  }, [detailsInvoice])

  const handleDeleteClick = async row => {
    try {
      await removeLineFromInvoiceMutation.mutateAsync({ invoiceId: id, lineId: row?.id })
    } catch (error) {}
  }

  const cancelFacture = async detailsInvoice => {
    const data = {
      sub_invoice_id: detailsInvoice?.id,
      reference: detailsInvoice?.reference
    }
    try {
      await cancelInvoiceMutation.mutateAsync(data)
      router.push('/user-profile/billing-setting/')
    } catch (error) {}
  }

  return (
    <>
      <IconButton
        onClick={() => {
          router.push(`/user-profile/billing-setting/`)
        }}
      >
        <IconifyIcon color={theme.palette.primary.main} icon='icon-park-outline:arrow-left' width={20} height={20} />
      </IconButton>
      <Card>
        <CardContent>
          <CardHeader
            title={
              <div className='flex justify-end'>
                <CustomChip
                  skin='light'
                  color={getStateByModel('DProjectInvoiceHeader', detailsInvoice?.data?.state)?.color}
                  sx={{
                    fontWeight: '600',
                    fontSize: '.75rem',
                    height: '26px'
                  }}
                  label={getStateByModel('DProjectInvoiceHeader', detailsInvoice?.data?.state)?.name}
                />
              </div>
            }
          />
          <Grid container spacing={5}>
            {/* header */}

            <InvoiceHeader detailsInvoices={detailsInvoice?.data} />
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
                {detailsInvoice?.data?.state == 0 && (
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:round-add' />}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Ajouter
                  </Button>
                )}
              </Grid>
            ) : null}
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
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
                          <CustomTableCellHeader width={150} align='center'>
                            Description
                          </CustomTableCellHeader>

                          <CustomTableCellHeader width={150} align='center'>
                            PRIX UNIT
                          </CustomTableCellHeader>
                          <CustomTableCellHeader width={290} align='center'>
                            MONTANT HT
                          </CustomTableCellHeader>

                          <CustomTableCellHeader width={290} align='center'>
                            MONTANT TTC
                          </CustomTableCellHeader>
                          <CustomTableCellHeader width={100} align='center' />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailsInvoice?.data?.lines?.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <RowTableCell align='center'>
                                <Typography> {row?.description}</Typography>
                              </RowTableCell>

                              <RowTableCell align='center'>
                                <CustomCurrencyInput
                                  custom={true}
                                  onChange={e => handleChange(index, 'unit_price_HT', e.value)}
                                  value={row?.unit_price_ht}

                                  // placeholder='€'
                                />
                              </RowTableCell>
                              <RowTableCell align='center'>
                                <CustomCurrencyInput displayType='text' value={row?.amount_ht} />
                              </RowTableCell>

                              <RowTableCell align='center'>
                                <CustomCurrencyInput displayType='text' value={row?.amount_ttc} />
                                {/* {row?.total} */}
                              </RowTableCell>
                              <RowTableCell align='center'>
                                <Box display={'flex'} justifyContent={'flex-end'}>
                                  {!hideButtons ? (
                                    <>
                                      <IconButton color='error' onClick={() => handleDeleteClick(row, index)}>
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
                </CardContent>
              </Card>
            </Grid>
            {/* footer */}
            <Grid item xs={12}>
              <TotalCardInvoice detailsInvoices={detailsInvoice?.data} />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ placeContent: 'end' }}>
          {detailsInvoice?.data?.state == 0 && (
            <LoadingButton
              onClick={() => cancelFacture(detailsInvoice?.data)}
              variant='outlined'
              color='error'
              size='small'
              startIcon={<IconifyIcon icon='mdi:cancel' />}
            >
              Annuler facture
            </LoadingButton>
          )}
        </CardActions>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth={'xl'}>
          <DialogContent>
            <ListProject withCheckbox={false} state={2} showAllColumn={false} />
          </DialogContent>
        </Dialog>
      </Card>
    </>
  )
}

export default Details
