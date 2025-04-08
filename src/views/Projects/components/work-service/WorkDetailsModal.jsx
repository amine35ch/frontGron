import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  IconButton,
  Divider,
  DialogTitle,
  Card,
  CardContent
} from '@mui/material'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import IconifyIcon from 'src/@core/components/icon'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { Box } from '@mui/system'
import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import CustomeAutoCompleteSelectMultiple from 'src/components/CustomeAutoCompleteSelectMultiple'
import dynamic from 'next/dynamic'
import RowTableCell from 'src/components/RowTableCell'
import { workModalProductColumns, workModalServiceColumns } from './columns/workModalProductColumns'
import { set } from 'nprogress'
import toast from 'react-hot-toast'
import { ar } from 'date-fns/locale'
import { cloneDeep } from 'lodash'
import { findLastIndex } from 'src/@core/utils/utilities'
import moment from 'moment'
import { useGetArticles } from 'src/services/articles.service'

const DynamicQuill = dynamic(() => import('./QuillJs'), { ssr: false })

const WorkDetailsModal = ({
  isDialogOpen,
  onDeleteArticle,
  listArticles,
  closeDialog,
  onSelectArticle,
  row,
  disabledInput,

  sousTraitantsList,
  user,
  localWorkList,
  setLocalWorkList,
  setTotals,
  totals
}) => {
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts
  } = useGetArticles({ state: 1, type: '0' })
  const currentProducts = productsData?.filter(product => row?.product_ids?.includes(product?.id)) ?? []
  const currentServices = listArticles?.filter(service => row?.article_ids?.includes(service?.id)) ?? []
  const [currentProductList, setCurrentProductList] = useState(cloneDeep(currentProducts))
  const [currentServiceList, setCurrentServiceList] = useState(cloneDeep(currentServices))

  const handleAddProductLine = () => {
    const newProduct = {
      id: '',
      reference: '',
      prix_vente_ht: 0
    }

    // if there is a line with empty values, do not add another one
    if (currentProductList.some(product => product.id === '')) {
      return
    }
    setCurrentProductList([...currentProductList, newProduct])
  }

  const handleAddServiceLine = () => {
    const newService = {
      id: '',
      designation: '',
      prix_vente_ht: 0
    }

    // if there is a line with empty values, do not add another one
    if (currentServiceList.some(service => service.id === '')) {
      return
    }
    setCurrentServiceList([...currentServiceList, newService])
  }

  const handleSelectProduct = (productId, index) => {
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === row?.d_work_id)
    const localProductData = [...productsData]
    const localProductList = [...currentProductList]
    const localCostHT = totals.amount_ht - parseFloat(row['cost_invoice_ht'])
    const localCostTTC = totals.amount_TTC - parseFloat(row['cost_invoice_ttc'])

    // if product id undefined remove product from list
    if (!productId) {
      const productIdToRemove = localProductList[index].id
      localProductList.splice(index, 1)

      work['price_unit_ht'] = localProductList.reduce((acc, product) => acc + product.prix_vente_ht, 0)

      row['cost_invoice_ht'] = work['price_unit_ht'] * row['qty']

      row['cost_invoice_ttc'] =
        parseFloat(row['cost_invoice_ht']) + parseFloat(row['cost_invoice_ht']) * parseFloat(row['tva'])

      work['product_ids'] = localProductList.map(product => product.id)

      // remove product from work description_v2 wichis an array that contain type 0 and id of product
      work['description_v2'] = work['description_v2'].filter(
        description => description.type !== 0 || description.id !== productIdToRemove
      )

      setLocalWorkList(newLocalWorkList)
      setCurrentProductList(localProductList)
      setTotals(prev => {
        return {
          ...prev,
          amount_ht: localCostHT + parseFloat(row['cost_invoice_ht']),
          amount_ttc: localCostTTC + parseFloat(row['cost_invoice_ttc'])
        }
      })

      return
    }

    const currentProduct = localProductData.find(product => product.id === productId)
    localProductList[index] = currentProduct

    work['product_ids'] = localProductList.map(product => product.id)

    if (row['cost_ht_simulation'] == 0) {
      if (user?.profile !== 'MAR' && currentProduct?.prix_vente_ht > row['price_unit_ht']) {
        toast.error('Le montant HT ne doit pas dépasser le montant HT de la simulation', { duration: 5000 })
      } else {
        calculateAndUpdateCosts(
          row,
          work,
          currentProduct,
          productId,
          localProductList,
          newLocalWorkList,
          localCostHT,
          localCostTTC
        )
      }
    } else {
      if (user?.profile !== 'MAR' && currentProduct?.prix_vente_ht > row['cost_ht_simulation']) {
        toast.error('Le montant HT ne doit pas dépasser le montant HT de la simulation', { duration: 5000 })
      } else {
        calculateAndUpdateCosts(
          row,
          work,
          currentProduct,
          productId,
          localProductList,
          newLocalWorkList,
          localCostHT,
          localCostTTC
        )
      }
    }
  }

  // dsqsdqsd

  const calculateAndUpdateCosts = (
    row,
    work,
    currentProduct,
    productId,
    localProductList,
    newLocalWorkList,
    localCostHT,
    localCostTTC
  ) => {
 

    work['cost_ht_simulation'] = row['cost_invoice_ht']

    work['price_unit_ht'] = localProductList.reduce((acc, product) => acc + product.prix_vente_ht, 0)

    row['cost_invoice_ht'] = work['price_unit_ht'] * row['qty']
    row['cost_invoice_ttc'] =
      parseFloat(row['cost_invoice_ht']) + parseFloat(row['cost_invoice_ht']) * parseFloat(row['tva'])

    const lastProductIndex = findLastIndex(work['description_v2'], description => description.type === 0)

    const scalesString = currentProduct?.scales?.map(scale => wrapInTags(scale.entitled, scale.value)).join('')
    let content = `${currentProduct.designation} ${scalesString}`
    const descriptionV2 = descriptionFormatter(0, productId, content)

    if (lastProductIndex !== -1) {
      work['description_v2'].splice(lastProductIndex + 1, 0, descriptionV2)
    } else {
      work['description_v2'] = [descriptionV2, ...work['description_v2']]
    }

    setCurrentProductList(localProductList)
    setLocalWorkList(newLocalWorkList)
    setTotals(prev => ({
      ...prev,
      amount_ht: localCostHT + parseFloat(row['cost_invoice_ht']),
      amount_ttc: localCostTTC + parseFloat(row['cost_invoice_ttc'])
    }))
  }

  const handleSelectService = (serviceId, index) => {
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === row?.d_work_id)
    const localServiceData = [...listArticles]
    const localServiceList = [...currentServiceList]

    if (!serviceId) {
      const serviceToRemoveId = localServiceList[index].id
      localServiceList.splice(index, 1)

      work['article_ids'] = localServiceList.map(service => service.id)

      work['description_v2'] = work['description_v2'].filter(
        description => description.type !== 1 || description.id !== serviceToRemoveId
      )
      setLocalWorkList(newLocalWorkList)
      setCurrentServiceList(localServiceList)

      return
    }

    const currentService = localServiceData.find(product => product.id === serviceId)
    localServiceList[index] = currentService
    work['article_ids'] = localServiceList.map(service => service.id)

    const descriptionV2 = descriptionFormatter(1, serviceId, currentService.designation)

    // i want to find the last product index

    const lastProductIndex = findLastIndex(work['description_v2'], description => description.type === 0)
    const lastServiceIndex = findLastIndex(work['description_v2'], description => description.type === 1)

    // if there is a service inbdex so add the service after it
    if (lastServiceIndex !== -1) {
      work['description_v2'].splice(lastServiceIndex + 1, 0, descriptionV2)
    } else if (lastProductIndex !== -1) {
      // if there is a product index so add the service after it
      work['description_v2'].splice(lastProductIndex + 1, 0, descriptionV2)
    } else {
      // if there is no product or service add the service at the end
      work['description_v2'] = [descriptionV2, ...work['description_v2']]
    }

    setCurrentServiceList(localServiceList)
    setLocalWorkList(newLocalWorkList)
  }



  const handleRemoveProductRow = index => {
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === row?.d_work_id)
    const localProductList = [...currentProductList]
    const localCostHT = totals.amount_ht - parseFloat(row['cost_invoice_ht'])
    const localCostTTC = totals.amount_TTC - parseFloat(row['cost_invoice_ttc'])
    const productIdToRemove = localProductList[index].id
    localProductList.splice(index, 1)
    if (currentProductList[0]?.prix_vente_ht == 0 || currentProductList[0]?.prix_vente_ht > work?.cost_ht_simulation) {
    } else {
      work['price_unit_ht'] = localProductList.reduce((acc, product) => acc + product.prix_vente_ht, 0)
    }


    row['cost_invoice_ht'] = work['price_unit_ht'] * row['qty']

    row['cost_invoice_ttc'] =
      parseFloat(row['cost_invoice_ht']) + parseFloat(row['cost_invoice_ht']) * parseFloat(row['tva'])

    setCurrentProductList(localProductList)
    work['product_ids'] = localProductList.map(product => product.id)
    work['description_v2'] = work['description_v2'].filter(
      description => description.type !== 0 || description.id !== productIdToRemove
    )
    setLocalWorkList(newLocalWorkList)
    setTotals(prev => {
      return {
        ...prev,
        amount_ht: localCostHT + parseFloat(row['cost_invoice_ht']),
        amount_ttc: localCostTTC + parseFloat(row['cost_invoice_ttc'])
      }
    })
  }

  const handleRemoveServiceRow = index => {
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === row?.d_work_id)
    const localServiceList = [...currentServiceList]
    const serviceId = localServiceList[index].id
    localServiceList.splice(index, 1)

    work['article_ids'] = localServiceList.map(service => service.id)

    work['description_v2'] = work['description_v2'].filter(
      description => description.type !== 1 || description.id !== serviceId
    )

    setCurrentServiceList(localServiceList)

    setLocalWorkList(newLocalWorkList)
  }

  const columns = workModalProductColumns(
    row?.product_ids,
    handleSelectProduct, // select function
    productsData,
    disabledInput,
    handleRemoveProductRow, // remove function
    handleAddProductLine // add function
  )

  const serviceColumns = workModalServiceColumns(
    row?.article_ids,
    handleSelectService, // select function
    listArticles,
    disabledInput,
    handleRemoveServiceRow, // remove function
    handleAddServiceLine // add function
  )

  const handleAddSousTraitant = value => {
    const newLocalWorkList = [...localWorkList]
    const work = newLocalWorkList?.find(work => work?.d_work_id === row?.d_work_id)

    work['d_sub_contractor_id'] = value ?? ''

    const subContractor = sousTraitantsList.find(subContractor => subContractor.id === value)

    const descriptionV2 = descriptionFormatter(2, value, textFromater(subContractor, row))

    work['description_v2'] = work['description_v2'].filter(description => description.type !== 2)
    work['description_v2'] = [...work['description_v2'], descriptionV2]
    setLocalWorkList(newLocalWorkList)
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth='md'>
      <DialogTitle>
        <Typography color='primary' fontSize={30} align='center' fontWeight='bold'>
          {row?.entitled}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
                <Typography fontSize={20} align='center' fontWeight='bold'>
                  Sélectionner des Produits
                </Typography>
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
                      {currentProductList?.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
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
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
                <Typography fontSize={20} align='center' fontWeight='bold'>
                  Sélectionner des Prestations
                </Typography>

                <TableContainer component={Paper}>
                  <Table aria-label='collapsible table'>
                    <TableHead>
                      <TableRow>
                        {serviceColumns?.map((column, index) => (
                          <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                            {column?.label}
                          </CustomTableCellHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentServiceList?.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {serviceColumns.map((column, index) => (
                            <RowTableCell {...column} key={index}>
                              {column?.renderCell ? (
                                column.renderCell({ row, index: rowIndex })
                              ) : (
                                <Typography> {row[column.field]}</Typography>
                              )}
                            </RowTableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* <CustomeAutoCompleteSelectMultiple
              uniqueOption='id'
              disabled={disabledInput}
              value={row?.product_ids}
              onChange={value => handleAddProductsToWork(value)}
              data={productsData}
              optionLabel={'reference'}
            /> */}
          </Grid>

          {/* <Grid item xs={12} md={8}>
            <CustomeAutoCompleteSelectMultiple
              uniqueOption='id'
              disabled={disabledInput}
              value={row?.article_ids}
              onChange={value => handleChangeArticles(value)}
              data={listArticles}
              optionLabel={'reference'}
            />
          </Grid> */}
          <Grid item xs={12} md={3}></Grid>

          <Grid item xs={12} md={6}>
            <Box mt={2} />
            <Typography fontSize={20} align='center' fontWeight='bold'>
              Sélectionner un Sous-Traitant (Facultatif)
            </Typography>
            {user?.profile === 'MAR' ? (
              <TextField disabled size='small' fullWidth value={row?.sub_contractor?.trade_name} variant='outlined' />
            ) : (
              <CustomeAutoCompleteSelect
                option='id'
                disabled={disabledInput}
                value={row?.d_sub_contractor_id}
                onChange={value => handleAddSousTraitant(value)}
                data={sousTraitantsList}
                displayOption={'trade_name'}
              />
            )}
          </Grid>
          <Grid item xs={12} md={1}></Grid>
          {/* <Grid item xs={12} md={10}>
            <Divider />
          </Grid> */}
          {/* <Grid item xs={12} md={12}>
            <Box sx={{ height: '350px' }}>
              <DynamicQuill value={row?.description || ''} handleSetCurrentQuillInstance={() => {}} />
            </Box>
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box>
          <Button variant='outlined' onClick={closeDialog} color='primary'>
            Fermer
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default WorkDetailsModal

const textFromater = (subContractor, row) => {
  const rge = subContractor?.rges?.find(rge => rge.qualifications.includes(row?.qualification?.type))

  return `<strong><p>Travaux sous traités auprès de l'entreprise ${subContractor?.trade_name}, ${
    subContractor?.address
  } SIRET ${subContractor?.siret}, ${row?.qualification?.entitled} RGE ${rge?.rge} EDITÉ LE ${moment(
    rge?.start_date
  ).format('DD-MM-YYYY')} VALABLE JUSQU'AU ${moment(rge?.end_date).format('DD-MM-YYYY')}</p></strong>`
}

const wrapInTags = (firstParam, secondParam) => {
  if (!secondParam) return ''
  const strongWrapped = `<strong>. ${firstParam}:</strong>`
  const paragraphWrapped = `<p>${strongWrapped} ${secondParam}</p>`

  return paragraphWrapped
}

const descriptionFormatter = (type, id, content) => {
  return {
    type,
    id,
    content
  }
}
