import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, Grid, Card, TextField, Button, IconButton } from '@mui/material'
import CustomAccordian from 'src/components/CustomAccordian'
import { LoadingButton } from '@mui/lab'
import { useAddParoiMotifMutation } from 'src/services/project.service'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { CustomInput } from 'src/components/CustomeCurrencyInput'

function LigneTypeTableWithDynamicLigne({
  criteria,
  setCriteria,
  idProject,
  detailsProject,
  redirect,
  getDetailsIsSuccess
}) {
  const [rows, setRows] = useState([])
  const [marque, setMarque] = useState('')
  const [cost, setCost] = useState('')

  // ** React query

  const handleAddRow = () => {
    if (marque && cost) {
      const newRow = { paroi: marque, motif: cost }
      setCriteria([...criteria, newRow])
      setMarque('')
      setCost('')
    }
  }

  const handleRemoveRow = index => {
    const newRows = criteria.filter((row, i) => i !== index)
    setCriteria(newRows)
  }

  const handleChangeRow = (key, value, index) => {
    const newRows = criteria.map((row, i) => {
      if (i === index) {
        return { ...row, [key]: value }
      }

      return row
    })
    setCriteria(newRows)
  }

  useEffect(() => {
    if (getDetailsIsSuccess) {
      const localRows = detailsProject?.derogation_request_criteria

      setCriteria(localRows || [])
    }
  }, [getDetailsIsSuccess])

  return (
    <>
      <CustomAccordian
        titleAccordian={
          'Demande de dérogation aux critères de résistance thermique, de coefficient de transmission thermique ou de facteur de transmission solaire'
        }
      >
        <Grid pt={5} container spacing={2}>
          <Grid item xs={12} md={3} className='!mb-2 !mt-2 !pt-0'>
            <TextField
              placeholder='Paroi opaque ou vitrée concernée'
              size='small'
              variant='outlined'
              className='w-full '
              value={marque}
              onChange={e => {
                setMarque(e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
            />
          </Grid>
          <Grid item xs={12} md={3} className='!mb-2 !mt-2 !pt-0'>
            <TextField
              placeholder='Motif'
              size='small'
              variant='outlined'
              className='w-full '
              value={cost}
              onChange={e => {
                setCost(e.target.value)
              }}
              sx={{ fontSize: '10px !important' }}
            />
          </Grid>

          <Grid item xs={12} md={6} className='flex justify-end'>
            <Button
              variant='contained'
              aria-label='add'
              onClick={() => handleAddRow()}
              className='h-[29px] w-[105px]'
              sx={{ fontSize: '12px' }}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
        <div className='my-2 overflow-x-auto sm:-mx-0 !lg:-mx-8'>
          <div className='inline-block min-w-full py-1 align-middle '>
            <div className='overflow-hidden !border !border-gray-200 rounded-lg'>
              <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                <thead
                  style={{
                    backgroundColor: 'rgb(245, 245, 247)',
                    borderBottom: '1px solid rgb(233, 233, 236)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    lineHeight: '24px !important'
                  }}
                  className='text-gray-900 bg-red-400 rounded-xl'
                >
                  <th scope='col' className='px-4 py-1 font-semibold text-center cursor-pointer'>
                    <div className='inline-flex '>
                      <span style={{ fontSize: '13px', color: '#4c4e64de' }}>Paroi opaque ou vitrée concernée</span>
                    </div>
                  </th>
                  <th scope='col' className='px-4 py-1 font-semibold text-center cursor-pointer'>
                    <div className='inline-flex '>
                      <span style={{ fontSize: '13px', color: '#4c4e64de' }}>Motif</span>
                    </div>
                  </th>
                  <th scope='col' className='px-4 py-1 font-semibold text-center cursor-pointer'>
                    <div className='inline-flex '></div>
                  </th>
                </thead>

                <tbody className='divide-y divide-gray-200'>
                  {criteria?.map((row, index) => (
                    <tr key={index} className={``}>
                      <td
                        style={{
                          borderLeft: '1px solid #e5e7eb'
                        }}
                        className={`text-semiBold  !p-2  text-center   !ml-2`}
                      >
                        <CustomInput
                          value={row.paroi}
                          size='small'
                          variant='standard'
                          onChange={event => handleChangeRow('paroi', event?.target?.value, index)}
                          placeholder='paroi'
                          sx={{
                            fontSize: '10px !important',
                            '& .MuiOutlinedInput-input': {
                              width: '100px'
                            }
                          }}
                        />
                        {/* <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          {row.paroi}
                        </Typography> */}
                      </td>
                      <td className={`text-semiBold  !p-2  text-center   !ml-2`}>
                        <CustomInput
                          value={row.motif}
                          size='small'
                          variant='standard'
                          onChange={event => handleChangeRow('motif', event?.target?.value, index)}
                          placeholder='motif'
                          sx={{
                            fontSize: '10px !important',
                            '& .MuiOutlinedInput-input': {
                              width: '100px'
                            }
                          }}
                        />
                        {/* <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          {row.motif}
                        </Typography> */}
                      </td>
                      <td className={`text-semiBold  !p-2 text-center  !ml-2`}>
                        <IconButton>
                          <IconifyIcon
                            onClick={() => handleRemoveRow(index)}
                            fontSize='20px'
                            icon='mdi:delete-outline'
                            color='red'
                          />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CustomAccordian>
    </>
  )
}

export default LigneTypeTableWithDynamicLigne
