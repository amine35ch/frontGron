import { TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import { Box, CircularProgress, Typography, hexToRgb, useTheme } from '@mui/material'
import { set } from 'nprogress'
import { useEffect, useState } from 'react'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { usePatchCurrentStep } from 'src/services/project.service'
import ConstructorMenSvg from './ConstructorMenSvg'

const StepsSideBar = ({ steps, currentStep, clearedStep = 1, id, isLoading, changeBetweenStep, detailsProject }) => {
  const theme = useTheme()
  const [hoveredStep, setHoveredStep] = useState(null)
  const [loadingStep, setLoadingStep] = useState(null)
  const [statusVisit, setStatusVisit] = useState(null)
  const [simulateurExist, setSimulateurExist] = useState(null)
  const patchCurrentStepMutation = usePatchCurrentStep({ id })


  const handleChangeStep = async stepOrder => {
    try {
      if (stepOrder === currentStep) return
      setLoadingStep(stepOrder)
      await patchCurrentStepMutation.mutateAsync({ step_order: stepOrder })
    } catch {}
  }
  useEffect(() => {
    if (!isLoading && !patchCurrentStepMutation.isPending) {
      setLoadingStep(null)
    }
  }, [isLoading, patchCurrentStepMutation.isPending])

  useEffect(() => {
    if (detailsProject) {

      const visite = detailsProject?.visits?.find(item => item.state === 3)
      const simu = detailsProject?.documents?.find(item => item.type === 13)
      const stateVisite = visite ? visite?.state : null
      setStatusVisit(stateVisite)

    }
  }, [detailsProject])


  return (
    <Box
      sx={{
        height: '98%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative' // Add this
      }}
    >
      {steps?.map((step, index) => (
        <TimelineItem
          sx={{
            ml: 3,
            '&:before': {
              display: 'none'
            },
            height: '6%',
            cursor: step?.order <= clearedStep && changeBetweenStep && loadingStep === null ? 'pointer' : 'default' // Disable if loading
          }}
          key={index}
          onClick={
            step?.order <= clearedStep && changeBetweenStep && loadingStep === null
              ? () => handleChangeStep(step.order)
              : undefined
          } // Disable if loading
          onMouseEnter={() => setHoveredStep(step.order)}
          onMouseLeave={() => setHoveredStep(null)}
        >
          <TimelineSeparator>
            <div style={{ opacity: step?.order <= clearedStep ? 1 : 0.5 }}>
              <CustomTimelineDot
                skin={theme.palette.secondary.darkFatah}
                sx={{
                  width: 32,
                  height: 32,
                  border: currentStep === step?.order ? 1 : 0,
                  boxShadow: 'none',
                  color: theme.palette.secondary.main,
                  backgroundColor:
                    currentStep === step?.order ? theme.palette.primary.fatah : theme.palette.primary.darkFatah,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {loadingStep === step.order ? (
                  <CircularProgress size={20} /> // Show loading animation if loading
                ) : (detailsProject?.installer !== null &&
                    detailsProject?.visits.length !== 0 &&
                    step?.order == 6 &&
                    detailsProject?.cleared_step_order < 6 &&
                    statusVisit !== null) ||
                  (detailsProject?.installer !== null &&
                    detailsProject?.visits.length !== 0 &&
                    step?.order == 5 &&
                    detailsProject?.cleared_step_order < 5 &&
                    statusVisit == null) ||
                  (detailsProject?.installer !== null &&
                    detailsProject?.visits.length == 0 &&
                    detailsProject?.works.length !== 0 &&
                    step?.order == 4 &&
                    detailsProject?.cleared_step_order == 1 &&
                    statusVisit == null) ||
                  (detailsProject?.installer !== null &&
                    detailsProject?.visits.length == 0 &&
                    detailsProject?.works.length == 0 &&
                    step?.order == 1 &&
                    statusVisit == null) ? (
                  <ConstructorMenSvg />
                ) : (
                  <Typography
                    width={30}
                    height={30}
                    color={currentStep === step?.order ? theme.palette.secondary.main : 'white'}
                    sx={{
                      lineHeight: '.9rem !important',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {step.order < 10 ? `0${step.order}` : step.order}
                  </Typography>
                )}
              </CustomTimelineDot>
            </div>
            {index + 1 < steps.length ? <TimelineConnector /> : null}
          </TimelineSeparator>
          {hoveredStep === step.order && (
            <div
              style={{
                position: 'absolute',
                top: '5px',
                left: '100%',
                width: '150px',
                transform: 'translateX(2%)',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: hexToRGBA(theme.palette.secondary.main, 1),
                color: hexToRGBA(theme.palette.primary.contrastText, 1),
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 9999999999
              }}
            >
              {step.display_name}
            </div>
          )}
        </TimelineItem>
      ))}
    </Box>
  )
}

export default StepsSideBar
