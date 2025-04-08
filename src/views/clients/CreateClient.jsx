// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useCreateClient, useGetTypeClients } from 'src/services/client.service'
import { useRouter } from 'next/router'
import ContentCreateClient from './ContentCreateClient'
import CustomModal from 'src/components/CustomModal'
import moment from 'moment'

// ** Custom Components Imports

// ** Styled Components

const CreateClient = ({
  setProjectFormInput,
  setCreatedClientId,
  addClientWithModal,
  openModalAddClient,
  setOpenModalAddClient,
  setProjectAddress
}) => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    gender: '',
    first_name: '',
    last_name: '',
    email_contact: '',

    files: [],
    position: '',
    city: '',
    zip_code: '',
    address: '',
    floor: '',
    stairs: '',
    commune: '',
    door: '',
    building: '',
    house_number: '',
    street: '',
    email_anah: '',
    password_anah: '',
    phone_number_1: '',
    phone_number_2: '',
    representative: '',
    type: 1,
    rib: '',
    iban: '',
    year_of_birth: null,
    representative: '',
    representative_contact: '',
    climatic_zone: ''
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createClientMutation = useCreateClient()
  const { data: listTypeClient } = useGetTypeClients()

  // Handle function

  const handleChange = (key, value) => {
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const onSubmit = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      if (key == 'files') {
        formInput?.files?.map((file, index) => {
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      } else {
        formData.append(key, formInput[key] == null ? '' : formInput[key])
      }
    }

    try {
      const response = await createClientMutation.mutateAsync(formData)
      if (!openModalAddClient) {
        router.push('/beneficiaries')
      } else {
        setProjectFormInput(prev => {
          return { ...prev, d_client_id: response?.data.data.id }
        })
        setProjectAddress('address', response?.data.data?.address)
        setProjectAddress('zip_code', response?.data.data?.zip_code)
        setProjectAddress('floor', response?.data.data?.floor)
        setProjectAddress('house_number', response?.data.data?.house_number)
        setProjectAddress('street', response?.data.data?.street)
        setProjectAddress('stairs', response?.data.data?.stairs)
        setProjectAddress('common', response?.data.data?.commune)
        setProjectAddress('door', response?.data.data?.door)
        setProjectAddress('city', response?.data.data?.city)
        setProjectAddress('batiment', response?.data.data?.building)
        setOpenModalAddClient(false)

        return true
      }
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)

      return false
    }
  }

  return (
    <div>
      {addClientWithModal ? (
        <CustomModal
          open={openModalAddClient}
          handleCloseOpen={() => setOpenModalAddClient(false)}
          btnTitle={'Ajouter'}
          ModalTitle={'Ajouter Bénéficiaire'}
          isLoading={createClientMutation?.isPending}
          action={onSubmit}
          widthModal={'md'}
          btnTitleClose={openModalAddClient}
          btnCanceledTitle='Annuler'
        >
          <ContentCreateClient
            formInput={formInput}
            formErrors={formErrors}
            showCompte={showCompte}
            listTypeClient={listTypeClient}
            setShowCompte={setShowCompte}
            handleChange={handleChange}
            setFormInput={setFormInput}
          />
        </CustomModal>
      ) : (
        <ContentCreateClient
          formInput={formInput}
          formErrors={formErrors}
          showCompte={showCompte}
          listTypeClient={listTypeClient}
          setShowCompte={setShowCompte}
          handleChange={handleChange}
          setFormInput={setFormInput}
        />
      )}

      {!addClientWithModal && (
        <Grid container className='mt-6 '>
          <Grid item xs={5}></Grid>
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={createClientMutation?.isPending}
              loadingPosition='start'
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => onSubmit()}
            >
              Créer
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

export default CreateClient
