import { useTranslation } from 'react-i18next'
import LanguageList from '../../language/languageList'

const LanguageComponents = () => {
  const { t } = useTranslation()

  return (
    <div className='min-h-[15rem]'>
      <span className='text-[18px] font-medium'>{t('tabLanguage')}</span>
      <div className='flex items-center justify-between'>
        <span>{t('changeLanguage')}</span>
        <LanguageList />
      </div>
    </div>
  )
}

export default LanguageComponents
