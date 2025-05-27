import { useTranslation } from 'react-i18next'
import { RiAlarmWarningFill } from 'react-icons/ri'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { extractValues } from '../../constants/utils/utilsConstants'
import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import {
  NotificationHistoryType,
  NotificationTmsHistoryType
} from '../../types/global/notification'
import { AxiosError } from 'axios'
import { setTokenExpire } from '../../redux/actions/utilsActions'
import Loading from '../../components/skeleton/table/loading'
import NotificationPagination from '../../components/pagination/notificationPagination'
import {
  PiDoorLight,
  PiDoorOpenLight,
  PiNoteLight,
  PiPlugsConnectedLight,
  PiPlugsLight,
  PiSimCardLight,
  PiSirenLight,
  PiThermometerColdLight,
  PiThermometerHotLight,
  PiThermometerSimpleLight,
  PiWifiHighLight,
  PiWifiSlashLight
} from 'react-icons/pi'

const Notification = () => {
  const dispatch = useDispatch()
  const { tokenDecode, tmsMode } = useSelector(
    (state: RootState) => state.utils
  )
  const { t } = useTranslation()
  const [notificationList, setNotification] = useState<
    NotificationHistoryType[] | NotificationTmsHistoryType[]
  >([])
  const [datePicker, setDatePicker] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { role } = tokenDecode || {}

  const subTextNotiDetails = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      if (text.split('/')[1] === 'TEMP') {
        if (text.split('/')[2] === 'OVER') {
          return t('tempHigherLimmit')
        } else if (text.split('/')[2] === 'LOWER') {
          return t('tempBelowLimmit')
        } else {
          return t('tempBackToNormal')
        }
      }
      const probe = text.split('/')
      const probeNumber = probe[0].replace('PROBE', '')
      const doorNumber = probe[1].replace('DOOR', '')
      const status = probe[2] === 'ON' ? t('stateOn') : t('stateOff')
      return `${t('deviceProbeTb')} ${probeNumber} ${t(
        'doorNum'
      )} ${doorNumber} ${status}`
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return t('plugBackToNormal')
      } else {
        return t('plugProblem')
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return t('SdCardProblem')
      } else {
        return t('SdCardBackToNormal')
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return `${t('reportText')}/ ${t('devicsmtrackTb')}: ${
        extractValues(text)?.temperature
          ? extractValues(text)?.temperature
          : '- -'
      }°C, ${t('deviceHumiTb')}: ${
        extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'
      }%`
    } else if (text.split('/')[0] === 'INTERNET') {
      if (text.split('/')[1] === 'ON') {
        return t('InternetProblem')
      } else {
        return t('InternetBackToNormal')
      }
    } else {
      return text
    }
  }

  const subTextNotiDetailsIcon = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      if (text.split('/')[1] === 'TEMP') {
        if (text.split('/')[2] === 'OVER') {
          return <PiThermometerHotLight size={24} />
        } else if (text.split('/')[2] === 'LOWER') {
          return <PiThermometerColdLight size={24} />
        } else {
          return <PiThermometerSimpleLight size={24} />
        }
      }
      const probe = text.split('/')
      return probe[2] === 'ON' ? (
        <PiDoorOpenLight size={24} />
      ) : (
        <PiDoorLight size={24} />
      )
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return <PiPlugsConnectedLight size={24} />
      } else {
        return <PiPlugsLight size={24} />
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return <PiSimCardLight size={24} />
      } else {
        return <PiSimCardLight size={24} />
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return <PiNoteLight size={24} />
    } else if (text.split('/')[0] === 'INTERNET') {
      if (text.split('/')[1] === 'ON') {
        return <PiWifiSlashLight size={24} />
      } else {
        return <PiWifiHighLight size={24} />
      }
    } else {
      return <PiSirenLight size={24} />
    }
  }

  const fetchNotificaton = useCallback(async () => {
    setIsLoading(true)

    const baeUrl =
      role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode
        ? `/legacy/templog/history/notification${
            datePicker !== '' ? `?filter=${datePicker}` : ''
          }`
        : `/log/notification/history/filter${
            datePicker !== '' ? `?filter=${datePicker}` : ''
          }`

    try {
      const response =
        role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode
          ? await axiosInstance.get<responseType<NotificationTmsHistoryType[]>>(
              baeUrl
            )
          : await axiosInstance.get<responseType<NotificationHistoryType[]>>(
              baeUrl
            )
      setNotification(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [role, tmsMode, datePicker])

  useEffect(() => {
    fetchNotificaton()
  }, [datePicker])

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex flex-col items-start gap-2 mb-3'>
        <span>{t('seeLastData')}</span>
        <input
          type='date'
          value={datePicker}
          onChange={e => setDatePicker(e.target.value)}
          className='input  w-full md:max-w-xs'
        />
      </div>
      <div className='bg-base-100 rounded-field py-4 px-5'>
        {!isLoading ? (
          role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' || tmsMode ? (
            <div>
              {notificationList.length > 0 ? (
                <NotificationPagination
                  data={
                    notificationList.sort(
                      (a, b) =>
                        new Date(b._time).getTime() -
                        new Date(a._time).getTime()
                    ) as NotificationTmsHistoryType[]
                  }
                  initialPerPage={10}
                  itemPerPage={[10, 30, 50, 100]}
                  renderItem={(item, index) => (
                    <li
                      className={`flex items-center gap-3 py-2 px-3 border-b border-base-content/5`}
                      key={index}
                    >
                      <div className='bg-primary/10 text-primary/70 rounded-field p-1'>
                        <RiAlarmWarningFill size={24} />
                      </div>
                      <div className='flex flex-col gap-1 w-full'>
                        <div className='flex items-center justify-between gap-3'>
                          <span>{item?.message}</span>
                          <div className='flex flex-col items-end opacity-70'>
                            <span className='text-[14px]'>
                              {item?._time?.substring(11, 16)}
                            </span>
                            <span className='w-max text-[14px]'>
                              {item?._time?.substring(0, 10)}
                            </span>
                          </div>
                        </div>
                        <span className='text-[14px] opacity-70'>
                          {item?.sn ?? '—'}
                        </span>
                      </div>
                    </li>
                  )}
                />
              ) : (
                <div className='flex items-center justify-center loading-hieght-full'>
                  <div>{t('notificationEmpty')}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {notificationList.length > 0 ? (
                <NotificationPagination
                  data={
                    notificationList.sort(
                      (a, b) =>
                        new Date(b._time).getTime() -
                        new Date(a._time).getTime()
                    ) as NotificationHistoryType[]
                  }
                  initialPerPage={10}
                  itemPerPage={[10, 30, 50, 100]}
                  renderItem={(item, index) => (
                    <li
                      className={`flex items-center gap-3 py-2 px-3 border-b border-base-content/5 hover:bg-base-200 duration-300 ease-linear`}
                      key={index}
                    >
                      <div className='bg-primary/10 text-primary/70 rounded-field p-1'>
                        {subTextNotiDetailsIcon(item?.message)}
                      </div>
                      <div className='flex flex-col gap-1 w-full'>
                        <div className='flex items-center justify-between gap-3'>
                          <span>{subTextNotiDetails(item?.message)}</span>
                          <div className='flex flex-col items-end opacity-70'>
                            <span className='text-[14px]'>
                              {new Date(item._time).toLocaleString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC'
                              })}
                            </span>
                            <span className='w-max text-[14px]'>
                              {new Date(item._time).toLocaleString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                timeZone: 'UTC'
                              })}
                            </span>
                          </div>
                        </div>
                        <span className='text-[14px] opacity-70'>
                          {item?.sn ?? '—'}
                        </span>
                      </div>
                    </li>
                  )}
                />
              ) : (
                <div className='flex items-center justify-center loading-hieght-full'>
                  <div>{t('notificationEmpty')}</div>
                </div>
              )}
            </div>
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}

export default Notification
