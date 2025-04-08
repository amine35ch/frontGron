// ** React Imports

// ** MUI Imports
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import { useEffect, useState } from 'react'
import { Box, useTheme } from '@mui/material'
import CustomModal from './CustomModal'
import { TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import Icon from 'src/@core/components/icon'
import StepsTimeLine from 'src/views/Projects/components/StepsTimeLine'

const CustomStepper = ({ currentStep, steps, detailsProject }) => {
  const [displaySteps, setDisplaySteps] = useState([])
  const [activeStep, setActiveStep] = useState(1)
  const [stepsModal, setStepsModal] = useState(false)
  const theme = useTheme()

  // ** States

  return (
    <>
      <Box>
        <StepperWrapper>
          <Stepper activeStep={activeStep} alternativeLabel>
            {detailsProject?.prev_step?.display_name ? (
              <Step>
                <StepLabel error={false} StepIconComponent={StepperCustomDot}>
                  <div className='flex flex-col items-center step-label'>
                    <Typography mb={2} className='step-number' sx={{ lineHeight: '.9rem !important' }}>
                      {detailsProject?.prev_step?.order}
                    </Typography>
                    <Typography className='step-title'>{detailsProject?.prev_step?.display_name}</Typography>
                  </div>
                </StepLabel>
              </Step>
            ) : (
              <Step>
                <StepLabel error={false} StepIconComponent={StepperCustomDot}>
                  <div className='flex flex-col items-center step-label'>
                    <Typography mb={2} className='step-number' sx={{ lineHeight: '.9rem !important' }}>
                      0
                    </Typography>
                    <Typography className='step-title'>Dossier créé</Typography>
                  </div>
                </StepLabel>
              </Step>
            )}
            <Step>
              <StepLabel error={false} StepIconComponent={StepperCustomDot}>
                <div className='flex flex-col items-center step-label'>
                  <Typography mb={2} className='step-number' sx={{ lineHeight: '.9rem !important' }}>
                    {detailsProject?.step?.order}
                  </Typography>
                  <Typography className='step-title'>{detailsProject?.step?.display_name}</Typography>
                </div>
              </StepLabel>
            </Step>
            {detailsProject?.next_step?.display_name ? (
              <Step>
                <StepLabel error={false} StepIconComponent={StepperCustomDot}>
                  <div className='flex flex-col items-center step-label'>
                    <Typography mb={2} className='step-number' sx={{ lineHeight: '.9rem !important' }}>
                      {detailsProject?.next_step?.order}
                    </Typography>
                    <Typography className='step-title'>{detailsProject?.next_step?.display_name}</Typography>
                  </div>
                </StepLabel>
              </Step>
            ) : null}
          </Stepper>
        </StepperWrapper>
      </Box>
      <CustomModal
        open={stepsModal}
        handleCloseOpen={() => setStepsModal(false)}
        handleActionModal={() => setStepsModal(false)}
        btnTitle={'Fermer'}
        ModalTitle={'Etapes'}
        widthModal={'lg'}
        btnTitleClose={false}
        action={() => setStepsModal(false)}
        bottomAction={false}
      >
        <StepsTimeLine>
          {steps?.map((step, index) => {
            return (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <CustomTimelineDot
                    skin={theme.palette.secondary.beige}
                    sx={{
                      width: 32,
                      height: 32,
                      border: currentStep === step?.ordre ? 1 : 0,
                      boxShadow: 'none',
                      color: theme.palette.primary.main,
                      backgroundColor:
                        currentStep === step?.ordre ? theme.palette.primary.fatah : theme.palette.secondary.beige,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography
                      width={20}
                      height={20}
                      color={'primary.dark'}
                      sx={{
                        lineHeight: '.9rem !important',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {step.ordre < 10 ? `0${step.ordre}` : step.ordre}
                    </Typography>
                  </CustomTimelineDot>
                  {index + 1 < steps.length ? <TimelineConnector /> : null}
                </TimelineSeparator>
                <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                  <Box display={'flex'} justifyContent={index % 2 === 0 ? 'flex-start' : 'flex-end'}>
                    <div>
                      <Typography textAlign={'center'} color={'primary.dark'} fontWeight={'400'}>
                        {step.display_name}
                      </Typography>
                    </div>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </StepsTimeLine>
      </CustomModal>
    </>
  )
}

export default CustomStepper
