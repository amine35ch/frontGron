// ** React Imports
import { memo, useState, forwardRef, useEffect } from 'react'

// ** MUI Imports

import CustomChip from 'src/@core/components/mui/chip'
import Divider from '@mui/material/Divider'
import { Menu, Box, Stack, Checkbox, Toolbar, Tooltip, Skeleton } from '@mui/material'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'
import PropTypes from 'prop-types'
import { LoadingButton } from '@mui/lab'
import CustomAvatar from 'src/@core/components/mui/avatar'

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
import CustomComponentDateRange from './CustomComponentDateRange'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomComponentDateRangeNoWrapper from './CustomComponentDateRangeNoWrapper'
import CustomModal from './CustomModal'
import { useGetCompanyPreview, useImportUser, useGenerateLinkCompany } from 'src/services/company.service'
import CustomUserPictureUpload from './CustomUserPictureUpload'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomInputSirenSiretNumber from './CustomInputSirenSiretNumber'

// ** renders client column
function EnhancedTableToolbar(props) {
  const { numSelected, handleClick, mutationToolBar } = props

  return (
    <Box
      className='my-2 overflow-x-auto sm:-mx-6 lg:-mx-4'
      sx={{
        bgcolor: '#F6F8EF',
        py: 3,
        px: 4,
        borderRadius: '5px',
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
        {numSelected} sélectionnée(s)
      </Typography>
      <LoadingButton
        variant='contained'
        loading={mutationToolBar?.isPending}
        loadingPosition='start'
        className='h-[29px] w-[355px]'
        sx={{ fontSize: '12px', cursor: 'pointer' }}
        onClick={() => handleClick()}
      >
        Générer Facture
      </LoadingButton>
    </Box>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
}

const CrudDataTable = memo(
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
    showFilter,
    showAllSection,
    showAll,
    setShowAll,
    setState,
    exportList,
    functionExportList,
    handeleRemoveFilter,
    withCheckbox,
    mutationToolBar,
    filterEnabled = false,
    btnImport = false,
    addModal = false,
    showBtnAdd = true,
    identifier,
    showDevisModal,
    deleteData,
    displayGeneratLink = false,
    isProspects = null,
    detailsProject
  }) => {
    //**  definir function
    const auth = useAuth()
    const router = useRouter()
    const theme = useTheme()
    const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)
    const authorizedList = listPermissions?.permissions.find(item => item.name == `create ${resource}`)
    const importUserMutation = useImportUser({ identifier })

    // ** state
    const [selectedRows, setSelectedRows] = useState([])
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')
    const [anchorEl, setAnchorEl] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const [companyCode, setCompanyCode] = useState('')
    const [company, setCompany] = useState({})
    const sortedData = data || [] // Replace with your actual data array
    const { data: publicLink, mutate: createLink, isPending: isGeneratingLink } = useGenerateLinkCompany()
    const [isOpenLinkModal, setIsOpenLinkModal] = useState('')
    const isDisabled = detailsProject?.isEditable

    const {
      data: preivewCompany,
      isLoading: isLoadingCompany,
      error: errorCompany,
      isSuccess: isSuccessCompany,
      isFetching: isFetchingCompany
    } = useGetCompanyPreview({ siret: companyCode, identifier: identifier == 'installers' ? 'INS' : 'AUD' })

    useEffect(() => {
      if (!isFetchingCompany) {
        setCompany(preivewCompany?.data)
      }
    }, [isFetchingCompany])

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

    const handleChange = event => {
      setPage(1)
      setPageSize(event.target.value)
    }

    const handleSort = field => {
      // split field string by . into an array
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortOrder('asc')
      }
    }

    if (sortField) {
      const filedsArray = sortField.split('.')

      if (filedsArray.length > 1) {
        sortedData?.sort((a, b) => {
          const aValue = a[filedsArray[0]][filedsArray[1]]
          const bValue = b[filedsArray[0]][filedsArray[1]]

          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : 1
          } else {
            return aValue > bValue ? -1 : 1
          }
        })
      }
      if (filedsArray.length === 1) {
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
    }

    const handleDropdownOpen = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleDropdownClose = url => {
      if (url) {
        router.push(url)
      }
      setAnchorEl(null)
    }

    const handleDropdownLinkClose = url => {
      if (url) {
        router.push(url)
      }
      setIsOpenLinkModal(null)
    }

    const handleChangeShowAll = checked => {
      setShowAll(checked)

      if (checked) {
        setState('')
      }
    }

    const handleClick = async () => {
      const data = {
        projects_ids: selectedRows
      }
      try {
        await mutationToolBar.mutateAsync(data)
        setSelectedRows([])
      } catch (error) {}
    }

    const handleAddNewLink = () => {
      if (auth) {
        if (auth?.user?.profile == 'INS') {
          if (auth?.user?.company?.max_projects_per_month == sortedData?.length) {
            toast.error('Vous avez atteint le nombre maximal de projets par mois.')
          } else {
            router.push(addNewLink)
          }
        } else {
          router.push(addNewLink)
        }
      }
    }

    const handleCreateNewLink = async event => {
      if (auth) {
        await createLink()
        setIsOpenLinkModal(event.target)
      }
    }

    const handleCopyNewLink = async event => {
      if (!isGeneratingLink && publicLink) {
        navigator.clipboard.writeText(publicLink?.data?.linkToken)
      }
    }

    const handleImportUser = async () => {
      const data = {
        company_code: companyCode,
        profile: identifier == 'installers' ? 'INS' : 'AUD'
      }

      try {
        await importUserMutation.mutateAsync(data)
        setOpenModal(false)
      } catch (error) {}
    }

    return (
      <>
        <Card>
          <CardContent
            sx={{
              minHeight: '75vh'
            }}
          >
            <Grid container>
              <Grid item={12} md={6}>
                <div>
                  <span className='font-semibold' style={{ fontSize: '17px' }}>
                    Liste des {titleCrud ? titleCrud : resource_name}
                  </span>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={total ? total : sortedData?.length}
                    color={'primary'}
                    sx={{ height: 24, fontSize: '14px', fontWeight: 500, px: 2, marginLeft: '10px' }}
                  />
                </div>
              </Grid>
              <Grid item={12} md={6}>
                <div className='font-semibold text-gray-500'>
                  {addNew && authorizedList?.authorized && (
                    <div className='flex items-center justify-end gap-2'>
                      {/* <Link href={`${addNewLink}`}> */}
                      {displayGeneratLink && isProspects === 'prospect' && (
                        <>
                          <LoadingButton
                            id='generateLinkButton'
                            aria-label='generate'
                            variant='outlined'
                            loading={isGeneratingLink}
                            loadingPosition='start'
                            className='h-[44px]  '
                            sx={{
                              fontWeight: '700',
                              borderRadius: '4px',
                              border: '2px solid #86A039',
                              textWrap: 'nowrap',
                              gap: '4px',
                              fontSize: '16px',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              '&:hover': {
                                borderColor: '#86A039',
                                backgroundColor: 'transparent'
                              }
                            }}
                            onClick={e => handleCreateNewLink(e)}
                          >
                            Générer le lien <IconifyIcon icon='ep:right' />
                          </LoadingButton>
                          <Menu
                            anchorEl={isOpenLinkModal}
                            open={Boolean(isOpenLinkModal)}
                            onClose={() => handleDropdownLinkClose()}
                            className='!!shadow-xl'
                            sx={{
                              '& .MuiMenu-paper': {
                                width: '40rem',
                                mt: 2,
                                height: resource_name === 'logs' ? '350px' : 'auto'
                              }
                            }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                          >
                            <Box className='px-5 py-2'>
                              <Grid container>
                                <Grid item xs={12} md={4} className='flex items-center'>
                                  <Typography className='!mr-1 !font-semibold'>Lien Public</Typography>
                                  <LoadingButton
                                    id='copyLinkButton'
                                    aria-label='copyLinkButton'
                                    variant='outlined'
                                    loading={isGeneratingLink}
                                    loadingPosition='center'
                                    className='h-[29px] w-[20px]'
                                    sx={{ fontSize: '12px', cursor: 'pointer' }}
                                    onClick={e => handleCopyNewLink(e)}
                                  >
                                    <IconifyIcon icon='solar:copy-line-duotone' fontSize='17px' />
                                  </LoadingButton>
                                </Grid>
                                <Grid item xs={12} md={8} className='flex justify-center'>
                                  <Stack direction='row' spacing={1} alignItems='center' width={'100%'}>
                                    <TextField
                                      fullWidth
                                      loading={isGeneratingLink}
                                      placeholder='Lien Public...'
                                      size='small'
                                      variant='outlined'
                                      value={!isGeneratingLink ? publicLink?.data?.linkToken : ''}
                                      disabled
                                      InputProps={{
                                        startAdornment: <IconifyIcon icon='ic:baseline-copy' fontSize='18px' />,
                                        style: {
                                          fontSize: '13px',
                                          height: '1.85rem',
                                          border: '1px solid red !important',
                                          width: '100%'
                                        }
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Box>
                          </Menu>
                        </>
                      )}

                      {showBtnAdd && isProspects !== 'prospect' && (
                        <Button
                          onClick={() => handleAddNewLink()}
                          variant='contained'
                          aria-label='add'
                          className='h-[29px] w-[105px]'
                          sx={{ fontSize: '12px' }}
                          startIcon={<IconifyIcon icon='mdi:plus' />}
                        >
                          Ajouter
                        </Button>
                      )}

                      {addModal && isProspects !== 'prospect' && (
                        <Button
                          onClick={() => {
                            deleteData()
                            showDevisModal()
                          }}
                          variant='contained'
                          aria-label='add'
                          className='h-[29px] w-[105px]'
                          sx={{ fontSize: '12px' }}
                          startIcon={<IconifyIcon icon='mdi:plus' />}
                          disabled={isDisabled}
                        >
                          Ajouter
                        </Button>
                      )}

                      <div className='flex items-center justify-end'>
                        {/* <Link href={`${addNewLink}`}> */}
                        {btnImport && (
                          <Button
                            onClick={() => setOpenModal(true)}
                            variant='outlined'
                            aria-label='add'
                            className='h-[29px] w-[105px] !ml-3'
                            sx={{ fontSize: '12px' }}
                            startIcon={<IconifyIcon icon='uil:import' fontSize={9} />}
                          >
                            Importer
                          </Button>
                        )}
                        {/* </Link> */}
                      </div>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Divider />

            <Grid container className='items-center mb-1 '>
              <Grid item xs={12} md={6} display={'flex'}>
                {showFilter ? (
                  <Button variant={filterEnabled ? 'contained' : 'outlined'} size='small' onClick={handleDropdownOpen}>
                    <IconifyIcon className='mr-1 !font-bold' icon='ion:filter' color={'#4c4e64de'} fontSize='17px' />
                    Filtre
                  </Button>
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
                      {resource_name !== 'Projets' && resource_name !== 'logs' && (
                        <Grid item xs={12} md={6} className='flex justify-end'>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Typography fontSize={'13px'}>Désactiver</Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  disabled={showAll == 1 ? true : false}
                                  onChange={e => handleChangeState(e.target.checked)}
                                  checked={state == '1' ? true : false}
                                  size='small'
                                />
                              }
                            />
                            <Typography fontSize={'13px'}>Activer</Typography>
                          </Stack>
                        </Grid>
                      )}
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
                              <CustomComponentDateRangeNoWrapper
                                startDate={filter.startDateRange}
                                setStartDate={filter.setStartDateRange}
                                endDate={filter.endDateRange}
                                setEndDate={filter.setEndDateRange}
                                fixedPosition={true}
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
            {selectedRows?.length !== 0 && (
              <EnhancedTableToolbar
                numSelected={selectedRows?.length}
                handleClick={handleClick}
                mutationToolBar={mutationToolBar}
              />
            )}
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
                        {withCheckbox && (
                          <th>
                            {/* <Checkbox
                            color='primary'
                            indeterminate={selected?.length > 0 && selected?.length < total}
                            checked={total > 0 && selected?.length === total}
                            onChange={onSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all desserts'
                            }}
                          /> */}
                          </th>
                        )}

                        {columns.map((column, index) => (
                          <th
                            key={index}
                            scope='col'
                            className={`px-4 py-1 font-semibold  text-left cursor-pointer`}
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
                        {!isLoading &&
                          sortedData?.map((item, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={`hover:bg-gray-200 hover:transition-colors transition-colors`}
                            >
                              {withCheckbox && (
                                <td className={`text-base whitespace-nowrap py-1  text-left`}>
                                  <Checkbox
                                    size='small'
                                    color='primary'
                                    onChange={() => handleRowSelect(item.id)}
                                    checked={selectedRows.includes(item.id)}
                                  />
                                </td>
                              )}

                              {columns?.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  className={`text-base whitespace-nowrap py-1 text-left px-4  !text-[#2a2e34] max-w-[${
                                    column.flex * 100
                                  }%]   truncate `}
                                >
                                  {column.renderCell ? column.renderCell({ row: item }) : item[column.field]}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {isLoading && (
                      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CircularProgress sx={{ mb: 4 }} />
                        <Typography>Chargement...</Typography>
                      </Box>
                    )}
                    {!isLoading && sortedData?.length == 0 && (
                      <div className='flex w-full h-64 place-content-center'>
                        <div className='self-center'>
                          <div>Pas de données</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Pagination */}
          </CardContent>
          <CardActions>
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
        {openModal && (
          <CustomModal
            open={openModal}
            widthModal={'sm'}
            handleCloseOpen={() => {
              setCompanyCode('')
              setCompany({})
              setOpenModal(false)
            }}
            btnTitle={'Importer'}
            ModalTitle={`Importer un ${identifier == 'installers' ? 'installateur' : 'auditeur'}`}
            isLoading={importUserMutation.isPending}
            action={handleImportUser}
            btnTitleClose={() => {
              setCompanyCode('')
              setCompany({})
              setOpenModal(false)
            }}
            btnCanceledTitle='Annuler'
          >
            <Grid container>
              <Grid item xs={12} md={12}>
                <Box display={'flex'} alignItems={'center'}>
                  <Typography className='!font-semibold' sx={{ fontSize: '15px', color: '#2a2e34' }}>
                    SIRET de Société
                  </Typography>
                </Box>

                {/* <TextField
                  placeholder='SIRET Société'
                  size='small'
                  variant='outlined'
                  className='w-full !mt-1'
                  value={companyCode}
                  onChange={e => {
                    setCompanyCode(e.target.value)
                  }}
                /> */}
                <CustomInputSirenSiretNumber
                  value={companyCode}
                  setNumber={value => {
                    setCompanyCode(value)
                  }}
                />
                <Grid item xs={12} md={12} mt={5}>
                  {isLoadingCompany || isFetchingCompany ? (
                    <Card
                      sx={{
                        padding: 0,
                        '& .MuiCardContent-root': {
                          padding: 4
                        }
                      }}
                    >
                      <CardContent>
                        <Box display='flex' justifyContent='center' gap={10}>
                          <Box display='flex' flexDirection='column' alignItems='center'>
                            <Skeleton variant='circular' width={85} height={85} />
                            <Skeleton variant='text' width={100} height={30} sx={{ mt: 2 }} />
                          </Box>
                          <Box pt={2}>
                            <Skeleton variant='text' width={150} height={30} />
                            <Skeleton variant='text' width={100} height={20} sx={{ mt: 1 }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{
                        padding: 0,
                        '& .MuiCardContent-root': {
                          padding: 4
                        }
                      }}
                    >
                      <CardContent>
                        {company?.trade_name ? (
                          <Box display='flex' justifyContent='center' gap={10}>
                            <CustomAvatar
                              skin='light'
                              variant='rounded'
                              color='primary'
                              sx={{
                                width: 85,
                                height: 85,
                                fontWeight: 500,
                                mb: 4,
                                fontSize: '1.8rem',
                                borderRadius: '50%'
                              }}
                            >
                              {company?.download_logo ? (
                                <img
                                  className='h-[100px] w-[100px]'
                                  style={{ borderRadius: '50%', marginBottom: 5 }}
                                  alt={'logo'}
                                  src={company?.download_logo}
                                />
                              ) : (
                                getInitials(company?.trade_name)
                              )}
                            </CustomAvatar>
                            <Box pt={2}>
                              <Typography fontWeight={700}>{company?.trade_name}</Typography>
                              <Typography pl={2} fontWeight={300}>
                                {company?.phone_number_1}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box display='flex' justifyContent='center' gap={10}>
                            <Typography fontWeight={700}>
                              Aucun {identifier == 'installers' ? 'installateur' : 'auditeur'}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CustomModal>
        )}
      </>
    )
  }
)

export default CrudDataTable
