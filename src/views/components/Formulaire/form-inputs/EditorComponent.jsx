import dynamic from 'next/dynamic'
import { FormControl } from '@mui/material'
import React, { useEffect, useState } from 'react'

const DynamicQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [['bold'], [{ color: [] }, { background: [] }], ['clean']]
}

const EditorComponent = ({
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  subLigneIndex = false,
  mainFieldIndex = false,
  disabled = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', marginLeft: 10 }}>{`${ligne?.content?.data?.question}`}</span>
      <FormControl style={{ marginLeft: 12, marginBottom: 10, marginTop: 10 }}>
        {ligne?.content?.data?.fields?.map((field, fieldIndex) => {
          return (
            <div key={field?.id}>
              <DynamicQuill
                readOnly={disabled}
                modules={modules}
                theme='snow'
                value={field?.value}
                onChange={event => {
                  if (mainFieldIndex !== false) {
                    handleChange(event, blocIndex, ligneIndex, mainFieldIndex, subLigneIndex, fieldIndex)
                  } else {
                    handleChange(event, blocIndex, ligneIndex, fieldIndex, subLigneIndex)
                  }
                }}
              />
            </div>
          )
        })}
      </FormControl>
    </div>
  )
}

export default EditorComponent
