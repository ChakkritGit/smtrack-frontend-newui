import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiCloseLine,
  RiHistoryLine,
  RiDeviceLine,
  RiNotification4Line,
  RiIdCardLine,
  RiLogoutBoxRLine,
  RiCommandFill
} from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import {
  // setDeviceKey,
  setIsExpand,
  setSearch,
  setSholdFetch,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import DefaultPic from '../../../assets/images/default-pic.png'
import { UAParser } from 'ua-parser-js'
import {
  cookieOptions,
  cookies,
  getRoleLabel
} from '../../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'
import ThemeList from '../../theme/themeList'
import LanguageList from '../../language/languageList'
import { menuDataArraySmtrack } from '../../../constants/utils/dataSearch'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceListTmsType } from '../../../types/tms/devices/deviceType'
import { AxiosError } from 'axios'
import { DeviceListType } from '../../../types/smtrack/devices/deviceType'
import Notifications from '../../notifications/notifications'
import ProfileComponent from '../../pages/settings/profileComponent'
import SoundAndNotificationComponents from '../../pages/settings/soundAndNotificationComponents'
import { GlobalContext } from '../../../contexts/globalContext'
import { GlobalContextType } from '../../../types/global/globalContext'
import Swal from 'sweetalert2'

type SearchType = {
  text: string
  path: string
  tag: string
}

interface FormState {
  imagePreview: string | null
}

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { isExpand, userProfile, globalSearch, tmsMode, transitionDisabled, blurDisabled } = useSelector(
    (state: RootState) => state.utils
  )
  const { searchRef, isFocused, setIsFocused, setIsCleared } = useContext(
    GlobalContext
  ) as GlobalContextType
  const { pic, display, role } = userProfile || {}
  const searchWrapperRef = useRef<HTMLInputElement | null>(null)
  const profileModalRef = useRef<HTMLDialogElement>(null)
  const settingModalRef = useRef<HTMLDialogElement>(null)
  const parser = new UAParser()
  const os = parser.getOS().name
  const isWindows = os === 'Windows'
  const clearText = globalSearch === ''
  const [deviceList, setDeviceList] = useState<
    DeviceListType[] | DeviceListTmsType[]
  >([])
  const [image, setImage] = useState<FormState>({
    imagePreview: userProfile?.pic ?? null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [edit, setEdit] = useState(false)
  const [imageProcessing, setImageProcessing] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchType[]>(() => {
    const storedHistory = cookies.get('searchHistory')
    return storedHistory ? storedHistory : []
  })
  const [searchOpen, setSearchOpen] = useState(false)

  const updateSearchHistory = (item: SearchType) => {
    setSearchHistory(prev => {
      let updatedHistory = [item, ...prev.filter(i => i.path !== item.path)]
      if (updatedHistory.length > 7) updatedHistory = updatedHistory.slice(0, 7)
      cookies.set('searchHistory', updatedHistory, cookieOptions)

      return updatedHistory
    })
  }

  const removeHistoryItem = (path: string) => {
    setSearchHistory(prev => {
      const updatedHistory = prev.filter(item => item.path !== path)
      cookies.set('searchHistory', updatedHistory, cookieOptions)
      return updatedHistory
    })
  }

  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        responseType<DeviceListTmsType[] | DeviceListTmsType[]>
      >(
        (
          tmsMode
            ? !(role === 'LEGACY_ADMIN' || role === 'LEGACY_USER')
            : role === 'LEGACY_ADMIN' || role === 'LEGACY_USER'
        )
          ? '/legacy/device/devices/list'
          : '/devices/dashboard/device'
      )
      setDeviceList(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }

        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [tmsMode, role])

  useEffect(() => {
    fetchDeviceList()
  }, [tmsMode, role])

  useEffect(() => {
    localStorage.setItem('expandaside', isExpand.toString())
  }, [isExpand])

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key?.toLowerCase() === 'k') {
          e.preventDefault()
          searchRef.current?.focus()
        }
      } else if (e.key?.toLowerCase() === 'escape') {
        e.preventDefault()
        if (isFocused) {
          searchRef.current?.blur()
          setIsFocused(false)
        }
      }
    }

    window.addEventListener('keydown', handleCk)

    return () => {
      window.removeEventListener('keydown', handleCk)
    }
  }, [isFocused])

  useEffect(() => {
    function handleClickOutside (event: any) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (
      (globalSearch === '' && location.pathname === '/') ||
      (globalSearch === '' && location.pathname === '/management')
    ) {
      setIsCleared(true)
    }
  }, [globalSearch, location])

  const searchRecommend = useMemo(() => {
    if (!isFocused) return null

    const filter = menuDataArraySmtrack(role, tmsMode).filter(
      f =>
        f.text?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
        f.tag?.toLowerCase().includes(globalSearch?.toLowerCase())
    )

    const devive = deviceList
      .filter(
        f =>
          f.name?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
          f.id?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
          f.sn?.toLowerCase().includes(globalSearch?.toLowerCase())
      )
      .slice(0, 6)

    return (
      <div
        className={`${transitionDisabled ? 'search-anim' : ''} absolute min-w-[280px] w-[280px] max-w-[300px] md:min-w-[450px] min-h-[50px] md:max-w-[500px]
      max-h-[400px] bg-base-100 backdrop-blur transition-shadow shadow-2xl duration-300 ease-linear
      border-base-content/15 border-[1px] py-3 pl-4 pr-1 top-[60px] overflow-y-scroll
      rounded-box`}
      >
        {(location.pathname === '/' || location.pathname === '/management') &&
        globalSearch.length > 0 ? (
          <div className='p-1 flex items-center gap-3 opacity-70 mb-1'>
            <span>{t('pressPre1')}</span>
            <kbd className='kbd kbd-sm'>Enter</kbd>
            <span>{t('pressPre3')}</span>
          </div>
        ) : (
          <div className='p-1 flex items-center gap-3 opacity-70 mb-1'>
            <span>{t('pressPre1')}</span>
            <kbd className='kbd kbd-sm'>Esc</kbd>
            <span>{t('pressPre2')}</span>
          </div>
        )}
        {searchHistory.length > 0 ? (
          <>
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className={`${
                  index !== 0 ? 'mt-1' : ''
                } flex items-center justify-between p-2 rounded-field cursor-pointer hover:bg-primary/30 duration-300 ease-linear`}
                onClick={() => {
                  updateSearchHistory(item)
                  setSearchOpen(false)

                  if (item.tag === 'menu') {
                    navigate(item.path)
                    setIsFocused(false)
                  } else if (item.tag === 'device') {
                    // cookies.set('deviceKey', item.path, cookieOptions) // it's mean setSerial
                    // dispatch(setDeviceKey(item.path))
                    dispatch(setSearch(t(item.text)))
                    dispatch(setSholdFetch())
                    // navigate('/dashboard')
                    // window.scrollTo(0, 0)
                    setIsFocused(false)
                  }
                }}
              >
                <div className='flex items-center gap-2'>
                  <div>
                    <RiHistoryLine size={18} />
                  </div>
                  <span
                    className='max-w-[170px] md:max-w-[300px] block truncate text-left'
                    style={{ direction: 'rtl'}}
                  >
                    {t(item.text)}
                  </span>
                </div>
                <button
                  className='p-1 rounded-full hover:bg-red-500 hover:text-white cursor-pointer duration-300 ease-linear'
                  onClick={e => {
                    e.stopPropagation()
                    removeHistoryItem(item.path)
                    setSearchOpen(false)
                  }}
                >
                  <RiCloseLine size={18} />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className='flex items-center justify-center py-5'>
            <span className='opacity-70'>{t('noHistory')}</span>
          </div>
        )}

        {globalSearch && (
          <div>
            {devive.length > 0 && (
              <div className='divider text-[12px] opacity-50'>
                {t('countDeviceUnit')}
              </div>
            )}
            <div
              className={`grid grid-cols-1 ${
                devive.length > 0 ? 'md:grid-cols-2' : ''
              } gap-2`}
            >
              {devive.length > 0 &&
                devive.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 p-2 rounded-field cursor-pointer hover:bg-primary/30 duration-300 ease-linear'
                    onClick={() => {
                      const newItem = {
                        text: item.name,
                        path: (
                          tmsMode
                            ? !(
                                role === 'LEGACY_ADMIN' ||
                                role === 'LEGACY_USER'
                              )
                            : role === 'LEGACY_ADMIN' || role === 'LEGACY_USER'
                        )
                          ? String(item.sn)
                          : item.id,
                        tag: 'device'
                      }
                      setSearchOpen(false)
                      dispatch(setSearch(item.name))
                      dispatch(setSholdFetch())
                      setIsFocused(false)
                      updateSearchHistory(newItem)
                      // cookies.set(
                      //   'deviceKey',
                      //   (
                      //     tmsMode
                      //       ? !(
                      //           role === 'LEGACY_ADMIN' ||
                      //           role === 'LEGACY_USER'
                      //         )
                      //       : role === 'LEGACY_ADMIN' || role === 'LEGACY_USER'
                      //   )
                      //     ? item.sn
                      //     : item.id,
                      //   cookieOptions
                      // ) // it's mean setSerial
                      // dispatch(
                      //   setDeviceKey(
                      //     (
                      //       tmsMode
                      //         ? !(
                      //             role === 'LEGACY_ADMIN' ||
                      //             role === 'LEGACY_USER'
                      //           )
                      //         : role === 'LEGACY_ADMIN' ||
                      //           role === 'LEGACY_USER'
                      //     )
                      //       ? String(item.sn)
                      //       : item.id
                      //   )
                      // )
                      // navigate('/dashboard')
                      // window.scrollTo(0, 0)
                    }}
                  >
                    <div>
                      <RiDeviceLine size={18} />
                    </div>
                    <span
                      className='max-w-[150px] block truncate'
                      style={{ direction: 'rtl', textAlign: 'left' }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
            </div>
            {filter.length > 0 && (
              <div className='divider text-[12px] opacity-50'>
                {t('menuButton')}
              </div>
            )}
            <div
              className={`grid grid-cols-1 ${
                filter.length > 0 ? 'md:grid-cols-2' : ''
              } gap-2`}
            >
              {filter.length > 0 &&
                filter.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 p-2 rounded-field cursor-pointer hover:bg-primary/30 duration-300 ease-linear'
                    onClick={() => {
                      const newItem = {
                        text: item.text,
                        path: item.path,
                        tag: 'menu'
                      }
                      setSearchOpen(false)
                      navigate(item.path)
                      setIsFocused(false)
                      updateSearchHistory(newItem)
                    }}
                  >
                    <div>{item.icon}</div>
                    <span
                      className='max-w-[150px] block truncate'
                      style={{ direction: 'rtl', textAlign: 'left' }}
                    >
                      {t(item.text)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }, [
    isFocused,
    searchHistory,
    menuDataArraySmtrack,
    t,
    globalSearch,
    navigate,
    dispatch,
    location
  ])

  const searchComponent = useMemo(
    () => (
      <div ref={searchWrapperRef} className='relative'>
        <div className='form-control'>
          <label
            className={`input input-bordered bg-base-200/50 ${
              searchOpen ? 'flex w-[210px]' : 'hidden'
            } border-none h-10 w-[250px] items-center gap-2 lg:flex duration-300 ease-linear`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-5 w-5 opacity-50'
            >
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              name='Search'
              onFocus={() => setIsFocused(true)}
              onChange={e => dispatch(setSearch(e.target.value))}
              value={globalSearch}
              type='text'
              className='grow !w-28 md:w-auto caret-primary placeholder:text-base-content/50'
              placeholder={t('searchItemsNav')}
              autoComplete='off'
              ref={searchRef}
            />
            {clearText ? (
              <>
                {!searchOpen && (
                  <>
                    <kbd className='kbd kbd-sm'>{isWindows ? 'Ctrl' : <RiCommandFill />}</kbd>
                    <kbd className='kbd kbd-sm'>K</kbd>
                  </>
                )}
              </>
            ) : (
              <kbd
                className='kbd kbd-sm'
                onClick={() => {
                  dispatch(setSearch(''))
                  if (
                    location.pathname === '/' ||
                    location.pathname === '/management'
                  ) {
                    setIsCleared(true)
                  }
                }}
              >
                X
              </kbd>
            )}
          </label>
        </div>
        {searchRecommend}
      </div>
    ),
    [
      searchWrapperRef,
      searchRecommend,
      location,
      isWindows,
      clearText,
      searchRef,
      globalSearch,
      searchOpen,
      t
    ]
  )

  return (
    <nav className={`text-base-content sticky top-0 z-[80] flex h-16 w-full justify-center ${blurDisabled ? 'bg-base-100/80 backdrop-blur' : 'bg-base-100'} transition-shadow duration-300 ease-linear [transform:translate3d(0,0,0)] shadow-sm`}>
      <div className='navbar'>
        <div className='flex flex-1 lg:gap-3'>
          <label
            htmlFor='my-drawer-2'
            className='btn btn-ghost drawer-button lg:hidden'
          >
            <RiLayoutLeftLine size={24} />
          </label>
          <label
            htmlFor='my-drawer-2'
            className='btn btn-ghost drawer-button hidden lg:flex tooltip tooltip-right'
            onClick={() => dispatch(setIsExpand())}
            data-tip={t('expandSide')}
          >
            {isExpand ? (
              <RiLayoutRightLine size={24} />
            ) : (
              <RiLayoutLeftLine size={24} />
            )}
          </label>
          {searchComponent}
          {!searchOpen ? (
            <div
              className='btn btn-ghost lg:hidden'
              onClick={() => {
                setSearchOpen(true)
              }}
            >
              <RiSearchLine size={24} />
            </div>
          ) : (
            <div
              className='btn btn-ghost lg:hidden'
              onClick={() => {
                setSearchOpen(false)
              }}
            >
              <RiCloseLine size={24} />
            </div>
          )}
        </div>
        {!searchOpen && (
          <div className='flex items-center flex-row-reverse md:flex-row'>
            <Notifications />
            <ThemeList />
            <LanguageList />
          </div>
        )}
        <div className='flex-none gap-2 hidden lg:block'>
          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost gap-3 px-1'
            >
              <div className='avatar'>
                <div className='w-8 rounded-field'>
                  <img src={pic ? pic : DefaultPic} alt='User-img' />
                </div>
              </div>
              <div className='flex flex-col items-start'>
                <span className='font-normal text-[14px] truncate max-w-[130px]'>
                  {display ? display : '—'}
                </span>
                <span className='text-[12px]'>
                  {role ? getRoleLabel(role, t) : '—'}
                </span>
              </div>
              <RiArrowDownSLine size={18} />
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-max p-2 shadow'
            >
              <li className='h-9'>
                <button
                  onClick={() => profileModalRef?.current?.showModal()}
                  className='text-[16px] h-9 flex items-center gap-2 w-full text-left cursor-pointer'
                >
                  <RiIdCardLine />
                  {t('profile')}
                </button>
              </li>

              <li className='h-9'>
                <button
                  onClick={() => settingModalRef?.current?.showModal()}
                  className='text-[16px] h-9 flex items-center gap-2 w-full text-left cursor-pointer'
                >
                  <RiNotification4Line />
                  {t('titleNotification')}
                </button>
              </li>

              <div className='divider divider-vertical m-0 before:h-[1px] after:h-[1px]'></div>

              <li className='h-9'>
                <button
                  onClick={() =>
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
                        cookies.remove('tokenObject', cookieOptions)
                        cookies.remove('userProfile', cookieOptions)
                        cookies.remove('tmsMode', cookieOptions)
                        cookies.remove('hosId', cookieOptions)
                        cookies.remove('wardId', cookieOptions)
                        cookies.remove('deviceKey', cookieOptions)
                        cookies.update()
                        window.location.href = '/login'
                      }
                    })
                  }
                  className='text-red-500 text-[16px] h-9 flex items-center gap-2 w-full text-left'
                >
                  <RiLogoutBoxRLine />
                  {t('tabLogout')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <dialog ref={profileModalRef} className='modal overflow-y-scroll py-10'>
        <div className='modal-box max-w-[50rem] h-max max-h-max'>
          <ProfileComponent
            key={'Navbar'}
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
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button
            onClick={() => {
              setEdit(false)
              setImage({
                imagePreview: userProfile?.pic ?? null
              })
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            close
          </button>
        </form>
      </dialog>

      <dialog ref={settingModalRef} className='modal overflow-y-scroll py-10'>
        <div className='modal-box max-w-[40rem] h-max max-h-max'>
          <SoundAndNotificationComponents />
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button
            onClick={() => {
              setImage({
                imagePreview: userProfile?.pic ?? null
              })
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </nav>
  )
}

export default Navbar
