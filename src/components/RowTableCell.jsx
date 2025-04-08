import { TableCell } from '@mui/material'
import { styled } from '@mui/system'

// style TableCell component height
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none'
}))

const RowTableCell = ({ children, ...rest }) => {
  return (
    <CustomTableCell size='small' {...rest}>
      {children}
    </CustomTableCell>
  )
}

export default RowTableCell
