// ** React Imports
import CustomInputCurrentcount from 'src/components/CustomInputCurrentcount'

// ** MUI Imports
import { CircularProgress, Grid, Stack, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import CustomAccordian from 'src/components/CustomAccordian'

import { LoadingButton } from '@mui/lab'

import { useGetCurrentPiece, useUpdateCurrentPieces } from 'src/services/company.service'

const UpdateInvoice = () => {
  // ** States
  const [formErrors, setFormErrors] = useState(false)
  const [invoiceReference, setInvoiceReference] = useState(false)

  // ** Query
  const { data: detailsCurrentPieces, isLoading } = useGetCurrentPiece()

  const handleChange = (field, value, index) => {
    const updatedInvoiceReference = [...invoiceReference]

    updatedInvoiceReference[index][field] = value

    setInvoiceReference(updatedInvoiceReference)
  }
  const updateCurrentPiecesMutation = useUpdateCurrentPieces()

  const onSubmit = async () => {
    const updatedData = {
      current: invoiceReference
    }

    try {
      await updateCurrentPiecesMutation.mutateAsync(updatedData)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    if (detailsCurrentPieces) {
      setInvoiceReference(detailsCurrentPieces)
    }
  }, [detailsCurrentPieces])

  if (isLoading)
    return (
      <Stack height='80vh' width='100%' display='flex' alignItems='center' justifyContent='center'>
        <CircularProgress />
      </Stack>
    )

  return (
    <div className='h-full'>
      {detailsCurrentPieces?.map((item, index) => (
        <CustomAccordian
          key={index}
          titleAccordian={item.type === 'devis' ? 'Devis' : item.type === 'invoice' ? 'Facture valable' : 'Contrat'}
        >
          <Grid className='!mt-4' container spacing={5}>
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Compteur actuel
              </Typography>
              <TextField
                placeholder='compteur actuel'
                size='small'
                variant='outlined'
                className='w-full !mt-1'
                defaultValue={item.current_count}
                onChange={e => handleChange(`current_count`, e.target.value, index)}
                InputProps={{
                  inputComponent: CustomInputCurrentcount
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Prefix
              </Typography>
              <TextField
                placeholder='Prefix'
                size='small'
                variant='outlined'
                className='w-full !mt-1'
                value={item.prefix}
                onChange={e => handleChange(`prefix`, e.target.value, index)}
              />
            </Grid>
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Format
              </Typography>
              <TextField
                placeholder='Disabled Format'
                size='small'
                variant='outlined'
                className='w-full !mt-1'
                value={item.format}
                disabled
              />
            </Grid>
          </Grid>
        </CustomAccordian>
      ))}
      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={updateCurrentPiecesMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Modifier
          </LoadingButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default UpdateInvoice
