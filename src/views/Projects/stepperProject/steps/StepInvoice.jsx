import React from 'react'
import Typography from 'src/@core/theme/overrides/typography'
import Simulator from 'src/views/simulator'
import ProjectInvoice from '../../form/Invoice'

const StepInvoice = ({ detailsProject }) => {
  return (
    <div className='w-full mt-2'>
      <ProjectInvoice detailsProject={detailsProject} />
    </div>
  )
}

export default StepInvoice
