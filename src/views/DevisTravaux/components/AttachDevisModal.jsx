import React, { useEffect, useRef, useState } from 'react'
import { Card, IconButton, Tooltip, CardContent, CardHeader, Typography, Divider } from '@mui/material'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import CustomModal from './CustomModal'
import CustomChip from 'src/@core/components/mui/chip'

import Icon from 'src/@core/components/icon'
import CustomComponentFileUpload from './CustomComponentFileUpload'
import ListItemsFiles from './ListItemsFiles'
import CustomFileUploadRestrictions from './CustomFileUploadRestrictions'
import { version } from 'nprogress'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import ItemFile from './ItemFile'

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '300px'
}))

const AttachDevisModal = ({
  documents,
  arrayDocuments,
  setFormInput,
  uploadDocument,
  openModalFile,
  setopenModalFile,
  formInput,
  authorizeDelete,
  deleteDocument,
  deleteSpecificVersion,
  border,
  showDivider,
  paddingTitle,
  showInputName,
  isLoading,
  hideDeleteButton = false,
  formErrors,
  addNewFile = true,
  onlyOthers = false
}) => {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedFile] = useState(false)
  const [openFileDialog, setIsOpenFileDialog] = useState(false)
  const [totalVersions, setTotalVersions] = useState(null)
  const theme = useTheme()
  useEffect(() => {
    if (arrayDocuments && arrayDocuments.length !== 0) {
      const total = arrayDocuments.reduce((acc, doc) => {
        if (doc?.versions?.length > 0) return acc + 1

        return acc
      }, 0)
      setTotalVersions(total)
    } else {
      setTotalVersions(0)
    }
  }, [arrayDocuments])

  const deleteFile = async () => {
    const id = selectedFile.id
    setSuspendDialogOpen(false)
    try {
      const result = await deleteFileMutation.mutateAsync(id)
    } catch (error) {}
  }

  const downloadFile = downloadPath => {
    // Créez un élément <a> pour déclencher le téléchargement
    const link = document.createElement('a')
    link.href = downloadPath
    link.download = '' // Vous pouvez également définir un nom de fichier ici
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadAll = () => {
    // Parcours de chaque objet dans le tableau et déclenchement du téléchargement
    arrayDocuments.forEach(file => {
      downloadFile(file.download_path)
    })
  }

  const handleCloseModal = () => {
    setopenModalFile(!openModalFile)
    setFormInput({ ...formInput, files: [] })
  }

  return (
    <>
      <Card sx={{ backgroundColor: 'white', border: border ? border : '', padding: 2 }}>
        <CardHeader
          sx={{ padding: paddingTitle ? paddingTitle : '' }}
          title={
            <div className='flex items-center'>
              <Typography color='#4c4e64de' fontSize={'15px'} sx={{ fontWeight: '600' }}>
                Liste des fichiers
              </Typography>

              <CustomChip
                skin='light'
                size='small'
                label={totalVersions}
                color={'secondary'}
                sx={{ height: 24, fontSize: '14px', fontWeight: 500, px: 2, marginLeft: '10px' }}
              />
            </div>
          }
          className='!pt-3 !pb-1'
          titleTypographyProps={{ fontSize: '15px !important', fontWeight: '600 !important' }}
          action={
            <div className='flex items-center '>
              {addNewFile ? (
                <Tooltip className='!p-0' title='Uploader' sx={{ cursor: 'pointer' }}>
                  <IconButton className='!p-0' size='small'>
                    <Icon
                      icon='ph:plus'
                      fontSize='20px'
                      onClick={() => setopenModalFile(true)}
                      style={{ cursor: 'pointer', color: theme.palette.secondary.main }}
                    />
                  </IconButton>
                </Tooltip>
              ) : null}
            </div>
          }
        />
        {showDivider && (
          <Divider
            sx={{ mt: theme => `${theme.spacing(1)} !important`, padding: paddingTitle ? `!${paddingTitle}` : 0 }}
          />
        )}
        <PerfectScrollbar sx={{ p: 0 }}>
          <CardContent className={`${paddingTitle ? `!p-${paddingTitle}` : ''} `}>
            {arrayDocuments && arrayDocuments?.length > 0 ? (
              arrayDocuments?.map((doc, key) =>
                doc?.versions ? (
                  doc?.versions?.map(
                    (docVersion, index) =>
                      doc?.versions?.length - 1 == index && (
                        <ListItemsFiles
                          hideDeleteButton={hideDeleteButton}
                          key={key}
                          doc={doc}
                          formInput={formInput}
                          setFormInput={setFormInput}
                          uploadDocument={uploadDocument}
                          document={docVersion}
                          allVersion={doc?.versions}
                          authorizeDelete={authorizeDelete}
                          deleteDocument={deleteDocument}
                          deleteSpecificVersion={deleteSpecificVersion}
                          isLoading={isLoading}
                        />
                      )
                  )
                ) : (
                  <ListItemsFiles
                    hideDeleteButton={hideDeleteButton}
                    key={key}
                    doc={doc}
                    formInput={formInput}
                    setFormInput={setFormInput}
                    uploadDocument={uploadDocument}
                    document={doc}
                    authorizeDelete={authorizeDelete}
                    deleteDocument={deleteDocument}
                    deleteSpecificVersion={deleteSpecificVersion}
                    isLoading={isLoading}
                  />
                )
              )
            ) : (
              <div className='flex flex-col items-center justify-center gap-6 text-xl text-center my-7'>
                {/* <img src={'/images/icons/file-icons/filesC.png'} width={'80'} /> */}
                <IconifyIcon
                  color={'#FFAF6C'}
                  className='w-[100px] md:w-[200px] h-10 md:h-10 self-center '
                  icon='pepicons-pencil:file-off'
                />
                <Typography sx={{ fontSize: '15px' }}>Aucun document ajouté</Typography>
              </div>
            )}
          </CardContent>
        </PerfectScrollbar>
      </Card>

      <CustomModal
        open={openModalFile}
        handleCloseOpen={() => handleCloseModal()}
        handleActionModal={() => handleCloseModal()}
        btnTitle={'Ajouter'}
        ModalTitle={'Ajouter des fichiers'}
        widthModal={'md'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
        action={() => uploadDocument()}
        isLoading={isLoading}

        // edit={editLine}
        //  isLoading={cancelInvoiceMutation?.isLoading}
      >
        <CustomFileUploadRestrictions
          fileTypes={['.png', '.jpg', '.jpeg', '.pdf', '.xlsx', '.docx', '.txt', '.pptx', '.pptx', '.mp3', '.mp4']}
          limit={100}
          multiple={true}
          formInput={formInput}
          setFormInput={setFormInput}
          showInputName={showInputName}
          formErrors={formErrors}
          name='files'
          onlyOthers={onlyOthers}
        />
      </CustomModal>

      <CustomModal
        open={suspendDialogOpen}
        handleCloseOpen={() => setSuspendDialogOpen(!suspendDialogOpen)}
        handleActionModal={() => setSuspendDialogOpen(!suspendDialogOpen)}
        btnTitle={'Supprimer'}
        ModalTitle={'Confirmation'}
        widthModal={'sm'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
        action={() => deleteFile()}

        // edit={editLine}pde
        //  isLoading={cancelInvoiceMutation?.isLoading}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le fichier <strong> {selectedFile?.name} </strong>
        </p>
      </CustomModal>

      <CustomModal
        open={openFileDialog}
        handleCloseOpen={() => setIsOpenFileDialog(!openFileDialog)}
        handleActionModal={() => setIsOpenFileDialog(!openFileDialog)}
        ModalTitle={selectedFile?.name}
        widthModal={'md'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
      >
        {selectedFile?.extension?.toLowerCase() == 'PNG' ? (
          <img
            src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/documents/${selectedFile.id}/download`}
            alt={selectedFile.name}
            style={{ maxWidth: '100%', height: '100%' }}
          />
        ) : (
          <iframe
            style={{
              borderRadius: 10,
              borderColor: '#90caf975',
              boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              border: '0px solid'
            }}
            title='contrat-pdf'
            src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/documents/${selectedFile.id}/download`}
            width='100%'
            height='700px'
          ></iframe>
        )}
      </CustomModal>
    </>
  )
}

export default AttachDevisModal
