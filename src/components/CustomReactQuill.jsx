// ** React Imports
import dynamic from 'next/dynamic'

const DynamicQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

// ** Styled Components

const CustomReactQuill = ({ height, value, handleChange }) => {
  const modules = {
    toolbar: [['bold'], [{ color: [] }, { background: [] }], ['clean']]
  }

  return (
    <div className='!min-h-[250px] '>
      <DynamicQuill
        style={{ height: '200px' }}
        
        modules={modules}
        theme='snow'
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default CustomReactQuill
