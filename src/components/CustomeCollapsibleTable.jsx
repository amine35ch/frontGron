import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconifyIcon from 'src/@core/components/icon'
import CustomTableCellHeader from '../CustomTableCellHeader'

function Row(props) {
  const { row, columns, rowIndex, columnsWork, setrowTable, displayNameLines } = props
  const [open, setOpen] = React.useState(false)

  const handleOpenRow = row => {
    setOpen(!open)

    setrowTable(row)
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {row?.[displayNameLines] && row?.[displayNameLines].length !== 0 && (
            <IconButton aria-label='expand row' size='small' onClick={() => handleOpenRow(row)}>
              {open ? (
                <IconifyIcon fontSize='20px' color='black' icon='mdi:chevron-up' />
              ) : (
                <IconifyIcon fontSize='20px' color='black' icon='mdi:chevron-down' />
              )}
            </IconButton>
          )}
        </TableCell>
        {columns.map((column, index) => (
          <TableCell {...column} key={index}>
            {column?.renderCell ? (
              column.renderCell({ row, index: rowIndex })
            ) : (
              <Typography> {row[column.field]}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
      {row?.[displayNameLines] && row?.[displayNameLines].length !== 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      {columnsWork?.map((column, index) => (
                        <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                          {column?.label}
                        </CustomTableCellHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.[displayNameLines]?.map((row, childrenIndex) => (
                      <TableRow key={childrenIndex}>
                        {columnsWork?.map((column, index) => (
                          <TableCell component='th' scope='row' {...column} key={index}>
                            {column?.renderCell ? (
                              column.renderCell({ row, index: childrenIndex, rowIndex: rowIndex })
                            ) : (
                              <Typography> {row[column.field]}</Typography>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired
  }).isRequired
}

export default function CustomCollapsibleTable({ data, columns, columnsWork, setrowTable, displayNameLines }) {


  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns?.map((column, index) => (
              <CustomTableCellHeader sx={{ color: 'primary.main' }} {...column} key={index} align='center'>
                {column?.label}
              </CustomTableCellHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              columns={columns}
              columnsWork={columnsWork}
              setrowTable={setrowTable}
              displayNameLines={displayNameLines}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
