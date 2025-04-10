// redux/actions/toggleActions.js
import { SocketResponseType } from '../../types/global/socketType'
import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import {
  TokenType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  USER_PROFILE,
  TMS_MODE,
  IS_EXPAND,
  GLOBAL_SEARCH,
  THEME_MODE,
  WARD_ID,
  HOS_ID,
  SUBMIT_LOADING,
  DEVICE_KEY,
  SOCKET_DATA,
  SOUND_MODE,
  POPUP_MODE,
  RESET_UTILS,
  TOKEN_EXPIRE,
  SHOULD_FETCH,
  SWITCHING_MODE
} from '../types/utilsTypes'

const setCookieEncode = (dataEncode?: string) => ({
  type: COOKIE_ENCODE,
  payload: dataEncode
})

const setCookieDecode = (dataDecode?: TokenDecodeType) => ({
  type: COOKIE_DECODE,
  payload: dataDecode
})

const setTokenDecode = (tokenDecode: TokenType) => ({
  type: TOKEN_DECODE,
  payload: tokenDecode
})

const setUserProfile = (userData: UserProfileType | undefined) => ({
  type: USER_PROFILE,
  payload: userData
})

const setTmsMode = () => ({
  type: TMS_MODE
})

const setIsExpand = () => ({
  type: IS_EXPAND
})

const setSubmitLoading = () => ({
  type: SUBMIT_LOADING
})

const setSearch = (search: string) => ({
  type: GLOBAL_SEARCH,
  payload: search
})

const setTheme = (theme: string) => ({
  type: THEME_MODE,
  payload: theme
})

const setHosId = (id: string | undefined) => ({
  type: HOS_ID,
  payload: id
})

const setWardId = (id: string | undefined) => ({
  type: WARD_ID,
  payload: id
})

const setDeviceKey = (id: string) => ({
  type: DEVICE_KEY,
  payload: id
})

const setSocketData = (data: SocketResponseType | null) => ({
  type: SOCKET_DATA,
  payload: data
})

const setPopUpMode = () => ({
  type: POPUP_MODE
})

const setSoundMode = () => ({
  type: SOUND_MODE
})

const setTokenExpire = (state: boolean) => ({
  type: TOKEN_EXPIRE,
  payload: state
})

const setSholdFetch = () => ({
  type: SHOULD_FETCH
})

const setSwitchingMode = () => ({
  type: SWITCHING_MODE
})

const resetUtils = () => ({
  type: RESET_UTILS
})

export {
  setCookieEncode,
  setCookieDecode,
  setTokenDecode,
  setUserProfile,
  setTmsMode,
  setIsExpand,
  setSearch,
  setTheme,
  setHosId,
  setWardId,
  setDeviceKey,
  setSubmitLoading,
  setSocketData,
  setPopUpMode,
  setSoundMode,
  setTokenExpire,
  setSholdFetch,
  setSwitchingMode,
  resetUtils
}
