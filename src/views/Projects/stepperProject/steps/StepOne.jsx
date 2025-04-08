import React, { useEffect, useState } from 'react'
import { Grid, Typography, IconButton } from '@mui/material'

import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import {
  useGetListEnergyClasses,
  useGetListIncomeClasses,
  useGetListProjectNatures,
  useGetListProjectResidences,
  useGetListTypeDemade
} from 'src/services/project.service'
import { useGetClients } from 'src/services/client.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetOperationTiers, useGetTiers } from 'src/services/tiers.service'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/@core/components/icon'
import CreateClient from 'src/views/clients/CreateClient'
import CreateTiers from 'src/views/Tiers/CreateTiers'
import Form1 from '../../form/form-1'
import FormUpdate from '../../form/FormUpdate'

const StepOne = ({ id, detailsProject, handleChange, formInput, setFormInput, formErrors, updateProject }) => {
  // ** state
  const [decision, setdecision] = useState(null)
  const [openModalAddClient, setOpenModalAddClient] = useState(false)
  const [openModalAddEntreprise, setOpenModalAddEntreprise] = useState(false)

  // Custom function

  return (
    <div>
      <FormUpdate detailsProject={detailsProject} />
    </div>
  )
}

export default StepOne
