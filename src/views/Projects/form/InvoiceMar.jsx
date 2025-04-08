import { Divider, Grid, Stack, Typography, useTheme } from '@mui/material'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useEffect, useMemo, useState } from 'react'
import TotalCard from '../components/InvoiceTotalCard'
import { useGetArticles } from 'src/services/articles.service'
import {
  useGetProjectInvoiceByType,
  useUpdateProjectInvoice,
  useValidateInvoiceMutation
} from 'src/services/project.service'
import { useAuth } from 'src/hooks/useAuth'
import { useGetMarScales } from 'src/services/settings.service'
import { LoadingButton } from '@mui/lab'
import ProjectMarInvoiceLinesTable from '../components/ProjectMarInvoiceLinesTable'
import moment from 'moment/moment'
import { marAmount } from 'src/views/simulator/simulateCalculator'

import QuoteHeader from './QuoteHeader'
import { totalHT, totalTVA } from '../components/ProjectInvoiceCalculator'

const ProjectMarInvoice = ({ displayOnly = false, detailsProject }) => {
  const theme = useTheme()
  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const auth = useAuth()
  const [totalHt, setTotalHt] = useState(0)
  const [invoiceLines, setInvoiceLines] = useState([])
  const isDisabled = detailsProject.isEditable

  const [allAmounts, setAllAmounts] = useState({
    totalHt: 0,
    totalTva: 0,
    totalTTC: 0
  })

  const updateInvoiceMutation = useUpdateProjectInvoice({ id: detailsProject?.id })
  const validateInvoiceMutation = useValidateInvoiceMutation({ id: detailsProject?.id })

  const {
    data: projectInvoice,
    isLoading: isProjectInvoiceLoading,
    isSuccess: isProjectInvoiceSuccess
  } = useGetProjectInvoiceByType({ id: detailsProject?.id, type: 0 })

  const { data: articles, isLoading: isLoadingArticles, isSuccess: isSuccessArticles } = useGetArticles({ type: 2 })

  const { data: marScaleList, isSuccess: marScaleListIsSuccess, isLoading: marScaleListIsLoading } = useGetMarScales()

  useEffect(() => {
    if (isProjectInvoiceSuccess && !isProjectInvoiceLoading && projectInvoice?.lines) {
      setInvoiceLines([...projectInvoice?.lines])
      setInvoiceDate(projectInvoice?.invoice_date)
      const totalTva = totalTVA(projectInvoice?.lines)
      const totalHt = totalHT(projectInvoice?.lines)
      const totalTTC = totalTva + totalHt

      setAllAmounts({
        totalHt: totalHt,
        totalTva: totalTva,
        totalTTC: totalTTC
      })
    }
  }, [isProjectInvoiceSuccess, isProjectInvoiceLoading, projectInvoice])

  const anahAmounts = useMemo(() => {
    if (!marScaleListIsSuccess) {
      return {
        amountHT: '',
        amountTVA: '',
        amountTTC: ''
      }
    }
    const amounts = marAmount(detailsProject?.income_class, marScaleList)

    return {
      amountHT: (amounts - amounts * auth?.user?.company?.tva) * -1,
      amountTVA: amounts * auth?.user?.company?.tva * -1,
      amountTTC: amounts
    }
  }, [detailsProject?.income_class, marScaleListIsSuccess, auth?.user?.company?.tva, marScaleList])

  // const allAmounts = useMemo(() => {
  //   return {
  //     totalHt: totalHt,
  //     amountTva: totalHt * auth?.user?.company?.tva,
  //     totalTTC: totalHt + totalHt * auth?.user?.company?.tva
  //   }
  // }, [totalHt, auth?.user?.company?.tva])

  const handleSubmitInvoice = async () => {
    const dataInvoiceLines = invoiceLines?.map(item => ({
      ...item,
      unit_price_HT: parseFloat(String(item.unit_price_HT).replace(',', '.')),
      qty: parseFloat(String(item.qty).replace(',', '.'))
    }))

    try {
      const data = {
        invoiceId: projectInvoice?.id,
        lines: dataInvoiceLines,
        invoice_date: moment(invoiceDate).format('YYYY-MM-DD'),
        TTC_rest: allAmounts.totalTTC - anahAmounts.amountTTC,
        TVA_rest: allAmounts.totalTva - anahAmounts.amountTVA,
        HT_rest: allAmounts.totalHt - anahAmounts.amountHT,
        HT_total: allAmounts.totalHt,
        TVA_total: allAmounts.totalTva,
        TTC_total: allAmounts.totalTTC,
        TTC_anah: anahAmounts.amountTTC,
        TVA_anah: anahAmounts.amountTVA,
        HT_anah: anahAmounts.amountHT,
        type: 0
      }
      await updateInvoiceMutation.mutateAsync(data)
    } catch (error) {}
  }

  const handleValdiateInvoice = async decision => {
    try {
      await validateInvoiceMutation.mutateAsync({ state: decision })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={5}>
        <QuoteHeader
          detailsProject={detailsProject}
          projectInvoice={projectInvoice}
          displayOnly={displayOnly}
          editableNumFacture={false}
          editableUser={false}
          detailsProfile={detailsProject?.mar}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
        />

        <Grid
          mt={5}
          flexDirection={'column'}
          alignItems={'center'}
          display={'flex'}
          justifyContent={'center'}
          p={8}
          item
          xs={12}
          md={12}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
            {detailsProject?.income_class_details}
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <ProjectMarInvoiceLinesTable
            hideButtons={projectInvoice?.state > 0}
            company={auth?.user?.company}
            listArticles={articles}
            localeRows={invoiceLines}
            setLocaleRows={setInvoiceLines}
            setTotalHt={setTotalHt}
            anahAmounts={anahAmounts}
            allAmounts={allAmounts}
            setAllAmounts={setAllAmounts}
            detailsProject={detailsProject}
          />
        </Grid>
        <Grid item sx={{ mt: 3 }} xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={12} pt={10}>
          <TotalCard
            preferences={{}}
            allAmounts={{
              montantHT: allAmounts.totalHt + anahAmounts.amountHT,
              montantTVA: allAmounts.totalTva + anahAmounts.amountTVA,
              montantTTC: allAmounts.totalTTC - anahAmounts.amountTTC
            }}
          />
        </Grid>
        <Grid item xs={12} md={12} pt={10}>
          <Stack spacing={2} direction='row' justifyContent={'flex-end'}>
            <LoadingButton
              loading={updateInvoiceMutation.isPending}
              onClick={handleSubmitInvoice}
              variant='outlined'
              color='secondary'
              disabled={isDisabled}
            >
              Enregistrer
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ProjectMarInvoice
