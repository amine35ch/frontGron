import { Card, CardContent, Divider, Grid, Stack, Typography, useTheme } from '@mui/material'
import Image from 'next/image'

import CardBgBorderGreen from 'src/components/CardBgBorderGreen'
import DataRangePicker from 'src/components/DataRangePicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useCallback, useEffect, useState } from 'react'
import addDays from 'date-fns/addDays'
import ProjectInvoiceLinesTable from '../components/ProjectInvoiceLinesTable'
import TotalCard from '../components/InvoiceTotalCard'
import { useGetArticles } from 'src/services/articles.service'
import { useGetProjectInvoice, useUpdateProjectInvoice, useValidateInvoiceMutation } from 'src/services/project.service'
import { useAuth } from 'src/hooks/useAuth'
import { totalHT } from '../components/ProjectInvoiceCalculator'
import { useGetBonus, useGetMarScales } from 'src/services/settings.service'
import { bonusAmount, marAmount, marscale, passoire, restMar } from 'src/views/simulator/simulateCalculator'
import user from 'src/store/apps/user'
import { dateFormater } from 'src/@core/utils/utilities'
import { LoadingButton } from '@mui/lab'
import CustomDatePicker from 'src/components/CustomDatePicker'
import moment from 'moment'

const ProjectInvoice = ({ displayOnly = false, detailsProject }) => {
  const theme = useTheme()

  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).format('YYYY-MM-DD hh:mm'),
    endDate: moment(addDays(new Date(), 7)).format('YYYY-MM-DD hh:mm')
  })
  const auth = useAuth()
  const [totalHt, setTotalHt] = useState(0)
  const [invoiceLines, setInvoiceLines] = useState([])
  const { data: bonusList, isSuccess: bonusListIsSuccess, isLoading: bonusListIsLoading } = useGetBonus()

  const updateInvoiceMutation = useUpdateProjectInvoice({ id: detailsProject?.id })
  const validateInvoiceMutation = useValidateInvoiceMutation({ id: detailsProject?.id })

  const {
    data: projectInvoice,
    isLoading: isProjectInvoiceLoading,
    isSuccess: isProjectInvoiceSuccess
  } = useGetProjectInvoice({ id: detailsProject?.id })
  const { data: articles, isLoading: isLoadingArticles, isSuccess: isSuccessArticles } = useGetArticles({ access: 1 })

  const {
    data: invoiceDetails,
    isLoading: isLoadingInvoice,
    isSuccess: isSuccessInvoice
  } = useGetProjectInvoice({ id: detailsProject?.id })

  const { data: marScaleList, isSuccess: marScaleListIsSuccess, isLoading: marScaleListIsLoading } = useGetMarScales()

  useEffect(() => {
    if (isProjectInvoiceSuccess) {
      setTotalHt(projectInvoice?.HT_total)
      setInvoiceLines([])
      setDateRange({
        startDate: dateFormater(projectInvoice?.start_date),
        endDate: dateFormater(projectInvoice?.end_date)
      })
    }
  }, [isProjectInvoiceSuccess])

  const totalBonus = useCallback(() => {
    const bonus = bonusAmount(
      detailsProject?.class_skip,
      bonusList,
      detailsProject?.income_class,
      detailsProject?.energy_class
    )
    if (bonus?.cap !== 0) {
      return {
        amount: totalHt * bonus?.percentage > bonus?.cap ? bonus?.cap : totalHt * bonus?.percentage,
        cap: bonus?.cap
      }
    }

    return { amount: totalHt * bonus?.percentage, cap: 0 }
  }, [totalHt, bonusListIsSuccess])

  const passBonus = useCallback(() => {
    const bonus = passoire(bonusList, detailsProject?.income_class)
    const passBonus = totalHt * bonus?.percentage
    const totalBonusDetails = totalBonus()

    return totalBonusDetails.amount + passBonus >= totalBonusDetails.cap
      ? totalBonusDetails.cap - totalBonusDetails.amount
      : passBonus
  }, [detailsProject?.income_class, totalHt, bonusListIsSuccess])

  // const racMar = restMar(detailsProject.income_class, marScaleList)

  const allAmounts = useCallback(() => {
    return {
      totalHt,
      totalBonus: totalBonus().amount,
      passBonus: passBonus(),
      bonus: totalBonus().amount + passBonus(),
      cap: totalBonus().cap,
      amountTva: totalHt * auth?.user?.company?.tva,
      totalTTC: totalHt + totalHt * auth?.user?.company?.tva,
      racMar: restMar(detailsProject?.income_class, marScaleList)
    }
  }, [totalHt, bonusListIsSuccess, marScaleListIsSuccess])

  const handleSubmitInvoice = async () => {
    try {
      const data = {
        ...projectInvoice,
        lines: invoiceLines,
        start_date: dateRange.startDate,
        end_date: dateRange.startDate,
        plafond_prime: allAmounts().cap,
        prime_renov: allAmounts().totalBonus,
        HT_total: totalHt,
        TTC_total: allAmounts().totalTTC,
        prime_renov_bonification: allAmounts().bonus,
        rac: totalHt - allAmounts().bonus,
        rac_mar: allAmounts()?.racMar
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
      <Grid container spacing={5} p={10}>
        <h1>{projectInvoice?.reference}</h1>
        <Grid item xs={12} md={7}>
          <Image src={projectInvoice?.installer?.logo} width={250} height={100} alt='logo' />
        </Grid>
        <Grid item xs={0} md={2.5}>
          {projectInvoice?.reference}
        </Grid>
        <Grid item xs={12} md={2.5}>
          <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 'bold' }}>{projectInvoice?.reference}</Typography>
              {displayOnly ? (
                <Typography sx={{ fontWeight: 'bold' }}>{projectInvoice?.invoice_date}</Typography>
              ) : (
                <>
                  {/* <DataRangePicker backendFormat='DD-MM-YYYY' dateRange={dateRange} setDateRange={setDateRange} /> */}
                  <CustomDatePicker
                    CustomeInputProps={{
                      variant: 'standard',
                      sx: {
                        '& .MuiInputBase-root': {
                          '& input': {
                            textAlign: 'center'
                          }
                        },
                        '& .MuiInput-underline:before': {
                          borderBottom: 'none'
                        },

                        // remove focus underline
                        '& .MuiInput-underline:after': {
                          borderBottom: 'none'
                        },

                        // remove hover underline
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                          borderBottom: 'none'
                        }
                      }
                    }}
                    dateFormat={'dd/MM/yyyy'}
                    backendFormat={'YYYY-MM-DD'}
                    dateValue={dateRange.startDate}
                    setDate={date => {
                      setDateRange({ ...dateRange, startDate: date })
                    }}
                  />
                </>
              )}
            </Stack>
          </CardBgBorderGreen>
        </Grid>
        <Grid item xs={12} md={3}>
          <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 'bold' }}>{detailsProject?.client?.reference}</Typography>
              <Typography
                sx={{}}
              >{`${detailsProject?.client?.first_name} ${detailsProject?.client?.last_name}`}</Typography>
              <Typography sx={{}}>{detailsProject?.client?.address}</Typography>
              <Typography sx={{}}>{detailsProject?.client?.email_contact}</Typography>
              <Typography sx={{}}>{detailsProject?.client?.phone_number_1}</Typography>
            </Stack>
          </CardBgBorderGreen>
        </Grid>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={3}>
          <CardBgBorderGreen bgColor={theme.palette.secondary.beigeBared} borderColor={theme.palette.primary.main}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 'bold' }}>{detailsProject?.installer?.trade_name}</Typography>
              <Typography sx={{}}>{detailsProject?.installer?.address}</Typography>
              <Typography sx={{}}>{detailsProject?.installer?.email}</Typography>
              <Typography sx={{}}>{detailsProject?.installer?.phone_number_1}</Typography>
            </Stack>
          </CardBgBorderGreen>
        </Grid>
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
            {detailsProject?.scenario_details?.entitled}
          </Typography>
          <Typography pt={2} pr={10} pl={10}>
            {detailsProject?.income_class_details}
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <ProjectInvoiceLinesTable
            hideButtons={projectInvoice?.state > 0}
            company={auth?.user?.company}
            listArticles={articles}
            localeRows={invoiceLines}
            setLocaleRows={setInvoiceLines}
            setTotalHt={setTotalHt}
          />
        </Grid>
        <Grid item sx={{ mt: 3 }} xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={12} pt={10}>
          <TotalCard preferences={{}} allAmounts={{ ...allAmounts() }} />
        </Grid>
        {auth?.user?.profile === 'INS' && invoiceDetails?.state === 0 ? (
          <Grid item xs={12} md={12} pt={10} display={'flex'} justifyContent={'flex-end'}>
            <LoadingButton onClick={handleSubmitInvoice} loading={updateInvoiceMutation?.isLoading} variant='outlined'>
              Enregister
            </LoadingButton>
          </Grid>
        ) : null}
        {invoiceDetails?.state === 0 && auth?.user?.profile === 'MAR' ? (
          <Grid item xs={12} md={12} mt={5} display={'flex'} justifyContent={'space-between'}>
            <LoadingButton
              onClick={() => handleValdiateInvoice(2)}
              loading={validateInvoiceMutation?.isLoading}
              variant='outlined'
              color='error'
            >
              Annuler
            </LoadingButton>
            <LoadingButton
              onClick={() => handleValdiateInvoice(1)}
              loading={validateInvoiceMutation?.isLoading}
              variant='outlined'
            >
              Valider
            </LoadingButton>
          </Grid>
        ) : null}
        {/* {invoiceDetails?.state === 1 && auth?.user?.profile === 'INS' ? (
          <Grid item xs={12} md={12} mt={5} display={'flex'} justifyContent={'space-between'}>

            <LoadingButton
              onClick={() => handleValdiateInvoice(1)}
              loading={validateInvoiceMutation?.isLoading}
              variant='outlined'
            >
              Generer Facture
            </LoadingButton>
          </Grid>
        ) : null} */}
      </Grid>
    </DatePickerWrapper>
  )
}

export default ProjectInvoice
