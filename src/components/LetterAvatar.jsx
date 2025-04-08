import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: '#0197A7',
      color: 'white',
      width: '64px',
      height: '64px',
      fontSize: '24px',
      fontWeight: '400'
    },
    children: `${name?.split(' ')[0][0]}${name?.split(' ')[1][0]}`
  }
}

export default function BackgroundLetterAvatars({ nameProps }) {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar {...stringAvatar(nameProps.toUpperCase())} />

    </Stack>
  )
}
