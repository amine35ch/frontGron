// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Card, Grid, CardHeader, Divider, Typography, CardContent, CardActions } from '@mui/material'
import { CircularProgress, IconButton, Menu, MenuItem } from '@mui/material'

// ** Icon Imports

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/material/styles'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import useStates from 'src/@core/hooks/useStates'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import moment from 'moment'

// ** Icon Imports
import { useAuth } from 'src/hooks/useAuth'
import { dateFormater } from 'src/@core/utils/utilities'
import { genreList } from 'src/views/clients/ContentCreateClient'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: '50%'
}))

const UserViewCardDetails = ({ dataDetails, isLoading, resource }) => {
  const { getStateByModel } = useStates()
  const auth = useAuth()

  return (
    <Card className='min-h-[85vh]'>
      <CardHeader
        sx={{ py: 2 }}
        title={
          <div className='flex justify-between pt-2'>
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
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              {dataDetails?.fiche_navette_interne && dataDetails?.profile === 'INS' ? (
                <Typography sx={{ mr: 2, fontSize: '0.8rem', fontWeight: 600 }}>
                  {dataDetails?.fiche_navette_interne ? 'Fiche navette interne' : 'Fiche navette externe'}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              {dataDetails?.quotation_interne && dataDetails?.profile === 'INS' ? (
                <Typography sx={{ mr: 2, fontSize: '0.8rem', fontWeight: 600 }}>
                  {dataDetails?.quotation_interne ? 'Devis interne' : 'Devis externe'}
                </Typography>
              ) : null}
            </Box>
          </div>
        }
      />
      {isLoading ? (
        <div className='flex h-full ' style={{ placeContent: 'center' }}>
          <CircularProgress sx={{ height: '100%' }} />
        </div>
      ) : (
        <>
          <CardContent
            sx={{
              minHeight: '10rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            {dataDetails?.download_logo ? (
              <img
                className='h-[100px] w-[100px]'
                style={{ borderRadius: '50%', marginBottom: 5 }}
                alt={'logo'}
                src={dataDetails?.download_logo}
              />
            ) : (
              <>
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
                {dataDetails?.trade_name && (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color='primary'
                    sx={{ width: 85, height: 85, fontWeight: 600, mb: 4, fontSize: '2rem', borderRadius: '50%' }}
                  >
                    {getInitials(dataDetails?.trade_name)}
                  </CustomAvatar>
                )}
              </>
            )}
            <div className='text-center'>
              {dataDetails?.first_name && (
                <Typography variant='h6' sx={{ fontSize: '16px !important' }}>
                  {dataDetails?.first_name} {dataDetails?.last_name}
                </Typography>
              )}
              {dataDetails?.trade_name && (
                <Typography variant='h5' sx={{ fontSize: '16px !important' }}>
                  {dataDetails?.trade_name}
                </Typography>
              )}

              <div className='flex'>
                {dataDetails?.representative_first_name && (
                  <Typography variant='body2' sx={{ fontSize: '16px !important' }}>
                    {dataDetails?.representative_first_name}
                  </Typography>
                )}
                {dataDetails?.representative_last_name && (
                  <Typography variant='body2' sx={{ fontSize: '16px !important' }}>
                    &nbsp; {dataDetails?.representative_last_name}
                  </Typography>
                )}
              </div>
            </div>
          </CardContent>
          <CardContent>
            <Divider sx={{ mt: theme => `${theme.spacing(1)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              {dataDetails?.website && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Site Web:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.website}</Typography>
                </Box>
              )}
              {/* {dataDetails?.representative_gender !== null && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>Genre:</Typography>
                  <Typography variant='body2'>
                    {dataDetails?.representative_gender === 0 ? 'Homme' : 'Femme'}
                  </Typography>
                </Box>
              )} */}
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
              {dataDetails?.email && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Email :
                  </Typography>
                  <Typography variant='body2'> {dataDetails?.email}</Typography>
                </Box>
              )}
              {dataDetails?.address && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Adresse:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.address}</Typography>
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
              {dataDetails?.capital && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Montant du capital:
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {dataDetails?.capital} €
                  </Typography>
                </Box>
              )}
              {dataDetails?.tva && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    TVA:
                  </Typography>
                  <CustomCurrencyInput
                    displayType='text'
                    value={dataDetails?.tva * 100}
                    suffix={' %'}
                    decimalScale={2}
                  />
                </Box>
              )}
              <div className='w-full' style={{ textAlign: '-webkit-center' }}>
                <Divider style={{ width: '26rem' }}>
                  <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                    Représentant
                  </Typography>{' '}
                </Divider>
              </div>
              {dataDetails?.legal_representative && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Nom et Prénom :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.legal_representative}</Typography>
                </Box>
              )}
              {dataDetails?.representative_first_name !== null || dataDetails?.representative_last_name !== null ? (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Nom et Prénom :
                  </Typography>
                  <Typography variant='body2'>
                    {dataDetails?.representative_gender !== null
                      ? genreList[dataDetails?.representative_gender]?.entitled
                      : null}{' '}
                    {dataDetails?.representative_first_name} {dataDetails?.representative_last_name}
                  </Typography>
                </Box>
              ) : null}
              {dataDetails?.position && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Fonction :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.position}</Typography>
                </Box>
              )}
              {dataDetails?.qualification_auditor && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Qualification :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.qualification_auditor}</Typography>
                </Box>
              )}
              {/* {dataDetails?.representative_gender !== null && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Genre :
                  </Typography>
                  <Typography variant='body2'>{genreList[dataDetails?.representative_gender]?.entitled}</Typography>
                </Box>
              )} */}
              {dataDetails?.email_two && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Email :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.email_two}</Typography>
                </Box>
              )}
              {dataDetails?.phone_number_2 && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Numéro de téléphone :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.phone_number_2}</Typography>
                </Box>
              )}
              <div className='w-full' style={{ textAlign: '-webkit-center' }}>
                <Divider style={{ width: '26rem' }}>
                  <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                    Identifiant
                  </Typography>{' '}
                </Divider>
              </div>
              {dataDetails?.siren && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>SIREN:</Typography>
                  <Typography variant='body2'>{dataDetails?.siren}</Typography>
                </Box>
              )}
              {dataDetails?.siret && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>SIRET:</Typography>
                  <Typography variant='body2'>{dataDetails?.siret}</Typography>
                </Box>
              )}
              {dataDetails?.entreprise?.name && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    Installateur:
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {dataDetails?.entreprise?.name}
                  </Typography>
                </Box>
              )}
              {dataDetails?.identifiant_tva && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Identifiant TVA:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.identifiant_tva}</Typography>
                </Box>
              )}
              {dataDetails?.company_rcs && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>RCS:</Typography>
                  <Typography variant='body2'>{dataDetails?.company_rcs}</Typography>
                </Box>
              )}
              {dataDetails?.num_ape && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Numéro APE
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.num_ape}</Typography>
                </Box>
              )}
              {dataDetails?.approval_number && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Numéro d'agrément
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.approval_number}</Typography>
                </Box>
              )}
              <div className='w-full' style={{ textAlign: '-webkit-center' }}>
                <Divider style={{ width: '26rem' }}>
                  <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                    Assurance
                  </Typography>{' '}
                </Divider>
              </div>
              {dataDetails?.insurance_name && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Raison sociale:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_name}</Typography>
                </Box>
              )}
              {dataDetails?.insurance_siret && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Numéro Siret:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_siret}</Typography>
                </Box>
              )}
              {dataDetails?.insurance_address && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Adresse :
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_address}</Typography>{' '}
                </Box>
              )}
              {dataDetails?.insurance_capital !== 0 ? (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Montant du capital social:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_capital}</Typography>
                </Box>
              ) : null}
              {dataDetails?.insurance_rcs && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>RCS:</Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_rcs}</Typography>
                </Box>
              )}
              {dataDetails?.insurance_police && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Numéro police:
                  </Typography>
                  <Typography variant='body2'>{dataDetails?.insurance_police}</Typography>
                </Box>
              )}
              {dataDetails?.emissions_date_assurance && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Date d'émission:
                  </Typography>
                  <Typography variant='body2'>{dateFormater(dataDetails?.emissions_date_assurance)}</Typography>
                </Box>
              )}
              {dataDetails?.end_date_assurance && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                    Date de fin:
                  </Typography>
                  <Typography variant='body2'>{dateFormater(dataDetails?.end_date_assurance)}</Typography>
                </Box>
              )}
              {dataDetails?.project_number ? (
                <>
                  <div className='w-full' style={{ textAlign: '-webkit-center' }}>
                    <Divider style={{ width: '26rem' }}>
                      <Typography variant='body2' sx={{ fontWeight: '500' }} color={'error'}>
                        Dossiers
                      </Typography>{' '}
                    </Divider>
                  </div>

                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', fontWeight: 600 }}>
                      Nombre des Dossiers:
                    </Typography>
                    <Typography variant='body2'>{dataDetails?.project_number}</Typography>
                  </Box>
                </>
              ) : null}
            </Box>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default UserViewCardDetails
