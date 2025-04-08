// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile'

const UserProfileTab = ({ tab, data }) => {
  return <UserProfile tab={tab} data={data} />
}

export default UserProfileTab
