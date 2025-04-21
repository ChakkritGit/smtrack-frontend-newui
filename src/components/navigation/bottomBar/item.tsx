import { Link, useLocation } from 'react-router-dom'
import {
  RiHome3Fill,
  RiHome3Line,
  RiDashboardFill,
  RiDashboardLine,
  RiUser6Fill,
  RiUser6Line,
  RiListSettingsFill,
  RiListSettingsLine
} from 'react-icons/ri'
import { TFunction } from 'i18next'
import { UserProfileType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import React from 'react'
import { UserRole } from '../../../types/global/users/usersType'

type BottomItemProps = {
  isScrollingDown: boolean
  themeMode: string
  t: TFunction
  userProfile: UserProfileType | undefined
  DefaultPic: string
  role: UserRole | undefined
  blurDisabled: boolean
}

const BottomNavItem = (props: BottomItemProps) => {
  const { DefaultPic, isScrollingDown, t, themeMode, userProfile, role, blurDisabled } = props
  const location = useLocation()

  return (
    <div
      className={`dock overflow-hidden bottom-0 px-3 pb-2 sm:hidden ${blurDisabled ? 'bg-base-100/80 backdrop-blur' : 'bg-base-100'} z-[89]
        ${
          isScrollingDown
            ? '!h-[0px] opacity-0'
            : 'h-[80px] shadow-sm opacity-100'
        }
        ${
          ['cupcake', 'valentine', 'forest', 'pastel', 'acid'].includes(themeMode)
            ? `bottom-5 mx-auto w-[95%] rounded-field !pb-0`
            : ''
        }`}
    >
      {[
        {
          to: '/',
          icon: [RiHome3Fill, RiHome3Line],
          text: t('sideShowAllBox')
        },
        {
          to: '/dashboard',
          icon: [RiDashboardFill, RiDashboardLine],
          text: t('sideDashboard')
        },
        {
          to: '/users',
          icon: [RiUser6Fill, RiUser6Line],
          text: t('sidePermission')
        },
        ...(role === 'SUPER' || role === 'SERVICE' ? [
          {
            to: '/management',
            icon: [RiListSettingsFill, RiListSettingsLine],
            text: t('sideManage')
          }
        ] : [])
      ]
        .filter(f => {
          if (role === 'USER' || role === 'LEGACY_USER' || role === 'GUEST') {
            return f.to === '/' || f.to === '/dashboard'
          }
          return f
        })
        .map(({ to, icon, text }) => {
          const isActive =
            location.pathname === to ||
            (to === '/dashboard' && location.pathname.includes('/dashboard'))
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center justify-center w-full py-0 ${
                isActive ? 'dock-active' : ''
              }`}
            >
              {isActive
                ? React.createElement(icon[0], { size: 24 })
                : React.createElement(icon[1], { size: 24 })}
              <span className='text-[10px] leading-normal truncate max-w-[64px]'>
                {text}
              </span>
            </Link>
          )
        })}

      <Link
        to={'/settings'}
        className={`relative flex flex-col items-center justify-center w-full py-0 ${
          location.pathname === '/settings' ? 'dock-active' : ''
        }`}
      >
        <div className='avatar'>
          <div
            className={`w-[24px] rounded-field ${
              isScrollingDown ? 'scale-0' : 'scale-100'
            }`}
          >
            <img src={userProfile?.pic ?? DefaultPic} alt='Profile' />
          </div>
        </div>
        <span className='text-[10px] leading-normal truncate max-w-[64px]'>
          {t('tabAccount')}
        </span>
      </Link>
    </div>
  )
}

export default BottomNavItem
