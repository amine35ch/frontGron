import { LoadingButton } from '@mui/lab'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAddCommentToProject } from 'src/services/project.service'

export default function CommentForm({ label, isReversible, btnLabel, onCancel, projectId }) {
  const form = useForm({
    mode: 'onSubmit'
  })

  const { mutateAsync, isPending } = useAddCommentToProject({ id: projectId })

  const onSubmit = form.handleSubmit(data => {
    mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        toast.success('Commentaire ajouté avec succès')
      },
      onError: () => {
        toast.error('une Erreur est survenue')
      }
    })
  })

  return (
    <FormProvider {...form}>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Typography variant='body1' color='black'>
            {label}
          </Typography>

          <Controller
            name='comment'
            control={form.control}
            defaultValue=''
            render={({ field, fieldState }) => (
              <TextField
                variant='outlined'
                disabled={isPending}
                multiline
                rows={4}
                placeholder='Entrez la raison'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || ''}
              />
            )}
            rules={{
              required: 'Ce champ est obligatoire'
            }}
          />
        </Stack>
        <Stack direction='row' spacing={2} justifyContent='flex-end'>
          {isReversible && (
            <Button variant='outlined' onClick={onCancel ? onCancel : undefined}>
              Annuler
            </Button>
          )}
          <LoadingButton variant='contained' loading={isPending} onClick={onSubmit}>
            {btnLabel || 'Envoyer'}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}
