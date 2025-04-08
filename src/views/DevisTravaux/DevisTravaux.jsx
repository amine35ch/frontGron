import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  Stack,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { styled } from '@mui/material/styles'

import { useGetListCompany } from 'src/services/company.service'
import IconifyIcon from 'src/@core/components/icon'
import CustomFileUploadRestrictions from 'src/components/CustomFileUploadRestrictions'
import CustomModal from 'src/components/CustomModal'
import {
  useCancelWorkDevis,
  useCreateWorkQuotion,
  useGetProjectInstallerInvoiceComments,
  useGetProjectInvoiceInstaller,
  useGetRefInvoice,
  useMarkCommentAsSeen,
  useUploadDocumentInstaller,
  useUploadDocumentToProject,
  useValidateDevis,
  useValidateWorkDevis,
  useVerifyInvoice
} from 'src/services/project.service'

import TotalCardTraveaux from './components/TotalCardTraveaux'
import { bonusAmount, operationUnitPrice, passoire } from '../simulator/simulateCalculator'
import { useGetBonus, useGetUnitType } from 'src/services/settings.service'
import { useAuth } from 'src/hooks/useAuth'
import { LoadingButton } from '@mui/lab'
import WorkService from '../Projects/components/work-service'
import QuoteHeader from '../Projects/form/QuoteHeader'
import DialogAlert from '../components/dialogs/DialogAlert'
import WorkServiceInstaller from '../Projects/components/work-service/installer'
import { useGetWorks } from 'src/services/work.service'
import CardBgBorderGreen from 'src/components/CardBgBorderGreen'
import { CustomInput } from 'src/components/CustomeCurrencyInput'
import DevisTravauxLoadingSkeleton from './components/InvoiceSkeleton'
import { dateFormaterWithTime } from 'src/@core/utils/utilities'
import { set } from 'nprogress'
import CustomAccordian from 'src/components/CustomAccordian'
import StepDocuments from 'src/components/StepDocuments'
import moment from 'moment'
import CrudDataTable from 'src/components/CrudDataTable'
import InstallerDocColumn from './installerDocColum'
import AttachPDocumentDialog from 'src/components/AttachPDocumentDialog'
import AttachPDocument from 'src/components/AttachPDocument'
import DisplayFileDialog from 'src/components/DisplayFileDialog'
import DetailsProject from '../Projects/detailsProject/DetailsProject'

const MailItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
    '& .mail-actions': { display: 'flex' },
    '& .mail-info-right': { display: 'none' },
    '& + .MuiListItem-root': { borderColor: 'transparent' }
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

const DevisTravaux = ({ noDocs = false, detailsProject, editableUser, refetchProject = () => {} }) => {
  const theme = useTheme()
  const { data: bonusList, isSuccess: bonusListIsSuccess, isLoading: bonusListIsLoading } = useGetBonus()
  const [openDisplayCommentsDialog, setOpenDisplayCommentsDialog] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

  const {
    data: projectInvoice,
    isLoading: isProjectInvoiceLoading,
    isSuccess: isProjectInvoiceSuccess,
    isFetching: isProjectInvoiceFetching,
    refetch: refetchProjectInvoice
  } = useGetProjectInvoiceInstaller({ id: detailsProject?.id })

  const { data: listUnit, isSuccess: isUnitListQuerySuccess } = useGetUnitType()

  const { data: projectInstallerInvoiceComments, isLoading: isProjectInstallerInvoiceCommentsLoading } =
    useGetProjectInstallerInvoiceComments({
      id: detailsProject?.id
    })

  const {
    data: worksList,
    isLoading,
    isSuccess,
    isFetching: isWorkListFetching
  } = useGetWorks({
    state: 1
  })
  const uploadDocumentToProjectMutation = useUploadDocumentInstaller()

  const [usedWorkList, setUsedWorkList] = useState([])
  useEffect(() => {
    setUsedWorkList(worksList)
  }, [worksList])

  // *****state

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(1)

  const [formInput, setFormInput] = useState({ files: [] })
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [invoiceHeaderId, setInvoiceHeaderId] = useState(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [invoiceState, setInvoiceState] = useState(0)

  const [totals, setTotals] = useState({
    amount_ht: 0,
    amount_ttc: 0,
    amount_tva: 0,

    // REST
    TTC_rest: 0,
    ht_rest: 0,
    TVA_rest: 0,

    // ANAH
    TTC_anah: 0,
    HT_anah: 0,
    TVA_anah: 0
  })
  const [localWorkList, setLocalWorkList] = useState([])
  const [defaultWorkList, setDefaultWorkList] = useState([])
  const [comment, setComment] = useState('')
  const [fileName, setFileName] = useState(null)
  const [openFileDialog, setIsOpenFileDialog] = useState(false)
  const [openCommentDialog, setIsOpenCommentDialog] = useState(false)
  const [openModalFile, setOpenModalFile] = useState(false)
  const [fileToView, setFileToView] = useState(null)
  const { user } = useAuth()
  const [formErrors, setFormErrors] = useState({})
  const [statusFacture, setstatusFacture] = useState(null)
  const [classSkipNumber, setClassSkipNumber] = useState(0)
  const [openDevisModal, setOpenDevisModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [attachFileDialog, setAttachFileDialog] = useState(false)
  const [fileToDisplay, setFileToDisplay] = useState(null)
  const [openFile, setOpenFile] = useState(false)
  const isDisabled = detailsProject?.isEditable

  const [documentToAttach, setDocumentToAttach] = useState({
    entitled: 'Attacher un devis',
    installerId: null,
    external: 0
  })
  const [formErrorsFiles, setformErrorsFiles] = useState(false)
  const [singleFile, setSingleFile] = useState([])

  const [installer, setInstaller] = useState({
    id: '',
    files: [],
    reference: ''
  })
  const [installerId, setInstallerId] = useState()

  const totalBonus = useMemo(() => {
    const bonus = bonusAmount(
      detailsProject.class_skip,
      bonusList,
      detailsProject.income_class,
      detailsProject.performance_energy_before_work
    )
    const bonusPass = passoire(bonusList, detailsProject.performance_energy_before_work)
    const percentenge = bonus?.percentage + bonusPass?.percentage

    if (totals.amount_ht <= bonus?.cap) {
      return {
        bonus: totals.amount_ht * percentenge,
        percentageBonus: bonus.percentage,
        cap: bonus?.cap,
        bonusPass: bonusPass
      }
    }

    return {
      bonus: bonus?.cap * percentenge,
      percentageBonus: bonus.percentage,
      cap: bonus?.cap,
      bonusPass: bonusPass
    }
  }, [
    detailsProject.sautClasse,
    detailsProject.incomeClasse,
    totals.amount_ht,
    bonusList,
    detailsProject.classeEnergetique
  ])

  // *******function
  useEffect(() => {
    setClassSkipNumber(detailsProject?.class_skip_number || 0)
    setInstaller(prev => {
      return { prev, id: detailsProject?.installer?.id, reference: detailsProject?.invoices?.reference_ins }
    })
  }, [])

  useEffect(() => {
    const newWorkList = detailsProject.works?.map(work => {
      const row = worksList?.find(row => row?.id === work?.d_work_id)
      if (row) {
        row['active'] = true
      }
      if (work?.d_work_id) {
        return handleAddWork(work)
      }

      return service(work)
    })
    setDefaultWorkList([...newWorkList])
    setLocalWorkList([...newWorkList])
  }, [detailsProject, worksList])

  useEffect(() => {
    if ((!isUpdate && detailsProject.works.length > 0) || !openDevisModal) {
      worksList?.forEach(work => {
        work['active'] = false
      })

      const newWorkList = detailsProject.works?.map(work => {
        const row = worksList?.find(row => row?.id === work?.d_work_id)
        if (row) {
          row['active'] = true
        }
        if (work?.d_work_id) {
          return handleAddWork(work)
        }

        return service(work)
      })
      setDefaultWorkList([...newWorkList])
    }
  }, [isUpdate, openDevisModal])

  // useEffect(() => {
  //   if (!isWorkListFetching && !isProjectInvoiceFetching && isProjectInvoiceSuccess && isSuccess) {
  //     if (projectInvoice[0]?.lines?.length === 0) {
  //       const row = worksList?.find(work => work?.reference === 'VMC double flux')
  //       const work = handleAddWork(row)
  //       setLocalWorkList([{ ...work }])
  //       row['active'] = true
  //     } else {
  //       const newWorkList = projectInvoice[0]?.lines?.map(work => {
  //         const row = worksList?.find(row => row?.id === work?.d_work_id)
  //         if (row) row['active'] = true
  //         if (work?.d_work_id) return handleAddWork(work)
  //         return service(work)
  //       })
  //       setLocalWorkList([...newWorkList])
  //     }
  //     setInvoiceState(projectInvoice[0]?.state)
  //     setInvoiceDate(projectInvoice[0]?.invoice_date)
  //   }
  // }, [projectInvoice, isProjectInvoiceFetching, isProjectInvoiceSuccess, isWorkListFetching, isSuccess])

  useEffect(() => {
    if (modalData?.lines) {
      const newWorkList = modalData?.lines?.map(work => {
        const row = worksList?.find(row => row?.d_work_id == work?.id)
        if (row) {
          work['active'] = true
        } else {
          work['active'] = false
        }
        if (work?.id) {
          return handleAddWork(work)
        }

        return service(work)
      })

      const allList = worksList?.map(work => {
        const row = modalData?.lines?.find(row => row?.d_work_id == work?.id)
        if (row) {
          work['active'] = true
        } else {
          work['active'] = false
        }

        if (work?.id) {
          return handleAddWork(work)
        }

        return service(work)
      })
      setUsedWorkList([...allList])
      setLocalWorkList([...newWorkList])
      setInvoiceState(modalData?.state)
      setInvoiceDate(modalData?.invoice_date)
    }
  }, [modalData])

  useEffect(() => {
    if (!isUpdate) {
      setModalData({})
    }
  }, [isUpdate])

  const handleAddWork = work => {
    let pricingList = []
    if (work?.pricing_list) {
      pricingList = work?.pricing_list[0]?.price_unit_ht
    } else {
      pricingList = 0
    }
    const unitPrice = operationUnitPrice(work?.work || work, detailsProject.shab)

    const tva = work?.tva || user?.company?.tva_work || 0.05
    const qty = work?.qty || 1
    const qty_simulation = work?.qty_simulation || 1

    const price_unit_ht = work?.price_unit_ht_simulation || work?.unit_price_HT || pricingList || 0
    const price_unit_ht_simulation = work?.price_unit_ht_simulation || work?.unit_price_HT || pricingList || 0
    const cost_ht_simulation = work?.cost_ht_simulation || work?.price_unit_ht_simulation * qty_simulation
    const cost_invoice_ht = work?.cost_invoice_ht || price_unit_ht * qty
    const cost_invoice_ttc = work?.cost_invoice_ttc || cost_invoice_ht + cost_invoice_ht * tva
    const entitled = work?.work?.display_name || work?.display_name || work?.designation || ''
    const children = work?.children || null
    const type = 2

    return {
      reference: work?.work?.reference || work?.reference || '',
      description: work?.description || '',
      d_project_id: detailsProject?.id,
      d_work_id: work?.d_work_id || work?.id,
      unit: work?.unit,
      sub_contractor_entitled: work?.sub_contractor_entitled || '',
      sub_contractor_siret: work?.sub_contractor_siret || '',
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
      type: type,
      article_ids: work?.article_ids || [],
      product_ids: work?.product_ids || [],
      d_sub_contractor_id: work?.d_sub_contractor_id || null,
      sub_contractor: work?.sub_contractor || {},
      qualification: work?.qualification || {},
      description_v2: work?.description_v2 || []
    }
  }

  const service = article => {
    const tva = article?.tva || user?.company?.tva_work || 5
    const qty = article?.qty || article?.qty_simulation || 1
    const qty_simulation = article?.qty_simulation || 1

    const price_unit_ht =
      article?.price_unit_ht ||
      article?.price_unit_ht_simulation ||
      article?.unit_price ||
      article?.unit_price_HT ||
      article?.service?.unit_price

    const price_unit_ht_simulation =
      article?.price_unit_ht_simulation || article?.unit_price || article?.service?.unit_price

    const cost_ht_simulation = price_unit_ht_simulation * qty_simulation
    const cost_invoice_ht = article?.cost_invoice_ht || price_unit_ht * qty
    const cost_invoice_ttc = article?.cost_invoice_ttc || cost_invoice_ht + cost_invoice_ht * tva
    const type = article?.type

    return {
      d_project_id: detailsProject?.id,
      d_article_id: article?.d_article_id || article?.id,
      unit: article?.unit?.type !== undefined ? article?.unit?.type : article?.unit,
      sub_contractor_entitled: article?.sub_contractor_entitled || '',
      sub_contractor_siret: article?.sub_contractor_siret || '',
      entitled: article?.entitled || article?.designation,
      qty: qty,
      qty_simulation: qty_simulation,
      tva: tva,
      price_unit_ht_simulation: price_unit_ht_simulation,
      price_unit_ht: price_unit_ht,
      cost_ht_simulation: cost_ht_simulation,
      cost_invoice_ht: cost_invoice_ht,
      cost_invoice_ttc: cost_invoice_ttc,
      type: type,
      article_ids: article?.article_ids || [],
      product_ids: article?.product_ids || [],
      d_sub_contractor_id: article?.d_sub_contractor_id || null,
      sub_contractor: article?.sub_contractor || {}
    }
  }

  const onSubmit = async () => {
    const scenario = isUpdate
      ? localWorkList
          ?.map((work, index) => (index !== localWorkList?.length - 1 ? `${work?.reference} + ` : work?.reference))
          .join('')
      : defaultWorkList
          ?.map((work, index) => (index !== defaultWorkList?.length - 1 ? `${work?.reference} + ` : work?.reference))
          .join('')

    const works = isUpdate
      ? localWorkList.map((work, index) => {
          return {
            ...work,
            installer: installer?.id,
            amount_HT:
              work?.cost_ht_simulation ||
              work?.cost_invoice_ht ||
              parseFloat(String(work?.price_unit_ht).replace(',', '.')),
            amount_TTC: work?.cost_invoice_ttc,
            qty: parseFloat(String(work?.qty).replace(',', '.')),
            designation: work?.entitled ? work?.entitled : '',
            amount_TVA: work?.cost_invoice_ttc - work?.cost_invoice_ht,
            d_sub_contractor_id: null,
            d_article_id: work?.d_article_id || null,
            unit_price_HT: parseFloat(String(work?.price_unit_ht).replace(',', '.')),
            unit_price_TTC: parseFloat(String(work?.price_unit_ht).replace(',', '.')) * work?.tva,
            description: work?.description,
            article_ids: work?.article_ids,
            product_ids: work?.product_ids,
            d_sub_contractor_id: work?.d_sub_contractor_id,
            description_v2: work?.description_v2
          }
        })
      : defaultWorkList.map((work, index) => {
          const ttc = work?.price_unit_ht_simulation
            ? parseFloat(String(work?.price_unit_ht_simulation).replace(',', '.')) *
              parseFloat(String(work.qty_simulation).replace(',', '.'))
            : work?.price_unit_ht * work.qty

          const ht =
            work?.cost_ht_simulation ||
            work?.cost_invoice_ht ||
            parseFloat(String(work?.price_unit_ht).replace(',', '.'))

          return {
            ...work,
            installer: installer?.id,
            amount_HT: ht,
            amount_TTC: ttc,
            qty: parseFloat(String(work?.qty_simulation).replace(',', '.')) || 1,
            designation: work?.entitled ? work?.entitled : '',
            amount_TVA: ttc - ht,
            d_sub_contractor_id: null,
            d_article_id: work?.d_article_id || null,
            unit_price_HT: parseFloat(String(work?.price_unit_ht_simulation).replace(',', '.')),
            unit_price_TTC: parseFloat(String(work?.price_unit_ht_simulation).replace(',', '.')) * work?.tva,
            description: work?.description,
            article_ids: work?.article_ids,
            product_ids: work?.product_ids,
            d_sub_contractor_id: work?.d_sub_contractor_id,
            description_v2: work?.description_v2
          }
        })
    const prime_bonification = totalBonus.bonusPass.percentage * totals.amount_ht

    const form = {
      class_skip_number: classSkipNumber,
      installer: modalData?.installer?.id ?? installer?.id,
      parents: works,
      cost_ht_offre: totals.amount_ht,
      cost_ttc_offre: totals.amount_ttc,
      rest_ht_offre: totals.ht_rest,
      TTC_rest: totals.TTC_rest,
      TVA_rest: totals.TVA_rest,
      HT_rest: totals.ht_rest,
      HT_total: totals.amount_ht,
      TVA_total: totals.amount_tva,
      TTC_total: totals.amount_ttc || totals.amount_ht + totals.amount_tva,
      TTC_anah: totals.TTC_anah,
      TVA_anah: totals.TVA_anah,
      HT_anah: totals.HT_anah,
      reference: modalData?.installer?.id ?? installer?.reference,
      plafond_prime: totalBonus.cap,

      prime_bonification: prime_bonification,
      prime_renov: totalBonus.percentageBonus * totals.amount_ht,
      prime_renov_bonification: totalBonus.bonus,

      rac: totals.TTC_rest - totalBonus.bonus,
      scenario: scenario,

      invoice_date: moment(invoiceDate).format('YYYY-MM-DD')
    }

    try {
      const response = await createWorkQuotionMutation.mutateAsync(form)
      setOpenDevisModal(false)
      setModalData(null)
      setIsUpdate(false)
      refetchProjectInvoice()
      refetchProject()
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const onValidateDevis = async () => {
    try {
      const data = {
        invoiceId: modalData?.id
      }
      onSubmit()
      await validateDevisMutation.mutateAsync(data)
      setstatusFacture(2)
      setInvoiceState(1)
      setModalData(null)
      setIsUpdate(false)
      setOpenDevisModal(false)
      refetchProjectInvoice()
      refetchProject()
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const onCancelDevis = async confirmation => {
    try {
      try {
        if (confirmation) {
          const data = {
            invoiceId: modalData?.id
          }
          await cancelDevisMutation.mutateAsync(data)
          setstatusFacture(1)
          setInvoiceState(0)
          setModalData(null)
          setIsUpdate(false)
          setSuspendDialogOpen(false)
          setOpenDevisModal(false)
          refetchProjectInvoice()
          refetchProject()
        }
        setSuspendDialogOpen(false)
      } catch (error) {}
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  // const onCancelDevis = async event => {
  //   try {

  //     // cancel-facture
  //     const data = {
  //       d_project_invoice_header_id: projectInvoice?.id,
  //       state: 0
  //     }
  //     if (event) {
  //       await validateDevisMutation.mutateAsync(data)

  //       setstatusFacture(1)
  //       setInvoiceState(0)
  //     }

  //     setSuspendDialogOpen(false)
  //   } catch (error) {
  //     const errorsObject = error?.response?.data?.errors
  //     setFormErrors(errorsObject)
  //   }
  // }

  const handleCancelDevis = () => {
    setSuspendDialogOpen(true)
  }

  // ******query

  const createWorkQuotionMutation = useCreateWorkQuotion({ id: detailsProject?.id })
  const validateDevisMutation = useValidateWorkDevis({})
  const cancelDevisMutation = useCancelWorkDevis({})
  const { data: refInvoice } = useGetRefInvoice({ installerId: installer?.id })
  const { data: ListInstaller } = useGetListCompany({ type: 'ins', profile: 'installers', display: 'short' })
  const verificationDevisMutation = useVerifyInvoice({ id: detailsProject?.id })

  const handleSubmitVerificatrion = async () => {
    try {
      const data = {
        comment
      }
      await verificationDevisMutation.mutateAsync(data)
      setIsOpenCommentDialog(false)
      setComment('')
    } catch {}
  }
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const markCommentAsSeenMutation = useMarkCommentAsSeen()

  const handleCommentsClick = async id => {
    if (user?.profile !== 'MAR') {
      try {
        await markCommentAsSeenMutation.mutateAsync(id)
      } catch (error) {}
    }
  }

  const handleChangeState = value => {
    if (value == false) {
      setState('0')
    } else {
      setState('1')
    }
  }

  const [selectedInstaller, setSelectedInstaller] = useState([])

  const [groupedDocs, setGroupedDocs] = useState([])
  const [remainDocs, setRemainDocs] = useState([])
  useEffect(() => {
    if (projectInvoice?.length > 0) {
      const insList = []
      for (let index = 0; index < projectInvoice?.length; index++) {
        const selectedInst = projectInvoice[index]
        insList.push(selectedInst.installer.id)
      }
      setSelectedInstaller(insList)
    }
  }, [projectInvoice])

  const installerColumn = InstallerDocColumn({
    setModalData,
    setIsUpdate,
    showDevisModal: setOpenDevisModal,
    documents: groupedDocs,
    resource: 'installers',
    resource_name: 'Installateurs',
    showAttachModal: setAttachFileDialog,
    setDocumentToAttach: setDocumentToAttach,
    documentToAttach,
    docInstallerId: setInstallerId,
    setFileToDisplay: setFileToDisplay,
    setOpenFile: setOpenFile,
    detailsProject: detailsProject
  })

  const handleAttacheDocument = async file => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('companyId', documentToAttach?.installerId)
      formData.append('external', documentToAttach?.external)

      await uploadDocumentToProjectMutation.mutateAsync({ formData, idDocument: installerId })
      handleCloseAttachFileDialog()
      setSingleFile([])
    } catch (error) {
      const errorsObject = error?.response?.data?.errors
      setformErrorsFiles(errorsObject)
    }
  }

  const handleCloseAttachFileDialog = () => {
    setAttachFileDialog(false)
    setformErrorsFiles(false)
    setSingleFile([])
  }

  const handleExternal = event => {
    setDocumentToAttach(prev => ({
      ...prev,
      external: event.target.checked ? 1 : 0
    }))
  }
  useEffect(() => {
    const countMap = detailsProject?.step_documents?.reduce((acc, doc) => {
      acc[doc.entitled] = (acc[doc.entitled] || 0) + 1

      return acc
    }, {})

    // Step 2: Split documents into grouped and remains
    const groupedDocuments = []
    const remainingDocuments = []

    detailsProject?.step_documents?.forEach(doc => {
      if (doc.type !== 16) {
        if (countMap[doc.entitled] > 1) {
          // If the document has duplicates (count > 1), add it to the grouped array
          groupedDocuments.push(doc)
        } else {
          // If the document is unique, add it to the remaining array
          remainingDocuments.push(doc)
        }
      }
    })

    setRemainDocs(remainingDocuments)
    groupedDocuments.shift()

    setGroupedDocs(groupedDocuments)
  }, [detailsProject])

  return (
    <>
      {user?.profile !== 'INS' && !noDocs && (
        <CustomAccordian
          style={{
            width: '100%'
          }}
          open={false}
          titleAccordian={'Liste des documents'}
        >
          <Grid container spacing={2} p={5}>
            <Grid item xs={12}>
              <StepDocuments
                detailsProject={detailsProject}
                typeProject={detailsProject?.type}
                stepDocuments={remainDocs}
                groupedDocuments={groupedDocs}
                id={detailsProject?.id}
              />
            </Grid>
          </Grid>
        </CustomAccordian>
      )}
      <CustomAccordian
        style={{
          width: '100%'
        }}
        titleAccordian={'Devis Travaux'}
      >
        <Box mt={5} />
        {isWorkListFetching && isProjectInvoiceFetching ? (
          <DevisTravauxLoadingSkeleton />
        ) : (
          <>
            <CrudDataTable
              data={projectInvoice}
              columns={installerColumn}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              isLoading={false}
              resource='installers'
              resource_name='Installateurs'
              titleCrud='Devis / Entreprises retenue '
              handleChangeState={handleChangeState}
              state={state}
              identifier={'installers'}
              addModal={true}
              showBtnAdd={false}
              showDevisModal={() => {
                setOpenDevisModal(true)
              }}
              deleteData={() => {
                setModalData(null), setLocalWorkList([])
              }}
              detailsProject={detailsProject}
            />
          </>
        )}
        {openDevisModal && (
          <CustomModal
            open={openDevisModal}
            widthModal={'xl'}
            handleCloseOpen={() => {
              setOpenDevisModal(false)
              setIsUpdate(false)
              setModalData(null)
            }}
            handleActionModal={() => setOpenDevisModal(false)}
            ModalTitle={'Devis'}
            action={() => setOpenDevisModal(false)}
            btnTitleClose={true}
            btnCanceledTitle='Fermer'
          >
            <Grid Container xs={12} sm={12} md={12}>
              <Grid container spacing={5}>
                <QuoteHeader
                  detailsProject={detailsProject}
                  displayOnly={isUpdate}
                  editableNumFacture={false}
                  projectInvoice={isUpdate ? modalData : refInvoice}
                  editableUser={editableUser}
                  installer={modalData?.installer ?? installer}
                  ListInstaller={
                    isUpdate ? ListInstaller : ListInstaller?.filter(inst => !selectedInstaller.includes(inst.id))
                  }
                  setInstaller={setInstaller}
                  formErrors={formErrors}
                  detailsProfile={modalData?.installer ?? installer}
                  invoiceDate={invoiceDate}
                  setInvoiceDate={setInvoiceDate}
                  isUpdate={isUpdate}
                />
              </Grid>
              <Grid item xs={12} md={2.5}>
                <CardBgBorderGreen
                  bgColor={theme.palette.secondary.beigeBared}
                  borderColor={theme.palette.primary.main}
                >
                  <Stack spacing={2}>
                    <Typography align='center' sx={{ fontWeight: 'bold' }}>
                      Nombre de sauts de classe énergétique:
                    </Typography>
                    <CustomInput
                      size='small'
                      onChange={e => {
                        if (!/^\d+$/.test(e.target.value)) {
                          return
                        }

                        // i want to only accept one digit
                        if (e.target.value.length > 1) {
                          return
                        }

                        setClassSkipNumber(e.target.value)
                      }}
                      value={classSkipNumber}
                      disabled={isUpdate ? modalData.status === 2 : false}
                    />
                  </Stack>
                </CardBgBorderGreen>
              </Grid>

              <Grid mt={10} item xs={12} md={12}>
                <WorkServiceInstaller
                  type={isUpdate ? 'invoice' : 'simulation'}
                  detailsProject={{
                    id: detailsProject?.id,
                    shab: detailsProject?.surface_housing_before_work,
                    nombreEtage: detailsProject?.number_of_floors,
                    mesures: detailsProject?.isolated_surface,
                    classeEnergetique: detailsProject?.performance_energy_before_work,
                    incomeClasse: detailsProject?.income_class,
                    sautClasse: detailsProject?.class_skip

                    // works: isUpdate ? modalData?.lines : detailsProject?.works
                  }}
                  totals={totals}
                  setTotals={setTotals}
                  projectInvoice={projectInvoice}
                  localWorkList={isUpdate ? localWorkList : defaultWorkList}
                  setLocalWorkList={isUpdate ? setLocalWorkList : setDefaultWorkList}
                  listUnit={listUnit}
                  worksList={worksList}
                  handleAddWork={handleAddWork}
                  service={service}
                  isUpdate={isUpdate}
                  disabled={isUpdate ? modalData.status === 2 : false}
                />
              </Grid>

              <Grid mt={5} item xs={12} md={12}>
                <TotalCardTraveaux allAmounts={totals} />
              </Grid>
              <Grid mt={5} item xs={12} md={12} display={'flex'} justifyContent={'space-between'}>
                {projectInstallerInvoiceComments?.data?.length !== 0 && (
                  <LoadingButton
                    loading={verificationDevisMutation?.isPending}
                    size='small'
                    color='primary'
                    className='h-[26px]'
                    variant='contained'
                    onClick={() => setOpenDisplayCommentsDialog(true)}
                    startIcon={<IconifyIcon icon='material-symbols-light:comment-outline' />}
                  >
                    Afficher les commentaires
                  </LoadingButton>
                )}
                <LoadingButton
                  loading={createWorkQuotionMutation.isPending}
                  size='small'
                  color='secondary'
                  className='h-[26px]'
                  variant='contained'
                  disabled={isUpdate ? modalData.status === 2 : false}
                  onClick={() => onSubmit()}
                >
                  Enregistrer
                </LoadingButton>
              </Grid>
              {user?.profile === 'MAR' && (
                <Grid mt={10} item xs={12} md={12} display={'flex'} justifyContent={'space-between'}>
                  {modalData?.status == 2 ? (
                    <LoadingButton
                      loading={validateDevisMutation?.isPending}
                      size='small'
                      color='error'
                      className='h-[26px]'
                      variant='contained'
                      onClick={() => handleCancelDevis()}
                      startIcon={<IconifyIcon icon='ic:outline-cancel' />}
                      disabled={isDisabled}
                    >
                      Annuler Devis
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      loading={verificationDevisMutation?.isPending}
                      size='small'
                      color='warning'
                      className='h-[26px]'
                      disabled={modalData?.status > 1}
                      variant='contained'
                      onClick={() => setIsOpenCommentDialog(true)}
                      startIcon={<IconifyIcon icon='ic:outline-cancel' />}
                    >
                      Demande de verification
                    </LoadingButton>
                  )}
                  <LoadingButton
                    loading={validateDevisMutation?.isPending || isProjectInvoiceFetching}
                    size='small'
                    color='primary'
                    className='h-[26px]'
                    disabled={!modalData?.id || modalData?.status > 1}
                    variant='contained'
                    onClick={() => onValidateDevis()}
                    startIcon={<IconifyIcon icon='ic:round-check' />}
                  >
                    Valider Devis
                  </LoadingButton>
                </Grid>
              )}
            </Grid>
          </CustomModal>
        )}
        {openFile ? (
          <DisplayFileDialog
            src={process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + `/project-documents/${fileToDisplay?.id}/download`}
            open={openFile}
            handleCloseOpen={() => {
              setOpenFile(false)
            }}
            file={fileToDisplay}
          />
        ) : null}
        {attachFileDialog ? (
          <AttachPDocumentDialog
            actionIsLoading={uploadDocumentToProjectMutation?.isPending}
            handleActionClick={handleAttacheDocument}
            handleCloseOpen={handleCloseAttachFileDialog}
            open={attachFileDialog}
            loading={uploadDocumentToProjectMutation?.isPending}
            document={documentToAttach}
            formErrors={formErrorsFiles}
            setformErrorsFiles={setformErrorsFiles}
            singleFile={singleFile}
            setSingleFile={setSingleFile}
            checked={documentToAttach?.external == 1}
            showExternal={true}
            onExternalChange={handleExternal}
          />
        ) : null}
      </CustomAccordian>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Etes-vous sûr d'annuler le devis ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={onCancelDevis}
      />
      <CustomModal
        open={openModalFile}
        handleCloseOpen={() => setOpenModalFile(false)}
        btnTitle={'Ajouter'}
        ModalTitle={'Ajouter un fichier'}
        widthModal={'md'}
        btnCanceledTitle={'Non'}
        btnTitleClose={false}
        action={() => addFile()}
      >
        <CustomFileUploadRestrictions
          fileTypes={['.pdf']}
          limit={100}
          multiple={false}
          formInput={formInput}
          setFormInput={setFormInput}
          showInputName={true}
          name='files'
          fileName={fileName}
        />
      </CustomModal>
      <CustomModal
        open={openFileDialog}
        handleCloseOpen={() => setIsOpenFileDialog(!openFileDialog)}
        handleActionModal={() => setIsOpenFileDialog(!openFileDialog)}
        btnCanceledTitle={'Non'}
        widthModal={'lg'}
        btnTitleClose={false}
      >
        <iframe
          style={{
            borderRadius: 10,
            borderColor: '#90caf975',
            boxShadow:
              '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
            border: '0px solid'
          }}
          title='contrat-pdf'
          src={fileToView?.download_path}
          width='100%'
          height='700px'
        ></iframe>
      </CustomModal>
      <CustomModal
        btnTitle={'Envoyer'}
        ModalTitle={'Verification Devis'}
        open={openCommentDialog}
        handleCloseOpen={() => setIsOpenCommentDialog(!openCommentDialog)}
        handleActionModal={() => setIsOpenCommentDialog(!openCommentDialog)}
        widthModal={'lg'}
        btnTitleClose={false}
        action={handleSubmitVerificatrion}
        isLoading={verificationDevisMutation?.isPending}
      >
        <Box height={200}>
          <TextareaAutosize
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              '&:focus': {
                outline: 'none'
              }
            }}
            fullWidth
            maxRows={20}
            value={comment}
            onChange={event => setComment(event.target.value)}
          />
        </Box>
      </CustomModal>
      <CustomModal
        btnTitle={'Fermer'}
        ModalTitle={'Commentaires'}
        open={openDisplayCommentsDialog}
        handleCloseOpen={() => setOpenDisplayCommentsDialog(!openDisplayCommentsDialog)}
        handleActionModal={() => setOpenDisplayCommentsDialog(!openDisplayCommentsDialog)}
        btnTitleClose={false}
        action={() => setOpenDisplayCommentsDialog(false)}
        widthModal={'sm'}
      >
        <Box height={200}>
          {/* {projectInstallerInvoiceComments?.data?.map((comment, index) => (
            <Box key={index} mb={2}>
              <Typography variant='body1'>{comment?.comment}</Typography>
              <Typography variant='body2' color='text.secondary'>
                {dateFormaterWithTime(comment?.created_at)}
              </Typography>
              <Divider />
            </Box>
          ))} */}
          <List sx={{ p: 0 }}>
            {projectInstallerInvoiceComments?.data?.map((comment, index) => (
              <MailItem
                key={comment.id}
                sx={{
                  backgroundColor: hoveredIndex === index ? 'action.hover' : 'background.paper',
                  cursor: comment?.endpoint == null ? 'default' : 'cursor'
                }}
                onClick={() => {
                  handleCommentsClick(comment.id)
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      overflow: 'hidden',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    <Typography
                      sx={{
                        mr: 4,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        width: ['100%', 'auto'],
                        overflow: ['hidden', 'unset'],
                        textOverflow: ['ellipsis', 'unset']
                      }}
                    >
                      {comment.comment}
                    </Typography>
                    <Typography noWrap variant='body2' sx={{ width: '100%' }}>
                      {comment.description && comment.description}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  className='mail-actions'
                  sx={{ display: 'none', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  {user?.profile !== 'MAR' && (
                    <Tooltip placement='top' title={comment.vue === 1 ? '' : 'Traiter le commentaire !'}>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation()
                          handleCommentsClick(comment.id, comment.vue)
                        }}
                      >
                        <IconifyIcon icon={'mdi:comments'} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Box
                  className='mail-info-right'
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <Typography
                    variant='caption'
                    sx={{
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      ml: 2,
                      color: comment.state === 1 ? '#9bcb0c' : 'red',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconifyIcon icon={'mdi:circle-small'} />
                    {comment.state === 1 ? 'Traité' : 'Non traité'}
                  </Typography>
                </Box>
              </MailItem>
            ))}
          </List>
        </Box>
      </CustomModal>
    </>
  )
}

export default DevisTravaux

async function urlToFile(url, filename, mimeType) {
  const res = await fetch(url)
  const blob = await res.blob()

  return new File([blob], filename, { type: mimeType })
}
