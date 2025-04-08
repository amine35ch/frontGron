import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, Grid, FormGroup, FormControlLabel, TextField, Button, IconButton } from '@mui/material'
import CustomAccordian from 'src/components/CustomAccordian'
import { LoadingButton } from '@mui/lab'
import { useUpdateModalityRestMutation } from 'src/services/project.service'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'

const LigneTypeTable = ({ idProject, detailsProject, redirect, getDetailsIsSuccess }) => {
  const router = useRouter()

  const [rows, setRows] = useState([
    { entitled: `Eco Prêt à taux zéro au sens de l'arrêté du 30 mars 2009`, type: 'checkbox', reponse: false },
    {
      entitled: `2009 Prêt avance rénovation au sens du décret n 2021-1700 du 17 décembre 2021relatif aux modalités d'intervention du fonds de garantie pour la rénovation énergétique, à l'amortissement des prêts avance mutation et au taux annuel effectif global applicable au prêt viager hypothécaire`,
      type: 'checkbox',
      reponse: false
    },
    { entitled: `Autres`, type: 'text', reponse: '' }
  ])
  const updateModalityRest = useUpdateModalityRestMutation({ id: idProject })

  const handleCheckboxChange = index => event => {
    const newRows = [...rows]
    newRows[index].reponse = event.target.checked
    setRows(newRows)
  }

  // Handler for text input change
  const handleTextChange = index => event => {
    const newRows = [...rows]
    newRows[index].reponse = event.target.value
    setRows(newRows)
  }

  const handleSubmit = async () => {
    try {
      await updateModalityRest.mutateAsync({
        eco_loan_stopped_thirty_mars: rows[0]?.reponse,
        renovation_advance_loan_seventeen_december: rows[1]?.reponse,
        other_description_of_remainder_payable: rows[2]?.reponse
      })
      redirect && router.push(`/projects/${idProject}/edit`)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (getDetailsIsSuccess) {
      setRows([
        { ...rows[0], reponse: detailsProject?.eco_loan_stopped_thirty_mars ? true : false },
        { ...rows[1], reponse: detailsProject?.renovation_advance_loan_seventeen_december ? true : false },
        { ...rows[2], reponse: detailsProject?.other_description_of_remainder_payable }
      ])
    }
  }, [getDetailsIsSuccess])

  return (
    <>
      <CustomAccordian
        titleAccordian={
          'Demande de dérogation aux critères de résistance thermique, de coefficient de transmission thermique ou de facteur de transmission solaire'
        }
      >
        <Grid pt={5} container spacing={2}></Grid>
        <div className='my-2 overflow-x-auto sm:-mx-0 !lg:-mx-8'>
          <div className='inline-block min-w-full py-1 align-middle '>
            <div className='overflow-hidden !border !border-gray-200 rounded-lg'>
              <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                <tbody className='divide-y divide-gray-200'>
                  {rows?.map((row, index) => (
                    <tr key={index} className={``}>
                      <td style={{ borderRight: '1px solid   #e5e7eb ', width: '70%' }} className={`!p-2 !ml-2`}>
                        <Typography className='!font-semibold ml-2 ' sx={{ fontSize: '14px' }}>
                          {row?.entitled}
                        </Typography>
                      </td>
                      {row?.type === 'text' ? (
                        <td style={{ width: '40% !importnat' }} className={`text-semiBold !p-2  !ml-2`}>
                          <input
                            placeholder='...'
                            className='w-full h-full !border-none outline-none pl-3'
                            type='text'
                            value={row?.reponse}
                            onChange={handleTextChange(index)}
                          />
                        </td>
                      ) : (
                        <td style={{ width: '40% !importnat' }} className={`text-semiBold  !p-2  !ml-2`}>
                          <div style={{ display: 'flex' }}>
                            <FormControlLabel
                              value={true}
                              onChange={handleCheckboxChange(index)}
                              control={<Checkbox checked={row?.reponse == true ? true : false} />}
                              label='Oui'
                            />
                            <FormControlLabel
                              required
                              value={false}
                              onChange={handleCheckboxChange(index)}
                              control={<Checkbox checked={row?.reponse == false ? true : false} />}
                              label='Non'
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Grid mt={5} container>
          <Grid item md={12} sx={12} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton loading={updateModalityRest.isLoading} variant='outlined' onClick={handleSubmit}>
              Enregistrer
            </LoadingButton>
          </Grid>
        </Grid>
      </CustomAccordian>
    </>
  )
}

export default LigneTypeTable
