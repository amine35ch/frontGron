import { Typography, Tooltip, IconButton, Grid } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { dateFormater, dateFormaterWithTime } from 'src/@core/utils/utilities'
import { useAuth } from 'src/hooks/useAuth'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { useUpdateDecisionProjectVisit, useUpdateProjectVisit } from 'src/services/projectVisit.service'
import CustomModal from 'src/components/CustomModal'
import CustomDatePicker from 'src/components/CustomDatePicker'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/@core/hooks/useStates'

const RowOptions = ({ row, resource }) => {
  // update date
  const [openModalDate, setopenModalDate] = useState(false)
  const [openModalDecision, setopenModalDecision] = useState(false)
  const [visiteDate, setvisiteDate] = useState('')

  const updateProjectVisitMutation = useUpdateProjectVisit()

  useEffect(() => {
    setvisiteDate(row?.visit_date)
  }, [row?.visit_date])

  const openModalEditDate = () => {
    setopenModalDate(!openModalDate)
  }

  const updateDateVisite = async () => {
    const date = {
      visit_date: visiteDate
    }
    try {
      await updateProjectVisitMutation.mutateAsync(date)
      setopenModalDate(false)
    } catch (error) {}
  }

  return (
    <>
      {row?.state === 0 && (
        <Tooltip title='Modifier la date de Visite'>
          <IconButton size='small' onClick={() => openModalEditDate()} sx={{ ml: 4 }}>
            <Icon icon='mdi:calendar-month' fontSize='20px' color='#1E4590' />
          </IconButton>
        </Tooltip>
      )}
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
          <Grid item xs={12} md={6} spacing={5}>
            <Typography sx={{ fontSize: '16px', fontWeight: '500', mb: 1 }}>Sélectionner la date de visite</Typography>
            <CustomDatePicker
              dateFormat={'dd/MM/yyyy h:mm'}
              backendFormat={'YYYY-MM-DD h:mm '}
              dateValue={visiteDate}
              setDate={date => setvisiteDate(date)}
            />
          </Grid>
        </Grid>
      </CustomModal>
    </>
  )
}

const VisitesColumn = () => {
  const auth = useAuth()
  const { getStateByModel } = useStates()

  const updateDecisionProjectVisitMutation = useUpdateDecisionProjectVisit()
  const updateProjectVisitMutation = useUpdateProjectVisit()

  const updateDecisionProjectVisite = async (state, id) => {
    const data = {
      state: state
    }
    try {
      await updateDecisionProjectVisitMutation.mutateAsync({ id, data })

      setopenModalDecision(false)
    } catch (error) {}
  }

  const handleChangeDateVisite = async (date, id) => {
    const data = {
      visit_date: date,

    }
    try {
      await updateProjectVisitMutation.mutateAsync({ id, data })
      setopenModalDate(false)
    } catch (error) {}
  }

  return [
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'name',
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
            fontSize: '0.75rem',
            alignSelf: 'flex-start',

            marginLeft: '10px'
          }}
        />
      )
    },
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'name',
      headerName: 'Nom de visite ',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.name}
        </Typography>
      )
    },

    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'd_company_id',
      headerName: 'Entreprise',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.user?.first_name}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'd_company_id',
      headerName: 'Role',
      align: 'center',

      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
          {row?.company?.profile}
        </Typography>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'visit_date',
      headerName: 'Date de visite',
      align: 'center',

      renderCell: ({ row }) => (
        <div className='flex items-center'>
          {row?.state == 0 ? (
            <CustomDatePicker
              minDate={auth?.user?.role == `${auth?.user?.profile}::admin` ? false : true}
              dateFormat={'dd/MM/yyyy h:mm'}
              backendFormat={'YYYY-MM-DD h:mm '}
              dateValue={row?.visit_date}
              setDate={date => handleChangeDateVisite(date, row?.id)}
              maxDate={false}

              // error={formErrors?.date_expiration_rge}
              // helperText={renderArrayMultiline(formErrors?.date_expiration_rge)}
            />
          ) : (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {dateFormaterWithTime(row?.visit_date)}
            </Typography>
          )}
          {/* {user?.profile === 'AUD' ? <RowOptions row={row} /> : null} */}
        </div>
      )
    },
    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'visit_date',
      headerName: '',
      align: 'center',

      renderCell: ({ row }) =>
        row?.state == 0 ? (
          <div className='flex items-center !justify-end'>
            <LoadingButton
              variant='outlined'
              color='error'
              loading={updateDecisionProjectVisitMutation?.isPending}
              loadingPosition='start'
              className='h-[28px] !w-[135px] '
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              fullWidth
              onClick={() => updateDecisionProjectVisite(2, row?.id)}
            >
              Non Valide
            </LoadingButton>
            <LoadingButton
              variant='contained'
              color='secondary'
              loading={updateDecisionProjectVisitMutation?.isPending}
              loadingPosition='start'
              className='h-[28px] !w-[135px] !ml-5'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              fullWidth
              onClick={() => updateDecisionProjectVisite(1, row?.id)}
            >
              Accepter
            </LoadingButton>
          </div>
        ) : null
    }
  ]
}

export default VisitesColumn
