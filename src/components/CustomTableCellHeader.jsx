import { TableCell, styled } from '@mui/material'

const CustomTableCellStyle = styled(TableCell)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 'bold',
  pl: 3,
  whiteSpace: 'nowrap',
  borderTopLeftRadius: 15,
  '&.MuiTableCell-head': {
    fontSize: 18
  }
}))

const CustomTableCellHeader = props => {
  const { children, ...rest } = props

  return <CustomTableCellStyle {...rest}>{children}</CustomTableCellStyle>
}

export default CustomTableCellHeader
