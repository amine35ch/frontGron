// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useCreateTiers, useGetTiers } from 'src/services/tiers.service'
import { useRouter } from 'next/router'
import { useGetListOperation } from 'src/services/operation.service'
import moment from 'moment'
import CustomModal from 'src/components/CustomModal'
import ContentCreateTiers from './ContentCreateTiers'

// ** Custom Component Imports

// ** Custom Components Imports

// ** Styled Components

const CreateTiers = ({ path, addTiersWithModal, openModalAddEntreprise, setOpenModalAddEntreprise }) => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    representative_last_name: '',
    representative_first_name: '',
    representative_gender: '',
    email: '',
    password: '',
    files: [],
    city: '',
    zip_code: '',
    address: '',
    username: '',
    phone_number_1: '',
    phone_number_2: '',
    num_rge: '',
    siren: '',
    operations: [],
    third_party_parent_id: '',
    date_expiration_rge: moment(new Date()).format('YYYY-MM-DD'),
    email_two: '',
    siret: '',
    trade_name: '',
    tva: '',
    logo: [],
    signature: [],
    profile: path == '/entreprise' ? 'INS' : '',
    position: '',
    trade_name: '',
    type_raison_sociale: '',
    website: '',
    num_ape: '',
    capital: '',
    approval_number: '',
    num_decennale: '',
    emissions_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    end_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    selfCheckIn: 0
  })

  const [showCompte, setShowCompte] = useState(false)
  const [formErrors, setFormErrors] = useState(false)

  // ** Query
  const createTiersMutation = useCreateTiers()

  const { data: listOperations } = useGetListOperation({})
  const { data: listEntreprise } = useGetTiers({ type: 2 })

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
      if (key === 'operations') {
        formInput.operations.forEach((id, index) => {
          formData.append(`operations[${index}]`, id)
        })
      } else if (key === 'files') {
        formInput?.files?.map((file, index) => {
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      } else formData.append(key, formInput[key])
    }
    try {
      await createTiersMutation.mutateAsync(formData)

      if (openModalAddEntreprise) {
        setOpenModalAddEntreprise(false)
      } else {
        router.push(path)
      }
      setOpenModalAddEntreprise(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  return (
    <div>
      {addTiersWithModal ? (
        <CustomModal
          open={openModalAddEntreprise}
          handleCloseOpen={() => setOpenModalAddEntreprise(false)}
          btnTitle={'Ajouter'}
          ModalTitle={'Ajouter Entreprise'}
          isLoading={false}
          action={onSubmit}
          widthModal={'md'}
          btnTitleClose={openModalAddEntreprise}
          btnCanceledTitle='Annuler'
        >
          <ContentCreateTiers
            path={path}
            formInput={formInput}
            setFormInput={setFormInput}
            formErrors={formErrors}
            showCompte={showCompte}
            listOperations={listOperations}
            listEntreprise={listEntreprise}
            addTiersWithModal={addTiersWithModal}
            setShowCompte={setShowCompte}
            onSubmit={onSubmit}
            handleChange={handleChange}
            createTiersMutation={createTiersMutation}
          />
        </CustomModal>
      ) : (
        <ContentCreateTiers
          path={path}
          formInput={formInput}
          setFormInput={setFormInput}
          formErrors={formErrors}
          showCompte={showCompte}
          listEntreprise={listEntreprise}
          listOperations={listOperations}
          addTiersWithModal={addTiersWithModal}
          setShowCompte={setShowCompte}
          onSubmit={onSubmit}
          handleChange={handleChange}
          createTiersMutation={createTiersMutation}
        />
      )}
      {!addTiersWithModal && (
        <Grid container className='mt-6'>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} className='flex justify-end'>
            <LoadingButton
              variant='contained'
              loading={createTiersMutation?.isPending}
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

export default CreateTiers
