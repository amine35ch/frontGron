// ** React Imports
import { useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// const CanViewNavLink = props => {
//   // ** Props
//   const { children, navLink } = props

//   // ** Hook
//   const ability = useContext(AbilityContext)

//   return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null
// }

const CanViewNavLink = props => {
  const { children, navLink } = props

  const auth = useAuth()

  if (!navLink?.resourceName) return <>{children}</>
  if (
    auth.user &&
    auth?.user?.permissions?.find(permission => permission?.resource_name === navLink?.resourceName)?.authorized
  ) {
    const subPermission = auth?.user?.permissions?.find(
      permission => permission?.resource_name === navLink?.resourceName
    )
    if (navLink?.subResourcePermission) {
      if (
        subPermission?.permissions?.find(permission => permission?.name === navLink?.subResourcePermission)?.authorized
      ) {
        return <>{children}</>
      }

      return null
    }

    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavLink
