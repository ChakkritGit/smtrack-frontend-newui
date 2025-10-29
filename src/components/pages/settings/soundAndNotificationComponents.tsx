import { useTranslation } from 'react-i18next'
import { RiCheckLine, RiSpeakerLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  setPopUpMode,
  setSound,
  setSoundMode
} from '../../../redux/actions/utilsActions'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { GiSoundWaves } from 'react-icons/gi'
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

  return (
    <div>
      <span className='text-[18px] font-medium'>{t('titleNotification')}</span>
      <label className='flex items-center justify-between mt-3'>
        <span>{t('allNotification')}</span>
        <input
          id='muteAllNotification'
          name='muteAllNotification'
          type='checkbox'
          className='toggle'
          checked={!popUpMode}
          onChange={() => {
            dispatch(setPopUpMode())
            cookies.set('popUpMode', !popUpMode, cookieOptions)
          }}
        />
      </label>
      <label
        className={`flex items-center justify-between mt-5 ml-3 ${
          popUpMode ? 'opacity-50' : ''
        }`}
      >
        <div className='flex items-center gap-2'>
          <RiSpeakerLine size={24} />
          <span>{t('notificationSound')}</span>
        </div>
        <input
          id='muteNotificationSound'
          name='muteNotificationSound'
          type='checkbox'
          className='toggle'
          checked={!soundMode}
          disabled={popUpMode}
          onChange={() => {
            dispatch(setSoundMode())
            cookies.set('soundMode', !soundMode, cookieOptions)
          }}
        />
      </label>
      <div
        className={`mt-5 ${
          soundMode || popUpMode ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
        <div className='flex items-center gap-2'>
          <span className='text-[18px] font-medium'>
            {t('notificationSound')}
          </span>
          <span className='opacity-50'>({t('clickToPlay')})</span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 py-3'>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 1 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n1).play()
              dispatch(setSound(1))
              localStorage.setItem('sound', '1')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>
                {t('notificationSoundList')} 1{' '}
                <span className='opacity-50 text-[14px]'>({t('default')})</span>
              </span>
            </div>

            {sound === 1 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 2 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n2).play()
              dispatch(setSound(2))
              localStorage.setItem('sound', '2')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 2</span>
            </div>
            {sound === 2 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 3 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n3).play()
              dispatch(setSound(3))
              localStorage.setItem('sound', '3')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 3</span>
            </div>
            {sound === 3 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 4 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n4).play()
              dispatch(setSound(4))
              localStorage.setItem('sound', '4')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 4</span>
            </div>
            {sound === 4 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 5 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n5).play()
              dispatch(setSound(5))
              localStorage.setItem('sound', '5')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 5</span>
            </div>
            {sound === 5 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 6 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n6).play()
              dispatch(setSound(6))
              localStorage.setItem('sound', '6')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 6</span>
            </div>
            {sound === 6 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 7 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n7).play()
              dispatch(setSound(7))
              localStorage.setItem('sound', '7')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 7</span>
            </div>
            {sound === 7 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
          <div
            className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
              sound === 8 ? 'bg-base-300/50' : ''
            }`}
            onClick={() => {
              new Audio(n8).play()
              dispatch(setSound(8))
              localStorage.setItem('sound', '8')
            }}
          >
            <div className='flex items-center gap-2'>
              <GiSoundWaves size={24} />
              <span>{t('notificationSoundList')} 8</span>
            </div>
            {sound === 8 && (
              <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
                <RiCheckLine size={18} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoundAndNotificationComponents
