import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAlertFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const Notacess = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const langs = localStorage.getItem('lang')

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('Logo_SM_WBG.jpg')

    return () => {
      changeFavicon('Logo_SM_WBG.jpg')
    }
  }, [])

  return (
    <div className='p-3 h-dvh flex items-center justify-center gap-3'>
      <div className='w-full fixed h-[60px] bg-yellow-500/40 blur-2xl top-0 shadow-2xl shadow-yellow-500/70 z-10'></div>
      <div className='flex items-center justify-center gap-3 flex-col'>
        <RiAlertFill size={48} className='text-yellow-600' />
        <span className='text-[48px] font-medium'>{t('titleNotAccess')}</span>
        <span className='text-[18px]'>{t('descriptionNotAccess')}</span>
        <button
          className='btn btn-ghost bg-base-300 text-base-content mt-5'
          onClick={() => navigate(-1)}
        >
          {t('buttonErrorBack')}
        </button>
      </div>
    </div>
  )
}

export default Notacess
