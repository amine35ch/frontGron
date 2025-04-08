import React from 'react'

import CustomAccordian from 'src/components/CustomAccordian'
import { Divider, Grid, Typography } from '@mui/material'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import moment from 'moment'

const DetailsFolder = ({ detailsProject }) => {

  return (
    <CustomAccordian titleAccordian={'Détails Dossier'}>
      <Grid mt={4} container spacing={6}>
        <Grid item xs={12} lg={6}>
          <TableContainer>
            <Table size='small' sx={{ width: '95%' }}>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    border: 0,
                    pt: 2,
                    pb: 2,
                    pl: '0 !important',
                    pr: '0 !important',
                    '&:first-of-type': {
                      width: 148
                    }
                  }
                }}
              >
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      N° Dossier Annah :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.anah_folder?.anah_folder}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Référence :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.reference}</TableCell>
                </TableRow>

                {detailsProject?.step && (
                  <TableRow>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          lineHeight: '22px',
                          letterSpacing: '0.1px'
                        }}
                      >
                        Étape actuelle :
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TableCell>{detailsProject?.step?.display_name}</TableCell>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Source:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.type_demande_project}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Classe Énergétique :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.project_energy_class}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='!w-[25%]'>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Classe du revenue :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.income_class_details}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={6}>
          <TableContainer>
            <Table size='small'>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    border: 0,
                    pt: 2,
                    pb: 2,
                    pl: '0 !important',
                    pr: '0 !important',
                    '&:first-of-type': {
                      width: 148
                    }
                  }
                }}
              >
                <TableRow>
                  <TableCell className='!w-[25%]'>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Sauts de classe prévu:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.class_skip_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='!w-[25%]'>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Résidence:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.project_residence?.entitled}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Scénario:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.scenario}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Entreprise retenue:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.installer?.trade_name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Auditeur:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.auditor?.trade_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Divider />
      <Grid mt={4} container>
        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
          <Typography>Créer Par: </Typography>
          <Typography color={'primary'} fontWeight={'700'}>
            &nbsp; {detailsProject?.company_creator}
          </Typography>
          <Typography>, &nbsp;le: {moment(detailsProject?.created_at).format('DD/MM/YYYY')} </Typography>

        </Grid>
      </Grid>
    </CustomAccordian>
  )
}

export default DetailsFolder
