import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import BackgroundLetterAvatars from 'src/components/LetterAvatar'

const CardDetails = ({ dataDetails }) => {
  return (
    <Card className='h-full'>
      <CardContent>
        <div className='flex ml-6'>
          <div className='flex mt-2'>
            <BackgroundLetterAvatars nameProps={'Rahma doss'} />
            <div
              style={{
                backgroundColor: '#1ad67b',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                marginLeft: '-5px'
              }}
            ></div>
          </div>

          {/* <div className='ml-4' style={{ lineHeight: '10px' }}>
            <div className='flex '>
              <Typography sx={{ fontSize: '17px', color: '#2a2e34' }} className='capitalize !font-semibold '>
                {' '}
                {dataDetails?.first_name}{' '}
              </Typography>
              <Typography sx={{ fontSize: '17px', color: '#2a2e34' }} className='capitalize !font-semibold '>
                {' '}
                &nbsp;{dataDetails?.last_name}{' '}
              </Typography>
            </div>
            {dataDetails?.role && (
              <Typography sx={{ fontSize: '14px', color: '#2a2e34' }} className='!ml-1'>
                {dataDetails?.role}
              </Typography>
            )}
          </div> */}
        </div>
        <div className='mt-8'>
          {dataDetails?.email && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Email (1):
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.email}
              </Typography>
            </div>
          )}

          {dataDetails?.city && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Ville:
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.city}
              </Typography>
            </div>
          )}
          {dataDetails?.address && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Adresse:
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.address}
              </Typography>
            </div>
          )}
          {dataDetails?.zip_code && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Code postal:
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.zip_code}
              </Typography>
            </div>
          )}
          {dataDetails?.phone_number_1 && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Numéro de téléphone (1):
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.phone_number_1}
              </Typography>
            </div>
          )}
          {dataDetails?.phone_number_2 && (
            <div className='flex mt-2'>
              <Typography className='!font-semibold ' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                Numéro de téléphone (2):
              </Typography>
              <Typography className='!font-medium !ml-2 capita ' sx={{ fontSize: '15px' }}>
                {dataDetails?.phone_number_2}
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CardDetails
