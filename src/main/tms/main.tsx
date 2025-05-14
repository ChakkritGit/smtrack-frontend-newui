import { Outlet, useLocation } from 'react-router-dom'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { SubmitLoading } from '../../components/loading/submitLoading'
import { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import {
  setSocketData,
  setTokenExpire,
  setUserProfile
} from '../../redux/actions/utilsActions'
import { AxiosError } from 'axios'
import { socket } from '../../services/websocket'
import { SocketResponseType } from '../../types/global/socketType'
import Navbar from '../../components/navigation/navbar/navbar'
import Sidebar from '../../components/navigation/sidebar/tsm/sidebar'
import toast, { ToastOptions, useToasterStore } from 'react-hot-toast'
import { RiCloseLargeFill } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { changIcon, changText } from '../../constants/utils/webSocket'
import notificationSound from '../../assets/sounds/notification.mp3'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import BottomBar from '../../components/navigation/bottomBar/bottomBar'
import TokenExpire from '../../components/modal/tokenExpire'
import Footer from '../../components/footer/footer'

const MainTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toasts } = useToasterStore()
  const location = useLocation()
  const {
    submitLoading,
    cookieDecode,
    tokenDecode,
    socketData,
    soundMode,
    popUpMode,
    themeMode
  } = useSelector((state: RootState) => state.utils)
  const { token } = cookieDecode || {}
  const { id, hosId, role } = tokenDecode || {}
  const notiSound = new Audio(notificationSound)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const isPlayingRef = useRef<boolean>(false)
  const toastLimit = 5

  const fetchUserProfile = async () => {
    if (id) {
      try {
        const response = await axiosInstance.get<responseType<UserProfileType>>(
          `${
            import.meta.env.VITE_APP_NODE_ENV === 'development'
              ? import.meta.env.VITE_APP_AUTH
              : ''
          }/auth/user/${id}`
        )
        cookies.set('userProfile', response.data.data, cookieOptions)
        dispatch(setUserProfile(response.data.data))
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  const isSocketResponseType = (
    response: any
  ): response is SocketResponseType => {
    return response && typeof response === 'object' && 'hospital' in response
  }

  const handleConnect = () => {}
  const handleDisconnect = (reason: any) =>
    console.error('Disconnected from Socket server:', reason)
  const handleError = (error: any) => console.error('Socket error:', error)
  const handleMessage = (response: unknown) => {
    if (!role && !hosId) return

    if (!isSocketResponseType(response)) return

    if (hosId?.toLowerCase() === response.hospital.toLowerCase()) {
      dispatch(setSocketData(response))
    } else if (role === 'SUPER' || role === 'SERVICE') {
      dispatch(setSocketData(response))
    }
  }

  useEffect(() => {
    if (!token) return
    if (location.pathname !== '/login') {
      window.scrollTo(0, 0)

      fetchUserProfile()

      if (isFirstLoad) {
        fetchUserProfile()
        setIsFirstLoad(false)
        return
      }

      const timer = setTimeout(() => {
        fetchUserProfile()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [location.pathname, token, tokenDecode, isFirstLoad])

  useEffect(() => {
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('error', handleError)
    socket.on('receive_message', handleMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('error', handleError)
      socket.off('receive_message', handleMessage)
    }
  }, [hosId, role])

  useEffect(() => {
    toasts
      .filter(toasts => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach(toasts => toast.dismiss(toasts.id))
  }, [toasts])

  useEffect(() => {
    const isMessageValid = socketData?.message?.toLowerCase() ?? ''

    if (
      isMessageValid?.includes('device offline') ||
      isMessageValid?.includes('device online')
    ) {
      dispatch(setSocketData(null))
      return
    }

    if (socketData && !popUpMode && !soundMode && isMessageValid) {
      if (!isPlayingRef.current) {
        notiSound.play()
        isPlayingRef.current = true

        setTimeout(() => {
          isPlayingRef.current = false
        }, 3000)
      }
    }

    if (socketData && !popUpMode) {
      toast(
        (_t: ToastOptions) => (
          <div className='flex items-center justify-between gap-4 min-w-[220px]'>
            <div className='flex flex-col'>
              <span className='text-sm font-bold max-w-[320px] break-words'>
                {socketData.device ? socketData.device : '- -'}
              </span>
              <span className='text-sm max-w-[320px] break-words'>
                {changText(socketData.message, t)}
              </span>
              <span className='text-sm mt-1'>
                {new Date(socketData.time).toLocaleString('th-TH', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  timeZone: 'UTC'
                })}
              </span>
            </div>
            <button
              className='flex items-center justify-center bg-base-300/50 text-base-content/60 border-none rounded-full p-2 cursor-pointer hover:bg-red-500/20 hover:text-red-700 duration-300 ease-linear'
              onClick={() => toast.dismiss(_t.id)}
            >
              <RiCloseLargeFill size={24} />
            </button>
          </div>
        ),
        {
          icon: changIcon(socketData.message),
          duration: 15000,
          style: {
            backgroundColor:
              'var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)))',
            borderRadius: 'var(--rounded-field, 0.5rem)',
            padding: '.5rem .7rem',
            backdropFilter:
              'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
            WebkitBackdropFilter:
              'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
            width: 'max-content'
          }
        }
      )
    }
    dispatch(setSocketData(null))
  }, [socketData, soundMode, popUpMode])

  return (
    <main>
      <div className='drawer lg:drawer-open bg-base-100 w-auto duration-300 ease-linear'>
        <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          <Navbar />
          <section
            className={`min-h-[calc(100dvh-120px)] pb-[84px] sm:pb-0 md:rounded-box bg-base-200 md:mx-3 md:mb-3 ${
              ['cupcake', 'valentine', 'forest', 'pastel', 'acid'].includes(
                themeMode
              )
                ? 'pb-[100px] sm:pb-0'
                : ''
            }`}
          >
            <Outlet />
          </section>
          <Footer />
          <BottomBar />
        </div>
        <Sidebar />
      </div>
      <TokenExpire />
      {submitLoading && <SubmitLoading submitLoading={submitLoading} />}
    </main>
  )
}

export default MainTms
