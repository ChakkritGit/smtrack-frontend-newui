import { useTranslation } from 'react-i18next'
import { RiAlertLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'

const NotFound = () => {
  const { blurDisabled } = useSelector((state: RootState) => state.utils)
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className='p-3 h-dvh flex items-center justify-center gap-3'>
      <div
        className={`w-full fixed ${
          blurDisabled
            ? 'blur-[100px] bg-yellow-500/40 h-[50px] top-0 shadow-2xl shadow-yellow-500/100 z-10'
            : ''
        }`}
      ></div>
      <div className='flex items-center justify-center gap-3 flex-col'>
        <RiAlertLine className='text-yellow-600 text-[48px] md:text-[64px]' />
        <span className='text-[42px] md:text-[82px] font-medium'>404</span>
        <span className='text-[18px] md:text-[24px]'>
          {t('descriptionError')}
        </span>
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

export default NotFound
