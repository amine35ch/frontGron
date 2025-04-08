import { alpha, Box, useTheme } from '@mui/material'

export default function CommentsHistorySingleTab({ label, onClick, isSelected }) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        cursor: 'pointer',
        backgroundColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
        color: isSelected ? theme.palette.common.white : theme.palette.text.primary,
        fontWeight: 600,
        borderRadius: '4px',
        padding: '10px 20px',
        '&:hover': {
          backgroundColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)
        }
      }}
      onClick={onClick}
    >
      {label}
    </Box>
  )
}
