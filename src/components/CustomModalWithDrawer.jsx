import * as React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import { Drawer, Box, Divider, Tooltip, DialogActions } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTheme } from '@emotion/react'
import CustomListItemHover from './CustomListItemHover'
import { useState } from 'react'
import { useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import IconifyIcon from 'src/@core/components/icon'
import CustomFileUploadRestrictions from './CustomFileUploadRestrictions'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import { LoadingButton } from '@mui/lab'
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'
import DialogAlert from 'src/views/components/dialogs/DialogAlert'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: 'white !important'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(3)
  }
}))

const Avatar = styled(CustomAvatar)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%',
  cursor: 'pointer'
}))

export default function CustomModalWithDrawer({
  open,
  handleCloseOpen,
  action,
  ListItemDrawer,
  formInput,
  setFormInput,
  uploadDocument,
  deleteSpecificVersion,
  nameOfVersion,
  isLoading,
  isDisabled
}) {
  const handleAction = () => {
    action()
    handleCloseOpen()
  }
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin, direction } = settings
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const [fileToShow, setfileToShow] = useState(null)
  const [addFiles, setAddFiles] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = React.useState(false)

  useEffect(() => {
    ListItemDrawer && setfileToShow(ListItemDrawer[0])
  }, [ListItemDrawer])

  const showFile = item => {
    setAddFiles(false)
    setfileToShow(item)
  }

  const handleDeleteFileValidation = async deleteFile => {
    try {
      if (deleteFile) {
        await deleteSpecificVersion(fileToShow.id)
      }
      setSuspendDialogOpen(false)
    } catch {}
  }

  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={true}
        maxWidth={'lg'}
        sx={{}}
        onClose={handleCloseOpen}
        aria-labelledby='customized-dialog-title'
        open={open}

        // sx={{ backgroundColor: 'white !important' }}
      >
        {/* <DialogContent dividers> */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: skin === 'bordered' ? 0 : 6

            // ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }}
        >
          <Drawer
            open={true}
            variant={lgAbove ? 'permanent' : 'temporary'}
            ModalProps={{
              disablePortal: true,
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              zIndex: 9,
              display: 'block',
              position: lgAbove ? 'static' : 'absolute',
              '& .MuiDrawer-paper': {
                boxShadow: 'none',
                width: 300,
                zIndex: lgAbove ? 2 : 'drawer',
                position: lgAbove ? 'static' : 'absolute',
                backgroundColor: '#F7F8F9'
              },
              '& .MuiBackdrop-root': {
                position: 'absolute'
              }
            }}
          >
            <Box sx={{ overflowY: 'hidden' }}>
              <Box sx={{ fontSize: '15px', mb: 4, px: 5, pt: 5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography className='!font-semibold ' sx={{ fontSize: '15px' }}>
                  Liste des versions
                </Typography>

                <CustomChip
                  skin='light'
                  size='small'
                  label={ListItemDrawer?.length}
                  color={'primary'}
                  sx={{ height: 24, fontSize: '14px', fontWeight: 500, px: 2, marginLeft: '10px' }}
                />
              </Box>
              <PerfectScrollbar>
                <Box py={4}>
                  {ListItemDrawer?.map((version, index) => (
                    <CustomListItemHover
                      index={index}
                      key={index}
                      item={version}
                      activeItem={fileToShow == version ? true : false}
                      option={'name'}
                      action={showFile}
                      deleteSpecificVersion={deleteSpecificVersion}
                      setSuspendDialogOpen={setSuspendDialogOpen}
                      isDisabled={isDisabled}
                    />
                  ))}
                </Box>
              </PerfectScrollbar>
            </Box>
          </Drawer>
          <div className='w-full main'>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', py: 2, alignItems: 'center' }}>
              <Typography className='!ml-3 !font-semibold !underline' sx={{ fontSize: '15px' }}>
                {nameOfVersion}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  aria-label='add'
                  onClick={() => setAddFiles(true)}
                  sx={{
                    color: theme => theme.palette.grey[500]
                  }}
                  variant='rounded'
                  disabled={isDisabled}
                >
                  <IconifyIcon icon='ph:plus' fontSize='18px' color='#585ddb' />
                </IconButton>
                {/* <BtnColorSecondary title={'Ajouter'} action={() => setAddFiles(true)} /> */}
                <Divider orientation='vertical' sx={{ color: 'red', height: '40px', ml: 2 }} />
                <IconButton
                  aria-label='close'
                  onClick={handleCloseOpen}
                  sx={{
                    color: theme => theme.palette.grey[500]
                  }}
                >
                  <IconifyIcon icon='mdi:close' color='#585ddb' fontSize={'18px'} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ m: '0 !important' }} />

            <div className='content p-3 h-[80vh]'>
              {addFiles ? (
                <>
                  <CustomFileUploadRestrictions
                    fileTypes={['.png', '.pdf', '.xlsx']}
                    limit={100}
                    multiple={true}
                    disabled={true}
                    fileName={nameOfVersion}
                    formInput={formInput}
                    setFormInput={setFormInput}
                    name='files'
                  />
                  <div className='flex justify-end '>
                    <LoadingButton
                      variant='contained'
                      color='primary'
                      loadingPosition='start'
                      className='h-[29px] w-[105px] !mt-2'
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      onClick={() => uploadDocument(nameOfVersion)}
                      loading={isLoading}
                    >
                      Ajouter
                    </LoadingButton>
                  </div>
                </>
              ) : (
                <>
                  {fileToShow?.extension?.toLowerCase() == 'png' ||
                  fileToShow?.extension?.toLowerCase() == 'jpg' ||
                  fileToShow?.extension?.toLowerCase() == 'jpeg' ? (
                    <img src={fileToShow?.download_path} style={{ height: '100%' }} />
                  ) : (
                    <iframe
                      style={{
                        borderRadius: 10,
                        borderColor: '#90caf975',
                        boxShadow:
                          '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                        border: '0px solid',
                        height: '100%'
                      }}
                      title='contrat-pdf'
                      src={fileToShow?.download_path}
                      width='100%'
                      credentialless
                    ></iframe>
                  )}
                </>
              )}
            </div>
          </div>
        </Box>
        {/* </DialogContent> */}
        <DialogActions>Créer le : {moment(fileToShow?.created_at).format('DD/MM/YYYY HH:mm')}</DialogActions>
      </BootstrapDialog>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer la ${fileToShow?.version} de ${nameOfVersion}  ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleDeleteFileValidation}
      />
    </React.Fragment>
  )
}
