import { useEffect } from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { RiBugLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

const ErrorScreen = () => {
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
      <div className='w-full fixed h-[64px] bg-red-500/40 blur-2xl top-0 shadow-2xl shadow-red-500/70 z-10'></div>
      <div className='flex items-center justify-center gap-3 flex-col'>
        <RiBugLine size={48} className='text-red-500' />
        <span>{String(error)}</span>
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
