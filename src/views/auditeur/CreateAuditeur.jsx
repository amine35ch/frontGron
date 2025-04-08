// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Grid } from '@mui/material'

// ** Third Party Imports

// ** Icon Imports
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import moment from 'moment'

import CustomModal from 'src/components/CustomModal'
import { useCreateCompany, useGetListQualification } from 'src/services/company.service'
import ContentCreateTiers from '../Tiers/ContentCreateTiers'

const CreateAuditeur = ({ path, addTiersWithModal, openModalAddEntreprise, setOpenModalAddEntreprise }) => {
  // ** States
  const router = useRouter()

  const [formInput, setFormInput] = useState({
    email: '',
    files: [],
    city: '',
    zip_code: '',
    address: '',
    phone_number_1: '',
    phone_number_2: '',
    num_rge: '',
    siren: '',
    operations: [2],
    date_expiration_rge: moment(new Date()).format('YYYY-MM-DD'),
    email_two: '',
    siret: '',
    trade_name: '',
    identifiant_tva: '',
    logo: [],
    signature: [],
    profile: 'AUD',
    assurance_type: '',
    position: '',
    representative_last_name: '',
    representative_first_name: '',
    representative_gender: '',
    type_raison_sociale: '',
    website: '',
    insurance_rcs: '',
    insurance_address: '',
    insurance_capital: 0,
    insurance_police: '',
    qualification_auditor: '',
    rges: [
      {
        rge: '',
        qualifications: [],

        start_date: moment(new Date()).format('YYYY-MM-DD'),
        end_date: moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      }
    ],
    num_ape: '',
    capital: '',
    approval_number: '',
    num_decennale: '',
    emissions_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    end_date_assurance: moment(new Date()).add(1, 'y').format('YYYY-MM-DD'),

    tva: ''
  })

  const [showCompte, setShowCompte] = useState(false)
  const [formErrors, setFormErrors] = useState(false)
  const { data: listQualifications, isLoading: loadingQualification } = useGetListQualification({ type: '1' })

  // ** Query
  const createCompanyMutation = useCreateCompany({ profile: 'auditors' })

  // Handle function

  const handleChange = (key, value, subKey = '', index = 0) => {
    if (key === 'rges') {
      const rges = formInput.rges
      rges[index][subKey] = value
      setFormInput({
        ...formInput,
        rges
      })

      return
    }
    setFormInput({
      ...formInput,
      [key]: value
    })
  }

  const handleAddRemoveRge = (action, index) => {
    if (action === 'add') {
      const rges = formInput.rges
      rges.push({
        rge: '',
        qualifications: [],
        start_date: moment(new Date()).format('YYYY-MM-DD'),
        end_date: moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      })
      setFormInput({
        ...formInput,
        rges
      })
    } else {
      const rges = formInput.rges
      rges.splice(index, 1)
      setFormInput({
        ...formInput,
        rges
      })
    }
  }

  const onSubmit = async () => {
    const formData = new FormData()

    for (let key in formInput) {
      if (key === 'operations') {
        formInput.operations.forEach((id, index) => {
          formData.append(`operations[${index}]`, id)
        })
      } else if (key === 'logo') {
        formInput?.logo?.forEach((file, index) => {
          formData.append(`logo`, file)
        })
      } else if (key === 'signature') {
        formInput?.signature?.forEach((file, index) => {
          formData.append(`signature`, file)
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
      } else if (key === 'rges') {
        formInput?.rges?.map((rge, index) => {
          formData.append(`rges[${index}][rge]`, rge?.rge)
          rge?.qualifications?.map((work, workindex) => {
            formData.append(`rges[${index}][qualifications][${workindex}]`, work)
          })
          formData.append(`rges[${index}][start_date]`, rge?.start_date)
          formData.append(`rges[${index}][end_date]`, rge?.end_date)
        })
      } else formData.append(key, formInput[key])
    }
    try {
      await createCompanyMutation.mutateAsync(formData)

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
          ModalTitle={'Ajouter un Auditeur'}
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
            addTiersWithModal={addTiersWithModal}
            setShowCompte={setShowCompte}
            onSubmit={onSubmit}
            handleChange={handleChange}
            createTiersMutation={createCompanyMutation}
            handleAddRemoveRge={handleAddRemoveRge}
            listQualifications={listQualifications}
          />
        </CustomModal>
      ) : (
        <ContentCreateTiers
          path={path}
          formInput={formInput}
          setFormInput={setFormInput}
          formErrors={formErrors}
          showCompte={showCompte}
          addTiersWithModal={addTiersWithModal}
          setShowCompte={setShowCompte}
          onSubmit={onSubmit}
          handleChange={handleChange}
          createTiersMutation={createCompanyMutation}
          handleAddRemoveRge={handleAddRemoveRge}
          listQualifications={listQualifications}
        />
      )}
      {!addTiersWithModal && (
        <Grid container className='mt-6'>
          <Grid item xs={5}></Grid>
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
        </Grid>
      )}
    </div>
  )
}

export default CreateAuditeur
