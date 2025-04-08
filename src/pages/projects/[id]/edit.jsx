import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import StepProjectAuditor from 'src/views/Projects/project-auditor/StepProjectAuditor'
import StepProjectCollaborator from 'src/views/Projects/project-collaborator/StepProjectCollaborator'
import DetailsProjectIns from 'src/views/Projects/project-installer/DetailsProjectIns'
import StepperProject from 'src/views/Projects/stepperProject/StepperProject'

// const permession = {
//   StepSimulator: {
//     component: detailsProject => <StepTwo detailsProject={detailsProject} />
//   },

// }

const Edit = () => {
  const { user } = useAuth()
  if (user?.role.includes('::supervisor') || user?.role.includes('::inspector')) {
    return <StepProjectCollaborator />
  }
  if (user?.profile === 'MAR') {
    return <StepperProject />
  }
  if (user?.profile === 'INS') {
    return <DetailsProjectIns />
  }
  if (user?.profile === 'AUD') {
    return <StepProjectAuditor />
  }
}

export default Edit
