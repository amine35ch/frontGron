import React, { useState } from 'react'
import DetailsMenageProject from './DetailsMenageProject'
import DetailsOccupantProject from './DetailsOccupantProject'
import DetailsVisiteProject from './DetailsVisiteProject'
import DetailsWorksProject from './DetailsWorksProject'

import DetailsClientProject from './DetailsClientProject'
import DetailsFolder from './DetailsFolder'
import IconifyIcon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import AttachFileModalWithTable from 'src/components/AttachFileModalWithTable'
import { useUploadGeneralDocumentToProject } from 'src/services/project.service'

const DetailsProject = ({ detailsProject }) => {
  const router = useRouter()
  const [openModalFile, setopenModalFile] = useState(false)
  const uploadGeneralDocumentMutation = useUploadGeneralDocumentToProject({ id: detailsProject?.id })
  const isDisabled = detailsProject?.isEditable
  const isLead = detailsProject?.project_type === 0
  const [formInput, setFormInput] = useState({
    files: []
  })

  const uploadDocumentToProject = async () => {
    const formData = new FormData()
    const files = formInput.files

    for (let key in formInput) {
      if (key == 'files') {
        formInput?.files?.map((file, index) => {
          // formData.append(`signature`, file)
          formData.append(`documents[${index}][file]`, file?.file)
          if (file.nom !== undefined) {
            formData.append(`documents[${index}][name]`, file.nom)
          } else {
            formData.append(`documents[${index}][name]`, '')
          }
        })
      }
    }
    try {
      await uploadGeneralDocumentMutation.mutateAsync(formData)
      setFormInput({
        ...formInput,
        files: []
      })
      setopenModalFile(false)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }
  return (
    <div>
      <div className='flex justify-end mt-2'>
        {/* <IconifyIcon icon='mdi:pencil-outline' fontSize={20} color='red' /> */}
        <Button
          className='h-[29px]'
          sx={{ fontSize: '12px', cursor: 'pointer' }}
          onClick={() => router.push(`/projects/${detailsProject?.id}/edit-project/`)}
          color={'primary'}
          variant={'contained'}
          disabled={isDisabled || isLead}
        >
          Modifier
        </Button>
      </div>
      <DetailsFolder detailsProject={detailsProject} />
      {detailsProject?.accordions?.client_details ? <DetailsClientProject detailsProject={detailsProject} /> : null}
      <DetailsMenageProject detailsProject={detailsProject} />
      <DetailsOccupantProject detailsProject={detailsProject} />
      {detailsProject?.accordions?.visitt_list ? <DetailsVisiteProject detailsProject={detailsProject} /> : null}
      {detailsProject?.accordions?.work_list ? <DetailsWorksProject detailsProject={detailsProject} /> : null}
      <div className='mt-5'>
        <AttachFileModalWithTable
          hideDeleteButton={true}
          openModalFile={openModalFile}
          setopenModalFile={setopenModalFile}
          formInput={formInput}
          setFormInput={setFormInput}
          arrayDocuments={detailsProject?.documents || []}
          uploadDocument={uploadDocumentToProject}
          authorizeDelete={true}
          showInputName={true}
          detailsProject={detailsProject}
        />
      </div>
    </div>
  )
}

export default DetailsProject
