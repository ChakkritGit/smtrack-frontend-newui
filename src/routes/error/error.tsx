import { useEffect } from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { RiBugLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'

const ErrorScreen = () => {
    const {blurDisabled} = useSelector((state: RootState) => state.utils)
  const { t } = useTranslation()
  const error = useRouteError()
  const navigate = useNavigate()
  let limitReload = cookies.get('limitError') || false

  useEffect(() => {
    if (limitReload) {
      cookies.set('limitError', false, cookieOptions)
      return
    }

    // window.location.reload()
    cookies.set('limitError', true, cookieOptions)
  }, [])

  return (
    <div className='p-3 h-dvh flex items-center justify-center gap-3'>
      <div className={`w-full fixed ${blurDisabled ? 'blur-[100px] bg-red-500/40 h-[50px] top-0 shadow-2xl shadow-red-500/100 z-10' : ''}`}></div>
      <div className='flex items-center justify-center gap-3 flex-col'>
        <RiBugLine className='text-red-500 text-[48px] md:text-[64px]' />
        <pre className='max-w-[720px] whitespace-pre-wrap break-words max-h-[520px] overflow-y-scroll py-1 no-scrollbar'>{String(error)}</pre>
        <button
          className='btn btn-ghost bg-base-300 text-base-content mt-5'
          onClick={() => navigate('/')}
        >
          {t('buttonErrorBack')}
        </button>
      </div>
    </div>
  )
}

export default ErrorScreen
