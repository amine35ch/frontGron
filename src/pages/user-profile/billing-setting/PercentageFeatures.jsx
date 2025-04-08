import React, { useState } from 'react'
import { useGetPercentageSubscriberFeatures } from 'src/services/subscription.service'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import LinearProgress from '@mui/material/LinearProgress'
import 'moment/locale/fr'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

import IconifyIcon from 'src/@core/components/icon'
import { Dialog, DialogContent } from '@mui/material'
import PendingFeatures from './PendingFeatures'
import AddFeaturesSub from './AddFeaturesSub'

const PercentageFeatures = () => {
  const [openDialogFeatures, setOpenDialogFeatures] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const { data: percentageSubscriberFeatures, isPending } = useGetPercentageSubscriberFeatures()

  return (
    <Grid item xs={12} md={4}>
      <Box display={'flex'} justifyItems={'center'} alignItems={'center'} justifyContent={'end'}>
        {/* add features */}
        <IconButton
          color='secondary'
          onClick={() => setOpenDialogFeatures(true)}
          sx={{
            p: 0,
            borderRadius: '50%',
            bgcolor: '#86a039',
            '&:hover': {
              bgcolor: '#86a039'
            },
            '&:active': {
              bgcolor: '#86a039'
            },
            mr: 3
          }}
        >
          <IconifyIcon icon='mdi:plus' color='white' fontSize='22' />
        </IconButton>
        <IconButton sx={{ p: 1 }} onClick={() => setOpenDialog(true)} color='secondary' title='Voir Document'>
          <IconifyIcon icon='carbon:data-view-alt' />
        </IconButton>
      </Box>
      <Box mt={4}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='mdi:user' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Utilisateur <strong>{percentageSubscriberFeatures?.data?.USER?.PERCENTAGE} %</strong>
            </Typography>
          </div>
          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.USER?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.USER?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.USER?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.USER?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.USER?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.USER?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='mdi:account-outline' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Bénéficiaires <strong>{percentageSubscriberFeatures?.data?.CLIENT?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.CLIENT?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.CLIENT?.pending}`}
              />
            )}

            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.CLIENT?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.CLIENT?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.CLIENT?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.CLIENT?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='mdi:storage' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Stockage <strong>{percentageSubscriberFeatures?.data?.STORAGE?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.STORAGE?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.STORAGE?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.STORAGE?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.STORAGE?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.STORAGE?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.STORAGE?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='ph:folder-bold' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Dossier <strong>{percentageSubscriberFeatures?.data?.PROJECT?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.PROJECT?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.PROJECT?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.PROJECT?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.PROJECT?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.PROJECT?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.PROJECT?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='fluent:person-money-24-filled' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Mandataires <strong>{percentageSubscriberFeatures?.data?.AGENT?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.AGENT?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.AGENT?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.AGENT?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.AGENT?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.AGENT?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.AGENT?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='eos-icons:product-subscriptions-outlined' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Marques <strong>{percentageSubscriberFeatures?.data?.BRAND?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex'>
            {percentageSubscriberFeatures?.data?.BRAND?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.BRAND?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.BRAND?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.BRAND?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.BRAND?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.BRAND?.PERCENTAGE
          }
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='gridicons:product' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Produits <strong>{percentageSubscriberFeatures?.data?.PRODUCT?.PERCENTAGE} %</strong>
            </Typography>
          </div>

          <div className='flex items-center'>
            {percentageSubscriberFeatures?.data?.PRODUCT?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.PRODUCT?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.PRODUCT?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.PRODUCT?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.PRODUCT?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.PRODUCT?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='fluent-mdl2:product-list' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Gestes <strong> {percentageSubscriberFeatures?.data?.WORK?.PERCENTAGE} % </strong>
            </Typography>
          </div>

          <div className='flex'>
            {percentageSubscriberFeatures?.data?.WORK?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.WORK?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.WORK?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.WORK?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.WORK?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.WORK?.PERCENTAGE
          }
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box component='span' sx={{ display: 'flex', color: 'text.secondary', mb: 2, justifyContent: 'space-between' }}>
          <div className='flex justify-center items-center'>
            <Icon icon='eos-icons:service' fontSize='20px' />
            <Typography sx={{ ml: 2 }} variant='body2'>
              Services <strong> {percentageSubscriberFeatures?.data?.WORK?.PERCENTAGE} % </strong>
            </Typography>
          </div>

          <div className='flex'>
            {percentageSubscriberFeatures?.data?.SERVICE?.pending !== 0 && !isPending && (
              <CustomChip
                skin='light'
                color={'warning'}
                sx={{
                  fontWeight: '600',
                  fontSize: '.75rem',
                  height: '26px'
                }}
                label={`En attente: ${percentageSubscriberFeatures?.data?.SERVICE?.pending}`}
              />
            )}
            <Typography sx={{ ml: 2 }} variant='body2' fontWeight={800}>
              {percentageSubscriberFeatures?.data?.SERVICE?.COUNT}
            </Typography>
          </div>
        </Box>

        <LinearProgress
          variant='determinate'
          color={percentageSubscriberFeatures?.data?.SERVICE?.PERCENTAGE >= 85 ? 'error' : 'primary'}
          value={
            percentageSubscriberFeatures?.data?.SERVICE?.PERCENTAGE > 100
              ? 100
              : percentageSubscriberFeatures?.data?.SERVICE?.PERCENTAGE
          }
        />
      </Box>

      <Dialog
        fullWidth
        scroll={'paper'}
        maxWidth='lg'
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onBackdropClick={() => setOpenDialog(false)}
      >
        <DialogContent>
          <IconButton
            size='small'
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <div className='mt-10'>
            <PendingFeatures />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        scroll={'paper'}
        maxWidth='sm'
        open={openDialogFeatures}
        onClose={() => setOpenDialogFeatures(false)}
        onBackdropClick={() => setOpenDialogFeatures(false)}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 8 }, py: { xs: 8, sm: 8 }, position: 'relative' }}>
          <div className='flex items-center justify-between '>
            <Typography variant='h6' color={'primary'}>
              Choisissez parmi ces fonctionnalités
            </Typography>
            <IconButton size='small' onClick={() => setOpenDialogFeatures(false)}>
              <Icon icon='mdi:close' />
            </IconButton>
          </div>

          <AddFeaturesSub setOpen={setOpenDialogFeatures} />
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default PercentageFeatures
