import { useEffect } from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { getOKLCHColor } from '../../constants/utils/color'

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
      className='w-full h-screen flex flex-col gap-3 items-center justify-center'
      data-theme={themeMode}
    >
      <span className='text-4xl md:text-5xl font-medium'>SMTrack+</span>
      <span className='font-medium'>Siamatic Co. Ltd</span>
    </div>
  )
}

export default SplashScreen
