import React from 'react'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import { Box } from '@mui/material'

const DevisTravauxLoadingSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Skeleton variant='rectangular' width='100%' height={118} />
      </Grid>
      <Grid item xs={12} md={2.5}>
        <Skeleton variant='rectangular' width='100%' height={150} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Skeleton variant='rectangular' width='100%' height={300} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Skeleton variant='rectangular' width='100%' height={100} />
      </Grid>
      <Grid item xs={12} md={12} display='flex' justifyContent='flex-end'>
        <Skeleton variant='rectangular' width={120} height={40} />
      </Grid>
      <Grid item xs={12} md={12} display='flex' justifyContent='space-between'>
        <Skeleton variant='rectangular' width={120} height={40} />
        <Skeleton variant='rectangular' width={120} height={40} />
      </Grid>
    </Grid>
  )
}

export default DevisTravauxLoadingSkeleton
