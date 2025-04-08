import { Box, Avatar, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

// import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import DialogAlert from '../components/dialogs/DialogAlert'

import { useDeleteWorkQuotion, useValidateWorkDevis } from 'src/services/project.service'
import IconifyIcon from 'src/@core/components/icon'

const InstallerDocColumn = ({
  resource,
  resource_name,
  showDevisModal,
  setModalData,
  setIsUpdate,
  showAttachModal,
  setDocumentToAttach,
  documentToAttach,
  docInstallerId,
  setOpenFile,
  setFileToDisplay,
  detailsProject
}) => {
  const auth = useAuth()
  const router = useRouter()
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const isDisabled = detailsProject?.isEditable

  const deleteUserMutation = useDeleteWorkQuotion()

  const deleteInstallateurValidation = async event => {
    setDialogDeleteOpen(false)
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: selectedRow?.id })
      }
    } catch (error) {}
  }

  const handleEdit = () => {
    router.push(`/entreprise/${row?.id}/edit`)
  }
  const validateDevisMutation = useValidateWorkDevis()

  const onValidateDevis = async invoiceId => {
    try {
      const data = {
        invoiceId: invoiceId
      }
      await validateDevisMutation.mutateAsync(data)
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
    }
  }

  const handleDelete = row => {
    setSelectedRow(row)
    setDialogDeleteOpen(true)
  }

  const handleAttachFileDialog = installerId => {
    showAttachModal(true)

    setDocumentToAttach({ ...documentToAttach, installerId: installerId })
  }

  const getStatusLabel = (state, status) => {
    if (state === 2) {
      return 'Annulé'
    } else if (state !== 2 && status === 2) {
      return 'Validé'
    }

    return 'En cours'
  }

  const getStatusDocumentLabel = statusDoc => {
    if (statusDoc === 4) {
      return 'document finalisé'
    } else return 'nouveau document'
  }
  const listPermissions = auth?.user?.permissions?.find(item => item.resource_name === resource_name)

  const handleDisplayFile = async file => {
    const reference = file?.reference
    try {
      await viewGeneralDocumentData.mutateAsync(reference)
    } catch (error) {}
    setOpenFile(true)
    setFileToDisplay(file)
  }

  const fixedNumberAfterComma = (value, number) => {
    return (Math.round(value * 100) / 100).toFixed(number)
  }

  switch (auth.user.profile) {
    case 'MAR':
      return [
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Statut',
          headerName: 'Statut',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={row?.state === 2 ? 'error' : row?.status === 2 ? 'success' : 'warning'}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStatusLabel(row?.state, row?.status)}
            />
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'Entreprise Retenue',
          headerName: 'Entreprise Retenue',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.installer.trade_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Montant HT',
          headerName: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.HT_total, 2)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Montant TTC',
          headerName: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.TTC_total, 2)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Statut Document',
          headerName: 'Statut Document',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {getStatusDocumentLabel(row?.document?.status)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => {
            const statusLabel = getStatusLabel(row?.state, row?.status)

            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized &&
              row.status !== 2 ? (
                <Tooltip title='Valider'>
                  <IconButton
                    onClick={() => {
                      onValidateDevis(row.id)
                    }}
                    size='small'
                    sx={{ mr: 0.5 }}
                  >
                    <Icon icon='material-symbols:check' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              ) : (
                ''
              )} */}
                {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                  <Tooltip title='modifier'>
                    <IconButton
                      size='small'
                      sx={{ mr: 0.5 }}
                      onClick={() => {
                        setIsUpdate(true)
                        setModalData(row)
                        showDevisModal(true)
                      }}
                    >
                      <Icon icon='ic:baseline-edit' fontSize='20px' />
                    </IconButton>
                  </Tooltip>
                )}
                {listPermissions?.permissions.find(item => item.name == `delete installers`).authorized &&
                !row?.main_installer &&
                row.status !== 2 ? (
                  <>
                    <Tooltip title='supprimer'>
                      <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDelete(row)} disabled={isDisabled}>
                        <Icon icon='mdi:delete-outline' color='red' fontSize={18} />
                      </IconButton>
                    </Tooltip>
                    <DialogAlert
                      open={dialogDeleteOpen}
                      description=''
                      setOpen={setDialogDeleteOpen}
                      title={`Voulez-vous supprimer Entreprise retenue ${selectedRow?.installer.trade_name} ?`}
                      acceptButtonTitle='Accepter'
                      declineButtonTitle='Annuler'
                      handleAction={deleteInstallateurValidation}
                    />
                  </>
                ) : (
                  ''
                )}
                <Tooltip title='Attacher Document'>
                  <IconButton
                    onClick={() => {
                      docInstallerId(row.id)
                      handleAttachFileDialog(row.id)
                    }}
                    color='secondary'
                    title='Attacher Document'
                    disabled={isDisabled}
                  >
                    <IconifyIcon icon='ion:document-attach-outline' />
                  </IconButton>
                </Tooltip>
                {statusLabel === 'Validé' && (
                  <Tooltip title='Voir Document'>
                    <IconButton onClick={() => handleDisplayFile(row.document)} color='secondary' title='Voir Document'>
                      <IconifyIcon icon='carbon:data-view-alt' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          },
          align: 'right'
        }
      ]
      break
    case 'INS':
      return [
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Statut',
          headerName: 'Statut',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={row?.state === 2 ? 'error' : row?.status === 2 ? 'success' : 'warning'}
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStatusLabel(row?.state, row?.status)}
            />
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'Entreprise Retenue',
          headerName: 'Entreprise Retenue',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.installer.trade_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Montant HT',
          headerName: 'Montant HT',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.HT_total, 2)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Montant TTC',
          headerName: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.TTC_total, 2)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Statut Document',
          headerName: 'Statut Document',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {getStatusDocumentLabel(row?.document?.status)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => {
            const statusLabel = getStatusLabel(row?.state, row?.status)

            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title='modifier'>
                  <IconButton
                    size='small'
                    sx={{ mr: 0.5 }}
                    onClick={() => {
                      setIsUpdate(true)
                      setModalData(row)
                      showDevisModal(true)
                    }}
                  >
                    <Icon icon='ic:baseline-edit' fontSize='20px' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Attacher Document'>
                  <IconButton
                    onClick={() => {
                      docInstallerId(row.id)
                      handleAttachFileDialog(row.id)
                    }}
                    color='secondary'
                    title='Attacher Document'
                    disabled={isDisabled}
                  >
                    <IconifyIcon icon='ion:document-attach-outline' />
                  </IconButton>
                </Tooltip>
                {statusLabel === 'Validé' && (
                  <Tooltip title='Voir Document'>
                    <IconButton onClick={() => handleDisplayFile(row.document)} color='secondary' title='Voir Document'>
                      <IconifyIcon icon='carbon:data-view-alt' />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )
          },
          align: 'right'
        }
      ]
      break
    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Statut',
          headerName: 'Statut',
          align: 'center',

          renderCell: ({ row }) => (
            <CustomChip
              skin='light'
              color={
                row?.state === 2 ? 'error' : row?.status === 2 ? 'success' : 'warning' // For 'En attente'
              }
              sx={{
                fontWeight: '600',
                fontSize: '.75rem',
                height: '26px'
              }}
              label={getStatusLabel(row?.state, row?.status)}
            />
          )
        },
        ,
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'Entreprise Retenue',
          headerName: 'Entreprise Retenue',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {row?.installer.trade_name}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Montant HT ',
          headerName: 'Montant HT ',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.HT_total, 2)}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'Montant TTC',
          headerName: 'Montant TTC',
          align: 'center',

          renderCell: ({ row }) => (
            <Typography sx={{ fontSize: '14px', fontWeight: '500' }} variant='body2'>
              {fixedNumberAfterComma(row?.TTC_total, 2)}
            </Typography>
          )
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized &&
              row.status !== 2 ? (
                <Tooltip title='Valider'>
                  <IconButton
                    onClick={() => {
                      onValidateDevis(row.id)
                    }}
                    size='small'
                    sx={{ mr: 0.5 }}
                  >
                    <Icon icon='material-symbols:check' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              ) : (
                ''
              )}
              {listPermissions?.permissions.find(item => item.name == `view ${resource}`)?.authorized && (
                <Tooltip title='modifier'>
                  <IconButton size='small' sx={{ mr: 0.5 }}>
                    <Icon icon='ic:baseline-edit' fontSize='20px' />
                  </IconButton>
                </Tooltip>
              )}

              {listPermissions?.permissions.find(item => item.name == `delete installers`).authorized &&
              !row?.main_installer &&
              row.status !== 2 ? (
                <>
                  <Tooltip title='supprimer'>
                    <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDelete(row)} disabled={isDisabled}>
                      <Icon icon='mdi:delete-outline' color='red' fontSize={18} />
                    </IconButton>
                  </Tooltip>
                  <DialogAlert
                    open={dialogDeleteOpen}
                    description=''
                    setOpen={setDialogDeleteOpen}
                    title={`Voulez-vous supprimer Entreprise retenue ${selectedRow?.installer.trade_name} ?`}
                    acceptButtonTitle='Accepter'
                    declineButtonTitle='Annuler'
                    handleAction={deleteInstallateurValidation}
                  />
                </>
              ) : (
                ''
              )}
            </Box>
          ),
          align: 'right'
        }
      ]
      break
  }
}

export default InstallerDocColumn
