import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { FormHelperText } from '@mui/material'

const QuillEditor = ({ value, error, helperText, handleSetCurrentQuillInstance }) => {
  const quillRef = useRef(null)
  const quillInstance = useRef(null)

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'] // remove formatting button
          ]
        }
      })

      // set current quill instance
      handleSetCurrentQuillInstance(quillInstance.current)

      // Set initial value
      if (value) {
        quillInstance.current.root.innerHTML = value
      }
    }
  }, [])

  useEffect(() => {
    quillInstance.current.root.innerHTML = value
  }, [quillInstance?.current])

  return (
    <div>
      <div ref={quillRef} style={{ height: '300px' }} />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </div>
  )
}

export default QuillEditor
