import { useTranslation } from 'react-i18next'
import { RiAlertLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className='p-3 h-dvh flex items-center justify-center gap-3'>
      <div className='w-full fixed h-[60px] bg-yellow-500/40 blur-2xl top-0 shadow-2xl shadow-yellow-500/70 z-10'></div>
      <div className='flex items-center justify-center gap-3 flex-col'>
        <RiAlertLine size={48} className='text-yellow-600' />
        <span className='text-[48px] font-medium'>404</span>
        <span className='text-[18px]'>{t('descriptionError')}</span>
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
