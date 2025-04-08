import React from 'react'
import CustomAccordian from 'src/components/CustomAccordian'
import OccupantColumn from '../OccupantColumn'
import SimpleCrudDataTable from 'src/components/SimpleCrudDataTable'


const DetailsOccupantProject = ({ detailsProject }) => {
  const occupantColumn = OccupantColumn({})

  return (
    <CustomAccordian titleAccordian={'Liste des occupants '}>
      <div className='p-5'>
        <SimpleCrudDataTable
          query={null}
          columns={occupantColumn}
          data={detailsProject?.occupants}
          page={1}
          total={detailsProject?.occupants?.length}
          titleCrud={'occupants'}
        />
      </div>
    </CustomAccordian>
  )
}

export default DetailsOccupantProject
