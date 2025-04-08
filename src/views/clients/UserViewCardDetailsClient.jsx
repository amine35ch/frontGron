// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import {
  Card,
  Grid,
  CardHeader,
  Divider,
  Typography,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon
} from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'

// ** Icon Imports

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import useStates from 'src/@core/hooks/useStates'

// ** Icon Imports
import { useAuth } from 'src/hooks/useAuth'
import { genreList } from './ContentCreateClient'
import IconifyIcon from 'src/@core/components/icon'
import CustomModal from 'src/components/CustomModal'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%'
}))

const UserViewCardDetailsClient = ({ dataDetails, resource }) => {
  const { getStateByModel } = useStates()
  const auth = useAuth()

  const [openModalSigantureClient, setOpenModalSigantureClient] = useState(false)

  // ** States

  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  return (
    <Card className=''>
      <CardHeader
        sx={{ py: 2 }}
        title={
          <div className='flex pt-2'>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <CustomChip
                skin='light'
                size='small'
                label={getStateByModel('DClient', dataDetails?.state)?.name}
                color={getStateByModel('DClient', dataDetails?.state)?.color}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </Box>
          </div>
        }
      />
      <CardContent
        sx={{
          minHeight: '10rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        {dataDetails?.first_name && (
          <CustomAvatar
            skin='light'
            variant='rounded'
            color='primary'
            sx={{ width: 85, height: 85, fontWeight: 500, mb: 4, fontSize: '1.8rem', borderRadius: '50%' }}
          >
            {getInitials(dataDetails?.first_name + ' ' + dataDetails?.last_name)}
          </CustomAvatar>
        )}

        <div className='text-center'>
          {dataDetails?.first_name && (
            <Typography variant='h6' sx={{ fontSize: '16px !important' }}>
              {dataDetails?.gender !== null ? genreList[dataDetails?.gender]?.entitled + ' ' : null}
              {dataDetails?.first_name} {dataDetails?.last_name}
            </Typography>
          )}

          {dataDetails?.trade_name && (
            <Typography variant='h5' sx={{ fontSize: '16px !important' }}>
              {dataDetails?.trade_name}
            </Typography>
          )}
          {dataDetails?.legal_representative && (
            <Typography variant='body2' sx={{ fontSize: '16px !important' }}>
              {dataDetails?.legal_representative}
            </Typography>
          )}
        </div>
      </CardContent>

      <CardContent>
        {/* <Typography color={'#4c4e64de'} fontSize={'15px'} sx={{ fontWeight: '600' }}>
          Information Générale
        </Typography> */}
        <Divider sx={{ mt: theme => `${theme.spacing(1)} !important` }} />
        <Box sx={{ pt: 2, pb: 1 }}>
          {dataDetails?.website && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Site Web:</Typography>
              <Typography variant='body2'>{dataDetails?.website}</Typography>
            </Box>
          )}

          {dataDetails?.type_raison_sociale && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                Forme juridique:
              </Typography>
              <Typography variant='body2'>{dataDetails?.type_raison_sociale?.entitled}</Typography>
            </Box>
          )}
          {dataDetails?.phone_number_1 && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                Numéro de téléphone:
              </Typography>
              <Typography variant='body2'>{dataDetails?.phone_number_1}</Typography>
            </Box>
          )}
          {dataDetails?.phone_number_2 && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Portable :</Typography>
              <Typography variant='body2'>{dataDetails?.phone_number_2}</Typography>
            </Box>
          )}
          {dataDetails?.year_of_birth && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                Date de naissance :
              </Typography>
              <Typography variant='body2'>{dataDetails?.year_of_birth}</Typography>
            </Box>
          )}
          {dataDetails?.email_contact && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                Email (1):
              </Typography>
              <Typography variant='body2'> {dataDetails?.email_contact}</Typography>
            </Box>
          )}
          {dataDetails?.email_contact_two && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                Email (2) :
              </Typography>
              <Typography variant='body2'> {dataDetails?.email_contact_two}</Typography>
            </Box>
          )}
          {dataDetails?.address && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Adresse:</Typography>
              <Typography variant='body2'>{dataDetails?.address}</Typography>
            </Box>
          )}

          {(dataDetails?.email_anah || dataDetails?.password_anah) && (
            <div className='w-full' style={{ textAlign: '-webkit-center' }}>
              <Divider style={{ width: '26rem' }}>
                <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                  Anah
                </Typography>
              </Divider>
            </div>
          )}
          {dataDetails?.email_anah && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Email :</Typography>
              <Typography variant='body2'>{dataDetails?.email_anah}</Typography>
            </Box>
          )}
          {dataDetails?.password_anah && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                Mot de passe :
              </Typography>
              <Typography variant='body2'>{dataDetails?.password_anah}</Typography>
            </Box>
          )}
          {dataDetails?.house_number && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>N°:</Typography>
              <Typography variant='body2'>{dataDetails?.house_number}</Typography>
            </Box>
          )}
          {dataDetails?.street && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Voie:</Typography>
              <Typography variant='body2'>{dataDetails?.street}</Typography>
            </Box>
          )}
          {dataDetails?.zip_code && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                Code postal:
              </Typography>
              <Typography variant='body2'>{dataDetails?.zip_code}</Typography>
            </Box>
          )}
          {dataDetails?.city && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                Ville:
              </Typography>
              <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                {dataDetails?.city}
              </Typography>
            </Box>
          )}
          {dataDetails?.rip && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                RIB:
              </Typography>
              <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                {dataDetails?.rip}
              </Typography>
            </Box>
          )}
          {dataDetails?.iban && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                IBAN:
              </Typography>
              <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                {dataDetails?.iban}
              </Typography>
            </Box>
          )}
          {dataDetails?.climatic_zone && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                Zone climatique:
              </Typography>
              <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                {dataDetails?.climatic_zone}
              </Typography>
            </Box>
          )}
          <div className='w-full' style={{ textAlign: '-webkit-center' }}>
            <Divider style={{ width: '26rem' }}>
              <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                Ménage
              </Typography>{' '}
            </Divider>
          </div>
          {dataDetails?.floor && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Étage:</Typography>
              <Typography variant='body2'>{dataDetails?.floor}</Typography>{' '}
            </Box>
          )}
          {dataDetails?.stairs && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Escalier:</Typography>
              <Typography variant='body2'>{dataDetails?.stairs}</Typography>
            </Box>
          )}
          {dataDetails?.commune && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Commune:</Typography>
              <Typography variant='body2'>{dataDetails?.commune}</Typography>
            </Box>
          )}
          {dataDetails?.door && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Porte:</Typography>
              <Typography variant='body2'>{dataDetails?.door}</Typography>
            </Box>
          )}
          {dataDetails?.building && (
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Bâtiment:</Typography>
              <Typography variant='body2'>{dataDetails?.building}</Typography>
            </Box>
          )}
          {dataDetails && dataDetails?.download_signature !== null && (
            <>
              <div className='w-full' style={{ textAlign: '-webkit-center' }}>
                <Divider style={{ width: '26rem' }}>
                  <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                    Signature
                  </Typography>{' '}
                </Divider>
              </div>
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
                              primary='Signature Client'
                            />
                          </div>
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={2} display='flex' justifyContent='flex-end' gap={2} alignItems='center'>
                      <IconButton>
                        <IconifyIcon
                          onClick={() => setOpenModalSigantureClient(true)}
                          fontSize='18px'
                          icon='ic:round-open-in-new'
                          color='#585ddb'
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </CardContent>

      <CustomModal
        open={openModalSigantureClient}
        handleCloseOpen={() => setOpenModalSigantureClient(false)}
        handleActionModal={() => setOpenModalSigantureClient(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Visualiser'}
        widthModal={'lg'}
        btnTitleClose={false}
        action={() => setOpenModalSigantureClient(false)}
      >
        <img alt={'signature client'} src={dataDetails?.download_signature} style={{ height: '100%' }} />
      </CustomModal>
    </Card>
  )
}

export default UserViewCardDetailsClient
