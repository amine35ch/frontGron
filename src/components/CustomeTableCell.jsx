import { TableCell } from '@mui/material'
import { styled } from '@mui/material/styles'

const TableCellCustom = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: 'transparent',
    lineHeight: '0.1rem',
    fontSize: '15px',
    color: theme.palette.primary.dark,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100px'
  }
}))

const CustomTableCell = props => {
  return (
    <TableCellCustom
      variant='head'
      align='center'
      key={props?.column?.id}
      sx={{
        minWidth: props?.column?.minWidth
      }}
    >
      {props?.children ? props?.children : props?.column.label}
    </TableCellCustom>
  )
}

export default CustomTableCell
