import { RiChatPrivateLine, RiFilePaper2Line } from 'react-icons/ri'
import Footer from '../../components/footer/footer'
import NavbarForTCPP from './navbarForTCPP'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Overview = () => {
  const { t } = useTranslation()
  document.title = t('overview')

  return (
    <div>
      <NavbarForTCPP />
      <div className='p-3 h-dvh'>
        <h1 className='text-[24px] font-medium'>{t('overview')}</h1>
        <p className='mt-3 text-[14px]'>{t('aboutOverview')}</p>
        <div className='flex items-center flex-col md:flex-row gap-5 mt-5'>
          <Link
            to={'/privacy-policy'}
            className='p-4 w-90 md:w-80 h-55 bg-base-100 rounded-selector border border-base-content/10 shadow-md hover:bg-base-200/50 hover:scale-95 duration-300 ease-out cursor-pointer'
          >
            <RiChatPrivateLine size={48} />
            <h2 className='text-[16px] md:text-[24px] font-medium mt-3'>
              {t('privacy')}
            </h2>
            <p className='mt-2 text-[14px]'>{t('aboutPrivacy')}</p>
          </Link>
          <Link
            to={'/terms-conditions'}
            className='p-4 w-90 md:w-80 h-55 bg-base-100 rounded-selector border border-base-content/10 shadow-md hover:bg-base-200/50 hover:scale-95 duration-300 ease-out cursor-pointer'
          >
            <RiFilePaper2Line size={48} />
            <h2 className='text-[16px] md:text-[24px] font-medium mt-3'>
              {t('terms')}
            </h2>
            <p className='mt-2 text-[14px]'>{t('aboutTerms')}</p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Overview
