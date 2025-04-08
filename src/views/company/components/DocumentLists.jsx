import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, Grid } from '@mui/material'
import { set } from 'nprogress'
import { useEffect, useState } from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import CustomeSwitch from 'src/components/switch'
import {
  useGetProjctDocuments,
  useUpdateProjectDocuments,
  useUpdateProjectDocumentsSignature
} from 'src/services/settings.service'

const DocumentLists = ({ field = 'required' }) => {
  const [toggles, setToggles] = useState([])

  const {
    data: projectDocumentsData,
    isSuccess: projectDocumentsIsSuccess,
    isFetching: projectDocumentsIsFetching
  } = useGetProjctDocuments({ signature: field === 'signature' })

  useEffect(() => {
    if (projectDocumentsIsSuccess) {
      setToggles([...projectDocumentsData])
    }
  }, [projectDocumentsIsSuccess, projectDocumentsData])

  const updateProjectDocumentsMutation = useUpdateProjectDocuments()
  const updateProjectDocumentsSignatureMutation = useUpdateProjectDocumentsSignature()

  const handleToggle = async (value, id) => {
    try {
      setToggles(prevState => {
        return prevState.map(document => {
          if (document?.type_doc === id) {
            return { ...document, [field]: value?.target?.checked }
          }

          return document
        })
      })
      if (field === 'required') {
        await updateProjectDocumentsMutation.mutateAsync({ type_doc: id, required: value?.target?.checked })
      } else {
        await updateProjectDocumentsSignatureMutation.mutateAsync({ type_doc: id, signature: value?.target?.checked })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CustomAccordian titleAccordian={'Documents'}>
      <Grid container columnSpacing={6} rowSpacing={3} mt={5} mb={5} justifyContent='center'>
        {toggles?.map((document, index) => (
          <>
            <Grid key={index} item md={5}>
              <CustomeSwitch
                checked={document[field]}
                onChange={event => {
                  handleToggle(event, document?.type_doc)
                }}
                label={document?.entitled}
              />
            </Grid>
            {index % 2 === 0 && index !== toggles.length - 1 && <Divider orientation='vertical' flexItem />}
          </>
        ))}
      </Grid>
    </CustomAccordian>
  )
}

export default DocumentLists
