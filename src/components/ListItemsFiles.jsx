import * as React from 'react'
import { List, Grid, IconButton } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import IconifyIcon from 'src/@core/components/icon'
import CustomModal from './CustomModal'
import CustomModalWithDrawer from './CustomModalWithDrawer'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { useViewGeneralDocumentData } from 'src/services/document.service'
import { useRouter } from 'next/router'
import zIndex from '@mui/material/styles/zIndex'
import DialogAlert from 'src/views/components/dialogs/DialogAlert'

export default function ListItemsFiles({
  doc,
  document,
  allVersion,
  deleteDocument,
  deleteSpecificVersion,
  formInput,
  setFormInput,
  uploadDocument,
  authorizeDelete,
  hideDeleteButton,
  isLoading,
  detailsProject
}) {
  const router = useRouter()
  const { id } = router.query
  const [openModalOneFile, setOpenModalOneFile] = React.useState(false)
  const [openModalWithDrawer, setOpenModalWithDrawer] = React.useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = React.useState(false)

  const [documentToShow, setDocumentToShow] = React.useState(document)
  const isDisabled = detailsProject?.isEditable

  // *********query********

  const viewGeneralDocumentData = useViewGeneralDocumentData({ id })

  React.useEffect(() => {
    document && setDocumentToShow(document)
  }, [document])

  const showOnlyDocument = async () => {
    const reference = doc?.reference
    try {
      await viewGeneralDocumentData.mutateAsync(reference)
    } catch (error) {}
    setOpenModalOneFile(true)
  }

  const handleDeleteFileValidation = async deleteFile => {
    try {
      if (deleteFile) await deleteDocument(doc.id)
      setSuspendDialogOpen(false)
    } catch {}
  }

  return (
    <>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          padding: 1,
          bgcolor: 'customColors.lightBg',
          borderRadius: 1,
          marginTop: 1
        }}
      >
        {/* {array.map(value => {
        return ( */}
        <ListItem sx={{ padding: '0px !important' }} disablePadding>
          <Grid container>
            <Grid item xs={9}>
              <div className='flex '>
                <ListItemIcon>
                  <IconifyIcon fontSize='19px' icon='ion:document-attach-outline' />
                </ListItemIcon>
                <div className='flex flex-col'>
                  <div className='flex items-center mb-1 '>
                    <ListItemText
                      className='!text-[10px] !m-0'
                      sx={{ fontSize: '10px  !important' }}
                      primary={doc?.name ? doc?.name : document?.name}
                    />
                    {doc?.new && (
                      <CustomChip
                        skin='light'
                        color={'warning'}
                        sx={{
                          fontWeight: '600',
                          fontSize: '.75rem',
                          height: '26px',
                          cursor: 'pointer',
                          ml: 2
                        }}
                        icon={<Icon icon='material-symbols:notifications-active-outline-sharp' fontSize={20} />}
                        label={'Nouveau'}
                      />
                    )}
                  </div>
                  {allVersion?.length > 0 ? (
                    <Typography
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setOpenModalWithDrawer(true)}
                      fontSize={12}
                      color='primary'
                      className='underline'
                    >
                      Toutes Les versions ({allVersion?.length})
                    </Typography>
                  ) : null}
                </div>
              </div>
            </Grid>

            <Grid item xs={2} display='flex' justifyContent='flex-end' gap={2} alignItems='center'>
              <IconButton>
                <IconifyIcon
                  onClick={() => showOnlyDocument(true)}
                  fontSize='18px'
                  icon='ic:round-open-in-new'
                  color='#585ddb'
                />
              </IconButton>
              {!authorizeDelete ? null : (
                <>
                  {!hideDeleteButton ? (
                    <IconButton disabled={isDisabled}>
                      <IconifyIcon
                        onClick={() => {
                          setSuspendDialogOpen(true)
                        }}
                        fontSize='20px'
                        icon='mdi:delete-outline'
                        color='red'
                      />
                    </IconButton>
                  ) : null}
                </>
              )}
            </Grid>
          </Grid>
        </ListItem>
        {/* // ) // })} */}
      </List>

      <CustomModal
        open={openModalOneFile}
        handleCloseOpen={() => setOpenModalOneFile(false)}
        handleActionModal={() => setOpenModalOneFile(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Visualiser'}
        widthModal={'lg'}
        btnTitleClose={false}
        action={() => setOpenModalOneFile(false)}
      >
        {documentToShow?.extension?.toLowerCase() == 'png' ||
        documentToShow?.extension?.toLowerCase() == 'jpeg' ||
        documentToShow?.extension?.toLowerCase() == 'jpeg' ? (
          <img
            alt={documentToShow?.extension?.toLowerCase()}
            src={documentToShow?.download_path}
            style={{ height: '100%' }}
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
            src={documentToShow?.download_path}
            width='100%'
            height='700px'
            credentialless
          ></iframe>
        )}
        {/* </div> */}
      </CustomModal>

      <CustomModalWithDrawer
        open={openModalWithDrawer}
        nameOfVersion={doc?.name}
        ListItemDrawer={allVersion}
        formInput={formInput}
        setFormInput={setFormInput}
        uploadDocument={uploadDocument}
        deleteSpecificVersion={deleteSpecificVersion}
        handleCloseOpen={() => setOpenModalWithDrawer(false)}
        handleActionModal={() => setOpenModalWithDrawer(false)}
        isLoading={isLoading}
        isDisabled={isDisabled}
      />
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Le Fichier ${doc?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleDeleteFileValidation}
      />
    </>
  )
}
