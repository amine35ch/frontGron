import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import CustomTableCellHeader from '../CustomTableCellHeader'
import RowTableCell from '../RowTableCell'

const CustomTable = ({ data, columns }) => {
  return (
    <TableContainer
      sx={{
        '&.MuiTableContainer-root': {
          borderRadius: 0
        }
      }}
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                {column?.label}
              </CustomTableCellHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
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
  )
}

export default CustomTable
