import { useTranslation } from 'react-i18next'

const DataTableNoData = () => {
  const { t } = useTranslation()

  return (
    <div className='w-full p-3 h-full'>
      <div className='flex items-center justify-center gap-3 h-full'>
        <span className='text-[14px] text-base-content/65'>{t('nodata')}</span>
      </div>
    </div>
  )
}

export default DataTableNoData