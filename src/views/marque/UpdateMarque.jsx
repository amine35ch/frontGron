// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'
import dynamic from 'next/dynamic'

const DynamicQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import renderArrayMultiline from 'src/@core/utils/utilities'
import { useRouter } from 'next/router'
import DialogAlert from '../components/dialogs/DialogAlert'
import {
  useDeleteBrand,
  useDisabledBrands,
  useEnableBrands,
  useGetDetailBrand,
  useToggleAccessBrands,
  useUpdateBrand,
  useValidateBrands
} from 'src/services/brand.service'
import CustomAccordian from 'src/components/CustomAccordian'
import IconifyIcon from 'src/@core/components/icon'
import { Tooltip, IconButton } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

// ** Custom Components Imports

// ** Styled Components

const UpdateMarque = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  // ** States

  const [formInput, setFormInput] = useState({
    entitled: null,
    description: null

    // reference: null
  })
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  // ** Query
  const { data: detailsBrand, isLoading, isSuccess } = useGetDetailBrand({ id })

  const updateBrandMutation = useUpdateBrand({ id })
  const disabledBrandsMutation = useDisabledBrands({ id })

  const enableBrandMutation = useEnableBrands({ id })
  const validateBrandMutation = useValidateBrands({ id })
  const toggleBrandMutation = useToggleAccessBrands({ id })
  const deleteBrandMutation = useDeleteBrand()

  const modules = {
    toolbar: [['bold'], [{ color: [] }, { background: [] }], ['clean']]
  }

  // Handle function
  useEffect(() => {
    isSuccess &&
      setFormInput({
        ...detailsBrand
      })
  }, [isSuccess, detailsBrand])

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      formData.append(key, formInput[key])
    }
    try {
      await updateBrandMutation.mutateAsync(formInput)

      router.push('/Catalog/brands/')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const disabledBrands = async () => {
    try {
      await disabledBrandsMutation.mutateAsync({ id: id })

      router.push('/Catalog/brands/')
    } catch (error) {}
  }

  const handleEnabledBrands = async () => {
    try {
      await enableBrandMutation.mutateAsync()
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const handleValidateBrand = async event => {
    setSuspendDialogOpen(false)

    try {
      await validateBrandMutation.mutateAsync()

      router.push(`/Catalog/brands/`)
    } catch (error) {}
  }

  const handleToggleAccesBrandsMuatation = async event => {
    setSuspendDialogOpen(false)

    try {
      await toggleBrandMutation.mutateAsync()
    } catch (error) {}
  }

  const handledeleteBrand = () => {
    setSuspendDialogOpen(true)
  }

  const deleteBrand = async event => {
    try {
      if (event) {
        await deleteBrandMutation.mutateAsync({ id })
        router.push(`/Catalog/brands/`)
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  return (
    <div className='h-full '>
      <CustomAccordian height={'!h-[70vh]'} titleAccordian={'Informations'}>
        <div className='flex items-center justify-between my-2'>
          <div className='flex items-center'>
            <Typography sx={{ fontWeight: '600' }}>Scoiété: &nbsp; </Typography>
            <Typography fontSize={15} sx={{ fontWeight: '400' }}>
              {formInput?.company_name} &nbsp;{' '}
            </Typography>
          </div>
          {/* {detailsBrand?.can_update && (
            <div className='flex items-center'>
              <Typography sx={{ fontWeight: '600' }}>Accès: &nbsp; </Typography>
              {formInput?.access == '1' ? (
                <Tooltip
                  sx={{ backgroundColor: '#ff4d491f' }}
                  onClick={() => handleToggleAccesBrandsMuatation()}
                  title={user?.profile == 'MAR' ? 'Désactiver Accès pour tout le monde' : 'Désactiver'}
                >
                  <IconButton>
                    <IconifyIcon color='#FF4D49' icon='mdi:lock-off' />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  sx={{ backgroundColor: '#EBEBFB' }}
                  onClick={() => handleToggleAccesBrandsMuatation()}
                  title={user?.profile == 'MAR' ? 'Activer Accès pour tout le monde ' : 'Activer Accès'}
                >
                  <IconButton>
                    <IconifyIcon color='#585dd8' icon='material-symbols:lock-open' />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )} */}
        </div>

        <Grid className='!mt-4' container spacing={5}>
          {/* <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Référence
            </Typography>
            <TextField
              placeholder='Titre'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.reference}
              onChange={e => {
                handleChange('reference', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.reference}
              helperText={renderArrayMultiline(formErrors?.reference)}
            />
          </Grid> */}
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Titre
            </Typography>
            <TextField
              placeholder='Titre'
              size='small'
              variant='outlined'
              className='w-full !mt-1'
              value={formInput.entitled}
              onChange={e => {
                handleChange('entitled', e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
              error={formErrors?.entitled}
              helperText={renderArrayMultiline(formErrors?.entitled)}
            />
          </Grid>
          <Grid item xs={12} md={12} className='!mb-2 !pt-0'>
            <Typography className='!font-semibold !mb-2' sx={{ fontSize: '15px', color: '#2a2e34' }}>
              Description
            </Typography>

            <DynamicQuill
              style={{ height: '350px' }}
              modules={modules}
              theme='snow'
              value={formInput.description}
              onChange={e => handleChange('description', e)}
            />
          </Grid>
        </Grid>
      </CustomAccordian>

      <Grid container>
        <Grid item xs={6}>
          {detailsBrand?.state == 0 ? (
            <LoadingButton
              variant='outlined'
              color='success'
              loading={enableBrandMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[115px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handleEnabledBrands()}
              startIcon={<IconifyIcon icon='material-symbols-light:notifications-active-rounded' />}
            >
              Activer
            </LoadingButton>
          ) : detailsBrand?.state == 1 ? (
            <LoadingButton
              variant='outlined'
              color='error'
              loading={disabledBrandsMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[115px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => disabledBrands()}
              startIcon={<IconifyIcon icon='mi:notification-off' />}
            >
              Désactiver
            </LoadingButton>
          ) : null}
          {user?.profile == 'MAR' ? (
            detailsBrand?.is_validated == 0 ? (
              <LoadingButton
                variant='contained'
                color='success'
                loading={validateBrandMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[150px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleValidateBrand()}
                startIcon={<IconifyIcon icon='mdi:check' />}
              >
                Valider
              </LoadingButton>
            ) : (
              <LoadingButton
                variant='outlined'
                color='error'
                loading={validateBrandMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[150px] !ml-3'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => handleValidateBrand()}
                startIcon={<IconifyIcon icon='icomoon-free:blocked' fontSize={15} />}
              >
                Refuser
              </LoadingButton>
            )
          ) : null}
          {detailsBrand?.can_delete && (
            <LoadingButton
              variant='contained'
              color='error'
              loading={deleteBrandMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[150px] !ml-3'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => handledeleteBrand()}
              startIcon={<IconifyIcon icon='mdi:trash-can-outline' />}
            >
              Supprimer
            </LoadingButton>
          )}
        </Grid>
        {detailsBrand?.can_update ? (
          <Grid item xs={6} mb={2} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton
              variant='contained'
              loading={updateBrandMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[150px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
              startIcon={<IconifyIcon icon='mdi:pencil-outline' />}
            >
              Modifier
            </LoadingButton>
          </Grid>
        ) : null}
      </Grid>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer Scénario ${formInput?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteBrand}
      />
    </div>
  )
}

export default UpdateMarque
