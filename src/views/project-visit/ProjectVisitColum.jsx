import { Box, Avatar, Typography } from '@mui/material'
import { Grid, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

const { LoadingButton } = require('@mui/lab')

import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import DialogAlert from '../components/dialogs/DialogAlert'
import moment from 'moment'
import {
  useDeleteProjectVisit,
  useTerminateProjectVisit,
  useUpdateDecisionProjectVisit,
  useUpdateProjectVisit
} from 'src/services/projectVisit.service'
import CustomModal from 'src/components/CustomModal'
import CustomDatePicker from 'src/components/CustomDatePicker'
import useStates from 'src/@core/hooks/useStates'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useGetListCompany } from 'src/services/company.service'
import { dateFormater } from 'src/@core/utils/utilities'
import CustomDateTimePickers from 'src/components/CustomDateTimePickers'

const RowOptions = ({ row, resource }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  // update date
  const [openModalDate, setopenModalDate] = useState(false)
  const [openModalDecision, setopenModalDecision] = useState(false)
  const [visiteDate, setvisiteDate] = useState('')
  const [user_id, setUser_id] = useState(null)
  const updateProjectVisitMutation = useUpdateProjectVisit()
  const updateDecisionProjectVisitMutation = useUpdateDecisionProjectVisit()

  useEffect(() => {
    setvisiteDate(row?.visit_date)
  }, [row?.visit_date])

  const openModalEditDate = () => {
    setopenModalDate(!openModalDate)
  }

  const updateDateVisite = async () => {
    const data = {
      visit_date: moment(visiteDate).format('YYYY-MM-DD'),
      user_id: user_id
    }
    try {
      await updateProjectVisitMutation.mutateAsync({ data, id: row.id })
      setopenModalDate(false)
    } catch (error) {}
  }

  const updateDecisionProjectVisite = async state => {
    const data = {
      state: state
    }
    try {
      await updateDecisionProjectVisitMutation.mutateAsync({ data, id: row.id })

      setopenModalDecision(false)
    } catch (error) {}
  }

  //
  const openModalEditDecision = () => {
    setopenModalDecision(!openModalDecision)
  }

  //

  const deleteProjectVisitMutation = useDeleteProjectVisit()

  const {
    data: listCollaborators,
    isLoading,
    isSuccess
  } = useGetListCompany({
    profile: 'users',
    state: 1
  })

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteProjectVisitValidation = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await deleteProjectVisitMutation.mutateAsync({ id: row?.id })
      }
    } catch (error) {}
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' fontSize='20px' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '9rem' } }}
      >
        {/* {listPermissions?.permissions.find(item => item.name == `update ${resource?.toLowerCase()}`).authorized && ( */}
        <MenuItem
          title='Modifier Date visite'
          onClick={() => openModalEditDate()}
          className='!px-2 !pb-1'
          sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}
        >
          <Icon icon='mdi:pencil-outline' fontSize={18} />
          Modifier
        </MenuItem>
        {row?.state === 0 && (
          <MenuItem
            onClick={() => updateDecisionProjectVisite(1)}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: '#86A039' }}
          >
            <Icon color={'#86A039'} icon='mdi:check' fontSize={19} />
            Accepter
          </MenuItem>
        )}
        {row?.state === 0 && (
          <MenuItem
            onClick={() => updateDecisionProjectVisite(2)}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px', color: 'red' }}
          >
            <Icon color={'red'} icon='icomoon-free:blocked' fontSize={15} />
            Non Valide
          </MenuItem>
        )}

        {/* {row?.state === 0 ? (
          <MenuItem
            color='success'
            onClick={() => openModalEditDecision()}
            className='!px-2 !pb-1'
            sx={{ '& svg': { mr: 2 }, fontSize: '14px' }}
          >
            <Icon icon='mdi:pencil-outline' color='success' fontSize={18} />
            Décision
          </MenuItem>
        ) : null} */}
        <CustomModal
          open={openModalDate}
          handleCloseOpen={() => openModalEditDate()}
          handleActionModal={() => openModalEditDate()}
          btnTitle={'Modifier'}
          ModalTitle={'Modifier la visite'}
          widthModal={'sm'}
          btnCanceledTitle={'Non'}
          btnTitleClose={false}
          action={() => updateDateVisite()}
        >
          <Grid container spacing={3} height={320}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '16px', fontWeight: '500', mb: 1 }}>
                Sélectionner la date de visite
              </Typography>
              <CustomDatePicker
                dateFormat={'dd/MM/yyyy'}
                backendFormat={'YYYY-MM-DD'}
                dateValue={visiteDate}
                setDate={date => setvisiteDate(date)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>Sélectionner un Inspecteur</Typography>
              <CustomeAutoCompleteSelect
                option={'id'}
                value={user_id}
                onChange={value => setUser_id(value)}
                data={listCollaborators}
                displayOption={'first_name'}
                label={'Inspecteur'}
              />
            </Grid>
          </Grid>
        </CustomModal>
        <CustomModal
          open={openModalDecision}
          handleCloseOpen={() => openModalEditDecision()}
          handleActionModal={() => openModalEditDecision()}
          ModalTitle={'Décision'}
          widthModal={'sm'}
          btnCanceledTitle={'Non'}
          btnTitleClose={false}
          action={() => updateDateVisite()}
        >
          <Grid container spacing={3} height={300} display={'flex'} alignItems={'center'}>
            <Grid item xs={12} md={6}>
              <LoadingButton
                variant='outlined'
                color='error'
                loading={updateDecisionProjectVisitMutation?.isPending}
                loadingPosition='start'
                className='h-[28px] '
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                fullWidth
                onClick={() => updateDecisionProjectVisite(2)}
              >
                Non Valide
              </LoadingButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <LoadingButton
                fullWidth
                variant='outlined'
                color='primary'
                loading={updateDecisionProjectVisitMutation?.isPending}
                loadingPosition='start'
                className='h-[28px] '
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => updateDecisionProjectVisite(1)}
              >
                Accepter
              </LoadingButton>
            </Grid>
          </Grid>
        </CustomModal>
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer projet de visite ${row?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteProjectVisitValidation}
      />
    </>
  )
}

const ProjectVisitColum = ({ userRole, resource }) => {
  const { getStateByModel } = useStates()
  const [user_id, setUser_id] = useState(null)
  const router = useRouter()
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === 'Visites')
  const updateProjectVisitMutation = useUpdateProjectVisit()

  const {
    data: listCollaborators,
    isLoading,
    isSuccess
  } = useGetListCompany({
    profile: 'users',
    state: 1
  })

  const updateDateVisite = async (date, row) => {
    const data = {
      visit_date: date,
      user_id: null
    }
    try {
      await updateProjectVisitMutation.mutateAsync({ data, id: row.id })
      setopenModalDate(false)
    } catch (error) {}
  }

  const updateDecisionProjectVisitMutation = useUpdateDecisionProjectVisit()
  const terminateProjectVisitMutation = useTerminateProjectVisit()

  const updateDecisionProjectVisite = async (state, id) => {
    const data = {
      state: state
    }
    try {
      await updateDecisionProjectVisitMutation.mutateAsync({ id, data })

      setopenModalDecision(false)
    } catch (error) {}
  }

  const handleTerminateProjectVisit = async id => {
    try {
      await terminateProjectVisitMutation.mutateAsync(id)
    } catch (error) {}
  }

  const updateUserVisite = async (value, row) => {
    setUser_id(value)

    const data = {
      user_id: value
    }
    try {
      await updateProjectVisitMutation.mutateAsync({ data, id: row.id })
    } catch (error) {}
  }
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'statut',
          headerName: 'Statut de visite ',
          align: 'center',
          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              size='small'
              label={getStateByModel('DProjectVisit', row?.state)?.name}
              color={getStateByModel('DProjectVisit', row?.state)?.color}
              sx={{
                height: 20,
                fontWeight: 500,
                mt: 4,
                fontSize: '0.75rem',
                alignSelf: 'flex-start',
                color: 'text.secondary'
              }}
            />
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'name',
          headerName: 'Nom de visite',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500', mt: 4 }} variant='body2'>
              {row?.name}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.3,
          field: 'collaborater',
          headerName: 'Inspecteur',
          align: 'center',

          renderCell: ({ row }) =>
            row?.state === 0 && listPermissions?.permissions.find(item => item.name == `update visits`).authorized ? (
              <CustomeAutoCompleteSelect
                option={'id'}
                value={row?.user?.id}
                onChange={value => updateUserVisite(value, row)}
                data={listCollaborators}
                displayOption={'first_name'}
                label={''}
                variant={'standard'}
              />
            ) : (
              <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
                {row?.user?.first_name} {row?.user?.last_name}
              </Typography>
            )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'date',
          headerName: 'Date de visite',
          align: 'center',

          renderCell: ({ row }) =>
            row?.state === 0 && listPermissions?.permissions.find(item => item.name == `update visits`).authorized ? (
              <div className='flex items-center justify-center mt-4 '>
                <CustomDateTimePickers
                  CustomeInputProps={{
                    variant: 'standard',
                    sx: {
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
                    }
                  }}
                  minDate={true}
                  maxDate={false}
                  dateFormat={'dd/MM/yyyy HH:mm'}
                  backendFormat={'YYYY-MM-DD HH:mm '}
                  dateValue={row?.visit_date}
                  setDate={date => updateDateVisite(date, row)}
                />
                <IconifyIcon
                  icon={'mdi:pencil-outline'}
                  color='#86A039'
                  style={{ fontSize: '19px', marginBottom: '15px', marginLeft: '-30px' }}
                />
              </div>
            ) : (
              <Typography sx={{ fontSize: '14px', fontWeight: '500', mt: 4 }} variant='body2'>
                {moment(row?.visit_date).format('DD/MM/YYYY HH:mm')}
              </Typography>
            )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: '',
          renderCell: ({ row }) => (
            <>
              {row?.state !== 2 && row?.state !== 3 ? (
                <LoadingButton
                  variant='outlined'
                  color='success'
                  disabled={updateDecisionProjectVisitMutation?.isPending}
                  loading={updateDecisionProjectVisitMutation?.isPending}
                  loadingPosition='start'
                  className='!w-[135px] '
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  fullWidth
                  size='small'
                  startIcon={<IconifyIcon icon={'mdi:check'} fontSize='15px' />}
                  onClick={() => handleTerminateProjectVisit(row?.id)}
                >
                  Terminer
                </LoadingButton>
              ) : null}
            </>
          ),
          align: 'right'
        }
      ]

    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'statut',
          headerName: 'Statut de visite ',
          align: 'center',
          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              size='small'
              label={getStateByModel('DProjectVisit', row?.state)?.name}
              color={getStateByModel('DProjectVisit', row?.state)?.color}
              sx={{
                height: 20,
                fontWeight: 500,
                mt: 4,
                fontSize: '0.75rem',
                alignSelf: 'flex-start',
                color: 'text.secondary'
              }}
            />
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'name',
          headerName: 'Nom de visite',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500', mt: 4 }} variant='body2'>
              {row?.name}
            </Typography>
          )
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.3,
        //   field: 'collaborater',
        //   headerName: 'Inspecteur',
        //   align: 'center',

        //   renderCell: ({ row }) =>
        //     row?.state === 0 ? (
        //       <CustomeAutoCompleteSelect
        //         option={'id'}
        //         value={row?.user?.id}
        //         onChange={value => updateUserVisite(value, row)}
        //         data={listCollaborators}
        //         displayOption={'first_name'}
        //         label={''}
        //         variant={'standard'}
        //       />
        //     ) : (
        //       <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
        //         {row?.user?.first_name} {row?.user?.last_name}
        //       </Typography>
        //     )
        // },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'date',
          headerName: 'Date de visite',
          align: 'center',

          renderCell: ({ row }) =>
            row?.state === 0 && listPermissions?.permissions.find(item => item.name == `update visits`).authorized ? (
              <div className='flex items-center justify-center mt-4 '>
                <CustomDateTimePickers
                  CustomeInputProps={{
                    variant: 'standard',
                    sx: {
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
                    }
                  }}
                  minDate={true}
                  maxDate={false}
                  dateFormat={'dd/MM/yyyy HH:mm'}
                  backendFormat={'YYYY-MM-DD HH:mm '}
                  dateValue={row?.visit_date}
                  setDate={date => updateDateVisite(date, row)}
                />
                <IconifyIcon
                  icon={'mdi:pencil-outline'}
                  color='#86A039'
                  style={{ fontSize: '19px', marginBottom: '15px', marginLeft: '-30px' }}
                />
              </div>
            ) : (
              <Typography sx={{ fontSize: '14px', fontWeight: '500', mt: 4 }} variant='body2'>
                {moment(row?.visit_date).format('DD/MM/YYYY HH:mm')}
              </Typography>
            )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: '',
          renderCell: ({ row }) =>
            row?.state === 0 ? (
              <>
                {listPermissions?.permissions.find(item => item.name == `update visits`).authorized && (
                  <div className='flex items-center !justify-end mt-4'>
                    <LoadingButton
                      variant='outlined'
                      color='error'
                      disabled={updateDecisionProjectVisitMutation?.isPending}
                      loading={updateDecisionProjectVisitMutation?.isPending}
                      loadingPosition='start'
                      className='h-[28px] !w-[135px] '
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      fullWidth
                      startIcon={<IconifyIcon icon={'mdi:block'} fontSize='15px' />}
                      onClick={() => updateDecisionProjectVisite(2, row?.id)}
                    >
                      Non Valide
                    </LoadingButton>
                    <LoadingButton
                      variant='contained'
                      color='primary'
                      loading={updateDecisionProjectVisitMutation?.isPending}
                      loadingPosition='start'
                      className='h-[28px] !w-[135px] !ml-5'
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      fullWidth
                      startIcon={<IconifyIcon icon={'mdi:check'} />}
                      onClick={() => updateDecisionProjectVisite(1, row?.id)}
                    >
                      Accepter
                    </LoadingButton>
                  </div>
                )}
              </>
            ) : (
              <>
                {row?.state !== 2 && row?.state !== 3 ? (
                  <LoadingButton
                    variant='outlined'
                    color='success'
                    disabled={updateDecisionProjectVisitMutation?.isPending}
                    loading={updateDecisionProjectVisitMutation?.isPending}
                    loadingPosition='start'
                    className='!w-[135px] '
                    sx={{ fontSize: '12px', cursor: 'pointer' }}
                    fullWidth
                    size='small'
                    startIcon={<IconifyIcon icon={'mdi:check'} fontSize='15px' />}
                    onClick={() => handleTerminateProjectVisit(row?.id)}
                  >
                    Terminer
                  </LoadingButton>
                ) : null}
              </>
            ),

          align: 'right'
        }
      ]
      break
  }
}

export default ProjectVisitColum
