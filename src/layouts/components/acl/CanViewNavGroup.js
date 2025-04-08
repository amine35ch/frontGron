// ** React Imports
import { useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavGroup = props => {
  const { children, navGroup } = props

  const auth = useAuth()
  for (let i = 0; i < navGroup?.children?.length; i++) {
    if (
      auth.user &&
      auth?.user?.permissions?.find(permission => permission?.resource_name === navGroup?.children[i]?.resourceName)
        ?.authorized
    ) {
      return <>{children}</>
    }
  }

  return null
}

export default CanViewNavGroup
