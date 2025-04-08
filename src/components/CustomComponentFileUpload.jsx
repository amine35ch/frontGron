import React, { useRef } from 'react'
import { Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import CustomFileUpload from './CustomFileUpload'
import CustomFileUploadRestrictions from './CustomFileUploadRestrictions'

const CustomComponentFileUpload = ({
  setFormInput,
  fileTypes,
  limit,
  multiple,
  formInput,
  showInputName,
  titleFiles,
  formErrors,
  documentsList,
  onlyOthers = false
}) => {
  const fileRef = useRef()
  const methods = useForm({})

  return (
    <FormProvider {...methods}>
      <Box component='form' noValidate autoComplete='off'>
        <CustomFileUploadRestrictions
          fileTypes={fileTypes}
          limit={limit}
          multiple={multiple}
          formInput={formInput}
          setFormInput={setFormInput}
          showInputName={showInputName}
          titleFiles={titleFiles}
          formErrors={formErrors}
          onlyOthers={onlyOthers}
        />
      </Box>
    </FormProvider>
  )
}

export default CustomComponentFileUpload
