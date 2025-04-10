import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers/rootReducer'
import Notacess from './notacess'
import Login from '../pages/login/login'

export const LogoutAuth = () => {
  const { cookieEncode } = useSelector((state: RootState) => state.utils)

  if (cookieEncode !== undefined) {
    return <Navigate to='/' />
  }

  return <Login />
}

export const HideSetting = () => {
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}
  return (role === 'USER' ||
    role === 'LEGACY_USER' ||
    role === 'GUEST') ? (
    <Notacess />
  ) : (
    <Outlet />
  )
}

export const HideSettingTms = () => {
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}
  return role === 'LEGACY_USER' || role === 'GUEST' ? <Notacess /> : <Outlet />
}

export const HideSettingManageTms = () => {
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}
  return role === 'LEGACY_USER' || role === 'LEGACY_ADMIN' || role === 'GUEST' ? <Notacess /> : <Outlet />
}

export const HideFlashFW = () => {
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}
  return role !== 'SUPER' ? <Notacess /> : <Outlet />
}
