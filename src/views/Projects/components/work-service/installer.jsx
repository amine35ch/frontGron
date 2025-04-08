import CustomTable from 'src/components/table'
import WorkServiceColumns from './columns'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { forwardRef, use, useEffect, useMemo, useRef, useState } from 'react'
import { useGetBonus, useGetMarScales, useGetUnitType } from 'src/services/settings.service'
import { useGetWorks } from 'src/services/work.service'
import { bonusAmount, marAmount, operationUnitPrice, passoire } from 'src/views/simulator/simulateCalculator'
import { useAuth } from 'src/hooks/useAuth'
import CustomChip from 'src/@core/components/mui/chip'

import IconifyIcon from 'src/@core/components/icon'
import { useGetArticles } from 'src/services/articles.service'
import ServiceDialog from './ServiceDialog'
import { round } from 'src/@core/utils/utilities'
import CustomCollapsibleTable from 'src/components/table/CustomCollapseTable'
import WorkServiceColumnsChildren from './columnsChildren'
import { handleSelectEvent } from 'src/store/apps/calendar'
import InvoiceTableInstaller from './InvoiceTableInstaller'
import WorkDetailsModal from './WorkDetailsModal'
import { useGetListCompany } from 'src/services/company.service'
import RowTableCell from 'src/components/RowTableCell'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import dynamic from 'next/dynamic'
import DOMPurify from 'dompurify'
import zIndex from '@mui/material/styles/zIndex'
import CustomModal from 'src/components/CustomModal'

const DynamicQuill = dynamic(() => import('./QuillJs'), { ssr: false })

const WorkServiceInstaller = forwardRef((props, ref) => {
  const {
    type = 'simulation',
    detailsProject,
    totals,
    setTotals,
    localWorkList,
    setLocalWorkList,
    defaultWorkList,
    listUnit,
    worksList,
    handleAddWork,
    service,
    disabled = false,
    isUpdate
  } = props

  const { user } = useAuth()
  const [serviceModal, setServiceModal] = useState(false)
  const [serviceModalSousService, setServiceModalSousService] = useState(false)
  const [quillEditorModal, setQuillEditorModal] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState({})
  const [articlesWork, setArticlesWork] = useState([])
  const [rowTable, setrowTable] = useState(null)
  const theme = useTheme()
  const [currentQuillInstance, setCurrentQuillInstance] = useState(null)

  // ** REACT QUERY
  const { data: bonusList, isSuccess: bonusListIsSuccess, isLoading: bonusListIsLoading } = useGetBonus()

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    isSuccess: isSuccessArticles
  } = useGetArticles({ state: 1, type: '1' })

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts
  } = useGetArticles({ state: 1, type: '0' })

  const {
    data: companyList,
    isLoading: companyListIsLoading,
    isSuccess: companyListIsSuccess
  } = useGetListCompany({
    type: 'stt',
    profile: 'sub-contractors',
    state: 1
  })

  // ** REACT QUERY
  const totalBonus = useMemo(() => {
    const bonus = bonusAmount(
      detailsProject.sautClasse,
      bonusList,
      detailsProject.incomeClasse,
      detailsProject.classeEnergetique
    )
    const bonusPass = passoire(bonusList, detailsProject.classeEnergetique)
    const percentenge = bonus?.percentage + bonusPass?.percentage

    if (totals.amount_ht <= bonus?.cap) {
      return {
        bonus: totals.amount_ht * percentenge,
        cap: bonus?.cap
      }
    }

    return {
      bonus: bonus?.cap * percentenge,
      cap: bonus?.cap
    }
  }, [
    detailsProject.sautClasse,
    detailsProject.incomeClasse,
    totals.amount_ht,
    bonusList,
    detailsProject.classeEnergetique
  ])

  const chooseWork = index => {
    const row = worksList[index]
    if (row['active']) {
      const newWorksList = localWorkList?.filter(work => work?.d_work_id !== row?.id)
      setLocalWorkList(newWorksList)

      row['active'] = false

      return 0
    }
    row['active'] = true
    const work = handleAddWork(row)

    setLocalWorkList([...localWorkList, work])
  }

  const hadnleOpenServiceModal = () => {
    setServiceModal(true)
  }

  const handleAddService = article => {
    const work = service(article)
    setLocalWorkList([...localWorkList, work])
  }

  const handleDeleteArticle = article => {
    const newWorksList = localWorkList?.filter(work => work?.d_article_id !== article?.id)
    setLocalWorkList(newWorksList)
  }

  const handleAddSousService = article => {
    const newLocalWorkList = [...localWorkList]

    const amount_HT = article?.unit_price * 1
    const amount_TTC = article?.unit_price * 1 + article?.unit_price * 1 * 0.055
    const amount_TVA = amount_TTC - amount_HT
    const tva = article?.tva || 0.055

    const newArticle = {
      amount_HT: amount_HT,
      amount_TTC: amount_TTC,
      amount_TVA: amount_TVA,
      d_work_id: article?.work?.id,
      d_article_id: article?.id,
      designation: article?.designation,
      qty: 1,
      qty_simulation: 1,
      unit: article?.unit?.type,
      tva: tva,
      d_sub_contractor_id: null,
      description: article?.description,
      unit_price_HT: article?.unit_price,
      price_unit_ht_simulation: article?.unit_price,
      unit_price_TTC: article?.unit_price * tva,
      type: article?.type
    }

    const workIndex = newLocalWorkList?.findIndex(work => work.d_work_id === rowTable?.d_work_id)
    if (workIndex !== -1) {
      if (!newLocalWorkList[workIndex].children) {
        newLocalWorkList[workIndex].children = [newArticle]
      } else {
        newLocalWorkList[workIndex].children.push(newArticle)
      }
    }

    setLocalWorkList(newLocalWorkList)
  }

  const handleAddServiceToWork = articlesIds => {
    const articles = articlesData?.filter(article => articlesIds.includes(article?.id))
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === rowTable?.d_work_id)
    work['article_ids'] = articlesIds

    // if (article.type === 1) {
    //   work['description'] = work['description'] + `<p>${article?.designation}</p>`
    // } else {
    //   work['description'] = work['description'] + '<p> </p>' + article?.description
    // }

    setLocalWorkList(newLocalWorkList)
  }

  const handleDeleteSousArticle = article => {
    const newChildrenList = rowTable?.children.filter(work => work?.d_article_id !== article?.id)

    const newRowTable = {
      ...rowTable,
      children: newChildrenList
    }
    setrowTable(newRowTable)

    const newLocalWorkList = localWorkList?.map(work => {
      if (work.d_work_id === rowTable?.d_work_id) {
        return newRowTable
      }

      return work
    })

    setLocalWorkList(newLocalWorkList)
  }

  const handleDeleteSousArticleFromTable = article => {
    const newChildrenList = rowTable?.children.filter(work => work?.d_article_id !== article?.d_article_id)

    const newRowTable = {
      ...rowTable,
      children: newChildrenList
    }
    setrowTable(newRowTable)

    const newLocalWorkList = localWorkList?.map(work => {
      if (work.d_work_id === rowTable?.d_work_id) {
        return newRowTable
      }

      return work
    })

    setLocalWorkList(newLocalWorkList)
  }

  const handleDeleteArticleFromTable = article => {
    const newWorksList = localWorkList?.filter(work => work?.d_article_id !== article?.d_article_id)
    setLocalWorkList(newWorksList)
  }

  const displayWorks = localWorkList?.filter(work => work?.d_work_id)

  useEffect(() => {
    let amountHT = 0
    let amountTTC = 0
    let amountTVA = 0
    localWorkList?.forEach(work => {
      let ht = 0
      let tva = 0

      if (work?.children && work?.children.length !== 0) {
        work?.children?.forEach(child => {
          ht += round(child?.amount_HT, user.company.decimals)

          const childTVA = round(child?.amount_HT * child.tva, 3)
          tva += childTVA
        })
      } else {
        ht = round(work?.cost_ht_simulation || work?.cost_invoice_ht, user.company.decimals)
        tva = round(ht * work.tva, 3)
      }

      amountHT += ht
      amountTTC += ht + tva
      amountTVA += tva
    })

    setTotals(prev => {
      return {
        ...prev,
        amount_ht: amountHT,
        ht_rest: amountHT - totalBonus.bonus,
        TTC_rest: amountTTC - totalBonus.bonus,
        HT_anah: totalBonus.bonus,
        amount_tva: amountTVA,
        amount_ttc: amountTTC
      }
    })
  }, [localWorkList, localWorkList?.length, totalBonus.bonus])

  const columns = WorkServiceColumns(
    theme,
    type,
    detailsProject?.shab,
    setLocalWorkList,
    totals,
    setTotals,
    user,
    localWorkList,
    handleAddSousService,
    handleDeleteSousArticle,
    serviceModalSousService,
    setServiceModalSousService,
    setArticlesWork,
    setrowTable,
    handleDeleteArticleFromTable,
    articlesData,
    listUnit,
    disabled
  )

  // const columnsWork = WorkServiceColumnsChildren(
  //   theme,
  //   type,
  //   detailsProject?.shab,
  //   setLocalWorkList,
  //   totals,
  //   setTotals,
  //   user,
  //   localWorkList,
  //   handleDeleteSousArticle,
  //   handleDeleteSousArticleFromTable
  // )

  const handleOpenDescriptionDialog = (description, row) => {
    setQuillEditorModal(true)
    setSelectedDescription(description)
    setrowTable(row)
  }

  const handleCloseDescriptionDialog = () => {
    const newLocalWorkList = [...localWorkList]

    const newDescription = {
      ...selectedDescription,
      content: currentQuillInstance.root.innerHTML
    }

    const work = newLocalWorkList?.find(work => work?.d_work_id === rowTable?.d_work_id)

    const descriptionIndex = work?.description_v2?.findIndex(
      description => description?.id === selectedDescription?.id && description?.type === selectedDescription?.type
    )
    work.description_v2[descriptionIndex] = newDescription

    setLocalWorkList(newLocalWorkList)
    setQuillEditorModal(false)
    setSelectedDescription({})
    setrowTable(null)
  }

  return (
    <>
      <Grid container>
        <Grid
          item
          pt={0}
          xs={12}
          sm={12}
          md={12}
          display={'block'}
          justifyContent={'center'}
          sx={{ textAlignLast: 'center' }}
        >
          {worksList?.map((work, index) => (
            <CustomChip
              skin='light'
              size='small'
              key={index}
              disabled={disabled}
              label={work?.reference}
              color={work?.active == true ? 'info' : 'primary'}
              onClick={() => chooseWork(index)}
              sx={{
                height: 28,
                fontWeight: 500,
                fontSize: '0.95rem',
                alignSelf: 'flex-start',
                marginLeft: '10px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            />
          ))}
        </Grid>
        {/* <Grid item sx={{ pt: 5 }} xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
          <CustomChip
            skin='light'
            size='small'
            label={
              <Stack direction='row' alignItems={'center'}>
                <IconifyIcon icon='bi:plus' />
                Prestation
              </Stack>
            }
            color={'primary'}
            onClick={hadnleOpenServiceModal}
            sx={{
              height: 28,
              fontWeight: 500,
              fontSize: '0.95rem',
              marginLeft: '10px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          />
        </Grid> */}
        <Grid item sx={{ pt: 0 }} xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
          <Grid item pt={0} xs={5} sm={5} md={5}>
            <Divider />
          </Grid>
        </Grid>
        <Grid item pt={1} mt={1} mb={3} xs={12} sm={12} md={12} display={'flex'} justifyContent={'center'}>
          <Typography ml={2} sx={{ fontWeight: 700 }}>
            {displayWorks?.map((work, index) =>
              index !== displayWorks?.length - 1 ? `${work?.reference} + ` : work?.reference
            )}
          </Typography>
        </Grid>

        <Grid item sx={12} md={12}>
          <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
              <TableHead>
                <TableRow>
                  {columns?.map((column, index) => (
                    <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                      {column?.label}
                    </CustomTableCellHeader>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {localWorkList?.map((row, rowIndex) => (
                  <>
                    <TableRow sx={{ backgroundColor: 'rgba(134, 160, 57, 0.12)' }} key={rowIndex}>
                      {columns.map((column, index) => (
                        <RowTableCell {...column} key={index}>
                          {column?.renderCell ? (
                            column.renderCell({ row, index: rowIndex })
                          ) : (
                            <Typography> {row[column.field]}</Typography>
                          )}
                        </RowTableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <RowTableCell colSpan={8}>
                        {row?.description_v2?.map((description, index) => (
                          <Card key={index} sx={styles.card}>
                            <CardContent sx={styles.cardContent}>
                              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description?.content) }} />
                              <IconButton
                                className='edit-icon'
                                sx={styles.editIcon}
                                onClick={() => handleOpenDescriptionDialog(description, row)}
                              >
                                <IconifyIcon icon='bi:pencil' />
                              </IconButton>
                            </CardContent>
                          </Card>
                        ))}
                      </RowTableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {serviceModal && (
        <ServiceDialog
          isDialogOpen={serviceModal}
          listArticles={articlesData?.filter(article => article?.type === 1) || []}
          selectedArticles={localWorkList?.filter(work => work?.d_article_id) || []}
          closeDialog={() => setServiceModal(false)}
          onSelectArticle={handleAddService}
          onDeleteArticle={handleDeleteArticle}
        />
      )}

      {serviceModalSousService && (
        <WorkDetailsModal
          user={user}
          sousTraitantsList={companyList?.filter(company =>
            company?.rges?.some(rge => rge.qualifications.includes(rowTable?.qualification?.type))
          )}
          productsData={productsData}
          isDialogOpen={serviceModalSousService}
          listArticles={articlesData?.filter(article => article.works.some(work => work.id === rowTable?.d_work_id))}
          selectedArticles={rowTable?.children?.filter(work => work?.d_article_id) || []}
          row={rowTable}
          closeDialog={() => setServiceModalSousService(false)}
          localWorkList={localWorkList}
          setLocalWorkList={setLocalWorkList}
          setTotals={setTotals}
          totals={totals}
        />
      )}

      {quillEditorModal && (
        <CustomModal
          open={quillEditorModal}
          handleCloseOpen={handleCloseDescriptionDialog}
          btnTitle={'Enregistrer'}
          ModalTitle={'Editer la description'}
          isLoading={false}
          action={handleCloseDescriptionDialog}
          widthModal={'md'}
          btnTitleClose={'Enregistrer'}
          btnCanceledTitle='Annuler'
        >
          <DynamicQuill value={selectedDescription?.content} handleSetCurrentQuillInstance={setCurrentQuillInstance} />
        </CustomModal>
      )}
    </>
  )
})

export default WorkServiceInstaller

const styles = {
  card: {
    border: 'none',
    boxShadow: 'none',
    transition: 'box-shadow 0.1s, border 0.1s',
    position: 'relative',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      border: '1px solid #ddd',
      zIndex: 2,
      '& .edit-icon': {
        display: 'flex'
      }
    }
  },

  editIcon: {
    display: 'none',
    position: 'absolute',
    top: '50%',
    right: '0%',
    transform: 'translate(-50%, -50%)'
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  }
}
