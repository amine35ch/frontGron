import * as React from 'react'
import styled from '@emotion/styled'
import { FormHelperText, TextareaAutosize } from '@mui/material'
import { blue, grey } from '@mui/material/colors'

const TextareaCutome = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${grey[900]};
    background: ${'#fff'};
    border: 2px solid ${grey['A700']};
    box-shadow: 0px 2px 2px ${grey[50]};



    &:focus {
     border: 2px solid ${theme.palette.primary.dark};
      box-shadow: 0 0 0 3px ${theme.palette.primary.bared};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
)

const Textarea = ({ ...props }) => {
  return (
    <>
      <TextareaCutome
        {...props}
        style={{
          borderColor: props?.error ? 'red' : grey[200]
        }}
      />
      {props?.error && <FormHelperText sx={{ color: 'red' }}>{props?.helperText}</FormHelperText>}
    </>
  )
}

export default Textarea
