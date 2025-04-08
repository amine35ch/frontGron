import React from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import { Grid, Typography } from '@mui/material'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const DetailsMenageProject = ({ detailsProject }) => {
  const { user } = useAuth()

  return (
    <CustomAccordian titleAccordian={'Détails Ménage'}>
      <Grid container spacing={6}>
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
                {user?.profile === 'AUD' ? (
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
                ) : null}
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
                      Adresse:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.address}</TableCell>
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
                      N° :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.house_number}</TableCell>
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
                      Voie :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.street}</TableCell>
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
                      Ville :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.city}</TableCell>
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
                      Bâtiment:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.batiment}</TableCell>
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
                      Étage :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.floor}</TableCell>
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
                      Escalier :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.stairs}</TableCell>
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
                      Porte(s):
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.door}</TableCell>
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
                      Année de construction du logement :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.logement_date_creation}</TableCell>{' '}
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
                      Commune :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.common}</TableCell>
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
                      Logement à améliorer :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.natureResidence?.entitled}</TableCell>
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
                      Travaux souhaités :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.workType?.entitled}</TableCell>
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
                      Nombre total d’occupants :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.total_number_occupants}</TableCell>
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
                      Surafce à isoler:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.isolated_surface_value}</TableCell>{' '}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </CustomAccordian>
  )
}

export default DetailsMenageProject
