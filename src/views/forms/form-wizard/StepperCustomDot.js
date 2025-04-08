// ** MUI Imports
import MuiBox from '@mui/material/Box'
import { alpha, styled, useTheme } from '@mui/material/styles'
import IconifyIcon from 'src/@core/components/icon'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// Styled Box component
const Box = styled(MuiBox)(() => ({
  width: 15,
  height: 15,
  borderWidth: 2,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StepperCustomDot = props => {
  // ** Props
  const { active, completed, error } = props

  // ** Hooks
  const theme = useTheme()
  if (error) {
    return <Icon icon='mdi:alert' fontSize={17} color={theme.palette.error.main} transform='scale(1.2)' />
  } else if (completed) {
    return (
      <IconifyIcon icon='mdi:check-circle' fontSize={18} color={theme.palette.secondary.main} transform='scale(1.2)' />
    )
  } else {
    return (
      <Box
        sx={{
          borderColor: active ? 'secondary.main' : alpha(theme.palette.secondary.main, 0.3)
        }}
      />
    )
  }
}

export default StepperCustomDot
