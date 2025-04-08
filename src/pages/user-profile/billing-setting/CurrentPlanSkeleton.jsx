import React from 'react'
import { Box, Divider, Grid, Skeleton } from '@mui/material'

const CurrentPlanSkeleton = () => {
  return (
    <Grid item xs={12} md={8}>
      <Box sx={{ mb: 6 }}>
        <div className='flex items-center mb-2'>
          <Skeleton variant='rounded' width={250} height={30} />
        </div>
        <Skeleton variant='rounded' width={350} height={30} />{' '}
      </Box>
      <Box sx={{ mb: 6 }}>
        <Skeleton variant='rounded' width={250} height={30} />
      </Box>
      <Box sx={{ mb: 6 }}>
        <Skeleton variant='rounded' width={250} height={30} />
        <div className='mt-4'>
          <Skeleton variant='rounded' width={500} height={30} />{' '}
        </div>
      </Box>
      <div>
        <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
          <Skeleton variant='rounded' width={170} height={50} />
        </Box>
        {/* <Typography sx={{ color: 'text.secondary' }}>Standard plan for small to medium businesses</Typography> */}
      </div>
    </Grid>
  )
}

export default CurrentPlanSkeleton
