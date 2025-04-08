// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { CircularProgress, Grid, Stack } from '@mui/material'
import { LoadingButton, TabContext, TabPanel } from '@mui/lab'

// ** Third Party Imports
import useTabs from 'src/hooks/useTabs'

import { useRouter } from 'next/router'
import DialogAlert from '../components/dialogs/DialogAlert'
import moment from 'moment'

import { useAuth } from 'src/hooks/useAuth'
import { useDisabledCompany, useUpdateCompanyProfile, useGetCompanyProfileDetails } from 'src/services/company.service'
import ContentUpdateCompany from '../company/ContentUpdateCompany'
import UpdateInvoice from './UpdateInvoice'
import ListUserCollab from './users/ListUserCollab'
import Logs from '../Logs/Logs'
import Basket from '../basket/Basket'
import DocumentLists from './components/DocumentLists'
import EmailsTable from './emails/emails-table'

// ** Custom Components Imports

// ** Styled Components

const UpdateProfileCompany = ({ path, redirect = true }) => {
  const router = useRouter()
  const { id } = router.query

  const { user } = useAuth()
  const { initTabs, activeTab } = useTabs()

  // ** States
  const [formInput, setFormInput] = useState({
    email: '',
    company_rcs: '',
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
    operations: [2],
    date_expiration_rge: moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    email_two: '',
    siret: '',
    trade_name: '',
    tva: null,
    logo: [],
    signature: [],
    profile: user.profile,
    assurance_type: '',
    position: '',
    representative_first_name: '',
    representative_last_name: '',
    representative_gender: '',
    type_raison_sociale: '',
    website: '',

    // docu_sign_token: '',
    approval_number: '',
    num_decennale: '',
    rges: [
      {
        rge: '',
        qualifications: [],
        start_date: moment(new Date()).format('YYYY-MM-DD'),
        end_date: moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      }
    ],
    insurance_rcs: '',
    insurance_address: '',
    insurance_capital: 0,
    insurance_police: '',
    insurance_name: '',
    insurance_siret: '',
    num_ape: '',
    capital: '',
    approval_number: '',
    emissions_date_assurance: moment(new Date()).format('YYYY-MM-DD'),
    end_date_assurance: moment(new Date()).format('YYYY-MM-DD')
  })

  const [formInputFile, setformInputFile] = useState({
    files: []
  })

  const [showCompte, setShowCompte] = useState(true)
  const [formErrors, setFormErrors] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedGender, setSelectedGender] = useState(formInput?.representative_gender)

  // ** Query
  const { data: detailsProfile, isSuccess, isLoading: isLoadingCompanyDetails } = useGetCompanyProfileDetails()

  const updateTiersMutation = useUpdateCompanyProfile()

  const disabledUserMutation = useDisabledCompany({ profile: 'auditors' })

  // Handle function
  useEffect(() => {
    if (isSuccess) {
      setFormInput({
        ...detailsProfile,
        logo: null,
        tva: detailsProfile?.tva === null ? '' : detailsProfile?.tva?.toString(),
        date_expiration_rge: moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        representative_first_name: detailsProfile?.representative_first_name,
        representative_last_name: detailsProfile?.representative_last_name,
        representative_gender: detailsProfile?.representative_gender,
        type_raison_sociale: detailsProfile?.type_raison_sociale ? detailsProfile?.type_raison_sociale?.type : '',
        signature: null,
        rges: detailsProfile?.rges?.map(item => ({
          id: item.id,
          rge: item.rge,
          qualifications: item.qualifications,
          start_date: moment(item.start_date).format('YYYY-MM-DD'),
          end_date: moment(item.end_date).format('YYYY-MM-DD')
        }))
      })

      let tabs = [
        { label: 'Informations générales', disabled: false },
        { label: 'Informations document', disabled: false },
        { label: 'Utilisateurs', disabled: false },
        { label: 'Corbeille ', disabled: false }

        // { label: 'Logs', disabled: false },
        // { label: 'Liste des documents', disabled: false }
      ]
      if (user?.profile === 'MAR') {
        tabs.push({ label: 'Liste des documents', disabled: false })
        tabs.push({ label: 'Notifications', disabled: false })

        // tabs.push({ label: 'Liste des signatures', disabled: false })
      }
      initTabs(tabs, 0, '/company', '/company')
    }
    // eslint-disable-next-line
  }, [isSuccess])

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

  const onSubmit = async () => {
    delete formInput.download_signature
    delete formInput.download_logo

    const formData = new FormData()

    for (let key in formInput) {
      if (key === 'logo' && formInput?.logo?.length !== 0) {
        formInput?.logo?.forEach((file, index) => {
          formData.append(`logo`, file)
        })
      } else if (key === 'signature' && formInput?.signature?.length !== 0) {
        formInput?.signature?.forEach((file, index) => {
          formData.append(`signature`, file)
        })
      } else if (key === 'invoice_reference') {
        formInput?.invoice_reference?.map((invoice, index) => {
          formData.append(`invoice_reference[${index}]`, JSON.stringify(invoice))
        })
      } else if (key === 'type_raison_sociale') {
        formData.append(`type_raison_sociale`, formInput?.type_raison_sociale)
      } else if (key === 'rges') {
        formInput?.rges?.map((rge, index) => {
          formData.append(`rges[${index}][id]`, rge?.id ?? '')
          formData.append(`rges[${index}][rge]`, rge?.rge)
          rge?.qualifications?.map((work, workindex) => {
            formData.append(`rges[${index}][qualifications][${workindex}]`, work)
          })
          formData.append(`rges[${index}][start_date]`, rge?.start_date)
          formData.append(`rges[${index}][end_date]`, rge?.end_date)
        })
      } else formData.append(key, formInput[key] == null ? '' : formInput[key])
    }

    try {
      await updateTiersMutation.mutateAsync(formData)
      redirect && router.push(path)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const deleteTiers = async event => {
    setSuspendDialogOpen(false)
    try {
      if (event) {
        await disabledUserMutation.mutateAsync({ id: id })
      }
      router.push('/auditor')
    } catch (error) {}
  }

  if (isLoadingCompanyDetails)
    return (
      <Stack height='80vh' width='100%' display='flex' alignItems='center' justifyContent='center'>
        <CircularProgress />
      </Stack>
    )

  return (
    <div>
      <TabContext value={activeTab}>
        <TabPanel value={0}>
          <ContentUpdateCompany
            path={path}
            formInput={formInput}
            setFormInput={setFormInput}
            formErrors={formErrors}
            showCompte={showCompte}
            addTiersWithModal={false}
            setShowCompte={setShowCompte}
            onSubmit={onSubmit}
            handleChange={handleChange}
            updateTiersMutation={updateTiersMutation}
            update={true}
            id={id}
            formInputFile={formInputFile}
            setformInputFile={setformInputFile}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
          />

          <Grid className='!mt-2 flex justify-end' container spacing={5} fullWidth>
            <Grid item>
              <LoadingButton
                variant='contained'
                loading={updateTiersMutation?.isPending}
                loadingPosition='start'
                className='h-[29px] w-[105px]'
                sx={{ fontSize: '12px', cursor: 'pointer' }}
                onClick={() => onSubmit()}
              >
                Modifier
              </LoadingButton>
            </Grid>
          </Grid>

          <DialogAlert
            open={suspendDialogOpen}
            description=''
            setOpen={setSuspendDialogOpen}
            title={`Suprimer Auditeur ${formInput?.name} ?`}
            acceptButtonTitle='Accepter'
            declineButtonTitle='Annuler'
            handleAction={deleteTiers}
          />
        </TabPanel>
        <TabPanel value={1}>
          <UpdateInvoice />
        </TabPanel>

        <TabPanel value={2}>
          <ListUserCollab />
        </TabPanel>

        <TabPanel value={3}>
          <Basket />
        </TabPanel>

        {/* <TabPanel value={4}>
          <Logs />
        </TabPanel> */}
        <TabPanel value={4}>
          <DocumentLists />
        </TabPanel>

        {/* <TabPanel value={5}>
          <DocumentLists field='signature' />
        </TabPanel> */}

        <TabPanel value={5}>
          <EmailsTable />
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default UpdateProfileCompany
