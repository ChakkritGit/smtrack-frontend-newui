import { SocketResponseType } from '../../types/global/socketType'
import { TokenDecodeType } from '../../types/smtrack/constants/constantsType'
import {
  TokenType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'

// redux/types/toggleTypes.js
const COOKIE_DECODE = 'COOKIE_DECODE'
const COOKIE_ENCODE = 'COOKIE_ENCODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const USER_PROFILE = 'USER_PROFILE'
const TMS_MODE = 'TMS_MODE'
const IS_EXPAND = 'IS_EXPAND'
const GLOBAL_SEARCH = 'GLOBAL_SEARCH'
const THEME_MODE = 'THEME_MODE'
const HOS_ID = 'HOS_ID'
const WARD_ID = 'WARD_ID'
const DEVICE_KEY = 'DEVICE_KEY'
const SUBMIT_LOADING = 'SUBMIT_LOADING'
const SOCKET_DATA = 'SOCKET_DATA'
const POPUP_MODE = 'POPUP_MODE'
const SOUND_MODE = 'SOUND_MODE'
const TOKEN_EXPIRE = 'TOKEN_EXPIRE'
const SHOULD_FETCH = 'SHOULD_FETCH'
const SWITCHING_MODE = 'SWITCHING_MODE'
const GRAYSCALE_MODE = 'GRAYSCALE_MODE'
const BLUR_DISABLED = 'BLUR_DISABLED'
const TRANSITION_DISABLED = 'TRANSITION_DISABLED'
const AMBIENT_DISABLED = 'AMBIENT_DISABLED'
const FPS_DISABLED = 'FPS_DISABLED'
const I18N_INIT = 'I18N_INIT'
const LOADING_STYLE = 'LOADING_STYLE'
const RESET_UTILS = 'RESET_UTILS'

interface UtilsState {
  cookieEncode?: string
  cookieDecode?: TokenDecodeType
  tokenDecode?: TokenType
  userProfile?: UserProfileType
  globalSearch: string
  themeMode: string
  tmsMode: boolean
  isExpand: boolean
  hosId: string
  wardId: string
  deviceKey: string
  submitLoading: boolean
  socketData: SocketResponseType | null
  popUpMode: boolean
  soundMode: boolean
  shouldFetch: boolean
  switchingMode: boolean
  grayscaleMode: boolean
  blurDisabled: boolean
  transitionDisabled: boolean
  ambientDisabled: boolean
  fpsDisabled: boolean
  i18nInit: string
  loadingStyle: string
  tokenExpire: boolean
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: TokenDecodeType }
  | { type: typeof TOKEN_DECODE; payload: TokenType }
  | { type: typeof USER_PROFILE; payload: UserProfileType | undefined }
  | { type: typeof GLOBAL_SEARCH; payload: string }
  | { type: typeof THEME_MODE; payload: string }
  | { type: typeof TMS_MODE }
  | { type: typeof IS_EXPAND }
  | { type: typeof SUBMIT_LOADING }
  | { type: typeof HOS_ID; payload: string }
  | { type: typeof WARD_ID; payload: string }
  | { type: typeof DEVICE_KEY; payload: string }
  | { type: typeof SOCKET_DATA; payload: SocketResponseType | null }
  | { type: typeof TOKEN_EXPIRE; payload: boolean }
  | { type: typeof POPUP_MODE }
  | { type: typeof SOUND_MODE }
  | { type: typeof SHOULD_FETCH }
  | { type: typeof SWITCHING_MODE }
  | { type: typeof GRAYSCALE_MODE }
  | { type: typeof BLUR_DISABLED }
  | { type: typeof TRANSITION_DISABLED }
  | { type: typeof AMBIENT_DISABLED }
  | { type: typeof FPS_DISABLED }
  | { type: typeof I18N_INIT; payload: string }
  | { type: typeof LOADING_STYLE; payload: string }
  | { type: typeof RESET_UTILS }

export {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  USER_PROFILE,
  TOKEN_DECODE,
  TMS_MODE,
  IS_EXPAND,
  GLOBAL_SEARCH,
  THEME_MODE,
  HOS_ID,
  WARD_ID,
  DEVICE_KEY,
  SUBMIT_LOADING,
  SOCKET_DATA,
  POPUP_MODE,
  SOUND_MODE,
  TOKEN_EXPIRE,
  SHOULD_FETCH,
  SWITCHING_MODE,
  GRAYSCALE_MODE,
  BLUR_DISABLED,
  TRANSITION_DISABLED,
  AMBIENT_DISABLED,
  FPS_DISABLED,
  I18N_INIT,
  LOADING_STYLE,
  RESET_UTILS
}
export type { UtilsState, UtilsAction }
