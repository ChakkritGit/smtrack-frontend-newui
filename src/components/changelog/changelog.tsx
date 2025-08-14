import { TbLogs } from 'react-icons/tb'
import { V2, V2_0_1 } from './version'
import { useTranslation } from 'react-i18next'

const Changelog = () => {
  const { t } = useTranslation()

  return (
    <div className='p-3'>
      <div className='flex items-center gap-3'>
        <TbLogs className='text-[24px] md:text-[32px]' />
        <h1 className='text-lg md:text-2xl font-bold my-3'>
          {t('changelog.title')}
        </h1>
      </div>
      <div>
        <V2_0_1 t={t} />
        <V2 t={t} />
      </div>
    </div>
  )
}

export default Changelog
