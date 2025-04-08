import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import moment from 'moment'

import { useGetProjectComments } from 'src/services/project.service'
import Comment from './Comment'

export default function HistorySection({ projectId }) {
  const { data, isFetching } = useGetProjectComments({ id: projectId })

  if (isFetching)
    return (
      <Stack height='100%' justifyContent='center' alignItems='center'>
        <CircularProgress size={25} />
      </Stack>
    )

  return (
    <Stack
      height='100%'
      mt={2}
      px={2}
      spacing={2}
      divider={<Divider orientation='horizontal' flexItem />}
      sx={{ overflowY: 'auto' }}
    >
      {data && data.length === 0 ? (
        <Stack justifyContent='center' alignItems='center' height='100%'>
          <Typography variant='h6'>Aucun commentaire n’a été ajouté pour le moment.</Typography>
        </Stack>
      ) : (
        data.map(comment => <Comment key={comment.id} comment={comment} />)
      )}
    </Stack>
  )
}
