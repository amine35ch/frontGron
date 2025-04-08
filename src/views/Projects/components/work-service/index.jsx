import CustomTable from 'src/components/table'
import WorkServiceColumns from './columns'
import { Button, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import { forwardRef, use, useEffect, useMemo, useState } from 'react'
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

const WorkService = forwardRef((props, ref) => {
  const {
    type = 'simulation',
    detailsProject,
    workList,
    totals,
    setTotals,
    localWorkList,
    setLocalWorkList,
    projectInvoice
  } = props

  const { user } = useAuth()
  const [serviceModal, setServiceModal] = useState(false)
  const [serviceModalSousService, setServiceModalSousService] = useState(false)
  const [articlesWork, setArticlesWork] = useState([])
  const [rowTable, setrowTable] = useState(null)
  const theme = useTheme()
  const isDisabled = detailsProject.isEditable

  // ** REACT QUERY
  const { data: bonusList, isSuccess: bonusListIsSuccess, isLoading: bonusListIsLoading } = useGetBonus()

  const {
    data: worksList,
    isLoading,
    isSuccess
  } = useGetWorks({
    state: 1
  })

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    isSuccess: isSuccessArticles
  } = useGetArticles({ type: 1, state: user.profile === 'INS' ? '' : 1 })
  const { data: listUnit, isSuccess: isUnitListQuerySuccess } = useGetUnitType()

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

  useEffect(() => {
    if (isSuccess && !isLoading && Array.isArray(worksList)) {
      if (workList?.length === 0) {
        const row = worksList?.find(work => work?.reference === 'VMC double flux')

        const work = handleAddWork(row)
        setLocalWorkList([work])
        row['active'] = true
      } else {
        const newWorkList =
          workList?.map(work => {
            const row = worksList?.find(row => row?.id === work?.d_work_id)

            if (row) row['active'] = true

            if (work?.d_work_id) return handleAddWork(work)

            return service(work)
          }) || []

        setLocalWorkList([...newWorkList])
      }
    }
  }, [workList, worksList, isSuccess, isLoading])

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

  const handleAddWork = work => {
    let pricingList = []
    if (work?.pricing_list) {
      pricingList = work?.pricing_list[0]?.price_unit_ht
    } else {
      pricingList = 0
    }
    const unitPrice = operationUnitPrice(work?.work || work, detailsProject.shab)

    const tva = work?.tva || user?.company?.tva_work || 0.055
    const qty = work?.qty || 1
    const qty_simulation = work?.qty_simulation || 1

    const price_unit_ht = work?.price_unit_ht_simulation || work?.unit_price_HT || pricingList || 0
    const price_unit_ht_simulation = work?.price_unit_ht_simulation || unitPrice || pricingList
    const cost_ht_simulation = work?.cost_ht_simulation || price_unit_ht_simulation * qty_simulation
    const cost_invoice_ht = work?.cost_invoice_ht || price_unit_ht * qty
    const cost_invoice_ttc = work?.cost_invoice_ttc || cost_invoice_ht + cost_invoice_ht * tva
    const entitled = work?.work?.reference || work?.reference || work?.designation || ''
    const children = work?.children || null
    const type = 2
    const cost_ttc_simulation = work?.cost_ttc_simulation || cost_ht_simulation + cost_ht_simulation * tva

    return {
      cost_ttc_simulation: cost_ttc_simulation,
      d_project_id: detailsProject?.id,
      d_work_id: work?.d_work_id || work?.id,
      unit: work?.unit,
      sub_contractor_entitled: work?.sub_contractor_entitled || '',
      sub_contractor_siret: work?.sub_contractor_siret || '',
      entitled: work?.entitled || work?.reference,
      qty: qty,
      qty_simulation: qty_simulation,
      tva: tva,
      pricing_list: work?.pricing_list || work?.work?.pricing_list || [],
      price_unit_ht_simulation: price_unit_ht_simulation,
      price_unit_ht: price_unit_ht,
      cost_ht_simulation: cost_ht_simulation,
      cost_invoice_ht: cost_invoice_ht,
      cost_invoice_ttc: cost_invoice_ttc,
      entitled: entitled,
      children: children,
      type: type
    }
  }

  const hadnleOpenServiceModal = () => {
    setServiceModal(true)
  }

  const service = article => {
    const tva = article?.tva || user?.company?.tva_work || 0.055
    const qty = article?.qty || article?.qty_simulation || 1
    const qty_simulation = article?.qty_simulation || 1
    const unit = article?.unit?.type || null

    const price_unit_ht =
      article?.price_unit_ht ||
      article?.price_unit_ht_simulation ||
      article?.unit_price ||
      article?.unit_price_HT ||
      article?.service?.unit_price

    const price_unit_ht_simulation =
      article?.price_unit_ht_simulation || article?.unit_price || article?.service?.unit_price
    const cost_ht_simulation = price_unit_ht_simulation * qty_simulation
    const cost_ttc_simulation = article?.cost_ttc_simulation || cost_ht_simulation + cost_ht_simulation * tva
    const cost_invoice_ht = article?.cost_invoice_ht || price_unit_ht * qty
    const cost_invoice_ttc = article?.cost_invoice_ttc || cost_invoice_ht + cost_invoice_ht * tva
    const type = article?.type

    return {
      d_project_id: detailsProject?.id,
      d_service_id: article?.d_service_id || article?.id,
      unit: article?.unit?.type !== undefined ? article?.unit?.type : article?.unit,
      sub_contractor_entitled: article?.sub_contractor_entitled || '',
      sub_contractor_siret: article?.sub_contractor_siret || '',
      entitled: article?.entitled || article?.designation,
      qty: qty,
      qty_simulation: qty_simulation,
      tva: tva,
      price_unit_ht_simulation: price_unit_ht_simulation,
      price_unit_ht: price_unit_ht,
      cost_ttc_simulation: cost_ttc_simulation,
      cost_ht_simulation: cost_ht_simulation,
      cost_invoice_ht: cost_invoice_ht,
      cost_invoice_ttc: cost_invoice_ttc,
      type: type
    }
  }

  const handleAddService = article => {
    const work = service(article)
    setLocalWorkList([...localWorkList, work])
  }

  const handleDeleteArticle = article => {
    const newWorksList = localWorkList?.filter(work => work?.d_service_id !== article?.id)
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
      unit: article?.unit?.type,
      tva: tva,
      d_sub_contractor_id: null,
      description: article?.description,
      unit_price_HT: article?.unit_price,
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
    const newWorksList = localWorkList?.filter(work => work?.d_service_id !== article?.d_service_id)
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
      if ('simulation' === type) {
        ht = round(work?.cost_ht_simulation, user.company.decimals)
        tva = round(ht * work.tva, 3)
      } else {
        if (work?.children && work?.children.length !== 0) {
          work?.children?.forEach(child => {
            ht += round(child?.amount_HT, user.company.decimals)

            const childTVA = round(child?.amount_HT * child.tva, 3)
            tva += childTVA
          })
        } else {
          ht = round(work?.cost_invoice_ht, user.company.decimals)
          tva = round(ht * work.tva, 3)
        }
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
    [],
    listUnit
  )

  const columnsWork = WorkServiceColumnsChildren(
    theme,
    type,
    detailsProject?.shab,
    setLocalWorkList,
    totals,
    setTotals,
    user,
    localWorkList,
    handleDeleteSousArticle,
    handleDeleteSousArticleFromTable
  )

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
              index !== displayWorks?.length - 1 ? `${work?.entitled} + ` : work?.entitled
            )}
          </Typography>
        </Grid>

        <Grid item sx={12} md={12}>
          {type === 'simulation' ? (
            <CustomTable data={localWorkList} columns={columns} />
          ) : (
            <CustomCollapsibleTable
              data={localWorkList}
              columns={columns}
              columnsWork={columnsWork}
              setrowTable={setrowTable}
              displayNameLines='children'
              custom={true}
              showHeader={false}
              showTitleDetails={false}
            />
          )}
        </Grid>
      </Grid>
      {serviceModal && (
        <ServiceDialog
          isDialogOpen={serviceModal}
          listArticles={articlesData}
          selectedArticles={localWorkList?.filter(work => work?.d_service_id) || []}
          closeDialog={() => setServiceModal(false)}
          onSelectArticle={handleAddService}
          onDeleteArticle={handleDeleteArticle}
        />
      )}

      {serviceModalSousService && (
        <ServiceDialog
          isDialogOpen={serviceModalSousService}
          listArticles={articlesWork}
          selectedArticles={rowTable?.children?.filter(work => work?.d_article_id) || []}
          row={rowTable}
          closeDialog={() => setServiceModalSousService(false)}
          onSelectArticle={handleAddSousService}
          onDeleteArticle={handleDeleteSousArticle}
        />
      )}
    </>
  )
})

export default WorkService
