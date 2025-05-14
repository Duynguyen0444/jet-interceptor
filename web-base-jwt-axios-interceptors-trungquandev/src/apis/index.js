import authorizedAxiosInstance from '~/utils/authorizedAxios';
import { API_ROOT } from '~/utils/constants';

export const handleLogoutAPI = async () => {
  // Case 1: Using localStorage
  localStorage.removeItem('userInfo')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')

  // Case 2: Using Http Only cookies => Call API to handle cookie removal
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, { refreshToken })
}