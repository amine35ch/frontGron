import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox, // Import Checkbox from @mui/material
  IconButton
} from '@mui/material'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import IconifyIcon from 'src/@core/components/icon'
import CustomCurrencyInput from 'src/components/CustomeCurrencyInput'
import { Box } from '@mui/system'

const SelectArticleDialog = ({
  isDialogOpen,
  onDeleteArticle,
  listArticles,
  selectedArticles,
  closeDialog,
  onSelectArticle
}) => {
  const handleAddArticle = article => {
    onSelectArticle(article)
  }

  const handleRemoveArticle = article => {
    onDeleteArticle(article)
  }

  // const handleConfirmSelection = () => {
  //   // Pass the selected articles back to the parent component
  //   onSelectArticle(selectedItems)
  //   closeDialog()
  // }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'lg'}>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCellHeader width={10} align='center' />
                <CustomTableCellHeader width={600} align='center'>
                  LIBELLÉ
                </CustomTableCellHeader>
                <CustomTableCellHeader align='center'>Prix unit</CustomTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {listArticles?.map((article, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align='center'>
                      {selectedArticles.find(selectedArticle => selectedArticle.d_article_id === article.id) ? (
                        <IconButton color='primary' onClick={() => handleRemoveArticle(article)}>
                          <IconifyIcon icon='mdi:minus' />
                        </IconButton>
                      ) : (
                        <IconButton color='secondary' onClick={() => handleAddArticle(article)}>
                          <IconifyIcon icon='mdi:plus' />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align='center'>{article?.designation}</TableCell>
                    <TableCell align='center'>
                      <CustomCurrencyInput value={article?.unit_price} displayType='text' />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {(!listArticles || (listArticles && !listArticles.length)) && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '81px' }}>
            <div>Aucun article trouvé</div>
          </div>
        )}
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

export default SelectArticleDialog
