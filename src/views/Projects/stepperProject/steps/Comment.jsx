import { Stack, Typography } from '@mui/material'
import moment from 'moment'

export default function Comment({ comment }) {
  return (
    <Stack
      key={comment.id}
      direction='row'
      alignItems='flex-start'
      spacing={2}
      padding={2}
      sx={{
        backgroundColor: 'primary.light',
        borderRadius: '5px',
        border: '1px',
        borderStyle: 'solid',
        borderColor: 'primary.main'
      }}
    >
      {/* Comment Details */}
      <Stack spacing={1} flex={1}>
        <Typography variant='body1' color='green' fontWeight={500}>
          {comment.comment}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {moment(comment.created_at).format('MMM DD, YYYY HH:mm')}
        </Typography>
      </Stack>
    </Stack>
  )
}
