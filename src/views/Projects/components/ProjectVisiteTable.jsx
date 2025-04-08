import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CustomTableCellHeader from 'src/components/CustomTableCellHeader'
import CustomTableCell from 'src/components/CustomeTableCell'

const ProjectVisiteTable = ({ listProjectVisit, projectVisitColumn }) => {
  return (
    <TableContainer>
      <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
        <thead
          style={{
            backgroundColor: 'rgb(245, 245, 247)',
            borderBottom: '1px solid rgb(233, 233, 236)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            lineHeight: '24px !important'
          }}
          className='text-gray-900 bg-red-400 rounded-xl'
        >
          {projectVisitColumn?.map((column, index) => (
            <th
              key={index}
              scope='col'
              className='px-4 py-1 font-semibold text-center cursor-pointer'

              // onClick={() => handleSort(column.field)}
            >
              <div className='inline-flex '>
                <span style={{ fontSize: '13px', color: '#2a2e34' }}>{column.headerName}</span>
              </div>
            </th>
          ))}
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {listProjectVisit?.length === 0 ? (
            <tr>
              <td colSpan={projectVisitColumn?.length} className='py-4 text-center'>
                Aucune visite disponible
              </td>
            </tr>
          ) : (
            <>
              {listProjectVisit?.map((item, rowIndex) => (
                <tr key={rowIndex} className={`hover:bg-gray-200 hover:transition-colors transition-colors`}>
                  {projectVisitColumn?.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`text-base whitespace-nowrap py-1 text-center px-4  !text-[#2a2e34] max-w-[${
                        column.flex * 100
                      }%] truncate `}
                    >
                      {column.renderCell ? column.renderCell({ row: item }) : item[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </TableContainer>
  )
}

export default ProjectVisiteTable
