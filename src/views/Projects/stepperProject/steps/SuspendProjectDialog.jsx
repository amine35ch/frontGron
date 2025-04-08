import { LoadingButton } from '@mui/lab'
import { Button, Dialog, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSetAnahResponse } from 'src/services/project.service'

export default function SuspendProjectDialog({ open, handleClose, id, selectedChoice, setHideSelect }) {
  const form = useForm({
    mode: 'onSubmit'
  })

  const { mutateAsync, isPending } = useSetAnahResponse({ id })

  const onSubmit = form.handleSubmit(({ comment }) => {
    mutateAsync(
      { anah_first_depot_response_state: selectedChoice, comment },
      {
        onSuccess: () => {
          handleClose()
          setHideSelect(true)
        }
      }
    )
  })

  return (
    <Dialog open={open} onClose={handleClose}>
      <Stack
        padding={3}
        width={{
          sm: '100%',
          md: '500px'
        }}
      >
        <FormProvider {...form}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Typography variant='body1' color='black'>
                Merci d'entrer la raison de la suspension
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
              <Button variant='outlined' fullWidth onClick={handleClose}>
                Annuler
              </Button>
              <LoadingButton
                variant='contained'
                size='small'
                color='primary'
                loading={isPending}
                fullWidth
                onClick={onSubmit}
              >
                Envoyer
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Stack>
    </Dialog>
  )
}
