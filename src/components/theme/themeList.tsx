import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setTheme } from '../../redux/actions/utilsActions'
import { useTranslation } from 'react-i18next'

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
        className='btn btn-ghost hidden lg:flex tooltip tooltip-bottom'
      >
        <svg
          width='20'
          height='20'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='h-[24px] w-[24px] stroke-current'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
          ></path>
        </svg>
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
        className='dropdown-content z-[80] bg-base-100 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16'
      >
        <div className='grid grid-cols-1 gap-3 p-3 z-[80]'>
          <div className='divider mt-0 mb-2 h-3 text-base-content/50 text-[16px]'>
            {t('systemMode')}
          </div>
          <button
            onClick={changeToSystem}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='system'
          >
            <span
              className='relative grid grid-cols-2 rounded-btn shadow-md text-base-content h-[44px] w-full cursor-pointer'
              data-theme='system'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                className={`${
                  themeMode === '' ? 'visible' : 'invisible'
                } fill-white shrink-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-btn shadow-md bg-primary w-[20px] h-[20px] p-1`}
              >
                <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
              </svg>
              <span
                className='bg-white text-black rounded-l-btn h-[44px] flex flex-col items-center justify-center gap-1 p-4'
                data-theme='light'
              >
                <span className='text-sm font-medium'>Light</span>
                <div className='flex gap-1'>
                  <span className='bg-primary rounded-badge w-2 h-2'></span>
                  <span className='bg-secondary rounded-badge w-2 h-2'></span>
                  <span className='bg-accent rounded-badge w-2 h-2'></span>
                  <span className='bg-neutral rounded-badge w-2 h-2'></span>
                </div>
              </span>
              <span
                className='bg-[oklch(0.25 0.02 252.42 / 0.8)] text-white rounded-r-btn h-[44px] flex flex-col items-center justify-center gap-1 p-4'
                data-theme='dark'
              >
                <span className='text-sm font-medium'>Dark</span>
                <div className='flex gap-1'>
                  <span className='bg-primary rounded-badge w-2 h-2'></span>
                  <span className='bg-secondary rounded-badge w-2 h-2'></span>
                  <span className='bg-accent rounded-badge w-2 h-2'></span>
                  <span className='bg-neutral rounded-badge w-2 h-2'></span>
                </div>
              </span>
            </span>
          </button>
          <div className='divider my-2 h-3 text-base-content/50 text-[16px]'>
            {t('themeMode')}
          </div>
          <button
            onClick={() => changeTheme('light')}
            className='outline-base-content text-start outline-offset-4 '
            data-set-theme='light'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='light'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'light' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>light</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('dark')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='dark'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='dark'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'dark' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>dark</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('cupcake')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='cupcake'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='cupcake'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'cupcake' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>cupcake</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('bumblebee')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='bumblebee'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='bumblebee'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'bumblebee' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>bumblebee</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('emerald')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='emerald'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='emerald'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'emerald' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>emerald</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('corporate')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='corporate'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='corporate'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'corporate' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>corporate</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('synthwave')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='synthwave'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='synthwave'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'synthwave' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>synthwave</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('retro')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='retro'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='retro'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'retro' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>retro</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('cyberpunk')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='cyberpunk'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='cyberpunk'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'cyberpunk' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>cyberpunk</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('valentine')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='valentine'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='valentine'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'valentine' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>valentine</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('halloween')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='halloween'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='halloween'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'halloween' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>halloween</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('garden')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='garden'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='garden'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'garden' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>garden</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('forest')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='forest'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='forest'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'forest' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>forest</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('aqua')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='aqua'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='aqua'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'aqua' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>aqua</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('lofi')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='lofi'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='lofi'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'lofi' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>lofi</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('pastel')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='pastel'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='pastel'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'pastel' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>pastel</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('fantasy')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='fantasy'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='fantasy'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'fantasy' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>fantasy</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('wireframe')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='wireframe'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='wireframe'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'wireframe' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>wireframe</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('black')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='black'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='black'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'black' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>black</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('luxury')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='luxury'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='luxury'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'luxury' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>luxury</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('dracula')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='dracula'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='dracula'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'dracula' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>dracula</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('cmyk')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='cmyk'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='cmyk'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'cmyk' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>cmyk</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('autumn')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='autumn'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='autumn'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'autumn' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>autumn</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('business')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='business'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='business'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'business' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>business</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('acid')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='acid'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='acid'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'acid' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>acid</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('lemonade')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='lemonade'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='lemonade'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'lemonade' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>lemonade</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('night')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='night'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='night'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'night' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>night</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('coffee')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='coffee'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='coffee'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'coffee' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>coffee</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('winter')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='winter'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='winter'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'winter' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>winter</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('dim')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='dim'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='dim'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'dim' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>dim</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('nord')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='nord'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='nord'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'nord' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>nord</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
          <button
            onClick={() => changeTheme('sunset')}
            className='outline-base-content text-start outline-offset-4'
            data-set-theme='sunset'
          >
            <span
              className='bg-base-100 rounded-btn shadow-md text-base-content block w-full cursor-pointer font-sans'
              data-theme='sunset'
            >
              <span className='grid grid-cols-5 grid-rows-3'>
                <span className='col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`${
                      themeMode === 'sunset' ? 'visible' : 'invisible'
                    } h-3 w-3 shrink-0`}
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'></path>
                  </svg>
                  <span className='flex-grow text-sm'>sunset</span>
                  <span className='flex h-full shrink-0 flex-wrap gap-1'>
                    <span className='bg-primary rounded-badge w-2'></span>
                    <span className='bg-secondary rounded-badge w-2'></span>
                    <span className='bg-accent rounded-badge w-2'></span>
                    <span className='bg-neutral rounded-badge w-2'></span>
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeList
