import React from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import { Grid, Typography } from '@mui/material'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'

const DetailsClientProject = ({ detailsProject }) => {
  return (
    <CustomAccordian titleAccordian={'Détails Client'}>
      <Grid container spacing={6}>
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
                      Référence :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.reference}</TableCell>
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
                      Nom et Prénom:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {detailsProject?.client?.last_name} {detailsProject?.client?.first_name}
                  </TableCell>
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
                      Ville:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.city}</TableCell>
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
                      Adresse:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.address}</TableCell>
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
                      Code postal:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.zip_code}</TableCell>
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
                      Classe de revenu:
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.income_class_details}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='!w-[27%]'>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        lineHeight: '22px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Numéro de téléphone (1) :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.phone_number_1}</TableCell>
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
                      Portable :
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.phone_number_2}</TableCell>
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
                      Email (1):
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.email_contact}</TableCell>
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
                      Email (2):
                    </Typography>
                  </TableCell>
                  <TableCell>{detailsProject?.client?.email_contact_two}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </CustomAccordian>
  )
}

export default DetailsClientProject
