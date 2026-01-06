import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import {
  RiBookOpenLine,
  RiColorFilterAiFill,
  RiColorFilterAiLine,
  RiIdCardFill,
  RiIdCardLine,
  RiLogoutBoxRLine,
  RiNotification4Fill,
  RiNotification4Line,
  RiTranslate2
} from 'react-icons/ri'

// Components
import ProfileComponent from '../../components/pages/settings/profileComponent'
import SoundAndNotificationComponents from '../../components/pages/settings/soundAndNotificationComponents'
import AppearanceComponents from '../../components/pages/settings/appearanceComponents'
import LanguageComponents from '../../components/pages/settings/languageComponents'
import ResetPassword from '../../components/pages/settings/resetPassword'

// Redux & Utils
import { RootState } from '../../redux/reducers/rootReducer'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'

interface FormState {
  imagePreview: string | null
}

const Settings = () => {
  const { t } = useTranslation()

  // 1. Optimize Selector: เลือกเฉพาะ userProfile
  const userProfile = useSelector((state: RootState) => state.utils.userProfile)

  const profileModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState(
    () => localStorage.getItem('settingTab') ?? '1'
  )
  const [edit, setEdit] = useState(false)
  const [imageProcessing, setImageProcessing] = useState(false)

  const [image, setImage] = useState<FormState>({
    imagePreview: userProfile?.pic ?? null
  })

  useEffect(() => {
    setImage({ imagePreview: userProfile?.pic ?? null })
  }, [userProfile])

  // 2. Handle Tab Change
  const handleTabChange = useCallback((newTab: string) => {
    setTab(newTab)
    localStorage.setItem('settingTab', newTab)
  }, [])

  // 3. Handle Logout Logic
  const handleLogout = useCallback(() => {
    Swal.fire({
      title: t('logoutDialog'),
      text: t('logoutDialogText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirmButton'),
      cancelButtonText: t('cancelButton'),
      reverseButtons: false,
      customClass: {
        actions: 'custom-action',
        confirmButton: 'custom-confirmButton',
        cancelButton: 'custom-cancelButton'
      }
    }).then(result => {
      if (result.isConfirmed) {
        // Clear all cookies
        const keysToRemove = [
          'tokenObject',
          'userProfile',
          'tmsMode',
          'hosId',
          'wardId',
          'deviceKey'
        ]
        keysToRemove.forEach(key => cookies.remove(key, cookieOptions))
        cookies.update()
        window.location.href = '/login'
      }
    })
  }, [t])

  // 4. Define Menu Configuration (Readability & DRY)
  const menuItems = useMemo(
    () => [
      {
        id: '1',
        label: t('profile'),
        iconActive: <RiIdCardFill size={24} />,
        iconInactive: <RiIdCardLine size={24} />
      },
      {
        id: '2',
        label: t('titleNotification'),
        iconActive: <RiNotification4Fill size={24} />,
        iconInactive: <RiNotification4Line size={24} />
      },
      {
        id: '3',
        label: t('tabDisplay'),
        iconActive: <RiColorFilterAiFill size={24} />,
        iconInactive: <RiColorFilterAiLine size={24} />
      },
      {
        id: '4',
        label: t('tabLanguage'),
        iconActive: <RiTranslate2 size={24} />, // Assuming same icon for both states or change if needed
        iconInactive: <RiTranslate2 size={24} />
      }
    ],
    [t]
  )

  // 5. Content Rendering Strategy
  const renderContent = useMemo(() => {
    switch (tab) {
      case '1':
        return (
          <>
            <ProfileComponent
              key={'Setting'}
              userProfile={userProfile}
              profileModalRef={profileModalRef}
              fileInputRef={fileInputRef}
              image={image}
              setImage={setImage}
              edit={edit}
              setEdit={setEdit}
              imageProcessing={imageProcessing}
              setImageProcessing={setImageProcessing}
            />
            <ResetPassword />
          </>
        )
      case '2':
        return <SoundAndNotificationComponents />
      case '3':
        return <AppearanceComponents />
      case '4':
        return <LanguageComponents />
      default:
        return null
    }
  }, [tab, userProfile, image, edit, imageProcessing])

  return (
    <div className='p-3'>
      <div className='flex gap-1 md:gap-3 p-3'>
        {/* Sidebar Menu */}
        <ul className='flex flex-col md:min-w-50 gap-1'>
          {menuItems.map(item => (
            <li
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`btn font-normal flex-nowrap text-[16px] justify-start w-full flex ${
                tab === item.id
                  ? 'btn-neutral! pointer-events-none'
                  : 'btn-ghost'
              }`}
            >
              <div className='text-[16px] h-9 flex items-center gap-2'>
                {tab === item.id ? item.iconActive : item.iconInactive}
                <span className='hidden md:block'>{item.label}</span>
              </div>
            </li>
          ))}

          {/* Static Links / Actions */}
          <Link
            to='/policies'
            className='btn btn-ghost font-normal flex-nowrap text-[16px] justify-start w-full flex'
          >
            <div className='text-[16px] h-9 flex items-center gap-2'>
              <RiBookOpenLine size={24} />
              <span className='hidden md:block'>{t('policies')}</span>
            </div>
          </Link>

          <li
            onClick={handleLogout}
            className='btn btn-ghost font-normal text-red-500 flex-nowrap text-[16px] justify-start w-full flex'
          >
            <div className='text-[16px] h-9 flex items-center gap-2'>
              <RiLogoutBoxRLine size={24} />
              <span className='hidden md:block'>{t('tabLogout')}</span>
            </div>
          </li>
        </ul>

        <div className='divider divider-horizontal mx-1 md:mx-4'></div>

        {/* Content Area */}
        <div className='w-full p-3 bg-base-100 rounded-field'>
          <div className='w-full max-h-[calc(100dvh-220px)] md:max-h-[calc(100dvh-205px)] overflow-y-scroll pr-5'>
            {renderContent}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
