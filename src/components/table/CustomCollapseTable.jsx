import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconifyIcon from 'src/@core/components/icon'
import CustomTableCellHeader from '../CustomTableCellHeader'
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import Link from 'next/link'
import CustomComponentDateRange from '../CustomComponentDateRange'
import { useAuth } from 'src/hooks/useAuth'

function Row(props) {
  const { row, columns, rowIndex, columnsWork, setrowTable, displayNameLines, custom, showTitleDetails } = props
  const [open, setOpen] = React.useState(false)

  const handleOpenRow = row => {
    setOpen(!open)

    setrowTable(row)
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {row?.[displayNameLines] && row?.[displayNameLines].length !== 0 && (
            <IconButton aria-label='expand row' size='small' onClick={() => handleOpenRow(row)}>
              {open ? (
                <IconifyIcon fontSize='20px' color='black' icon='mdi:chevron-up' />
              ) : (
                <IconifyIcon fontSize='20px' color='black' icon='mdi:chevron-down' />
              )}
            </IconButton>
          )}
        </TableCell>
        {columns.map((column, index) => (
          <TableCell {...column} sx={{ px: 0 }} key={index}>
            {column?.renderCell ? (
              column.renderCell({ row, index: rowIndex })
            ) : (
              <Typography> {row[column.field]}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
      {row?.[displayNameLines] && row?.[displayNameLines].length !== 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {showTitleDetails && (
                  <Typography color='primary.main' variant='h6' gutterBottom component='div'>
                    Détails
                  </Typography>
                )}
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      {columnsWork?.map((column, index) =>
                        custom ? (
                          <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                            {column?.label}
                          </CustomTableCellHeader>
                        ) : (
                          <TableCell
                            key={index}
                            scope='col'
                            align='center'
                            color='primary.dark'
                            className={`px-4 py-1 font-semibold  text-center cursor-pointer`}
                          >
                            <div className='inline-flex '>
                              <span style={{ fontSize: '14px', color: '#2a2e34', fontWeight: '600' }}>
                                {column.label}
                              </span>
                              {/* Add sorting indicators here */}
                            </div>
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.[displayNameLines]?.map((item, childrenIndex) => (
                      <TableRow key={childrenIndex}>
                        {columnsWork?.map((column, index) => (
                          <TableCell component='th' scope='row' {...column} key={index}>
                            {column?.renderCell ? (
                              column.renderCell({ item, index: childrenIndex, rowIndex: rowIndex, row })
                            ) : (
                              <Typography> {row[column.field]}</Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired
  }).isRequired
}

export default function CustomCollapsibleTable({
  data,
  columns,
  columnsWork,
  setrowTable,
  displayNameLines,
  custom,
  isLoading,
  showTitleDetails,
  showFilter,
  exportList,
  addNew,
  titleCrud,
  resource_name,
  total,
  showAllSection,
  showAll,
  state,
  filterArray,
  setSearch,
  showHeader,
  resource,
  setState,
  page,
  pageSize,
  setPage,
  setPageSize,
  query
}) {
  const auth = useAuth()
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)
  const authorizedList = listPermissions?.permissions.find(item => item.name == `create ${resource}`)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleChangeShowAll = checked => {
    setShowAll(checked)

    if (checked) {
      setState('')
    }
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleChange = event => {
    setPageSize(event.target.value)
  }

  return (
    <Card>
      <CardContent>
        {showHeader && (
          <>
            <Grid container>
              <Grid item={12} md={6}>
                <div>
                  <span className='font-semibold' style={{ fontSize: '17px' }}>
                    Liste des {titleCrud ? titleCrud : resource_name}
                  </span>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={total ? total : 0}
                    color={'primary'}
                    sx={{ height: 24, fontSize: '14px', fontWeight: 500, px: 2, marginLeft: '10px' }}
                  />
                </div>
              </Grid>
              <Grid item={12} md={6}>
                <div className='font-semibold text-gray-500'>
                  {addNew && authorizedList?.authorized && (
                    <div className='flex items-center justify-end'>
                      <Link href={`${addNewLink}`}>
                        <Button
                          variant='contained'
                          aria-label='add'
                          className='h-[29px] w-[105px]'
                          sx={{ fontSize: '12px' }}
                          startIcon={<IconifyIcon icon='mdi:plus' />}
                        >
                          Ajouter
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Divider />

            <Grid container className='items-center mb-1 '>
              <Grid item xs={12} md={6} display={'flex'}>
                {showFilter ? (
                  <button
                    variant='outlined'
                    size='small'
                    onClick={handleDropdownOpen}
                    className='flex cursor-pointer items-center justify-center !border !border-[#4c4e6438] !rounded-xl text-[13px]
                !text-[#4c4e64de] px-1 h-[26px] w-[70px]  '
                  >
                    <IconifyIcon className='mr-1 !font-bold' icon='ion:filter' color={'#4c4e64de'} fontSize='17px' />
                    Filter
                  </button>
                ) : null}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => handleDropdownClose()}
                  className='!!shadow-xl'
                  sx={{
                    '& .MuiMenu-paper': { width: '40rem', mt: 2, height: resource_name === 'logs' ? '350px' : 'auto' }
                  }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  {showAllSection && (
                    <Box className='px-5 py-2'>
                      <Grid container>
                        <Grid item xs={12} md={6} className='flex items-center'>
                          <Typography className='!mr-1 !font-semibold'>Voir tout </Typography>
                          <IconifyIcon icon='ph:info' fontSize='17px' />
                        </Grid>
                        <Grid item xs={12} md={6} className='flex justify-end'>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Typography fontSize={'13px'}>Non</Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  onChange={e => handleChangeShowAll(e.target.checked)}
                                  checked={showAll == '1' ? true : false}
                                  size='small'
                                />
                              }
                            />
                            <Typography fontSize={'13px'}>Oui</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  <Box className='px-5 py-2'>
                    <Grid container mb={2}>
                      <Grid item xs={12} md={6} className='flex items-center'>
                        <Typography className='!mr-1 !font-semibold'>Filter </Typography>
                        <IconifyIcon icon='ph:info' fontSize='17px' />
                      </Grid>
                    </Grid>

                    {filterArray?.length > 0 && (
                      <Grid
                        container
                        spacing={3}
                        className='py-1 px-3 bg-[#f7f8f9] rounded-lg !my-1'

                        // sx={{ height: resource_name === 'logs' ? '150px' : 'auto' }}
                      >
                        {filterArray?.map((filter, index) =>
                          filter?.type === 'date' ? (
                            <Grid item className='!p-1 ' display={'flex'} alignItems={'center'} xs={12} md={12}>
                              <CustomComponentDateRange
                                startDate={filter.startDateRange}
                                setStartDate={filter.setStartDateRange}
                                endDate={filter.endDateRange}
                                setEndDate={filter.setEndDateRange}
                              />
                              <IconButton title='Supprimer le filter' onClick={() => handeleRemoveFilter()}>
                                <IconifyIcon icon={'iconoir:cancel'} color='red' fontSize={'20px'} />
                              </IconButton>
                            </Grid>
                          ) : filter?.type === 'switch' ? (
                            <Grid item xs={12} md={6} className='flex justify-end'>
                              <Stack direction='row' spacing={1} alignItems='center'>
                                <Typography fontSize={'13px'}>{filter?.title}</Typography>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      onChange={e => filter?.setState(e.target.checked ? '1' : '0')}
                                      checked={filter?.state == 1}
                                      size='small'
                                    />
                                  }
                                />
                              </Stack>
                            </Grid>
                          ) : (
                            <Grid item className='!p-1 ' xs={12} md={6}>
                              <Autocomplete
                                ListboxProps={{ style: { maxHeight: '150px' } }}
                                size='small'
                                sx={{ backgroundColor: 'white' }}
                                value={filter?.data?.find(item => item[filter?.option] === filter?.value) || null}
                                onChange={(event, newValue) => {
                                  if (newValue) {
                                    filter?.setState(newValue[filter.option])
                                  } else {
                                    filter?.setState(setState ? setState : '')
                                  }
                                }}
                                options={filter?.data || []}
                                getOptionLabel={option => option[filter?.displayOption]}
                                renderInput={params => (
                                  <TextField {...params} variant='outlined' className='w-full' label={filter?.title} />
                                )}
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    )}
                  </Box>
                </Menu>
                {exportList && (
                  <IconButton sx={{ padding: '0', marginLeft: '12px' }} onClick={() => functionExportList()}>
                    <Icon icon='ic:twotone-cloud-download' color='#1E61B6' fontSize={24} />
                  </IconButton>
                )}
              </Grid>

              <Grid item xs={12} md={6} className='flex justify-end'>
                <TextField
                  placeholder='Recherche...'
                  size='small'
                  variant='outlined'
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  InputProps={{
                    startAdornment: <IconifyIcon icon='ic:baseline-search' fontSize='18px' />,
                    style: { fontSize: '13px', height: '1.85rem', border: '1px solid red !important' }
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
        <TableContainer component={Paper}>
          <Table aria-label='collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell />
                {columns?.map((column, index) =>
                  custom ? (
                    <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                      {column?.label}
                    </CustomTableCellHeader>
                  ) : (
                    <TableCell
                      key={index}
                      scope='col'
                      align='center'
                      className={`px-4 py-1 font-semibold  text-center cursor-pointer`}
                    >
                      <div className='inline-flex '>
                        <span style={{ fontSize: '16px', color: '#5B6D34' }}>{column.label}</span>
                        {/* Add sorting indicators here */}
                      </div>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((row, rowIndex) => (
                <Row
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  columnsWork={columnsWork}
                  setrowTable={setrowTable}
                  displayNameLines={displayNameLines}
                  custom={custom}
                  showTitleDetails={showTitleDetails}
                />
              ))}
            </TableBody>
          </Table>
          {isLoading && (
            <Box
              className='!w-full'
              sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}
            >
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Chargement...</Typography>
            </Box>
          )}

          {!isLoading && data?.length == 0 && (
            <div className='flex w-full h-64 place-content-center'>
              <div className='self-center'>
                <div>Pas de données</div>
              </div>
            </div>
          )}
        </TableContainer>
      </CardContent>

      <CardActions>
        <div style={{ borderTop: '1px solid #e5e7eb' }} className='w-full gap-4 sm:flex sm:items-center sm:justify-end'>
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
              <MenuItem style={{ fontSize: '12px' }} value={15}>
                15
              </MenuItem>
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
              {/* <MenuItem style={{ fontSize: '12px' }} value={1000}>
                  1000
                </MenuItem> */}
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
      </CardActions>
    </Card>
  )
}
