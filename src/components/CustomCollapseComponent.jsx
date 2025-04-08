import React, { useState } from 'react'
import { Tooltip, IconButton, Grid, Collapse, CardContent, Typography, Button } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Icon from 'src/@core/components/icon'
import CustomModal from './CustomModal'

import CardDetailsProject from 'src/views/components/Cards/CardDetailsProject'
import moment from 'moment'
import { useTheme } from '@emotion/react'
import { useRouter } from 'next/router'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}

const CustomCollapseComponent = ({ titleCollapse, background, backgroundHex, projects }) => {
  const [expanded, setExpanded] = React.useState(true)
  const [projectItem, setprojectItem] = useState(null)
  const [openModal, setopenModal] = useState(false)
  const theme = useTheme()
  const router = useRouter()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleOpenModalDetails = project => {
    setopenModal(true)
    setprojectItem(project)
  }

  const handleCloseModalDetails = () => {
    setopenModal(false)
  }

  return (
    <>
      <Grid container spacing={2} className='mb-1'>
        <Grid item xs={12} className='flex items-center'>
          <Button expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
            {expanded ? (
              <IconifyIcon icon='teenyicons:down-solid' color='#A3A3A3' fontSize={'14px'} />
            ) : (
              <IconifyIcon icon='teenyicons:right-solid' color='#A3A3A3' fontSize={'14px'} />
            )}
          </Button>
          <div className={`flex items-center h-[27px] w-[105px]  rounded-md p-1 ${background} text-white`}>
            <IconifyIcon icon='carbon:circle-filled' fontSize={'14px'} />
            <Typography className={` !text-white !ml-2 !font-semibold `} fontSize={13}>
              {titleCollapse}
            </Typography>
          </div>
          <Typography style={{ fontSize: '12px' }} className={` !ml-2  !font-semibold`}>
            ({projects?.count})
          </Typography>
        </Grid>
      </Grid>

      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent sx={{ pt: 1, mt: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{}} size='small' aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ fontSize: '10px', p: 0 }}>
                    <Typography
                      color={theme.palette.primary.dark}
                      sx={{ fontSize: '13px', fontWeight: '600' }}
                      variant='body2'
                    >
                      Référence
                    </Typography>
                  </TableCell>
                  <TableCell align='center' sx={{ fontSize: '10px', p: 0 }}>
                    <Typography
                      color={theme.palette.primary.dark}
                      sx={{ fontSize: '13px', fontWeight: '600' }}
                      variant='body2'
                    >
                      Bénéficiare
                    </Typography>
                  </TableCell>
                  <TableCell align='center' sx={{ fontSize: '10px', p: 0 }}>
                    <Typography
                      color={theme.palette.primary.dark}
                      sx={{ fontSize: '13px', fontWeight: '600' }}
                      variant='body2'
                    >
                      Date de création
                    </Typography>
                  </TableCell>
                  <TableCell align='center' width={30} sx={{ p: 0 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects?.data?.map(project => (
                  <TableRow key={project.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ ml: 2 }} component='th' scope='row'>
                      <div className='flex items-center'>
                        <IconifyIcon icon='carbon:circle-filled' color={backgroundHex} fontSize={'14px'} />

                        <Typography sx={{ fontSize: '14px', fontWeight: '600' }} variant='body2'>
                          {project?.reference}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell align='center'>{project?.client}</TableCell>
                    <TableCell align='center'> {moment(project?.created_at).format('DD-MM-YYYY')}</TableCell>
                    <TableCell align='center'>
                      <Tooltip title='Voir' onClick={() => router.push(`/projects/${project?.id}/edit/`)}>
                        <IconButton size='small' sx={{ mr: 0.5 }}>
                          <Icon icon='mdi:eye-outline' fontSize='20px' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>

      <CustomModal
        open={openModal}
        handleCloseOpen={() => handleCloseModalDetails()}
        ModalTitle={'Détails Projet'}
        widthModal={'md'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
      >
        <CardDetailsProject project={projectItem} viewDetailsProject={true} />
      </CustomModal>
    </>
  )
}

export default CustomCollapseComponent
