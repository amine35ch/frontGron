import { TableRow } from '@mui/material'
import { styled } from '@mui/material/styles'

const TableRowCustome = styled(TableRow)(({ theme }) => ({
  '&.css-1fq1npq-MuiTableHead-root': {
    backgroundColor: 'transparent',
    lineHeight: '0.1rem'
  }
}))

const CustomeTableRow = ({ children, ...rest }) => {
  return <TableRowCustome {...rest}>{children}</TableRowCustome>
}

export default CustomeTableRow
