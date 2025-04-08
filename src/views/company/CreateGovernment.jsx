// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

// import { useCreateGovernmentUser, useGetTypeClients } from 'src/services/client.service'
import { useCreateGovernmentUser } from 'src/services/government.service'
import { useRouter } from 'next/router'
import ContentCreateGovernment from './ContentCreateGovernment'
import CustomModal from 'src/components/CustomModal'

// ** Custom Components Imports

// ** Styled Components

const CreateGovernment = ({
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
    first_name: '',
    last_name: '',
    email: '',
    password: '',
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
    user_name: '',
    email_contact_two: '',
    phone_number: '',
    phone_number_2: '',
    representative: '',
    type: 1,
    user_name: ''
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createGovernmentMutation = useCreateGovernmentUser()

  //   const { data: listTypeClient } = useGetTypeClients()

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
          formData.append(`documents[${index}][file]`,  file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      } else {
        formData.append(key, formInput[key])
      }
    }

    try {
      const response = await createGovernmentMutation.mutateAsync(formData)
      if (!openModalAddClient) {
        router.push('/company')
      } else {
        setProjectFormInput(prev => {
          return { ...prev, d_client_id: response?.data.data.id }
        })
        setProjectAddress('address', response?.data.data?.address)
        setProjectAddress('zip_code', response?.data.data?.zip_code)
        setProjectAddress('floor', response?.data.data?.floor)
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
          isLoading={false}
          action={onSubmit}
          widthModal={'md'}
          btnTitleClose={openModalAddClient}
          btnCanceledTitle='Annuler'
        >
          <ContentCreateGovernment
            formInput={formInput}
            formErrors={formErrors}
            showCompte={showCompte}
            setShowCompte={setShowCompte}
            handleChange={handleChange}
            setFormInput={setFormInput}
          />
        </CustomModal>
      ) : (
        <ContentCreateGovernment
          formInput={formInput}
          formErrors={formErrors}
          showCompte={showCompte}
          setShowCompte={setShowCompte}
          handleChange={handleChange}
          setFormInput={setFormInput}
        />
      )}

      {!addClientWithModal && (
        <Grid container className='mt-6 '>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={createGovernmentMutation?.isPending}
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

export default CreateGovernment
