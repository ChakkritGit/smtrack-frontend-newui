import { useTranslation } from 'react-i18next'
import { RootState } from '../../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import DefaultPic from '../../../assets/images/default-user.jpg'
import BottomNavItem from './item'

const BottomBar = () => {
  const { t } = useTranslation()
  const { tokenDecode, themeMode, userProfile } = useSelector(
    (state: RootState) => state.utils
  )
  const { role } = tokenDecode ?? {}
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsScrollingDown(true)
    } else {
      setIsScrollingDown(false)
    }
    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <BottomNavItem
      DefaultPic={DefaultPic}
      isScrollingDown={isScrollingDown}
      t={t}
      themeMode={themeMode}
      userProfile={userProfile}
      role={role}
    />
  )
}

export default BottomBar
