import { FormEvent, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { AxiosError } from 'axios'
import {
  RiAtLine,
  RiBookOpenLine,
  RiEyeLine,
  RiEyeOffLine,
  RiKey2Line
} from 'react-icons/ri'

// Redux & Utils
import { RootState } from '../../redux/reducers/rootReducer'
import { setCookieEncode } from '../../redux/actions/utilsActions'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'

// Types
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { LoginType } from '../../types/global/login'
import Footer from '../../components/footer/footer'
import LanguageList from '../../components/language/languageList'

const Login = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Redux State
  const { loadingStyle } = useSelector((state: RootState) => state.utils)

  // Local State
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWarning, setIsWarning] = useState(false)

  // Refs
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const modalAlertRef = useRef<HTMLDialogElement>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    // 1. Get Values
    const username = usernameRef.current?.value.trim() || ''
    const password = passwordRef.current?.value || ''

    // 2. Reset States
    setError(null)
    setIsWarning(false)

    // 3. Validation
    if (!username || !password) {
      setIsWarning(true)
      return
    }

    setLoading(true)

    try {
      // 4. API Call
      const response = await axiosInstance.post<responseType<LoginType>>(
        '/auth/login',
        {
          username: username.toLowerCase(),
          password
        }
      )

      const { hosId, token, refreshToken, id, wardId, role } =
        response.data.data

      // 5. Role Check
      if (role === 'GUEST') {
        modalAlertRef.current?.showModal()
        return
      }

      // 6. Set Auth Data
      const tokenObject = { hosId, refreshToken, token, id, wardId }
      const tokenString = String(accessToken(tokenObject))

      cookies.set('tokenObject', tokenString, cookieOptions)
      cookies.update() // Ensure cookies are flushed if needed by library
      dispatch(setCookieEncode(tokenString))

      // 7. Navigate
      navigate('/')
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message ?? t('descriptionErrorWrong'))
      } else {
        console.error(err)
        setError(t('descriptionErrorWrong'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    // เปลี่ยน bg-base-200/30 เป็น Gradient
    // bg-gradient-to-br: ไล่สีจากมุมบนซ้ายไปล่างขวา
    // from-base-100: เริ่มต้นด้วยสีพื้นหลังปกติ (ขาว)
    // via-base-100: ตรงกลางยังคงขาวเพื่อให้ดูสะอาด
    // to-base-200/50: ปลายทางเป็นสีเทาจางๆ (50%)
    <div className='min-h-dvh flex flex-col bg-linear-to-br from-base-100 via-base-100 to-base-200/50'>
      <Helmet prioritizeSeoTags>
        <title>SMTrack+ - Login</title>
      </Helmet>

      {/* 2. Content Wrapper */}
      <div className='flex-1 flex flex-col items-center justify-center p-4 gap-6 w-full'>
        {/* --- ส่วน Card (เหมือนเดิม) --- */}
        <div className='card bg-base-100 w-full max-w-112.5 shadow-2xl shadow-base-300/50 rounded-3xl overflow-hidden'>
          <div className='card-body px-6 sm:px-10 py-8 gap-0'>
            <div className='flex justify-between items-start mb-2'>
              <div className='flex flex-col'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-primary'>
                  SMTrack+
                </h1>
                <span className='text-sm text-base-content/60 font-medium mt-1 leading-relaxed'>
                  Real-time temperature monitoring
                </span>
              </div>
              <div className='-mr-2 -mt-1'>
                <LanguageList />
              </div>
            </div>

            <div className='flex flex-col gap-3 min-h-6 mt-4 mb-2'>
              {error && (
                <div
                  role='alert'
                  className='alert alert-error bg-error/10 text-error border-none py-2 px-3 text-sm rounded-lg animate-transition-pop flex items-start'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 shrink-0 stroke-current mt-0.5'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span className='font-medium'>{`${t(
                    'alertHeaderError'
                  )} ${error}`}</span>
                </div>
              )}

              {isWarning && (
                <div
                  role='alert'
                  className='alert alert-warning bg-warning/10 text-warning-content border-none py-2 px-3 text-sm rounded-lg animate-transition-pop flex items-start'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 shrink-0 stroke-current mt-0.5'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                    />
                  </svg>
                  <span className='font-medium'>{`${t(
                    'alertHeaderWarning'
                  )} ${t('completeField')}`}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className='flex flex-col gap-5 mt-2'>
              <div className='form-control'>
                <label className='input input-bordered flex items-center gap-3 w-full h-12 rounded-xl bg-base-100 border-base-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all outline-none'>
                  <RiAtLine size={20} className='text-base-content/40' />
                  <input
                    ref={usernameRef}
                    type='text'
                    className='grow text-base-content placeholder:text-base-content/30'
                    placeholder={t('userNameForm')}
                    autoComplete='username'
                    autoFocus
                  />
                </label>
              </div>

              <div className='form-control relative'>
                <label className='input input-bordered flex items-center gap-3 pr-12 w-full h-12 rounded-xl bg-base-100 border-base-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all outline-none'>
                  <RiKey2Line size={20} className='text-base-content/40' />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    className='grow text-base-content placeholder:text-base-content/30'
                    placeholder={t('userPassword')}
                    autoComplete='current-password'
                  />
                </label>
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-base-content/40 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer'
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? (
                    <RiEyeOffLine size={18} />
                  ) : (
                    <RiEyeLine size={18} />
                  )}
                </button>
              </div>

              <button
                type='submit'
                className='btn btn-neutral w-full h-12 text-[16px] rounded-xl font-semibold shadow-lg shadow-neutral/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2'
                disabled={loading}
              >
                {loading ? (
                  <span className={`loading ${loadingStyle} loading-md`}></span>
                ) : (
                  t('loginButton')
                )}
              </button>
            </form>

            <div className='mt-8 flex flex-col items-center gap-4'>
              <div className='relative w-full flex items-center justify-center'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-base-200'></span>
                </div>
                <span className='relative bg-base-100 px-3 text-xs text-base-content/40 uppercase tracking-wider'>
                  {t('contactUs')}
                </span>
              </div>

              <p className='text-sm text-base-content/60'>
                {t('neddHelp')}{' '}
                <button
                  type='button'
                  onClick={() => navigate('/support')}
                  className='font-semibold text-primary hover:text-primary-focus transition-colors cursor-pointer hover:underline'
                >
                  {t('contactSupport')}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Policies Link */}
        <div className='w-full max-w-112.5 flex justify-center sm:justify-end px-4'>
          <Link
            to='/policies'
            className='flex items-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors group cursor-pointer'
          >
            <RiBookOpenLine
              size={16}
              className='group-hover:scale-110 transition-transform'
            />
            <span>{t('policies')}</span>
          </Link>
        </div>
      </div>
      {/* จบ Content Wrapper */}

      {/* 3. Footer */}
      <div className='w-full'>
        <Footer />
      </div>

      {/* Modal Dialog */}
      <dialog
        ref={modalAlertRef}
        className='modal modal-bottom sm:modal-middle backdrop-blur-sm'
      >
        <div className='modal-box rounded-2xl'>
          <h3 className='font-bold text-lg text-error'>
            {t('alertHeaderError')}
          </h3>
          <p className='py-2 text-sm opacity-70'>{t('exit')}</p>
          <p className='py-2 font-medium'>{t('titleNotAccess')}</p>
          <div className='modal-action mt-6'>
            <form method='dialog'>
              <button className='btn btn-ghost rounded-xl'>
                {t('doorClose')}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Login
