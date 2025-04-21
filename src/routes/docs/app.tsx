import { useTranslation } from 'react-i18next'
import playStore from '../../assets/images/playstore.png'
import appStore from '../../assets/images/appstore.png'
import LogoBanner from '../../assets/images/app-logo.png'
import ApkBanner from '../../assets/images/apk-banner.svg'
import pdf from '../../assets/pdf/install_apk.pdf'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/footer/footer'

const App = () => {
  const { t } = useTranslation()
  return (
    <div className='min-h-dvh max-w-[720px] mx-auto py-14 px-5 flex flex-col items-center justify-center gap-3'>
      <Helmet prioritizeSeoTags>
        <meta
          name='description'
          content='SMTrack SMTrack+ smtrack smtrack+ app app-store play-store download application tracking temperature'
        />
      </Helmet>
      <div className='flex flex-col md:flex-row items-center justify-center'>
        <div className='avatar'>
          <div className='w-24 rounded'>
            <img src={LogoBanner} alt='SMTrack+ Logo' />
          </div>
        </div>
        <div className='divider divider-vertical md:divider-horizontal'></div>
        <div>
          <p className='text-[24px] font-medium leading-7 tracking-wide'>
            {t('appDownload')} SMTrack+
          </p>
          <div className='flex flex-col md:flex-row items-center gap-3 mt-4'>
            <a
              className='avatar'
              href='https://apps.apple.com/th/app/smtrack/id6670781090'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={appStore} alt='Download on the App Store' />
              </div>
            </a>
            <a
              className='avatar'
              href='https://play.google.com/store/apps/details?id=com.thanes.temp_noti'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={playStore} alt='Get it on Google Play' />
              </div>
            </a>
            <a
              className='avatar'
              href='https://api.siamatic.co.th/etemp/media/app-release.apk'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='h-[50px] w-[150px] rounded !aspect-auto'>
                <img src={ApkBanner} alt='Download APK directly' />
              </div>
            </a>
          </div>
        </div>
      </div>
      <p className='link link-primary leading-7 tracking-wide' onClick={() => window.open(pdf)}>
        {t('installApp')}
      </p>
      <div className='absolute bottom-0 left-0 right-0'>
        <Footer />
      </div>
    </div>
  )
}

export default App
