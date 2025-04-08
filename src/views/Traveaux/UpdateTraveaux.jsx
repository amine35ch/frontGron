// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography, Button } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import DialogAlert from '../components/dialogs/DialogAlert'
import { useGetUnitType } from 'src/services/settings.service'

import { useDisabledWorks, useGetDetailWorks, useUpdateWorks } from 'src/services/work.service'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomReactQuill from 'src/components/CustomReactQuill'
import BasicTable from 'src/components/BasicTable'
import { useGetListQualification } from 'src/services/company.service'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import CustomCurrencyInputV2 from 'src/components/CustomCurrencyInputV2'

// ** Custom Components Imports

// ** Styled Components

const UpdateTraveaux = () => {
  const router = useRouter()
  const { id } = router.query

  // ** States

  const [formInput, setFormInput] = useState({
    description: null,
    reference: '',
    unit: null,
    pricing_list: [],
    display_name: '',
    p_qualification_id: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [updatedRows, setUpdatedRows] = useState()

  // ** Query
  const { data: detailsWorks, isLoading, isSuccess } = useGetDetailWorks({ id })
  const { data: listUnit } = useGetUnitType({})
  const updateTravauxMutation = useUpdateWorks({ id })
  const disabledWorksMutation = useDisabledWorks({ id })
  const { data: listQualification } = useGetListQualification({ type: 2 })

  // Handle function
  useEffect(() => {
    isSuccess &&
      setFormInput({
        ...detailsWorks,
        p_qualification_id: detailsWorks?.qualification?.id
      })
    setUpdatedRows(detailsWorks?.pricing_list)
  }, [isSuccess, detailsWorks])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    const data = {
      ...formInput,
      pricing_list: formInput?.pricing_list?.map(item => ({
        ...item,
        price_unit_ht: parseFloat(String(item.price_unit_ht).replace(',', '.'))
      }))
    }

    try {
      await updateTravauxMutation.mutateAsync(data)

      router.push('/works/')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors

      setFormErrors(errorsObject)
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
  }

  const disabledScenario = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledWorksMutation.mutateAsync({ id: id })
      }
      router.push('/works/')
    } catch (error) {}
  }

  const addLines = () => {
    const newUpdatedRows = [...updatedRows, { condition: '>= 0', price_unit_ht: updatedRows[0]?.price_unit_ht }]
    setUpdatedRows(newUpdatedRows)
  }

  const handleChangePrice = (index, field, value) => {
    const newRows = [...updatedRows]
    newRows[index][field] = value

    setUpdatedRows(newRows)

    setFormInput({ ...formInput, pricing_list: newRows })
  }

  return (
    <div className='h-full '>
      <CustomAccordian titleAccordian={'Informations'}>
        <Grid className='!mt-4' container spacing={5}>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Référence <span className='text-red-500'>*</span>
            </Typography>
            <TextField
              disabled
              placeholder='Titre'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.reference}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.reference}
              helperText={renderArrayMultiline(formErrors?.reference)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Désignation devis <span className='text-red-500'>*</span>
            </Typography>
            <TextField
              placeholder='Désignation'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.display_name}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.display_name}
              onChange={e => {
                handleChange('display_name', e.target.value)
              }}
              helperText={renderArrayMultiline(formErrors?.display_name)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Unité
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput.unit}
              onChange={value => handleChange('unit', value)}
              data={listUnit}
              formError={formErrors}
              option={'type'}
              displayOption={'entitled'}
              error={formErrors?.unit}
              helperText={renderArrayMultiline(formErrors?.unit)}
            />
          </Grid>
          <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Qualification<span className='text-red-500'>*</span>
            </Typography>
            <CustomeAutoCompleteSelect
              value={formInput.p_qualification_id}
              onChange={value => handleChange('p_qualification_id', value)}
              data={listQualification}
              formError={formErrors}
              option={'id'}
              displayOption={'entitled'}
              error={formErrors?.p_qualification_id}
              helperText={renderArrayMultiline(formErrors?.p_qualification_id)}
            />
          </Grid>
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
            {/* <div className='flex items-center justify-between mb-2 '>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Liste des Prix
              </Typography>

              <Button
                variant='contained'
                className='h-[29px]'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => addLines()}
              >
                <IconifyIcon color={'white'} icon='mdi:plus-circle-outline' fontSize={21} />
              </Button>
            </div> */}
            <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
              <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Prix HT <span className='text-red-500'>*</span>
              </Typography>
              {updatedRows?.map((row, index) => (
                <CustomCurrencyInputV2
                  key={index}
                  custome={true}
                  onChange={event => handleChangePrice(index, 'price_unit_ht', event)}
                  value={row.price_unit_ht}
                  name='unit_price'
                  fullWidth
                  size='small'
                  variant='outlined'
                  error={formErrors?.[`pricing_list.${index}.price_unit_ht`]}
                  helperText={renderArrayMultiline(formErrors?.[`pricing_list.${index}.price_unit_ht`])}
                />
              ))}
              {isLoading && (
                <CustomCurrencyInput value={0} name='unit_price' fullWidth size='small' variant='outlined' />
              )}
            </Grid>
            {/*
            <BasicTable
              formErrors={formErrors}
              rows={formInput?.pricing_list}
              updatedRows={updatedRows}
              setUpdatedRows={setUpdatedRows}
              setFormInput={value => setFormInput({ ...formInput, pricing_list: value })}
            /> */}
          </Grid>
          <Grid item xs={12} md={12} className='!mb-2 !mt-2 !pt-0'>
            <Typography className='!font-semibold !mb-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Description
            </Typography>
            <CustomReactQuill
              value={formInput.description}
              height={'250px'}
              handleChange={value => {
                handleChange('description', value)
              }}
            />
            {/* <TextField
            placeholder='Description'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.description}
            onChange={e => {
              handleChange('description', e.target.value)
            }}
            error={formErrors?.description}
            helperText={renderArrayMultiline(formErrors?.description)}
          /> */}
          </Grid>
        </Grid>
      </CustomAccordian>

      <Grid className='!mt-2' container spacing={5}>
        <Grid item xs={6}>
          {detailsWorks?.can_update && (
            <LoadingButton
              variant='contained'
              color='warning'
              loading={disabledWorksMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] '
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleDelete()}
              startIcon={<IconifyIcon icon='mdi:delete-outline' />}
            >
              {detailsWorks?.state == '0' ? 'Activer' : 'Désactiver'}
            </LoadingButton>
          )}
        </Grid>
        <Grid item xs={6} className='flex justify-end'>
          {detailsWorks?.can_update && (
            <LoadingButton
              variant='contained'
              loading={updateTravauxMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
            >
              Modifier
            </LoadingButton>
          )}
        </Grid>
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Scénario ${formInput?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={disabledScenario}
      />
    </div>
  )
}

export default UpdateTraveaux
