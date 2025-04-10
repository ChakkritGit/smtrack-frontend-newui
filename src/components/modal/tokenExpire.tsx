import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { KeyboardEvent, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import {
  resetUtils,
  setCookieEncode,
  setTokenExpire,
  setUserProfile
} from '../../redux/actions/utilsActions'
import { RiAlertLine } from 'react-icons/ri'

const TokenExpire = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tokenExpire } = useSelector((state: RootState) => state.utils)
  const tokenExpireModalRef = useRef<HTMLDialogElement>(null)

  const clearEverything = () => {
    dispatch(setTokenExpire(false))
    cookies.remove('tokenObject', cookieOptions)
    cookies.remove('userProfile', cookieOptions)
    cookies.remove('tmsMode', cookieOptions)
    cookies.remove('hosId', cookieOptions)
    cookies.remove('wardId', cookieOptions)
    cookies.remove('deviceKey', cookieOptions)
    dispatch(resetUtils())
    dispatch(setCookieEncode(undefined))
    dispatch(setUserProfile(undefined))
    cookies.update()
    navigate('/login')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
    }
  }

  useEffect(() => {
    if (tokenExpire && tokenExpireModalRef.current) {
      tokenExpireModalRef.current.showModal()
    }
  }, [tokenExpire])

  return (
    <dialog
      ref={tokenExpireModalRef}
      className='modal'
      onKeyDown={handleKeyDown}
    >
      <div className='modal-box'>
        <div className='flex items-center gap-2'>
          <RiAlertLine size={24} />
          <h3 className='font-bold text-lg'>{t('tokenExpired')}</h3>
        </div>
        <p className='py-4'>{t('tokenExpiredText')}</p>
        <div className='modal-action mt-3'>
          <form method='dialog'>
            <button className='btn btn-error' onClick={() => clearEverything()}>
              {t('confirmButton')}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default TokenExpire
