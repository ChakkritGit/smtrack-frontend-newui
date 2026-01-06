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
  const { deviceKey, socketData, switchingMode, ambientDisabled, tokenDecode } =
    useSelector((state: RootState) => state.utils)

  const [deviceLogs, setDeviceLogs] = useState<DeviceLogsType>()

  // 1. เพิ่ม Ref เพื่อแก้ Infinite Loop
  const deviceLogsRef = useRef<DeviceLogsType | undefined>(deviceLogs)

  const [loading, setLoading] = useState(false)
  const [isPause, setIsPaused] = useState(false)
  const { activeIndex } = useSwiperSync() as GlobalContextType

  const swiperTempRef = useRef<SwiperType>(null)
  const swiperTempOfDayRef = useRef<SwiperType>(null)
  const swiperDoorRef = useRef<SwiperType>(null) // Ref สำหรับ Door
  const swiperInfoRef = useRef<SwiperType>(null)

  const deviceFetchHistory = useRef<Record<string, number>>({})
  const abortRef = useRef<AbortController | null>(null)
  const modalRef = useRef<HTMLDialogElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { role } = tokenDecode || {}

  // 2. Sync ค่าจาก State เข้า Ref เสมอ
  useEffect(() => {
    deviceLogsRef.current = deviceLogs
  }, [deviceLogs])

  const abortPrevRequest = () => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const fetchDeviceLogs = useCallback(
    async (showLoading = false) => {
      if (!deviceKey) return

      if (showLoading) setLoading(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await axiosInstance.get<responseType<DeviceLogsType>>(
          `/devices/device/${deviceKey}`,
          {
            signal: controller.signal
          }
        )
        setDeviceLogs(response.data.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          if (error.name !== 'CanceledError') {
            console.error(error.response?.data.message)
          }
        } else {
          console.error(error)
        }
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [deviceKey]
  )

  // 3. Socket Effect: ใช้ Ref แทน State ในเงื่อนไข และเอา deviceLogs ออกจาก dependency
  useEffect(() => {
    const handleDeviceData = () => {
      // ใช้ deviceLogsRef.current แทน deviceLogs
      if (socketData?.device && deviceLogsRef.current?.name) {
        const deviceName = socketData.device.toLowerCase()
        const matchedDevice = deviceLogsRef.current.name
          .toLowerCase()
          .includes(deviceName)

        if (matchedDevice) {
          const currentTime = Date.now()
          const lastFetchTime = deviceFetchHistory.current[deviceName] || 0

          if (currentTime - lastFetchTime >= 30000) {
            deviceFetchHistory.current[deviceName] = currentTime
            abortPrevRequest()
            fetchDeviceLogs(false)
          }
        }
      }
    }

    if (socketData?.device) {
      handleDeviceData()
    }

    return () => {}
  }, [socketData, deviceKey]) // เอา deviceLogs ออก เพื่อกัน Loop

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    abortPrevRequest()
    fetchDeviceLogs(true)

    intervalRef.current = setInterval(() => {
      fetchDeviceLogs(false)
    }, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [deviceKey])

  const CardInfoComponent = useMemo(() => {
    return (
      <CardInFoComponent
        deviceData={deviceLogs}
        fetchDevices={() => fetchDeviceLogs(true)}
        swiperInfoRef={swiperInfoRef}
        isPause={isPause}
        ambientDisabled={ambientDisabled}
        role={role}
      />
    )
  }, [deviceKey, deviceLogs, activeIndex, isPause, role])

  const CardStatusComponent = useMemo(() => {
    return (
      <CardStatus
        deviceData={deviceLogs}
        swiperTempRef={swiperTempRef}
        swiperTempOfDayRef={swiperTempOfDayRef}
        swiperDoorRef={swiperDoorRef} // ส่ง Ref ไป
        isPause={isPause}
      />
    )
  }, [
    deviceKey,
    deviceLogs,
    activeIndex,
    swiperTempRef,
    swiperTempOfDayRef,
    swiperDoorRef,
    isPause
  ])

  useEffect(() => {
    if (!deviceKey && !switchingMode) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [deviceKey])

  const DeviceDetailLog = useMemo(() => {
    if (!deviceLogs) return null

    return (
      <>
        <div className='flex items-center gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
          <div className='w-full xl:w-[35%] lg:h-82.5 bg-base-100 rounded-field overflow-hidden'>
            {CardInfoComponent}
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full xl:w-[65%] justify-items-center'>
            {CardStatusComponent}
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-4 gap-3'>
          <div className='w-full min-h-96.25'>
            <ChartSwiperWrapper deviceLogs={deviceLogs} isPause={isPause} />
          </div>
          <div className='w-full min-h-96.25'>
            <DataTableWrapper deviceLogs={deviceLogs} isPause={isPause} />
          </div>
        </div>
      </>
    )
  }, [deviceKey, deviceLogs, isPause])

  return (
    <div className='p-3 px-4 min-h-screen'>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box h-125'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl mb-0'>{t('selectDeviceDrop')}</h2>
            <button
              type='button'
              name='close-modal'
              aria-label={t('closeButton')}
              className='btn btn-ghost outline-none flex p-0 min-w-7.5 min-h-7.5 max-w-7.5 max-h-7.5 duration-300 ease-linear'
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
      <div className='flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-4'>
        <label htmlFor='react-select-9-input' className='min-w-78.75 w-max'>
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
                className='btn btn-neutral shadow-lg shadow-neutral/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-opacity-15 text-primary border-primary border p-0 hover:opacity-50 hover:border-primary hover:bg-transparent duration-300 ease-linear max-h-7 min-h-7 max-w-7 min-w-7'
                onClick={togglePause}
              >
                {isPause ? <RiPlayLine size={20} /> : <RiStopLine size={20} />}
              </button>
            </label>
          )}
          <HospitalAndWard />
        </div>
      </div>

      {/* Container สำหรับ Loading ที่มีความสูงชัดเจน */}
      {loading ? (
        <div className='flex items-center justify-center w-full min-h-[60vh] h-full'>
          <Loading />
        </div>
      ) : (
        DeviceDetailLog
      )}
    </div>
  )
}

export default Dashboard
