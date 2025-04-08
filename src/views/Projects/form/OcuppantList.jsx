import { IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'

const OcuppantTable = ({ occuppants, setOccuppants, formErrors }) => {
  return (
    <div className='w-full p-2 m-2 table-responsive'>
      <table className='table w-full'>
        <thead>
          <tr>
            <th className='w-1/4'>
              <Typography sx={{ fontWeight: 'bold' }} color={'primary.dark'}>
                Civilité
              </Typography>
            </th>
            <th className='w-1/4'>
              <Typography sx={{ fontWeight: 'bold' }} color={'primary.dark'}>
                Prénom
              </Typography>
            </th>
            <th className='w-1/4'>
              <Typography sx={{ fontWeight: 'bold' }} color={'primary.dark'}>
                Nom
              </Typography>
            </th>
            <th className='w-1/4'>
              <Typography sx={{ fontWeight: 'bold' }} color={'primary.dark'}>
                Année de naissance
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {occuppants.map((ocuppant, index) => {
            if (typeof ocuppant?.civility !== 'number') {
              if (ocuppant?.civility === 'Monsieur') {
                ocuppant.civility = 0
              }
              if (ocuppant?.civility === 'Madame') {
                ocuppant.civility = 1
              }
            }

            return (
              <tr key={index}>
                <td className='text-center '>
                  <CustomeAutoCompleteSelect
                    option={'type'}
                    value={ocuppant.civility}
                    onChange={value => {
                      setOccuppants(prev => {
                        const newOcuppants = [...prev]
                        newOcuppants[index].civility = value

                        return newOcuppants
                      })
                    }}
                    data={[
                      { type: 0, entitled: 'M.' },
                      { type: 1, entitled: 'Mme' }
                    ]}
                    displayOption={'entitled'}
                    error={formErrors?.[`occupants.${index}.civility`]}
                    helperText={renderArrayMultiline(formErrors?.[`occupants.${index}.civility`])}
                  />
                </td>
                <td className='text-center '>
                  <TextField
                    type='text'
                    variant='outlined'
                    size='small'
                    className='form-control'
                    value={ocuppant.first_name}
                    onChange={event => {
                      const { value } = event.target
                      setOccuppants(prev => {
                        const newOcuppants = [...prev]
                        newOcuppants[index].first_name = value

                        return newOcuppants
                      })
                    }}
                    error={formErrors?.[`occupants.${index}.first_name`]}
                    helperText={renderArrayMultiline(formErrors?.[`occupants.${index}.first_name`])}
                  />
                </td>
                <td className='text-center '>
                  <TextField
                    type='text'
                    variant='outlined'
                    size='small'
                    className='form-control'
                    value={ocuppant.last_name}
                    onChange={event => {
                      const { value } = event.target
                      setOccuppants(prev => {
                        const newOcuppants = [...prev]
                        newOcuppants[index].last_name = value

                        return newOcuppants
                      })
                    }}
                    error={formErrors?.[`occupants.${index}.last_name`]}
                    helperText={renderArrayMultiline(formErrors?.[`occupants.${index}.last_name`])}
                  />
                </td>
                <td className='text-center '>
                  <TextField
                    type='number'
                    variant='outlined'
                    size='small'
                    className='form-control'
                    value={ocuppant.year_of_birth}
                    onChange={event => {
                      const { value } = event.target
                      setOccuppants(prev => {
                        const newOcuppants = [...prev]
                        newOcuppants[index].year_of_birth = value

                        return newOcuppants
                      })
                    }}
                    error={formErrors?.[`occupants.${index}.year_of_birth`]}
                    helperText={renderArrayMultiline(formErrors?.[`occupants.${index}.year_of_birth`])}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default OcuppantTable
