import { LoadingButton } from '@mui/lab'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Radio,
  RadioGroup
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import IconifyIcon from 'src/@core/components/icon'

const LigneTypeTwo = ({
  blocIndex,
  ligne,
  ligneIndex,
  handleChange,
  formErrors,
  setFormErrors,
  handleRemoveFile,
  handleDeleteImage,
  isLoading,
  isImageLoading,
  images,
  formImages,
  handleImage,
  subFieldIndex = false
}) => {
  return (
    <div className='mt-5' style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <div className='flex '>
          <span style={{ fontWeight: 'bold', marginLeft: 18 }}>
            {ligne?.content?.data?.question && `${ligne?.content?.data?.question}`}
          </span>
        </div>

        <FormControl style={{}}>
          <div
            style={{
              marginTop: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 35
            }}
            key={ligne?.id}
          >
            <>
              <input
                multiple
                accept='image/*'
                type='file'
                id={'select-image-' + ligne?.id}
                style={{ display: 'none' }}
                onChange={event => handleImage(event, blocIndex, ligneIndex, 0)}
              />
              <label htmlFor={'select-image-' + ligne?.id}>
                {!isLoading && (
                  <LoadingButton
                    className='!ml-4'
                    disabled={isLoading}
                    variant='contained'
                    color='primary'
                    component='span'
                  >
                    Selectionner Image
                  </LoadingButton>
                )}
              </label>
            </>
          </div>
        </FormControl>
      </div>
      <Grid container spacing={2} style={{}}>
        {formImages[ligne?.id]?.map((item, imageIndex) => (
          <div key={`form-image-${imageIndex}`} style={{ position: 'relative', marginBottom: '16px' }}>
            {isImageLoading[imageIndex] ? (
              <div
                className='spinner'
                style={{
                  display: 'flex',
                  width: '180px',
                  height: '100px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div className=''>
                  <CircularProgress size={40} />
                </div>
              </div>
            ) : (
              <div className='flex items-center'>
                <img
                  id={`image-${ligne?.id}-${imageIndex}`}
                  src={`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/forms/image/${item?.name}`}
                  alt=''
                  className='!w-[180px] !h-[120px] '
                  style={{ display: 'block' }}
                />
                <IconButton color='error' disabled={isLoading} onClick={() => handleDeleteImage(ligne.id, imageIndex)}>
                  <IconifyIcon icon={'mdi:close-circle-outline'} />
                </IconButton>
              </div>
            )}
          </div>
        ))}
        {images?.map(item => {
          if (item.line === ligne?.id) {
            return item.images.map((image, imageIndex) => (
              <div key={`uploaded-image-${imageIndex}`} style={{ position: 'relative', marginBottom: '16px' }}>
                {
                  <div className='flex items-center'>
                    <img
                      id={`image-${ligne?.id}-${imageIndex}`}
                      src={URL.createObjectURL(image)}
                      alt=''
                      className='!w-[180px] !h-[120px] '
                      style={{ display: 'block' }}
                    />
                    <IconButton
                      disabled={isLoading}
                      color='error'
                      onClick={() => handleRemoveFile(ligne.id, imageIndex)}
                      style={{}}
                    >
                      <IconifyIcon icon={'mdi:close-circle-outline'} />
                    </IconButton>
                  </div>
                }
              </div>
            ))
          } else {
            return null
          }
        })}
      </Grid>
    </div>
  )
}

export default LigneTypeTwo
