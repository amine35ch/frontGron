import { useEffect, useState } from 'react'
import CustomeCurrencyDisplay from 'src/components/CustomeCurrencyDisplay'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { useGetListScenario } from 'src/services/scenario.service'

const {
  Grid,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TextField,
  Paper,
  Typography
} = require('@mui/material')
const { default: CustomeAutoCompleteSelect } = require('src/components/CustomeAutoCompleteSelect')
const { default: CustomTableCell } = require('src/components/CustomeTableCell')
const { default: CustomeTableRow } = require('src/components/CustomeTableRow')

const OperationsForm = ({ detailsProject }) => {
  const [scenario, setScenario] = useState(null)

  const [operationList, setOperationList] = useState([])

  const {
    data: scenarioList,
    isSuccess: scenarioListIsSuccess,
    isLoading: scenarioListIsLoading
  } = useGetListScenario({ paginated: false })

  const handleScenarioChange = value => {
    const scenario = scenarioList?.find(item => item?.reference === value)
    setOperationList(scenario?.list_operations || [])

    setScenario(value)
  }

  useEffect(() => {
    setScenario(detailsProject?.scenario)

    setOperationList(detailsProject?.operations)
  }, [])

  const handleRowValueChange = (event, type) => {
    const { value } = event.target

    const newOperationList = operationList?.map(item => {
      if (item?.operation?.type === type) {
        let price = 0
        item?.operation?.pricing_list.forEach(element => {
          // string to js code
          const condition = element.condition.replace(/(>=|<=|<|>)/g, ' $1 ')
          try {
            if (eval(detailsProject?.surface_housing_before_work + condition)) price = element.price_unit_ht
          } catch (error) {}
        })

        return {
          ...item,
          value,
          cost_ht: value * price
        }
      } else {
        return item
      }
    })
    setOperationList(newOperationList)
  }

  const columns = [
    {
      id: 'parois',
      label: 'Operation',
      minWidth: 170,
      renderCell: params => {
        // display the operation name

        return (
          <Typography sx={{ color: 'black', fontSize: '14px', fontWeight: '500' }} variant='body2'>
            {params?.operation?.reference}
          </Typography>
        )
      }
    },
    {
      id: 'surface',
      label: 'Valeur',
      minWidth: 100,
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            <TextField
              value={params?.value}
              variant='outlined'
              size='small'
              onChange={event => handleRowValueChange(event, params?.operation?.type)}
              placeholder='M²'
              sx={{ fontSize: '10px !important', width: '100px' }}
            />
          </div>
        )
      }
    },
    {
      id: 'surface',
      label: 'Montant HT',
      minWidth: 100,
      renderCell: params => {
        return <CustomCurrencyInput displayType='text' disabled={true} value={params?.cost_ht} fullWidth size='small' />
      }
    }
  ]

  return (
    <Grid
      container
      spacing={5}
      sx={{
        p: 5
      }}
    >
      <Grid item xs={12} sm={12} className='flex justify-end'>
        <div className='w-1/4'>
          <CustomeAutoCompleteSelect
            data={scenarioList}
            value={scenario}
            onChange={handleScenarioChange}
            error={false}
            helperText={false}
            option='reference'
            displayOption='entitled'
            label='Scénario'
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Table>
          <TableHead>
            <CustomeTableRow>
              {columns.map(column => (
                <CustomTableCell variant='head' align='center' key={column.id} column={column} />
              ))}
            </CustomeTableRow>
          </TableHead>
          <TableBody>
            {operationList.map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column?.id]
                    if (column?.renderCell) {
                      return (
                        <CustomTableCell column={column} key={column.id} align='center'>
                          {column?.renderCell(row)}
                        </CustomTableCell>
                      )
                    } else {
                      return (
                        <CustomTableCell column={column} key={column.id} align='center'>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </CustomTableCell>
                      )
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default OperationsForm
