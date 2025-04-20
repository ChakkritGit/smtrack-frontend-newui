/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import { DeviceLogsType } from '../../../types/smtrack/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import DeviceList from '../../../components/filter/deviceList'
import Loading from '../../../components/skeleton/table/loading'
import CardInFoComponent from '../../../components/pages/dashboard/smtrack/cardInfo'
import CardStatus from '../../../components/pages/dashboard/smtrack/cardStatus'
import ChartSwiperWrapper from '../../../components/pages/dashboard/smtrack/chartSwiperWrapper'
import DataTableWrapper from '../../../components/pages/dashboard/smtrack/dataTableWrapper'
import { useTranslation } from 'react-i18next'
import { RiCloseLargeLine, RiPlayLine, RiStopLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { setTokenExpire } from '../../../redux/actions/utilsActions'
import { useSwiperSync } from '../../../constants/utils/utilsConstants'
import { GlobalContextType } from '../../../types/global/globalContext'
import { Swiper as SwiperType } from 'swiper/types'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceKey, socketData, switchingMode, blurDisabled } = useSelector(
    (state: RootState) => state.utils
  )
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogsType>()
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)
  const { activeIndex } = useSwiperSync() as GlobalContextType
  const swiperTempRef = useRef<SwiperType>(null)
  const swiperTempOfDayRef = useRef<SwiperType>(null)
  const swiperInfoRef = useRef<SwiperType>(null)
  const [isPause, setIsPaused] = useState(false)
  const deviceFetchHistory = useRef<Record<string, number>>({})

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [isPause])

  const fetchDeviceLogs = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<DeviceLogsType>>(
        `/devices/device/${deviceKey}`
      )
      setDeviceLogs(response.data.data)
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
      setLoading(false)
    }
  }, [deviceKey])

  useEffect(() => {
    const handleDeviceData = () => {
      if (socketData?.device && deviceLogs?.name) {
        const deviceName = socketData.device.toLowerCase()

        const matchedDevice = deviceLogs.name.toLowerCase().includes(deviceName)

        if (matchedDevice) {
          const currentTime = Date.now()
          const lastFetchTime = deviceFetchHistory.current[deviceName] || 0

          if (currentTime - lastFetchTime >= 30000) {
            deviceFetchHistory.current[deviceName] = currentTime

            fetchDeviceLogs()
          }
        }
      }
    }

    if (socketData?.device) {
      handleDeviceData()
    }

    return () => {}
  }, [deviceLogs, socketData])

  useEffect(() => {
    if (!deviceKey) return
    setLoading(true)
    fetchDeviceLogs()
  }, [deviceKey])

  useEffect(() => {
    if (!deviceKey) return
    setInterval(() => {
      fetchDeviceLogs()
    }, 300000)
  }, [deviceKey])

  const CardInfoComponent = useMemo(() => {
    return (
      <CardInFoComponent
        deviceData={deviceLogs}
        fetchDevices={fetchDeviceLogs}
        swiperInfoRef={swiperInfoRef}
        isPause={isPause}
        blurDisabled={blurDisabled}
      />
    )
  }, [deviceKey, deviceLogs, activeIndex, swiperInfoRef, isPause])

  const CardStatusComponent = useMemo(() => {
    return (
      <CardStatus
        deviceData={deviceLogs}
        swiperTempRef={swiperTempRef}
        swiperTempOfDayRef={swiperTempOfDayRef}
        isPause={isPause}
      />
    )
  }, [
    deviceKey,
    deviceLogs,
    activeIndex,
    swiperTempRef,
    swiperTempOfDayRef,
    isPause
  ])

  useEffect(() => {
    if (!deviceKey && !switchingMode) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [deviceKey])

  return (
    <div className='p-3 px-[16px]'>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box h-[500px]'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl mb-0'>{t('selectDeviceDrop')}</h2>
            <button
              type='button'
              name='close-modal'
              aria-label={t('closeButton')}
              className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear'
              onClick={() => navigate('/')}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>
          <label htmlFor='react-select-9-input'>
            <DeviceList />
          </label>
        </div>
      </dialog>
      {deviceKey && (
        <>
          <div className='flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-[16px]'>
            <label htmlFor='react-select-11-input'>
              <DeviceList />
            </label>
            <div className='flex items-center gap-3 justify-end w-full flex-wrap'>
              {deviceLogs && deviceLogs?.probe?.length > 1 && (
                <label
                  htmlFor='button'
                  className='tooltip tooltip-left'
                  data-tip={isPause ? t('startSlide') : t('stopSlide')}
                >
                  <button
                    name={isPause ? t('startSlide') : t('stopSlide')}
                    aria-label={isPause ? t('startSlide') : t('stopSlide')}
                    className='btn btn-neutral bg-opacity-15 text-primary border-primary border-2 p-0 hover:opacity-50 hover:border-primary hover:bg-transparent duration-300 ease-linear max-h-[28px] min-h-[28px] max-w-[28px] min-w-[28px]'
                    onClick={togglePause}
                  >
                    {isPause ? (
                      <RiPlayLine size={20} />
                    ) : (
                      <RiStopLine size={20} />
                    )}
                  </button>
                </label>
              )}
              <HospitalAndWard />
            </div>
          </div>
          {loading ? (
            <div className='flex items-center justify-center loading-hieght-full'>
              <Loading />
            </div>
          ) : (
            <>
              <div className='flex items-center gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
                <div className='w-full xl:w-[35%] lg:h-[330px] bg-base-100 rounded-field overflow-hidden'>
                  {CardInfoComponent}
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full xl:w-[65%] justify-items-center'>
                  {CardStatusComponent}
                </div>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 mt-4 gap-3'>
                <div className='w-full min-h-[385px]'>
                  <ChartSwiperWrapper
                    deviceLogs={deviceLogs}
                    isPause={isPause}
                  />
                </div>
                <div className='w-full min-h-[385px]'>
                  <DataTableWrapper deviceLogs={deviceLogs} isPause={isPause} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
