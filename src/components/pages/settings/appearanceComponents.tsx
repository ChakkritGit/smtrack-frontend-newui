import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  setAmbientDisabled,
  setBlurDisabled,
  setFpsDisabled,
  setGrayscaleMode,
  setTheme,
  setTransitionDisabled
} from '../../../redux/actions/utilsActions'
import { ThemeListTwoComponent } from '../../../styles/daisyui/themeList'

const AppearanceComponents = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    themeMode,
    grayscaleMode,
    blurDisabled,
    transitionDisabled,
    ambientDisabled,
    fpsDisabled,
    tokenDecode
  } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}

  const changeTheme = (themeName: string) => {
    dispatch(setTheme(themeName))
    localStorage.setItem('theme', themeName)
  }

  const changeToSystem = () => {
    dispatch(setTheme(''))
    localStorage.removeItem('theme')
  }

  return (
    <div>
      <span className='text-[24px]'>{t('themeMode')}</span>
      <ThemeListTwoComponent
        changeTheme={changeTheme}
        changeToSystem={changeToSystem}
        themeMode={themeMode}
        t={t}
      />
      <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
      <div className='mt-3'>
        <span className='text-[24px]'>{t('filterColor')}</span>
        <div>
          <div className=' flex items-center justify-between mt-3'>
            <span>{t('blur')}</span>
            <input
              type='checkbox'
              className='toggle'
              name='filterColor'
              id='filterColor'
              checked={blurDisabled}
              onChange={() => {
                dispatch(setBlurDisabled())
                localStorage.setItem('blurDisabled', String(!blurDisabled))
              }}
            />
          </div>
          <div
            className={`ml-3 flex items-center justify-between mt-3 max-h-[24px] opacity-100 ${
              !blurDisabled ? '!max-h-0 !opacity-0' : ''
            } overflow-hidden duration-300 ease-linear`}
          >
            <span>{t('grayscale')}</span>
            <input
              type='checkbox'
              className='toggle'
              name='filterColor'
              id='filterColor'
              disabled={!blurDisabled}
              checked={grayscaleMode}
              onChange={() => {
                dispatch(setGrayscaleMode())
                localStorage.setItem('grayscaleMode', String(!grayscaleMode))
              }}
            />
          </div>
          <div className=' flex items-center justify-between mt-3'>
            <span>{t('ambientMode')}</span>
            <input
              type='checkbox'
              className='toggle'
              name='filterColor'
              id='filterColor'
              checked={ambientDisabled}
              onChange={() => {
                dispatch(setAmbientDisabled())
                localStorage.setItem(
                  'ambientDisabled',
                  String(!ambientDisabled)
                )
              }}
            />
          </div>
        </div>
      </div>
      <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
      <div className='mt-3'>
        <span className='text-[24px]'>{t('animation')}</span>
        <div className=' flex items-center justify-between mt-3'>
          <span>{t('transition')}</span>
          <input
            type='checkbox'
            className='toggle'
            name='filterColor'
            id='filterColor'
            checked={transitionDisabled}
            onChange={() => {
              dispatch(setTransitionDisabled())
              localStorage.setItem(
                'transitionDisabled',
                String(!transitionDisabled)
              )
            }}
          />
        </div>
        {role === 'SUPER' && (
          <div className=' flex items-center justify-between mt-3'>
            <span>{t('showFPS')}</span>
            <input
              type='checkbox'
              className='toggle'
              name='filterColor'
              id='filterColor'
              checked={fpsDisabled}
              onChange={() => {
                dispatch(setFpsDisabled())
                localStorage.setItem('fpsDisabled', String(!fpsDisabled))
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppearanceComponents
