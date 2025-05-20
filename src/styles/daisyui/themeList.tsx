import { TFunction } from 'i18next'
import { RiCheckLine } from 'react-icons/ri'

const themeList = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
  'halfview',
  'dinosaur',
  'slaybanana',
  'capocean',
  'blessedwizard',
  'sigmataco',
  'unboss',
  'averageghost',
  'daisyspace',
  'glasssupreme',
  'neonfade',
  'toxicmoon',
  'junglewoodnight',
  'junglewoodday',
  'extremedark',
  'extremelight',
  'redvelvetdark',
  'redvelvetlight',
  'oceandeep',
  'oceanshallow',
  'sigmaandmore',
  'coolbro',
  'coolsquad',
  'tinyocean',
  'windowsxp',
  'hugepenguin',
  'tinystar',
  'darkcaramellatte',
  'hotspace',
  'goblinjuggly'
]

type ThemeListProps = {
  themeMode: string
  changeTheme: (themeName: string) => void
  changeToSystem: () => void
  t: TFunction
}

const ThemeListComponent = (props: ThemeListProps) => {
  const { changeTheme, changeToSystem, t, themeMode } = props
  return (
    <div className='flex flex-col gap-2 py-3 pl-3 pr-2'>
      <span className='text-xs opacity-50'>{t('systemMode')}</span>
      <button
        data-set-theme='system'
        className='flex items-center justify-between p-2 rounded-box hover:bg-base-200 cursor-pointer'
        onClick={changeToSystem}
      >
        <div className='flex items-center gap-2.5'>
          <div
            data-theme='system'
            className='grid grid-cols-2 gap-0.5 p-1 bg-radial-[at_25%_25%] from-gray-200 to-gray-800 to-75% shadow-sm rounded-md'
          >
            <div className='bg-black rounded-box rounded-full w-1 h-1'></div>
            <div className='bg-white rounded-box rounded-full w-1 h-1'></div>
            <div className='bg-white rounded-box rounded-full w-1 h-1'></div>
            <div className='bg-black rounded-box rounded-full w-1 h-1'></div>
          </div>
          <span className='text-sm'>{t('systemMode')}</span>
        </div>
        <div
          className={
            themeMode === ''
              ? 'bg-neutral text-neutral-content p-[0.8px] rounded-selector'
              : ''
          }
        >
          {themeMode === '' && <RiCheckLine size={16} />}
        </div>
      </button>
      <span className='text-xs opacity-50'>{t('themeMode')}</span>
      {themeList.map(theme => (
        <button
          data-set-theme={theme}
          className='flex items-center justify-between p-2 rounded-box hover:bg-base-200 cursor-pointer'
          onClick={() => changeTheme(theme)}
        >
          <div className='flex items-center gap-2.5'>
            <div
              data-theme={theme}
              className='grid grid-cols-2 gap-0.5 p-1 bg-base-200 shadow-sm rounded-md'
            >
              <div className='bg-primary rounded-box rounded-full w-1 h-1'></div>
              <div className='bg-secondary rounded-box rounded-full w-1 h-1'></div>
              <div className='bg-accent rounded-box rounded-full w-1 h-1'></div>
              <div className='bg-neutral rounded-box rounded-full w-1 h-1'></div>
            </div>
            <span className='text-sm'>{theme}</span>
          </div>
          <div
            className={
              themeMode === theme
                ? 'bg-neutral text-neutral-content p-[0.8px] rounded-selector'
                : ''
            }
          >
            {themeMode === theme && <RiCheckLine size={16} />}
          </div>
        </button>
      ))}
    </div>
  )
}

const ThemeListTwoComponent = (props: ThemeListProps) => {
  const { changeTheme, changeToSystem, t, themeMode } = props
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 py-3 pl-3 pr-2 max-h-[220px] md:max-h-[270px] lg:max-h-[280px] overflow-y-scroll'>
      <button
        data-set-theme='system'
        className='flex items-center justify-between p-2 rounded-box hover:bg-base-200 cursor-pointer'
        onClick={changeToSystem}
      >
        <div className='flex items-center gap-2.5'>
          <div
            data-theme='system'
            className='grid grid-cols-2 gap-0.5 p-1.5 bg-radial-[at_25%_25%] from-gray-200 to-gray-800 to-75% shadow-sm rounded-md'
          >
            <div className='bg-black rounded-box rounded-full w-2 h-2'></div>
            <div className='bg-white rounded-box rounded-full w-2 h-2'></div>
            <div className='bg-white rounded-box rounded-full w-2 h-2'></div>
            <div className='bg-black rounded-box rounded-full w-2 h-2'></div>
          </div>
          <span className='text-sm'>{t('systemMode')}</span>
        </div>
        <div
          className={
            themeMode === ''
              ? 'bg-neutral text-neutral-content p-0.5 rounded-selector'
              : ''
          }
        >
          {themeMode === '' && <RiCheckLine size={18} />}
        </div>
      </button>
      {themeList.map(theme => (
        <button
          data-set-theme={theme}
          className='flex items-center justify-between p-2 rounded-box hover:bg-base-200 cursor-pointer'
          onClick={() => changeTheme(theme)}
        >
          <div className='flex items-center gap-2.5'>
            <div
              data-theme={theme}
              className='grid grid-cols-2 gap-0.5 p-1.5 bg-base-200 shadow-sm rounded-md'
            >
              <div className='bg-primary rounded-box rounded-full w-2 h-2'></div>
              <div className='bg-secondary rounded-box rounded-full w-2 h-2'></div>
              <div className='bg-accent rounded-box rounded-full w-2 h-2'></div>
              <div className='bg-neutral rounded-box rounded-full w-2 h-2'></div>
            </div>
            <span className='text-sm'>{theme}</span>
          </div>
          <div
            className={
              themeMode === theme
                ? 'bg-neutral text-neutral-content p-0.5 rounded-selector'
                : ''
            }
          >
            {themeMode === theme && <RiCheckLine size={18} />}
          </div>
        </button>
      ))}
    </div>
  )
}

export { ThemeListComponent, ThemeListTwoComponent }
