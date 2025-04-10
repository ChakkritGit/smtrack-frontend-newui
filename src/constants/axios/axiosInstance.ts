import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import store from '../../redux/store/index'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { setCookieEncode } from '../../redux/actions/utilsActions'

class AxiosService {
  private static instance: AxiosService
  private axiosInstance: AxiosInstance

  private constructor () {
    const BASE_URL = import.meta.env.VITE_APP_API

    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    })

    this.initializeInterceptors()
  }

  public static getInstance (): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService()
    }
    return AxiosService.instance
  }

  public getAxiosInstance (): AxiosInstance {
    return this.axiosInstance
  }

  private initializeInterceptors () {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState()
        const token = state.utils.cookieDecode?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async error => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const state = store.getState()
            const storeRefreshToken = state.utils.cookieDecode?.refreshToken
            const response = await axios.post(
              `${import.meta.env.VITE_APP_API}/auth/refresh`,
              {
                token: storeRefreshToken
              }
            )

            const { token, refreshToken } = response.data.data

            const tokenObject = {
              hosId: state.utils.cookieDecode?.hosId,
              refreshToken: refreshToken,
              token: token,
              id: state.utils.cookieDecode?.id,
              wardId: state.utils.cookieDecode?.wardId
            }

            store.dispatch(setCookieEncode(String(accessToken(tokenObject))))
            cookies.set(
              'tokenObject',
              String(accessToken(tokenObject)),
              cookieOptions
            )
            cookies.update()

            this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`
            originalRequest.headers.Authorization = `Bearer ${token}`
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            console.error('Refresh token expired or invalid:', refreshError)
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
  }
}

export const axiosService = AxiosService.getInstance()
export const axiosInstance = axiosService.getAxiosInstance()
export default axiosInstance
