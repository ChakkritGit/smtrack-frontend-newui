import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './createRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/reducers/rootReducer'
import { setTokenDecode, setTokenExpire } from '../redux/actions/utilsActions'
import {
  responseType,
  TokenType
} from '../types/smtrack/utilsRedux/utilsReduxType'
import { jwtDecode } from 'jwt-decode'
import { HospitalType } from '../types/smtrack/hospitals/hospitalType'
import { WardType } from '../types/smtrack/wards/wardType'
import { AxiosError } from 'axios'
import { GlobalContext } from '../contexts/globalContext'
import axiosInstance from '../constants/axios/axiosInstance'
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import { getOKLCHColor } from '../constants/utils/color'

const Routes = () => {
  const dispatch = useDispatch()
  const { tokenDecode, cookieDecode, tmsMode, themeMode, userProfile } =
    useSelector((state: RootState) => state.utils)
  const [hospital, setHospital] = useState<HospitalType[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [ward, setWard] = useState<WardType[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const { role = 'USER' } = tokenDecode || {}
  const { token } = cookieDecode || {}
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  const decodeToken = async (getToken: string) => {
    const decoded: TokenType = await jwtDecode(getToken)
    dispatch(setTokenDecode(decoded))
  }

  const fetchHospital = async () => {
    try {
      const response = await axiosInstance.get<responseType<HospitalType[]>>(
        '/auth/hospital'
      )
      setHospital(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const fetchWard = async () => {
    try {
      const response = await axiosInstance.get<responseType<WardType[]>>(
        '/auth/ward'
      )
      setWard(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!token) return
    fetchHospital()
    fetchWard()
  }, [token])

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', themeMode)
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    const currentColor = getOKLCHColor(themeMode, system)

    if (themeColorMetaTag) {
      themeColorMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'theme-color')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }

    const statusBarMetaTag = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    )
    if (statusBarMetaTag) {
      statusBarMetaTag.setAttribute('content', currentColor)
    } else {
      const newStatusBarMetaTag = document.createElement('meta')
      newStatusBarMetaTag.setAttribute(
        'name',
        'apple-mobile-web-app-status-bar-style'
      )
      newStatusBarMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newStatusBarMetaTag)
    }
  }, [themeMode, system])

  useEffect(() => {
    if (!token) return
    decodeToken(token)
  }, [token])

  useEffect(() => {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link')
    link.type = 'image/png'
    link.rel = 'icon'
    link.href = String(userProfile?.ward.hospital.hosPic)

    const pathSegment = location.pathname.split('/')[1]
    const capitalized =
      pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)

    document.getElementsByTagName('head')[0].appendChild(link)
    document.title = userProfile
      ? userProfile?.ward.hospital.hosName +
        ' - ' +
        `${location.pathname.split('/')[1] !== '' ? capitalized : 'Home'}`
      : 'SMTrack+'
  }, [location, cookieDecode, userProfile])

  const routerInstance = useMemo(() => router(role, tmsMode), [role, tmsMode])
  const contextValue = useMemo(
    () => ({
      hospital,
      setHospital,
      ward,
      setWard,
      fetchHospital,
      fetchWard,
      activeIndex,
      setActiveIndex,
      searchRef,
      isFocused,
      setIsFocused,
      isCleared,
      setIsCleared
    }),
    [hospital, ward, activeIndex, isFocused, searchRef, isCleared]
  )
  const hashText = useCallback(
    () =>
      Base64.stringify(
        hmacSHA512(
          sha256(tmsMode ? `tms-${role}` : `smtrack-${role}`),
          import.meta.env.VITE_APP_SECRETKEY
        )
      ),
    [tmsMode, role]
  )

  const routesProvider = useMemo(
    () => <RouterProvider key={hashText()} router={routerInstance} />,
    [routerInstance]
  )

  return (
    <GlobalContext.Provider value={contextValue}>
      {routesProvider}
    </GlobalContext.Provider>
  )
}

export default Routes
