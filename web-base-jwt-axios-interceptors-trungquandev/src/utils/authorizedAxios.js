// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from 'axios'
import { toast } from 'react-toastify'

// Khởi tạo axios instance - authorizedAxiosInstance
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa cho mỗi request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials - Allows axios to automatically send cookies with each request to the backend
// Useful in cases where the JWT token is stored in an httpOnly cookie in the browser
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  // Get accessToken from localStorage and set it in the Authorization header
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    // Bearer - Complies with the OAuth 2.0 standard for specifying the type of token
    // Bearer defines a type of token used for authentication and authorization,
    // such as Basic token, Digest token, OAuth token
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  // Centralized error handling to return error messages from the API,
  // Use toasty to display any error codes on the screen, except for 410 - GONE, which is used for automatic token refresh.
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance