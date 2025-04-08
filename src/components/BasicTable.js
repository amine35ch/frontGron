import * as React from 'react'
import { useEffect } from 'react'
import CustomInputCondition from './CustomInputCondition'
import { Icon } from '@iconify/react'
import CustomCurrencyInput from './CustomeCurrencyInput'
import renderArrayMultiline from 'src/@core/utils/utilities'

export default function BasicTable({ rows, setFormInput, updatedRows, setUpdatedRows, formErrors }) {
  useEffect(() => {
    setUpdatedRows(rows)
  }, [rows])

  const handleChange = (index, field, value) => {
    const newRows = [...updatedRows]
    newRows[index][field] = value
    setUpdatedRows(newRows)
    setFormInput(newRows)
  }

  const deleteRow = index => {
    const newUpdatedRows = [...updatedRows]
    newUpdatedRows.splice(index, 1)
    setUpdatedRows(newUpdatedRows)
  }

  return (
    <>
      <div className='flex !h-full flex-col mt-3'>
        <div className='mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-1 align-middle md:px-4 '>
            <div className='overflow-hidden'>
              <table className='h-full min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg '>
                <thead
                  style={{
                    backgroundColor: 'rgb(245, 245, 247)',
                    borderBottom: '1px solid rgb(233, 233, 236)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    lineHeight: '24px !important'
                  }}
                  className='text-gray-900 bg-red-400 rounded-xl'
                >
                  {/* <th scope='col' className='px-4 py-1 font-semibold text-left cursor-pointer'>
                    <div className='inline-flex '>
                      <span style={{ fontSize: '13px', color: '#2a2e34' }}>Condition</span>
                    </div>
                  </th> */}
                  <th scope='col' className='px-4 py-1 font-semibold text-left cursor-pointer'>
                    <div className='inline-flex '>
                      <span style={{ fontSize: '13px', color: '#2a2e34' }}>Prix HT</span>
                      {/* Add sorting indicators here */}
                    </div>
                  </th>
                  <th scope='col' className='px-4 py-1 font-semibold text-left cursor-pointer'></th>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {updatedRows?.map((row, index) => (
                    <tr key={index} className={` transition-colors`}>
                      {/* <td className={`text-base whitespace-nowrap py-1 text-left px-4  !text-[#2a2e34]  truncate `}>
                        <CustomInputCondition
                          value={row.condition}
                          setNumber={value => handleChange(index, 'condition', value)}
                          error={formErrors?.[`pricing_list.${index}.condition`]}
                          helperText={renderArrayMultiline(formErrors?.[`pricing_list.${index}.condition`])}
                        />
                      </td> */}
                      <td className={`text-base whitespace-nowrap py-1 text-left px-4  !text-[#2a2e34] truncate `}>
                        <CustomCurrencyInput
                          onChange={event => handleChange(index, 'price_unit_ht', event.floatValue)}
                          value={row.price_unit_ht}
                          fullWidth
                          size='small'
                          variant='outlined'
                          custom={true}
                          error={formErrors?.[`pricing_list.${index}.price_unit_ht`]}
                          helperText={renderArrayMultiline(formErrors?.[`pricing_list.${index}.price_unit_ht`])}
                        />
                      </td>
                      <td>
                        {updatedRows?.length > 1 ? (
                          <Icon
                            icon='mdi:delete-outline'
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteRow(index)}
                            color='red'
                            fontSize={22}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
