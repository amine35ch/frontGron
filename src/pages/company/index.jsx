import React from 'react'
import ListCompany from 'src/views/company/ListCompany'
import UpdateProfileCompany from 'src/views/company/UpdateProfileCompany'

const index = () => {
  return <UpdateProfileCompany redirect={false} path={'/auditor'} />
}

export default index
