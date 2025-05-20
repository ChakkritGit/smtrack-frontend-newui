// redux/reducers/toggleReducer.js
import { cookies } from '../../constants/utils/utilsConstants'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  TMS_MODE,
  UtilsState,
  UtilsAction,
  IS_EXPAND,
  USER_PROFILE,
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
  SWITCHING_MODE,
  GRAYSCALE_MODE,
  BLUR_DISABLED,
  TRANSITION_DISABLED,
  AMBIENT_DISABLED,
  I18N_INIT,
  FPS_DISABLED,
  LOADING_STYLE
} from '../types/utilsTypes'

const initialState: UtilsState = {
  cookieEncode: cookies.get('tokenObject'),
  cookieDecode: undefined,
  tokenDecode: undefined,
  userProfile: cookies.get('userProfile') ?? undefined,
  globalSearch: '',
  themeMode: localStorage.getItem('theme') ?? '',
  tmsMode: cookies.get('tmsMode') ?? false,
  isExpand: localStorage.getItem('expandaside') === 'true',
  hosId: cookies.get('hosId'),
  wardId: cookies.get('wardId'),
  deviceKey: cookies.get('deviceKey'),
  submitLoading: false,
  socketData: null,
  popUpMode: cookies.get('popUpMode') ?? false,
  tokenExpire: false,
  shouldFetch: false,
  switchingMode: false,
  grayscaleMode: localStorage.getItem('grayscaleMode') === 'true' ? true : false,
  blurDisabled: localStorage.getItem('blurDisabled') === 'false' ? false : true,
  transitionDisabled: localStorage.getItem('transitionDisabled') === 'false' ? false : true,
  ambientDisabled: localStorage.getItem('ambientDisabled') === 'true' ? true : false,
  fpsDisabled: localStorage.getItem('fpsDisabled') === 'true' ? true : false,
  i18nInit: localStorage.getItem("lang") || 'th',
  loadingStyle: localStorage.getItem('loadingStyle') ?? 'loading-spinner',
  soundMode: cookies.get('soundMode') ?? false
}

const utilsReducer = (
  state = initialState,
  action: UtilsAction
): UtilsState => {
  switch (action.type) {
    case COOKIE_ENCODE:
      return { ...state, cookieEncode: action.payload }
    case COOKIE_DECODE:
      return { ...state, cookieDecode: action.payload }
    case TOKEN_DECODE:
      return { ...state, tokenDecode: action.payload }
    case USER_PROFILE:
      return { ...state, userProfile: action.payload }
    case TMS_MODE:
      return { ...state, tmsMode: !state.tmsMode }
    case IS_EXPAND:
      return { ...state, isExpand: !state.isExpand }
    case SUBMIT_LOADING:
      return { ...state, submitLoading: !state.submitLoading }
    case GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload }
    case THEME_MODE:
      return { ...state, themeMode: action.payload }
    case HOS_ID:
      return { ...state, hosId: action.payload }
    case WARD_ID:
      return { ...state, wardId: action.payload }
    case DEVICE_KEY:
      return { ...state, deviceKey: action.payload }
    case SOCKET_DATA:
      return { ...state, socketData: action.payload }
    case POPUP_MODE:
      return { ...state, popUpMode: !state.popUpMode }
    case SOUND_MODE:
      return { ...state, soundMode: !state.soundMode }
    case TOKEN_EXPIRE:
      return { ...state, tokenExpire: action.payload }
    case SHOULD_FETCH:
      return { ...state, shouldFetch: !state.shouldFetch }
    case SWITCHING_MODE:
      return { ...state, switchingMode: !state.switchingMode }
    case GRAYSCALE_MODE:
      return { ...state, grayscaleMode: !state.grayscaleMode }
    case BLUR_DISABLED:
      return { ...state, blurDisabled: !state.blurDisabled }
    case TRANSITION_DISABLED:
      return { ...state, transitionDisabled: !state.transitionDisabled }
    case AMBIENT_DISABLED:
      return { ...state, ambientDisabled: !state.ambientDisabled }
    case FPS_DISABLED:
      return { ...state, fpsDisabled: !state.fpsDisabled }
    case I18N_INIT:
      return { ...state, i18nInit: action.payload }
    case LOADING_STYLE:
      return { ...state, loadingStyle: action.payload }
    case RESET_UTILS:
      return initialState
    default:
      return state
  }
}

export default utilsReducer
