// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid, TextField, Typography } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import CustomComponentFileUpload from 'src/components/CustomComponentFileUpload'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useRouter } from 'next/router'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { useCreateCompany } from 'src/services/company.service'
import { useGetClients } from 'src/services/client.service'
import CustomInputPhoneNumber from 'src/components/CustomInputPhoneNumber'

// ** Custom Components Imports

// ** Styled Components

const CreateCompany = () => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    entitled: '',
    email: '',
    city: '',
    address: '',
    phone_number_1: '',
    phone_number_2: '',
    users: [],
    legal_representative: '',
    representative_role: '',
    trade_name: '',

    siret: '',
    approval_number: '',
    num_decennale: '',
    signature: null
  })

  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createCompanyMutation = useCreateCompany({ profile: 'mars' })
  const { data: ClientList, isLoading } = useGetClients({})

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const listUsers = formInput.users.map(id => ({ id, role: 'client' }))

    const data = {
      ...formInput,
      users: listUsers
    }

    const formData = new FormData()
    for (let key in data) {
      if (key === 'users') {
        data.users.forEach((user, index) => {
          // formData.append(`users[${index}]`, user)
          formData.append(`users[${index}]`, JSON.stringify(user))
        })
      } else {
        formData.append(key, formInput[key])
      }
    }
    try {
      await createCompanyMutation.mutateAsync(formData)

      router.push('/company')
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
            loading={createCompanyMutation?.isPending}
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
            value={formInput.entitled}
            onChange={e => {
              handleChange('entitled', e.target.value)
            }}
            sx={{ fontSize: '10px !important' }}
            error={formErrors?.entitled}
            helperText={renderArrayMultiline(formErrors?.entitled)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Email du contact
          </Typography>
          <TextField
            placeholder='Email'
            type='email'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.email}
            onChange={e => {
              handleChange('email', e.target.value)
            }}
            error={formErrors?.email}
            helperText={renderArrayMultiline(formErrors?.email)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Ville
          </Typography>
          <TextField
            placeholder='Ville'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.city}
            onChange={e => {
              handleChange('city', e.target.value)
            }}
            error={formErrors?.city}
            helperText={renderArrayMultiline(formErrors?.city)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Adresse
          </Typography>
          <TextField
            placeholder='Adresse'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.address}
            onChange={e => {
              handleChange('address', e.target.value)
            }}
            error={formErrors?.address}
            helperText={renderArrayMultiline(formErrors?.address)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Numéro de téléphone (1)
          </Typography>
          <CustomInputPhoneNumber
            phoneValue={formInput.phone_number_1}
            setPhoneNumber={value => {
              handleChange('phone_number_1', value)
            }}
            error={formErrors?.phone_number_1}
            helperText={renderArrayMultiline(formErrors?.phone_number_1)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Numéro de téléphone (2)
          </Typography>
          <CustomInputPhoneNumber
            phoneValue={formInput.phone_number_2}
            setPhoneNumber={value => {
              handleChange('phone_number_2', value)
            }}
            error={formErrors?.phone_number_2}
            helperText={renderArrayMultiline(formErrors?.phone_number_2)}
          />
        </Grid>

        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Liste Client
          </Typography>
          <CustomeAutoCompleteSelectMultiple
            value={formInput.users}
            onChange={value => handleChange('users', value)}
            data={ClientList}
            formError={formErrors}
            error={formErrors?.users}
            helperText={renderArrayMultiline(formErrors?.users)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            legal_representative
          </Typography>
          <TextField
            placeholder='legal_representative'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.legal_representative}
            onChange={e => {
              handleChange('legal_representative', e.target.value)
            }}
            error={formErrors?.legal_representative}
            helperText={renderArrayMultiline(formErrors?.legal_representative)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            representative_role
          </Typography>
          <TextField
            placeholder='representative_role'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.representative_role}
            onChange={e => {
              handleChange('representative_role', e.target.value)
            }}
            error={formErrors?.representative_role}
            helperText={renderArrayMultiline(formErrors?.representative_role)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            trade_name
          </Typography>
          <TextField
            placeholder='trade_name'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.trade_name}
            onChange={e => {
              handleChange('trade_name', e.target.value)
            }}
            error={formErrors?.trade_name}
            helperText={renderArrayMultiline(formErrors?.trade_name)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            siret
          </Typography>
          <TextField
            placeholder='siret'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.siret}
            onChange={e => {
              handleChange('siret', e.target.value)
            }}
            error={formErrors?.siret}
            helperText={renderArrayMultiline(formErrors?.siret)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2 !pt-0'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            approval_number
          </Typography>
          <TextField
            placeholder='approval_number'
            size='small'
            variant='outlined'
            className='w-full !mt-1'
            value={formInput.approval_number}
            onChange={e => {
              handleChange('approval_number', e.target.value)
            }}
            error={formErrors?.approval_number}
            helperText={renderArrayMultiline(formErrors?.approval_number)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomComponentFileUpload
            fileTypes={['png']}
            limit={1}
            multiple={false}
            setFormInput={setFormInput}
            name='signature'
            showInputName={true}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateCompany
