// ** React Imports
import { memo, useState, forwardRef } from 'react'

// ** MUI Imports

import CustomChip from 'src/@core/components/mui/chip'
import Divider from '@mui/material/Divider'
import { Menu, Box, Stack } from '@mui/material'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Components

// ** Data Import
import {
  Autocomplete,
  Button,
  MenuItem,
  TextField,
  Select,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import CustomDatePicker from './CustomDatePicker'

// ** renders client column

const SimpleCrudDataTable = memo(
  ({
    addNewLink,
    columns,
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    setSearch,
    resource,
    resource_name,
    enableFilter = false,
    filter,
    selection = false,
    addNew = true,
    generateResources = '',
    generate,
    handleChangeState,
    state,
    filterArray,
    isLoading,
    titleCrud,
    total,
    query,
    showFilter
  }) => {
    //**  definir function
    const auth = useAuth()
    const theme = useTheme()

    // const { direction } = settings

    // ** state
    const [selectedRows, setSelectedRows] = useState([])

    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')


    const sortedData = data || [] // Replace with your actual data array

    // ** function
    const handleRowSelect = rowId => {
      if (selectedRows.includes(rowId)) {
        // Row is already selected, so remove it
        setSelectedRows(selectedRows.filter(id => id !== rowId))
      } else {
        // Row is not selected, so add it
        setSelectedRows([...selectedRows, rowId])
      }
    }

    const handleSort = field => {
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortOrder('asc')
      }
    }

    if (sortField) {
      sortedData?.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : 1
        } else {
          return aValue > bValue ? -1 : 1
        }
      })
    }


    return (
      <>
        <Grid container>
   
        </Grid>
        {/* <Divider /> */}

        <div className='flex !h-full flex-col mt-3'>
          <div className='mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-1 align-middle md:px-4 '>
              <div className='overflow-hidden'>
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
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope='col'
                        className='px-4 py-1 font-semibold text-left cursor-pointer'
                        onClick={() => handleSort(column.field)}
                      >
                        <div className='inline-flex '>
                          <span style={{ fontSize: '13px', color: '#2a2e34' }}>{column.headerName}</span>
                          {/* Add sorting indicators here */}
                        </div>
                      </th>
                    ))}
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {sortedData?.map((item, rowIndex) => (
                      <tr key={rowIndex} className={`hover:bg-gray-200 hover:transition-colors transition-colors`}>
                        {((generate &&
                          selection &&
                          filterArray.every(filter => filter.state !== null) &&
                          auth?.user?.resources?.find(item => item.resource_name === `create ${generateResources}`)
                            ?.authorized) ||
                          (selection && resource == 'invoices')) && (
                          <td className={`text-base whitespace-nowrap py-1  text-left px-4 text-gray-700 truncate`}>
                            <div className='inline-flex items-center'>
                              <label
                                className='relative flex items-center p-3 rounded-full cursor-pointer'
                                htmlFor='checkbox-8'
                                data-ripple-dark='true'
                              >
                                <input
                                  type='checkbox'
                                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-2 border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                  id='checkbox-8'
                                  onChange={() => handleRowSelect(item.id)}
                                  checked={selectedRows.includes(item.id)}
                                />

                                <div
                                  className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'

                                  // onClick={() => handleCopy(item[column.field])}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-3.5 w-3.5 cursor-pointer'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    strokeWidth='1'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    ></path>
                                  </svg>
                                </div>
                              </label>
                            </div>
                          </td>
                        )}
                        {columns?.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className={`text-base whitespace-nowrap py-1 text-left px-4  !text-[#2a2e34] max-w-[${
                              column.flex * 100
                            }%] truncate `}
                          >
                            {column.renderCell ? column.renderCell({ row: item }) : item[column.field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {
                  isLoading ? (
                    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                      <CircularProgress sx={{ mb: 4 }} />
                      <Typography>Chargement...</Typography>
                    </Box>
                  ) : sortedData?.length < 1 ? (
                    <div className='flex w-full h-64 place-content-center'>
                      <div className='self-center'>
                        <div>Pas de données</div>
                      </div>
                    </div>
                  ) : null

                  // <div
                  //   style={
                  //     {
                  //       // backgroundColor: 'rgb(245, 245, 247)'
                  //     }
                  //   }
                  //   className='flex w-full py-4 h-72 place-content-center'
                  // >
                  //   <div role='status' className='w-[90%] animate-pulse'>
                  //     <div className='w-full h-4 my-8 bg-gray-200 rounded-full'></div>
                  //     <div className='h-4 my-8 bg-gray-200 rounded-full'></div>
                  //     <div className='h-4 my-8 bg-gray-200 rounded-full'></div>
                  //     <div className='h-4 my-8 bg-gray-200 rounded-full'></div>
                  //     <div className='h-4 my-8 bg-gray-200 rounded-full'></div>
                  //   </div>
                  // </div>
                }
              </div>
            </div>
          </div>
        </div>
        {/* Pagination */}

        {/* <CardActions>
          <div
            style={{ borderTop: '1px solid #e5e7eb' }}
            className='w-full gap-4 sm:flex sm:items-center sm:justify-end'
          >
            <div className='flex items-center gap-2 text-base text-gray-400'>
              <span style={{ fontSize: '13px' }} className='ml-4 text-gray-400'>
                Lignes par page :{' '}
              </span>
              <Select
                className='flex !h-6 w-16 !text-sm '
                endAdornment={<IconButton icon='mdi:plus' />}
                value={pageSize}
                onChange={e => handleChange(e)}
              >
                <MenuItem style={{ fontSize: '12px' }} value={25}>
                  25
                </MenuItem>
                <MenuItem style={{ fontSize: '12px' }} value={50}>
                  50
                </MenuItem>
                <MenuItem style={{ fontSize: '12px' }} value={100}>
                  100
                </MenuItem>
                <MenuItem style={{ fontSize: '12px' }} value={250}>
                  250
                </MenuItem>
                <MenuItem style={{ fontSize: '12px' }} value={1000}>
                  1000
                </MenuItem>
              </Select>
            </div>
            <div>
              <span className='flex gap-1 !text-gray-400' style={{ fontSize: '13px' }}>
                {query?.per_page && page ? query?.per_page * page - query?.per_page + 1 : 0}-
                {page == query?.last_page && query?.per_page
                  ? total
                    ? total
                    : 1
                  : query?.per_page && page
                  ? query?.per_page * page
                  : 1}
                <div>sur</div> {total ? total : 1}
              </span>
            </div>
            <div className='flex items-center p-1 sm:mt-0'>
              <IconButton
                disabled={page > 1 ? false : true}
                onClick={e => {
                  setPage(page - 1)
                }}
              >
                <IconifyIcon fontSize='17px' icon='mingcute:left-line' />
              </IconButton>
              <IconButton
                disabled={page < query?.last_page ? false : true}
                onClick={e => {
                  setPage(page + 1)
                }}
              >
                <IconifyIcon fontSize='17px' icon='mingcute:right-line' />
              </IconButton>
            </div>
          </div>
        </CardActions> */}
      </>
    )
  }
)

export default SimpleCrudDataTable
