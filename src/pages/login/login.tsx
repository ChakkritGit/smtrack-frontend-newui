import { AxiosError } from 'axios'
import { FormEvent, useRef, useState } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { setCookieEncode } from '../../redux/actions/utilsActions'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageList from '../../components/language/languageList'
import {
  RiAtLine,
  RiBookOpenLine,
  RiEyeLine,
  RiEyeOffLine,
  RiKey2Line
} from 'react-icons/ri'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/footer/footer'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { LoginType } from '../../types/global/login'
import { RootState } from '../../redux/reducers/rootReducer'

const Login = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loadingStyle } = useSelector((state: RootState) => state.utils)
  const [showPassword, setShowPassword] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const modalAlert = useRef<HTMLDialogElement>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const username = usernameRef.current?.value || ''
    const password = passwordRef.current?.value || ''

    const alertWarningElement = document.querySelector('[role="alert-warning"]')
    const alertErrorElement = document.querySelector('[role="alert-error"]')
    if (alertWarningElement) {
      alertWarningElement.classList.add('hidden')
    }
    if (alertErrorElement) {
      alertErrorElement.classList.add('hidden')
    }

    if (username === '' || password === '') {
      if (alertWarningElement) {
        alertWarningElement.classList.remove('hidden')
        setLoading(false)
      }
      return
    }

    try {
      const response = await axiosInstance.post<responseType<LoginType>>(
        '/auth/login',
        {
          username: username.toLowerCase(),
          password
        }
      )
      const { hosId, token, refreshToken, id, wardId, role } =
        response.data.data

      if (role === 'GUEST') {
        if (modalAlert.current) {
          modalAlert.current.showModal()
        }
        return
      }

      const tokenObject = {
        hosId,
        refreshToken,
        token,
        id,
        wardId
      }

      cookies.set(
        'tokenObject',
        String(accessToken(tokenObject)),
        cookieOptions
      )
      cookies.update()
      dispatch(setCookieEncode(String(accessToken(tokenObject))))
      navigate(`/`)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (alertErrorElement) {
          setAlertMessage(error.response?.data.message)
          alertErrorElement.classList.remove('hidden')
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-dvh flex flex-col items-center justify-center gap-7'>
      <Helmet prioritizeSeoTags>
        <title>SMTrack+ - Login</title>
      </Helmet>

      <div className='card bg-base-100 w-[350px] sm:w-[500px] md:w-[500px] lg:w-[600px] h-max shadow-xl'>
        <div className='px-5 sm:px-7 lg:px-10 pt-5'>
          <div className='text-end'>
            <LanguageList />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold'>SMTrack+</h1>
          <span className='font-medium'>
            Real-time temperature monitoring with alerts for exceeding limits
          </span>
          <div
            role='alert-error'
            className='alert alert-error mt-4 hidden animate-transition-pop'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
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
            <span>{`${t('alertHeaderError')} ${
              alertMessage ?? t('descriptionErrorWrong')
            }`}</span>
          </div>
          <div
            role='alert-warning'
            className={`alert alert-warning mt-4 hidden animate-transition-pop`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
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
            <div>
              <span>{`${t('alertHeaderWarning')} ${t('completeField')}`}</span>
            </div>
          </div>
        </div>
        <div className='card-body px-5 sm:px-7 lg:px-10'>
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <label className='input  flex items-center gap-2 w-full'>
              <RiAtLine
                fill='currentColor'
                width={16}
                hanging={16}
                opacity={0.7}
              />
              <input
                ref={usernameRef}
                type='text'
                className='grow'
                placeholder={t('userNameForm')}
                autoComplete='username'
                autoFocus
              />
            </label>
            <div className='relative'>
              <label className='input  flex items-center gap-2 pr-16 w-full'>
                <RiKey2Line
                  fill='currentColor'
                  width={16}
                  height={16}
                  opacity={0.7}
                />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  className='grow'
                  placeholder={t('userPassword')}
                  autoComplete='current-password'
                />
              </label>
              <button
                type='button'
                className='absolute right-2 top-1/2 -translate-y-1/2 border border-base-content/30 w-7 h-7 p-1 flex items-center justify-center cursor-pointer rounded-field text-base-content/30 hover:opacity-50 duration-300 ease-linear z-10'
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <RiEyeOffLine size={18} />
                ) : (
                  <RiEyeLine size={18} />
                )}
              </button>
            </div>
            <div className='card-actions'>
              <button
                type='submit'
                className='btn btn-neutral w-full text-[16px]'
              >
                {loading ? (
                  <span className={`loading ${loadingStyle} loading-md`}></span>
                ) : (
                  t('loginButton')
                )}
              </button>
            </div>
          </form>
          <div className='divider'>{t('contactUs')}</div>
          <span className='text-center'>
            {t('neddHelp')}{' '}
            <span
              onClick={() => navigate('/support')}
              className='text-primary active:underline underline-offset-[3px] cursor-pointer'
            >
              {t('contactSupport')}
            </span>
          </span>
        </div>
      </div>
      <div className='flex items-center justify-end text-[14px] w-[370px] sm:w-[500px] md:w-[500px] lg:w-[600px] px-10'>
        <Link
          to={'/policies'}
          className='flex items-center gap-2 active:underline underline-offset-[3px]'
        >
          <RiBookOpenLine size={16} />
          <span>{t('policies')}</span>
        </Link>
      </div>
      <div className='absolute bottom-0 left-0 right-0'>
        <Footer />
      </div>

      <dialog ref={modalAlert} className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('alertHeaderError')}</h3>
          <p className='py-2 text-sm opacity-70'>{t('exit')}</p>
          <p className='py-2'>{t('titleNotAccess')}</p>
          <div className='modal-action mt-3'>
            <form method='dialog'>
              <button className='btn'>{t('doorClose')}</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Login
