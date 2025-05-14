import { useCallback, useEffect, useState } from 'react'
import UserListWithSetState from '../filter/userList'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { HistoryLohType } from '../../types/global/historyLogs/historyLogType'
import { AxiosError } from 'axios'
import { setTokenExpire } from '../../redux/actions/utilsActions'
import HistoryPagination from '../pagination/historyPagination'
import { useTranslation } from 'react-i18next'
import Loading from '../skeleton/table/loading'
import DeviceListWithSetState from '../filter/deviceListState'

const HistoryLog = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [deviceId, setDeviceId] = useState('')
  const [userId, setUserId] = useState('')
  const [historyLogs, setHistoryLogs] = useState<HistoryLohType[]>([])
  const [historyLogsFilter, setHistoryLogsFilter] = useState<HistoryLohType[]>(
    []
  )
  const [datePicker, setDatePicker] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchHistoryLog = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<HistoryLohType[]>>(
        `/history/device?sn=${deviceId} ${datePicker ? `&filter=${datePicker}` : ''}`
      )
      setHistoryLogs(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }

        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [deviceId, datePicker])

  const clearForm = () => {
    setDeviceId('')
    setUserId('')
    setDatePicker('')
    setHistoryLogs([])
    setHistoryLogsFilter([])
  }

  useEffect(() => {
    if (deviceId === '') return
    fetchHistoryLog()
  }, [deviceId, datePicker])

  useEffect(() => {
    const filter = historyLogs.filter(f => f.user.includes(userId))
    setHistoryLogsFilter(filter)
  }, [historyLogs, userId])

  return (
    <div className='p-3'>
      <div className='flex items-center flex-wrap gap-2'>
        <span className='ml-3 md:ml-0'>{t('countDeviceUnit')}</span>
        <DeviceListWithSetState deviceId={deviceId} setDeviceId={setDeviceId} />
        <span className='ml-3 md:ml-0'>{t('hisUsername')}</span>
        <UserListWithSetState userId={userId} setUserId={setUserId} />
        <span>{t('seeLastData')}</span>
        <input
          type='date'
          disabled={deviceId === ''}
          value={datePicker}
          onChange={e => setDatePicker(e.target.value)}
          className='input input-bordered w-full md:max-w-xs'
        />
        <button className='btn btn-error w-full md:w-auto' disabled={deviceId === '' && userId === '' && datePicker === ''} onClick={() => clearForm()}>{t('buttonClear')}</button>
      </div>
      <div className='py-4'>
        {!isLoading ? (
          historyLogsFilter.length > 0 ? (
            <HistoryPagination
              data={historyLogsFilter.sort((a, b) => new Date(b._time).getTime() - new Date(a._time).getTime()) as HistoryLohType[]}
              initialPerPage={10}
              itemPerPage={[10, 30, 50, 100]}
              renderItem={(item, index) => (
                <div
                  className='collapse collapse-plus join-item border-base-300 border'
                  key={index}
                >
                  <input
                    type='radio'
                    name='my-accordion-1'
                    defaultChecked={index === 0}
                  />
                  <div className='collapse-title'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`badge badge-ghost p-3 font-medium ${
                            item.type === 'update'
                              ? 'bg-blue-500/30 text-blue-500 border-0'
                              : 'bg-green-500/30 text-green-500 border-0'
                          }`}
                        >
                          {item.type === 'update'
                            ? t('typeUpdate')
                            : t('typeCreate')}
                        </span>
                        <span className='text-sm text-base-content/70'>
                          {new Date(item._time).toLocaleString('th-TH', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC'
                          })}
                        </span>
                      </div>
                      <span className='font-medium text-sm'>
                        {item.service}
                      </span>
                    </div>
                  </div>
                  <div className='collapse-content'>
                    <div className='flex flex-col gap-2 w-full rounded-md bg-base-200/50 p-3'>
                      <p className='font-medium'>{t('hisDetail')}</p>
                      <p className='ml-5'>- {item.message.split(':')[1].split('/')[0]}</p>
                      <p className='text-[14px]'>{t('modifyBy')}: {item.message.split('/')[1]}</p>
                    </div>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className='flex items-center justify-center h-[calc(100dvh-310px)]'>
              <div>{t('nodata')}</div>
            </div>
          )
        ) : (
          <div className='h-[calc(100dvh-300px)]'>
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryLog
