import React from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import { Grid, TextField, Typography } from '@mui/material'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import CrudDataTable from 'src/components/CrudDataTable'
import OccupantColumn from '../OccupantColumn'
import SimpleCrudDataTable from 'src/components/SimpleCrudDataTable'
import WorksColumn from '../WorksColumn'
import VisitesColumn from '../VisitesColumn'

const DetailsWorksProject = ({ detailsProject }) => {
  const worksColumn = WorksColumn({})

  return (
    <CustomAccordian titleAccordian={'Liste des travaux'}>
      <div className='p-5'>
        <SimpleCrudDataTable
          query={null}
          columns={worksColumn}
          data={detailsProject?.works}
          page={1}
          total={detailsProject?.works?.length}
          titleCrud={'travaux'}
        />
      </div>
    </CustomAccordian>
  )
}

export default DetailsWorksProject
