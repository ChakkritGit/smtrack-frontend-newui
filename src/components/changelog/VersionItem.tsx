import { i18n, TFunction } from 'i18next'
import { dateThaiFormat } from '../../constants/utils/utilsConstants'
import { ChangeLogItem } from './changelogData'

interface VersionItemProps {
  data: ChangeLogItem
  t: TFunction
  i18n: i18n
}

const VersionItem = ({ data, t, i18n }: VersionItemProps) => {
  const { version, date, isNew, changes, titleSuffixKey } = data

  return (
    <div className='border-b py-3 px-2 border-base-content/10'>
      <div className='flex items-center justify-between mr-3'>
        <div className='mt-2 flex items-center gap-3'>
          <span className='font-bold'>{version}</span>

          {titleSuffixKey && <span>{t(`changelog.${titleSuffixKey}`)}</span>}

          {isNew && (
            <div className='badge badge-accent font-medium px-1.5'>
              {t('changelog.badgeNew')}
            </div>
          )}
        </div>
        <span className='text-[14px] font-medium'>
          {dateThaiFormat(date, i18n)}
        </span>
      </div>

      <div>
        {changes.map((changeKey, index) => (
          <div key={index} className='ml-3'>
            <span className='font-bold text-lg'>-</span>
            <span className='ml-3'>
              {t(`changelog.${changeKey}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VersionItem
