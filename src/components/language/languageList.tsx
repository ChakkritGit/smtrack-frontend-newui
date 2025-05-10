import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setI18nInit } from '../../redux/actions/utilsActions'
import { RootState } from '../../redux/reducers/rootReducer'
import { RiEarthLine } from 'react-icons/ri'

const LanguageList = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { i18nInit } = useSelector((state: RootState) => state.utils)

  const changeLanguage = (language: string) => {
    localStorage.setItem('lang', language)
    dispatch(setI18nInit(language))
  }

  return (
    <div className='dropdown dropdown-end'>
      <div
        tabIndex={0}
        role='button'
        className='flex px-2.5 btn btn-ghost tooltip tooltip-left md:tooltip-bottom'
        aria-label='Language'
        data-tip={t('tabLanguage')}
      >
        <RiEarthLine size={24} />
        <svg
          width='12px'
          height='12px'
          className='hidden h-2 w-2 fill-current opacity-60 sm:inline-block'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 2048 2048'
        >
          <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z'></path>
        </svg>
      </div>
      <div
        tabIndex={0}
        className='dropdown-content bg-base-100 text-base-content rounded-box z-10 top-px mt-16 max-h-[calc(100vh-10rem)] w-33 overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5'
      >
        <ul className='menu menu-sm gap-1.5 w-full'>
          <li onClick={() => changeLanguage('th')}>
            <button
              className={`${
                i18nInit === 'th' ? 'menu-active' : ''
              } flex items-center justify-start h-7.5`}
            >
              <span className='pe-2 font-mono text-[.5625rem] font-bold tracking-[0.09375rem] opacity-40'>
                TH
              </span>
              <span className='text-[14px]'>ไทย</span>
            </button>
          </li>
          <li onClick={() => changeLanguage('en')}>
            <button
              className={`${
                i18nInit === 'en' ? 'menu-active' : ''
              } flex items-center justify-start h-7.5`}
            >
              <span className='pe-2 font-mono text-[.5625rem] font-bold tracking-[0.09375rem] opacity-40'>
                EN
              </span>
              <span className='text-[14px]'>English</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LanguageList
