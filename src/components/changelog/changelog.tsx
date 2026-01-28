import { MdOutlineUpdate } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { CHANGELOG_DATA } from './changelogData'
import VersionItem from './VersionItem'

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
        {CHANGELOG_DATA.map(item => (
          <VersionItem key={item.version} data={item} t={t} i18n={i18n} />
        ))}
      </div>
    </div>
  )
}

export default Changelog
