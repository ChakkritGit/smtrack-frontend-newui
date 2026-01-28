import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AxiosError } from 'axios'
import axiosInstance from '../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../types/smtrack/utilsRedux/utilsReduxType'
import { cookieOptions, cookies } from '../constants/utils/utilsConstants'
import { setTokenExpire, setUserProfile } from '../redux/actions/utilsActions'

export const useUserProfile = (
  id: string | undefined,
  token: string | undefined
) => {
  const dispatch = useDispatch()

  const fetchUserProfile = useCallback(async () => {
    if (!id || !token) return
    try {
      const response = await axiosInstance.get<responseType<UserProfileType>>(
        `/auth/user/${id}`
      )

      cookies.set('userProfile', response.data.data, cookieOptions)
      dispatch(setUserProfile(response.data.data))
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        dispatch(setTokenExpire(true))
      } else {
        console.error('Fetch Profile Error:', error)
      }
    }
  }, [id, token, dispatch])

  return { fetchUserProfile }
}
