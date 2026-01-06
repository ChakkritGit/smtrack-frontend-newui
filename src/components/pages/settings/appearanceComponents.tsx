import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  setAmbientDisabled,
  setBlurDisabled,
  setGrayscaleMode,
  setTheme,
  setTransitionDisabled
} from '../../../redux/actions/utilsActions'
import { ThemeListTwoComponent } from '../../../styles/daisyui/themeList'
import LoadingList from '../../../styles/daisyui/loadingList'

// 1. สร้าง Reusable Component สำหรับ Toggle Row
interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  id: string // รับ ID แยกเพื่อให้ไม่ซ้ำกัน
  className?: string
}

const ToggleRow = ({
  label,
  checked,
  onChange,
  disabled = false,
  id,
  className = ''
}: ToggleRowProps) => (
  <div className={`flex items-center justify-between mt-3 ${className}`}>
    <label
      htmlFor={id}
      className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}
    >
      {label}
    </label>
    <input
      type='checkbox'
      className='toggle'
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
)

const AppearanceComponents = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // 2. Performance: ดึงเฉพาะค่าที่ใช้จริงๆ (หรือถ้า reducer แยกดีแล้ว เขียนแบบเดิมก็ได้ แต่แบบนี้ชัดเจนกว่า)
  const {
    themeMode,
    grayscaleMode,
    blurDisabled,
    transitionDisabled,
    ambientDisabled
  } = useSelector((state: RootState) => state.utils)

  // 3. Helper Functions wrapped with useCallback
  const changeTheme = useCallback(
    (themeName: string) => {
      dispatch(setTheme(themeName))
      localStorage.setItem('theme', themeName)
    },
    [dispatch]
  )

  const changeToSystem = useCallback(() => {
    dispatch(setTheme(''))
    localStorage.removeItem('theme')
  }, [dispatch])

  // Generic Handler สำหรับ Toggle
  const handleToggle = useCallback(
    (action: any, key: string, currentValue: boolean) => {
      dispatch(action())
      localStorage.setItem(key, String(!currentValue))
    },
    [dispatch]
  )

  return (
    <div>
      {/* Theme Section */}
      <section>
        <span className='text-[18px] font-medium'>{t('themeMode')}</span>
        <ThemeListTwoComponent
          changeTheme={changeTheme}
          changeToSystem={changeToSystem}
          themeMode={themeMode}
          t={t}
        />
      </section>

      {/* Loading Mode Section */}
      <section className='mt-3'>
        <span className='text-[18px] font-medium'>{t('loadingMode')}</span>
        <LoadingList />
      </section>

      <div className='divider divider-vertical my-2 before:h-px after:h-px'></div>

      {/* Filter Color Section */}
      <section className='mt-3'>
        <span className='text-[18px] font-medium'>{t('filterColor')}</span>
        <div>
          <ToggleRow
            id='toggle-blur'
            label={t('blur')}
            checked={blurDisabled}
            onChange={() =>
              handleToggle(setBlurDisabled, 'blurDisabled', blurDisabled)
            }
          />

          {/* Logic การซ่อน Grayscale: ใช้ CSS grid หรือ max-height transition */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              !blurDisabled ? 'max-h-0 opacity-0' : 'max-h-12.5 opacity-100'
            }`}
          >
            <ToggleRow
              id='toggle-grayscale'
              className='ml-3'
              label={t('grayscale')}
              checked={grayscaleMode}
              disabled={!blurDisabled}
              onChange={() =>
                handleToggle(setGrayscaleMode, 'grayscaleMode', grayscaleMode)
              }
            />
          </div>

          <ToggleRow
            id='toggle-ambient'
            label={t('ambientMode')}
            checked={ambientDisabled}
            onChange={() =>
              handleToggle(
                setAmbientDisabled,
                'ambientDisabled',
                ambientDisabled
              )
            }
          />
        </div>
      </section>

      <div className='divider divider-vertical my-2 before:h-px after:h-px'></div>

      {/* Animation Section */}
      <section className='mt-3'>
        <span className='text-[18px] font-medium'>{t('animation')}</span>
        <ToggleRow
          id='toggle-transition'
          label={t('transition')}
          checked={transitionDisabled}
          onChange={() =>
            handleToggle(
              setTransitionDisabled,
              'transitionDisabled',
              transitionDisabled
            )
          }
        />
      </section>
    </div>
  )
}

export default AppearanceComponents
