import React, { useRef, useState } from 'react'
import { Grid, Box, TextField, TextareaAutosize, Checkbox, FormGroup, Typography } from '@mui/material'

// import CustomFileUpload from 'src/components/CustomFileUpload'
import { FormProvider, useForm } from 'react-hook-form'
import CustomFileUpload from 'src/components/CustomFileUpload'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'

const StepWithSignature = () => {
  const fileRef = useRef()
  const methods = useForm({})

  const [formInput, setFormInput] = useState({})

  const handleFilesChange = files => {
    // Update chosen files
    setFormInput(f => {
      return { ...f, attached_file: files[0] }
    })
  }

  const handleFilesChangeMultiple = files => {
    // Update chosen files

    setFormInput(f => {
      return { ...f, [name]: [...files] }
    })
  }



  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    methods.reset()

    fileRef.current.value = null
  }

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6} className='!mb-2'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Nom
          </Typography>
          <TextField
            placeholder='Nom'
            size='small'
            variant='outlined'
            className='w-full !mt-1'

            // value={attributeStepWithSignature.entitled}
            // onChange={e => {
            //   handleChangeAttribute('entitled', e.target.value)
            // }}
            // error={formError?.entitled}
            // helperText={renderArrayMultiline(formError?.entitled)}
          />
        </Grid>
        <Grid item xs={12} md={6} className='!mb-2'>
          <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
            Nom
          </Typography>
          <TextField
            placeholder='Nom'
            size='small'
            variant='outlined'
            className='w-full !mt-1'

            // value={attributeStepWithSignature.entitled}
            // onChange={e => {
            //   handleChangeAttribute('entitled', e.target.value)
            // }}
            // error={formError?.entitled}
            // helperText={renderArrayMultiline(formError?.entitled)}
          />
        </Grid>
       

        <Grid item xs={12} md={6}>
          <FormProvider {...methods}>
            <Box component='form' noValidate autoComplete='off'>
              <CustomFileUpload
                fileTypes={['pdf', 'xlsx', 'png']}
                ref={fileRef}
                limit={10}
                multiple={true}
                name='Fichier'
                handleFilesChange={handleFilesChange}
                handleFilesChangeMultiple={handleFilesChangeMultiple}
                onFileDelete={onFileDelete}
              />
            </Box>
          </FormProvider>
        </Grid>
      </Grid>
    </div>
  )
}

export default StepWithSignature
