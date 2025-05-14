// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

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

// Khởi tạo một Prromise cho gọi lại refresh token
// Mục đích tạo Promise này để nhận yêu cầu refreshToken đầu tiên => hold lại việc gọi api refresh token cho tới khi xong mới retry lại các api lỗi
let refreshTokenPromise = null



authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  // Centralized error handling to return error messages from the API,
  // Handle refresh token automatically
  // ErrorCode 401 => Logout
  if (error.response?.status === 401) {
    // Remove accessToken and refreshToken from localStorage
    handleLogoutAPI().then(() => {
      // Nếu trường hợp dùng cookies, xoá userInfo trong localStorage
      // localStorage.removeItem('userInfo')

      // Redirect to login page
      window.location.href = '/login'
    })
  }

  // ErrorCode 410 => Refresh token
  // 1. Cần lấy các request API đang lỗi thông qua error.config
  const originalRequest = error.config
  if (error.response?.status === 410 && originalRequest) {
    // 2. Gắn thêm giá trị _retry = true vào request để tránh việc gọi lại request này nhiều lần
    // Gọi refresh token nên gọi 1 lần trong 1 thời điểm
    // originalRequest._retry = true

    if (!refreshTokenPromise) {
      // 3. Gọi API refresh token - With case localStorage
      const refreshToken = localStorage.getItem('refreshToken')
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then((res) => {
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
        })
        .catch((_error) => {
          // If any error is received from the refresh token API => Logout
          handleLogoutAPI().then(() => {
            // Nếu trường hợp dùng cookies, xoá userInfo trong localStorage
            // localStorage.removeItem('userInfo')

            // Redirect to login page
            window.location.href = '/login'
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          // Reset lại refreshTokenPromise về null để cho phép gọi lại api refresh token lần sau
          refreshTokenPromise = null
        })
    }

    // Return refreshTokenPromise trong trường hợp refreshTọken success
    return refreshTokenPromise.then((() => {
      // Lưu ý: accessToken đã được update ở Cookie - With case Cookie
      // Final step: Return lại axios instance + originalRequest để gọi lại api bị lỗi ban đầu
      return authorizedAxiosInstance(originalRequest)
    }))
  }

  // Use toasty to display any error codes on the screen, except for 410 - GONE, which is used for automatic token refresh.
  // if  (error.response?.status !== 410) {
  //   toast.error(error.response?.data?.message || error?.message)
  // }

  return Promise.reject(error)
})

export default authorizedAxiosInstance