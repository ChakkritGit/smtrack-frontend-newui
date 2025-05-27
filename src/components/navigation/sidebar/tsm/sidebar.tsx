import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/reducers/rootReducer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  RiDashboardFill,
  RiDashboardLine,
  RiHome3Fill,
  RiHome3Line,
  RiListSettingsFill,
  RiListSettingsLine,
  RiSettings3Fill,
  RiSettings3Line,
  RiUser6Fill,
  RiUser6Line
} from 'react-icons/ri'
import {
  setDeviceKey,
  setHosId,
  setSwitchingMode,
  setTmsMode,
  setWardId
} from '../../../../redux/actions/utilsActions'
import DefaultPic from '../../../../assets/images/default-pic.png'
import { useTranslation } from 'react-i18next'
import {
  cookieOptions,
  cookies
} from '../../../../constants/utils/utilsConstants'
import { useContext } from 'react'
import { GlobalContext } from '../../../../contexts/globalContext'
import { GlobalContextType } from '../../../../types/global/globalContext'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const {
    isExpand,
    userProfile,
    tmsMode,
    tokenDecode,
    switchingMode,
    transitionDisabled,
    loadingStyle
  } = useSelector((state: RootState) => state.utils)
  const { ward: wardData } = useContext(GlobalContext) as GlobalContextType
  const { ward } = userProfile || {}
  const { role } = tokenDecode || {}

  // const currentDate: Date = new Date()
  // const formattedDate = currentDate
  //   .toLocaleDateString('en-GB', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: '2-digit'
  //   })
  //   .replace(/\//g, '-')

  return (
    <aside
      className={`drawer-side z-[90] ${isExpand ? '!overflow-visible' : ''}`}
    >
      <label
        htmlFor='my-drawer-2'
        aria-label='close sidebar'
        className='drawer-overlay'
      ></label>
      <div
        className={`menu bg-base-100 text-base-content min-h-full flex flex-col !items-center justify-between ${
          transitionDisabled ? '!transition-all !ease-out !duration-300' : ''
        } ${isExpand ? 'w-[100px]' : 'w-[235px]'}`}
      >
        <div>
          <div className='flex items-center justify-center flex-col gap-5 p-3'>
            <img
              onClick={() => navigate('/')}
              src={ward?.hospital.hosPic ? ward.hospital.hosPic : DefaultPic}
              alt='Hospital-img'
              className={`btn btn-ghost rounded-box transition-all ease-out duration-300 ${
                isExpand ? 'w-24 h-max' : 'w-32 h-28'
              } object-contain p-0 hover:bg-transparent`}
            />
            <h3
              className='text-[24px] truncate max-w-[180px] leading-9'
              title={ward?.hospital.hosName}
            >
              {ward?.hospital.hosName
                ? isExpand
                  ? ward?.hospital.hosName[0]
                  : ward?.hospital.hosName
                : '—'}
            </h3>
          </div>
          <div className='divider mt-0 mb-0'></div>
          <div className='items-center justify-center flex-col gap-2 p-3 hidden md:flex'>
            <Link
              to={'/'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/'
                  ? 'btn-neutral pointer-events-none'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideShowAllBox')}
            >
              {location.pathname === '/' ? (
                <RiHome3Fill size={24} />
              ) : (
                <RiHome3Line size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideShowAllBox')}
                </span>
              )}
            </Link>
            <Link
              to={'/dashboard'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/dashboard' ? 'pointer-events-none' : ''
              } ${
                location.pathname === '/dashboard' ||
                location.pathname.split('/')[2] === 'chart' ||
                location.pathname.split('/')[2] === 'table' ||
                location.pathname === '/dashboard/chart/compare'
                  ? 'btn-neutral'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideDashboard')}
            >
              {location.pathname === '/dashboard' ||
              location.pathname.split('/')[2] === 'chart' ||
              location.pathname.split('/')[2] === 'table' ||
              location.pathname === '/dashboard/chart/compare' ? (
                <RiDashboardFill size={24} />
              ) : (
                <RiDashboardLine size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideDashboard')}
                </span>
              )}
            </Link>
            {(role === 'LEGACY_ADMIN' ||
              role === 'SUPER' ||
              role === 'SERVICE') && (
              <>
                <Link
                  to={'/users'}
                  className={`btn font-normal flex-nowrap justify-start w-full ${
                    location.pathname === '/users'
                      ? 'btn-neutral pointer-events-none'
                      : 'btn-ghost'
                  } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
                  data-tip={t('sidePermission')}
                >
                  {location.pathname === '/users' ? (
                    <RiUser6Fill size={24} />
                  ) : (
                    <RiUser6Line size={24} />
                  )}
                  {!isExpand && (
                    <span className='text-[16px] leading-normal truncate'>
                      {t('sidePermission')}
                    </span>
                  )}
                </Link>
                {(role === 'SUPER' || role === 'SERVICE') && (
                  <Link
                    to={'/management'}
                    className={`btn font-normal flex-nowrap justify-start w-full ${
                      location.pathname === '/management'
                        ? 'btn-neutral pointer-events-none'
                        : 'btn-ghost'
                    } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
                    data-tip={t('sideManage')}
                  >
                    {location.pathname === '/management' ? (
                      <RiListSettingsFill size={24} />
                    ) : (
                      <RiListSettingsLine size={24} />
                    )}
                    {!isExpand && (
                      <span className='text-[16px] leading-normal truncate'>
                        {t('sideManage')}
                      </span>
                    )}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        <div className='w-full'>
          <div className='divider mb-0'></div>
          <div className='flex justify-center flex-col gap-3 p-3'>
            {(role === 'SUPER' ||
              role === 'SERVICE' ||
              role === 'ADMIN' ||
              role === 'LEGACY_ADMIN') &&
              wardData.find(f => f.type === 'NEW') && (
                <label
                  htmlFor='ModeToggle'
                  className='flex flex-col items-center justify-center gap-2'
                >
                  {!isExpand ? (
                    <div className='flex items-center gap-2'>
                      {switchingMode && (
                        <span
                          className={`loading ${loadingStyle} loading-xs`}
                        ></span>
                      )}
                      <span className='text-[12px] truncate'>
                        {!switchingMode ? t('currentMode') : t('switchingMode')}
                      </span>
                    </div>
                  ) : (
                    switchingMode && (
                      <span
                        className={`loading ${loadingStyle} loading-xs mb-2`}
                      ></span>
                    )
                  )}
                  <input
                    id='ModeToggle'
                    name='ModeToggle'
                    type='checkbox'
                    className='toggle toggle-md'
                    checked={tmsMode}
                    disabled={switchingMode}
                    onChange={async () => {
                      dispatch(setSwitchingMode())
                      dispatch(setDeviceKey(''))
                      dispatch(setHosId(undefined))
                      dispatch(setWardId(undefined))
                      cookies.remove('hosId', cookieOptions)
                      cookies.remove('wardId', cookieOptions)
                      cookies.remove('deviceKey', cookieOptions)
                      cookies.remove('searchHistory', cookieOptions)
                      cookies.set('tmsMode', !tmsMode, cookieOptions)
                      cookies.update()

                      await new Promise(resolve => setTimeout(resolve, 500))

                      navigate('/')
                      dispatch(setTmsMode())
                      dispatch(setSwitchingMode())
                    }}
                  />
                </label>
              )}
            <Link
              to={'/settings'}
              className={`btn font-normal flex-nowrap justify-start w-full ${
                location.pathname === '/settings'
                  ? 'btn-neutral pointer-events-none'
                  : 'btn-ghost'
              } flex ${isExpand ? 'tooltip tooltip-right z-50' : ''}`}
              data-tip={t('sideSetting')}
            >
              {location.pathname === '/settings' ? (
                <RiSettings3Fill size={24} />
              ) : (
                <RiSettings3Line size={24} />
              )}
              {!isExpand && (
                <span className='text-[16px] leading-normal truncate'>
                  {t('sideSetting')}
                </span>
              )}
            </Link>
            <Link
              to={'/changelog'}
              className={`text-[12px] ${
                isExpand ? 'text-center' : 'text-right'
              } hover:underline cursor-pointer`}
            >
              Version 2.0.0b24d
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
