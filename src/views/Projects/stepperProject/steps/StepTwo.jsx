import React from 'react'
import Typography from 'src/@core/theme/overrides/typography'
import Simulator from 'src/views/simulator'

const StepTwo = React.memo(({ detailsProject }) => {
  return (
    <div className='w-full mt-2'>
      <Simulator detailsProject={detailsProject} />
    </div>
  )
})

export default StepTwo
