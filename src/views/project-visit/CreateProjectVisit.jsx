// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useRouter } from 'next/router'
import { useCreateProjectVisit, useGetTypeProjectVisit } from 'src/services/projectVisit.service'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { useGetClients } from 'src/services/client.service'
import user from 'src/store/apps/user'

// ** Custom Components Imports

// ** Styled Components

const CreateProjectVisit = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    name: '',
    type: '',
    visit_date: new Date(),
    users: []
  })

  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createProjectVisitMutation = useCreateProjectVisit({})
  const { data: listTypeVisit } = useGetTypeProjectVisit()
  const { data: clientList, isLoading } = useGetClients({})

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    // const data = new FormData()
    const listUsers = formInput.users.map(id => ({ id, role: 'client' }))

    const data = {
      ...formInput,
      users: listUsers
    }

    try {
      await createProjectVisitMutation.mutateAsync(data)

      router.push('/project-visit')
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div className='h-full pt-6'>
      <Grid className='' container spacing={5}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className='flex justify-end'>
          <LoadingButton
            variant='contained'
            loading={createProjectVisitMutation?.isPending}
            loadingPosition='start'
            className='h-[29px] w-[105px]'
            sx={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => onSubmit()}
          >
            Créer
          </LoadingButton>
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Nom
          </Typography>
          <TextField
            placeholder='Nom'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.name}
            onChange={e => {
              handleChange('name', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.name}
            helperText={renderArrayMultiline(formErrors?.name)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Date de visite
          </Typography>
          <CustomDatePicker
            dateFormat={'dd/MM/yyyy'}
            backendFormat={'YYYY-MM-DD'}
            dateValue={formInput.visit_date}
            setDate={date => handleChange('visit_date', date)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Type Visite
          </Typography>
          <CustomeAutoCompleteSelect
            value={formInput.type}
            onChange={value => handleChange('type', value)}
            option={'id'}
            data={listTypeVisit}
            formError={formErrors}
            error={formErrors?.type}
            helperText={renderArrayMultiline(formErrors?.type)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Liste Client
          </Typography>
          <CustomeAutoCompleteSelectMultiple
            value={formInput.users}
            onChange={value => handleChange('users', value)}
            data={clientList}
            formError={formErrors}
            error={formErrors?.users}
            helperText={renderArrayMultiline(formErrors?.users)}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateProjectVisit
