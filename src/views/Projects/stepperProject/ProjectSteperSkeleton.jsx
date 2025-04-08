import { Box, Divider, Grid, Skeleton } from '@mui/material'

const ProjectSteperSkeleton = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        display: 'flex',
        minHeight: '95vh'
      }}
    >
      <Grid container p={5} spacing={5}>
        <Grid item xs={12} md={2}>
          <Skeleton variant='rounded' width={150} height={30} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant='rounded' height={70} />
        </Grid>
        <Grid item xs={12} md={2} display={'flex'} justifyContent={'flex-end'}>
          <Skeleton variant='rounded' width={150} height={30} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={12}>
          <Skeleton variant='rounded' height={300} />
        </Grid>
        <Grid item xs={12} md={12}>
          <Skeleton variant='rounded' height={200} />
        </Grid>
        <Grid item xs={12} md={2}>
          <Skeleton variant='rounded' width={150} height={30} />
        </Grid>
        <Grid item xs={12} md={8}></Grid>
        <Grid item xs={12} md={2} display={'flex'} justifyContent={'flex-end'}>
          <Skeleton variant='rounded' width={150} height={30} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProjectSteperSkeleton
