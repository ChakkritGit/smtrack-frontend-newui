import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setTheme } from '../../redux/actions/utilsActions'
import { useTranslation } from 'react-i18next'
import { ThemeListComponent } from '../../styles/daisyui/themeList'

const ThemeList = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { themeMode } = useSelector((state: RootState) => state.utils)

  const changeTheme = (themeName: string) => {
    dispatch(setTheme(themeName))
    localStorage.setItem('theme', themeName)
  }

  const changeToSystem = () => {
    dispatch(setTheme(''))
    localStorage.removeItem('theme')
  }

  return (
    <div className='dropdown dropdown-end hidden [@supports(color:oklch(0%_0_0))]:block'>
      <button
        data-tip={t('themeMode')}
        tabIndex={0}
        name='Themes'
        aria-label={t('themeMode')}
        role='button'
        className='btn btn-ghost px-2.5 hidden lg:flex tooltip tooltip-bottom'
      >
        <div
          data-theme={themeMode}
          className='grid grid-cols-2 content-center gap-0.5 p-1 w-6 h-6 bg-base-200 shadow-sm rounded-md'
        >
          <div className='bg-primary rounded-box rounded-full w-1.5 h-1.5'></div>
          <div className='bg-secondary rounded-box rounded-full w-1.5 h-1.5'></div>
          <div className='bg-accent rounded-box rounded-full w-1.5 h-1.5'></div>
          <div className='bg-neutral rounded-box rounded-full w-1.5 h-1.5'></div>
        </div>
        <svg
          width='12px'
          height='12px'
          className='hidden h-2 w-2 fill-current opacity-60 sm:inline-block'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 2048 2048'
        >
          <path d='M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z'></path>
        </svg>
      </button>
      <div
        tabIndex={0}
        className='dropdown-content z-[80] bg-base-100 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5 mt-16'
      >
        <ThemeListComponent
          changeTheme={changeTheme}
          changeToSystem={changeToSystem}
          themeMode={themeMode}
          t={t}
        />
      </div>
    </div>
  )
}

export default ThemeList
