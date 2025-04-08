import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

axiosClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response && error.response.status === 401 && window.location.pathname !== '/login/') {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosClient
