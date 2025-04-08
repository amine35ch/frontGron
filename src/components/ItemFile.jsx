import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import IconifyIcon from 'src/@core/components/icon'
import CustomModal from './CustomModal'
import CustomModalWithDrawer from './CustomModalWithDrawer'

export default function ItemFile({
  doc,
  document,
  allVersion,
  deleteDocument,
  deleteSpecificVersion,
  formInput,
  setFormInput,
  uploadDocument,
  authorizeDelete,
  fileName
}) {
  const [openModalOneFile, setOpenModalOneFile] = React.useState(false)
  const [openModalWithDrawer, setOpenModalWithDrawer] = React.useState(false)


  const showOnlyDocument = () => {
    setOpenModalOneFile(true)
  }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {/* {array.map(value => {
        return ( */}
        <ListItem
          sx={{ cursor: 'pointer' }}
          secondaryAction={
            <div className='flex'>
              <IconifyIcon
                onClick={() => showOnlyDocument(true)}
                fontSize='18px'
                icon='ic:round-open-in-new'
                color='#585ddb'
              />
              {authorizeDelete === false ? null : (
                <IconifyIcon
                  onClick={() => deleteDocument(doc.id)}
                  fontSize='20px'
                  icon='mdi:delete-outline'
                  color='red'
                />
              )}
            </div>
          }
          disablePadding
        >
          <ListItemButton className='!rounded-lg !py-1 !px-3' role={undefined}>
            <ListItemIcon>
              <IconifyIcon fontSize='19px' icon='ion:document-attach-outline' />
            </ListItemIcon>
            <ListItemText className='!text-[10px]' sx={{ fontSize: '10px  !important' }} primary={fileName} />
          </ListItemButton>
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
        {formInput?.extension?.toLowerCase() == 'png' ||
        formInput?.extension?.toLowerCase() == 'jpeg' ||
        formInput?.extension?.toLowerCase() == 'jpeg' ? (
          <img src={formInput?.download_path} style={{ height: '100%', height: '100%' }} />
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
            src={formInput?.download_path}
            width='100%'
            height='700px'
            credentialless
          ></iframe>
        )}
      </CustomModal>

      <CustomModalWithDrawer
        open={openModalWithDrawer}
        formInput={formInput}
        setFormInput={setFormInput}
        uploadDocument={() => setOpenModalWithDrawer(false)}
        deleteSpecificVersion={deleteSpecificVersion}
        handleCloseOpen={() => setOpenModalWithDrawer(false)}
        handleActionModal={() => setOpenModalWithDrawer(false)}
      />
    </>
  )
}
