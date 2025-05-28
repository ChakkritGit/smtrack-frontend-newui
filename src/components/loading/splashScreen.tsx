import { useEffect } from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { getOKLCHColor } from '../../constants/utils/color'
import Logo from '../../assets/images/app-logo.png'

const SplashScreen = () => {
  const { themeMode } = useSelector((state: RootState) => state.utils)
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', themeMode)
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    const currentColor = getOKLCHColor(themeMode, system)

    if (themeColorMetaTag) {
      themeColorMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'theme-color')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }

    const statusBarMetaTag = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    )
    if (statusBarMetaTag) {
      statusBarMetaTag.setAttribute('content', currentColor)
    } else {
      const newStatusBarMetaTag = document.createElement('meta')
      newStatusBarMetaTag.setAttribute(
        'name',
        'apple-mobile-web-app-status-bar-style'
      )
      newStatusBarMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newStatusBarMetaTag)
    }
  }, [themeMode, system])

  return (
    <div
      className='w-full h-dvh flex flex-col gap-1.5 md:gap-3 items-center justify-center'
      data-theme={themeMode}
    >
      {/* <span className='text-4xl md:text-5xl font-medium'>SMTrack+</span> */}
      <div className='avatar'>
        <div className='w-16 md:w-28 rounded-selector'>
          <img src={Logo} alt='SM-LOGO' className='' />
        </div>
      </div>
      <span className='text-lg font-medium opacity-70 absolute bottom-3.5'>Siamatic Co. Ltd</span>
    </div>
  )
}

export default SplashScreen
