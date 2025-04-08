import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

// ** React Imports
import dynamic from 'next/dynamic'
import { useRef } from 'react'

const DynamicQuill = dynamic(() => import('./QuillJs'), { ssr: false })
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import RowTableCell from 'src/components/RowTableCell'

// import QuillEditor from './QuillJs'

const InvoiceTableInstaller = ({ columns, data, handleChangeDescription }) => {
  const quillRef = useRef(null)

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'] // remove formatting button
    ]
  }

  const handleClick = () => {
    if (quillRef.current) {
      quillRef.current.addProduct()
    }
  }

  return (
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
          {data?.map((row, rowIndex) => (
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
              <TableRow key={rowIndex}>
                <RowTableCell colSpan={3}>
                  <Box sx={{ height: '350px' }}>
                    <DynamicQuill
                      ref={quillRef}
                      key={rowIndex}
                      value={row.description || ''}
                      onChange={value => handleChangeDescription(rowIndex, value)}
                    />
                  </Box>
                </RowTableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InvoiceTableInstaller
