import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiCheckLine, RiSpeakerLine } from 'react-icons/ri'
import { GiSoundWaves } from 'react-icons/gi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  setPopUpMode,
  setSound,
  setSoundMode
} from '../../../redux/actions/utilsActions'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'

// Import sounds
import n1 from '../../../assets/sounds/n1.mp3'
import n2 from '../../../assets/sounds/n2.wav'
import n3 from '../../../assets/sounds/n3.wav'
import n4 from '../../../assets/sounds/n4.wav'
import n5 from '../../../assets/sounds/n5.wav'
import n6 from '../../../assets/sounds/n6.wav'
import n7 from '../../../assets/sounds/n7.wav'
import n8 from '../../../assets/sounds/n8.mp3'

const SoundAndNotificationComponents = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { popUpMode, soundMode, sound } = useSelector(
    (state: RootState) => state.utils
  )

  // 1. รวม Assets ไว้ใน Array เพื่อให้จัดการง่าย (Scalable)
  const soundAssets = useMemo(
    () => [
      {
        id: 1,
        src: n1,
        label: `${t('notificationSoundList')} 1`,
        isDefault: true
      },
      { id: 2, src: n2, label: `${t('notificationSoundList')} 2` },
      { id: 3, src: n3, label: `${t('notificationSoundList')} 3` },
      { id: 4, src: n4, label: `${t('notificationSoundList')} 4` },
      { id: 5, src: n5, label: `${t('notificationSoundList')} 5` },
      { id: 6, src: n6, label: `${t('notificationSoundList')} 6` },
      { id: 7, src: n7, label: `${t('notificationSoundList')} 7` },
      { id: 8, src: n8, label: `${t('notificationSoundList')} 8` }
    ],
    [t]
  )

  // 2. แยก Logic การเปลี่ยนเสียงออกมา (Clean Logic)
  const handlePlaySound = useCallback(
    (id: number, src: string) => {
      const audio = new Audio(src)
      audio.play().catch(e => console.error('Audio play failed', e))

      dispatch(setSound(id))
      localStorage.setItem('sound', String(id))
    },
    [dispatch]
  )

  // 3. Helper สำหรับ Toggle (Optional: เพื่อลดโค้ดซ้ำในการ dispatch/cookie)
  const handleToggle = (
    action: any,
    cookieKey: string,
    currentValue: boolean
  ) => {
    dispatch(action())
    cookies.set(cookieKey, !currentValue, cookieOptions)
  }

  return (
    <div>
      <span className='text-[18px] font-medium'>{t('titleNotification')}</span>

      {/* Toggle: Mute All */}
      <label className='flex items-center justify-between mt-3 cursor-pointer'>
        <span>{t('allNotification')}</span>
        <input
          id='muteAllNotification'
          type='checkbox'
          className='toggle'
          checked={!popUpMode}
          onChange={() => handleToggle(setPopUpMode, 'popUpMode', popUpMode)}
        />
      </label>

      {/* Toggle: Mute Sound */}
      <label
        className={`flex items-center justify-between mt-5 ml-3 cursor-pointer duration-200 ${
          popUpMode ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className='flex items-center gap-2'>
          <RiSpeakerLine size={24} />
          <span>{t('notificationSound')}</span>
        </div>
        <input
          id='muteNotificationSound'
          type='checkbox'
          className='toggle'
          checked={!soundMode}
          disabled={popUpMode}
          onChange={() => handleToggle(setSoundMode, 'soundMode', soundMode)}
        />
      </label>

      {/* Sound List */}
      <div
        className={`mt-5 transition-opacity duration-300 ${
          // หมายเหตุ: เช็ค Logic เดิมของคุณดีๆ นะครับ
          // ปกติถ้า soundMode = true (เปิดเสียง) ไม่ควร disable list
          // แต่ถ้า Logic เดิมคุณถูกต้องแล้วก็ใช้ตามเดิมครับ
          soundMode || popUpMode ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className='divider divider-vertical my-2 before:h-px after:h-px'></div>
        <div className='flex items-center gap-2'>
          <span className='text-[18px] font-medium'>
            {t('notificationSound')}
          </span>
          <span className='opacity-50'>({t('clickToPlay')})</span>
        </div>

        {/* 4. ใช้ Map เพื่อสร้างรายการเสียง (DRY Principle) */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 py-3'>
          {soundAssets.map(item => (
            <div
              key={item.id}
              role='button'
              tabIndex={0}
              className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector border border-transparent ${
                sound === item.id ? 'bg-base-300/50 border-base-300' : ''
              }`}
              onClick={() => handlePlaySound(item.id, item.src)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePlaySound(item.id, item.src)
                }
              }}
            >
              <div className='flex items-center gap-2'>
                <GiSoundWaves size={24} />
                <span>
                  {item.label}{' '}
                  {item.isDefault && (
                    <span className='opacity-50 text-[14px]'>
                      ({t('default')})
                    </span>
                  )}
                </span>
              </div>

              {sound === item.id && (
                <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                  <RiCheckLine size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SoundAndNotificationComponents
