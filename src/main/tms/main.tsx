import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast, { ToastOptions } from 'react-hot-toast'
import { RiCloseLargeFill } from 'react-icons/ri'

// Redux & Types
import { RootState } from '../../redux/reducers/rootReducer'
import { setSocketData } from '../../redux/actions/utilsActions'

// Components
import { SubmitLoading } from '../../components/loading/submitLoading'
import Navbar from '../../components/navigation/navbar/navbar'
import Sidebar from '../../components/navigation/sidebar/tsm/sidebar' // Note: Sidebar ของ TMS
import BottomBar from '../../components/navigation/bottomBar/bottomBar'
import TokenExpire from '../../components/modal/tokenExpire'
import Footer from '../../components/footer/footer'

// Utils
import { changIcon, changText } from '../../constants/utils/webSocket'
import { useUserProfile } from '../../hook/useUserProfile'
import { useSocketNotification } from '../../hook/useSocketNotification'

const MainTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Selectors
  const {
    submitLoading,
    cookieDecode,
    tokenDecode,
    socketData,
    popUpMode,
    themeMode
  } = useSelector((state: RootState) => state.utils)

  const { token } = cookieDecode || {}
  const { id } = tokenDecode || {}

  // Local State
  // const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showAnimation, setShowAnimation] = useState(false)

  // 1. Reuse Hooks Logic
  const { fetchUserProfile } = useUserProfile(id, token)
  useSocketNotification() // Handle socket & audio logic internally

  // Initial Fetch Logic
  useEffect(() => {
    if (!token || location.pathname === '/login') return

    window.scrollTo(0, 0)

    // if (isFirstLoad) {
      fetchUserProfile()
      // setIsFirstLoad(false)
    // }
  }, [location.pathname, token, fetchUserProfile])

  // Notification Toast Logic (Duplicate from MainSmtrack - Can extract to another hook if needed)
  useEffect(() => {
    if (!socketData) return

    const message = socketData.message?.toLowerCase() ?? ''

    // Ignore status messages
    if (
      message.includes('device offline') ||
      message.includes('device online')
    ) {
      dispatch(setSocketData(null))
      return
    }

    if (!popUpMode) {
      toast(
        (toa: ToastOptions) => (
          <>
            <div
              className={`flex flex-col ${
                location.pathname === '/notification'
                  ? 'cursor-default'
                  : 'cursor-pointer'
              }`}
              onClick={() => {
                if (location.pathname !== '/notification')
                  navigate('/notification')
              }}
            >
              <span className='text-sm font-medium max-w-47.5 whitespace-pre-wrap wrap-break-word block'>
                {socketData.device || '- -'}
              </span>
              <span className='text-sm max-w-47.5 whitespace-pre-wrap wrap-break-word block'>
                {changText(socketData.message, t)}
              </span>
              <span className='text-xs mt-1'>
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
            <div>
              <button
                className='flex items-center justify-center text-base-content/50 border-none rounded-full p-2 cursor-pointer hover:bg-red-500/20 hover:text-red-700 duration-300 ease-out'
                onClick={() => toast.dismiss(toa.id)}
              >
                <RiCloseLargeFill size={18} />
              </button>
            </div>
          </>
        ),
        {
          icon: changIcon(socketData.message),
          duration: 15000,
          style: {
            backgroundColor:
              'var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)))',
            borderRadius: 'var(--rounded-field, 0.5rem)',
            padding: '.5rem .7rem',
            backdropFilter: 'blur(10px)',
            width: 'max-content'
          }
        }
      )
    }

    dispatch(setSocketData(null))
  }, [socketData, popUpMode, location.pathname, dispatch, navigate, t])

  // Render Logic
  const isSpecialTheme = [
    'cupcake',
    'valentine',
    'forest',
    'pastel',
    'acid'
  ].includes(themeMode)

  return (
    <main>
      <div
        className={`drawer lg:drawer-open w-auto duration-300 ease-linear ${
          showAnimation ? 'initial-Launched-Main' : ''
        }`}
        onAnimationEnd={() => setShowAnimation(false)}
      >
        <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          <Navbar />
          <section
            className={`min-h-[calc(100dvh-120px)] pb-21 sm:pb-0 md:rounded-box bg-linear-to-br from-base-200 via-base-100 to-base-200/50 md:mx-3 md:mb-3 ${
              isSpecialTheme ? 'pb-25 sm:pb-0' : ''
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
