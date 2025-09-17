import { MdOutlineUpdate } from 'react-icons/md'
import { V2, V2_0_1, V2_0_2 } from './version'
import { useTranslation } from 'react-i18next'

const Changelog = () => {
  const { t, i18n } = useTranslation()

  return (
    <div className='p-3'>
      <div className='flex items-center gap-3'>
        <MdOutlineUpdate className='text-[24px] md:text-[32px]' />
        <h1 className='text-lg md:text-2xl font-bold my-3'>
          {t('changelog.title')}
        </h1>
      </div>
      <div>
        <V2_0_2 t={t} i18n={i18n} />
        <V2_0_1 t={t} i18n={i18n} />
        <V2 t={t} i18n={i18n} />
      </div>
    </div>
  )
}

export default Changelog
