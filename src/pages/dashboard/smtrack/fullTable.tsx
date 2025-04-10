import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { AxiosError } from 'axios'
import {
  RiDashboardLine,
  RiFileExcel2Line,
  RiMenuLine,
  RiPlayLine,
  RiStopLine,
  RiTableFill
} from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import {
  setDeviceKey,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import { Swiper as SwiperType } from 'swiper/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  DeviceLog,
  DeviceLogs
} from '../../../types/smtrack/devices/deviceType'
import FullTableComponent from '../../../components/pages/dashboard/smtrack/fullTable'

const FullTable = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as Location<{ deviceLogs: DeviceLog }>
  const { deviceLogs } = location.state ?? {
    deviceLogs: { sn: '', minTemp: 0, maxTemp: 0 }
  }
  const [pageNumber, setPagenumber] = useState(1)
  const [dataLog, setDataLog] = useState<DeviceLogs[]>([])
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isPause, setIsPaused] = useState(false)
  const swiperRef = useRef<SwiperType>(null)

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
    if (swiperRef.current) {
      if (isPause) {
        swiperRef.current.autoplay.start()
      } else {
        swiperRef.current.autoplay.stop()
      }
    }
  }, [isPause])

  useEffect(() => {
    if (!deviceLogs) {
      dispatch(setDeviceKey(''))
      cookies.remove('deviceKey', cookieOptions)
      navigate('/dashboard')
    }
  }, [deviceLogs])

  const logDay = async () => {
    setPagenumber(1)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<DeviceLogs[]>>(
        `/log/graph?sn=${
          deviceLogs?.id ? deviceLogs?.id : cookies.get('deviceKey')
        }&filter=day`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logWeek = async () => {
    setPagenumber(2)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<DeviceLogs[]>>(
        `/log/graph?sn=${
          deviceLogs?.id ? deviceLogs?.id : cookies.get('deviceKey')
        }&filter=week`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logMonth = async () => {
    setPagenumber(3)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<DeviceLogs[]>>(
        `/log/graph?sn=${
          deviceLogs?.id ? deviceLogs?.id : cookies.get('deviceKey')
        }&filter=month`
      )
      setDataLog(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.log(error.response?.data?.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const Logcustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' && endDate !== '') {
      if (diffDays <= 31) {
        try {
          setDataLog([])
          setIsLoading(true)
          const responseData = await axiosInstance.get<
            responseType<DeviceLogs[]>
          >(
            `/log/graph?sn=${
              deviceLogs?.id ? deviceLogs?.id : cookies.get('deviceKey')
            }&filter=${filterDate.startDate},${filterDate.endDate}`
          )
          setDataLog(responseData.data.data)
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              dispatch(setTokenExpire(true))
            } else {
              console.error('Something wrong' + error)
            }
          } else {
            console.error('Uknown error: ', error)
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('customMessageLogData'),
          icon: 'warning',
          timer: 3000,
          showConfirmButton: false
        })
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const convertArrayOfObjectsToExcel = (object: {
    deviceData: DeviceLog | undefined
    log: DeviceLogs[]
  }) => {
    return new Promise<boolean>((resolve, reject) => {
      if (object.deviceData && object.log.length > 0) {
        const wb = XLSX.utils.book_new()

        object.deviceData.probe.forEach(i => {
          const newArray = object.log
            .filter(f => f.probe === i.channel)
            .map((items, index) => ({
              No: index + 1,
              DeviceSN: object.deviceData?.id,
              DeviceName: object.deviceData?.name,
              TemperatureMin: i.tempMin,
              TemperatureMax: i.tempMax,
              Date: new Date(items._time).toLocaleString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'UTC'
              }),
              Time: new Date(items._time).toLocaleString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC'
              }),
              Temperature: items.temp.toFixed(2),
              Humidity: items.humidity.toFixed(2),

              ...(i.doorQty === 3
                ? {
                    Door1: items.door1 ? t('stateOn') : t('stateOff'),
                    Door2: items.door2 ? t('stateOn') : t('stateOff'),
                    Door3: items.door3 ? t('stateOn') : t('stateOff')
                  }
                : i.doorQty === 2
                ? {
                    Door1: items.door1 ? t('stateOn') : t('stateOff'),
                    Door2: items.door2 ? t('stateOn') : t('stateOff')
                  }
                : {
                    Door1: items.door1 ? t('stateOn') : t('stateOff')
                  }),

              Plug: !items.plug ? t('stateProblem') : t('stateNormal'),
              Battery: items.battery
            }))

          try {
            const ws = XLSX.utils.json_to_sheet(newArray)
            XLSX.utils.book_append_sheet(wb, ws, `Probe_Channel_${i.channel}`)
          } catch (error) {
            console.error(error)
          }
        })

        try {
          if (wb.SheetNames.length > 0) {
            XLSX.writeFile(wb, 'smtrack-data-table.xlsx')
            resolve(true)
          } else {
            reject(false)
          }
        } catch (error) {
          console.error(error)
          reject(false)
        }
      } else {
        reject(false)
      }
    })
  }

  useEffect(() => {
    logDay()
  }, [])

  useEffect(() => {
    if (deviceLogs?.id === '') {
      navigate('/dashboard')
    }
  }, [deviceLogs?.id])

  const tableWrapper = useMemo(() => {
    return (
      <Swiper
        onSwiper={swiper => (swiperRef.current = swiper)}
        slidesPerView={'auto'}
        spaceBetween={30}
        centeredSlides={true}
        loop={deviceLogs?.probe && deviceLogs?.probe.length > 2}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true
        }}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: false,
            translate: ['-120%', 0, -500]
          },
          next: {
            shadow: false,
            translate: ['120%', 0, -500]
          }
        }}
        modules={[Autoplay, Pagination, EffectCreative]}
        className='mySwiper h-full custom-swiper-pagination'
      >
        {deviceLogs &&
          deviceLogs?.probe?.map(item => {
            const filterItem = dataLog.filter(itemTwo =>
              itemTwo.probe.includes(item.channel)
            )
            return (
              <SwiperSlide key={0}>
                <FullTableComponent
                  dataLog={filterItem}
                  deviceLogs={deviceLogs}
                  tempMin={item.tempMin}
                  tempMax={item.tempMax}
                  isLoading={isLoading}
                />
              </SwiperSlide>
            )
          })}
      </Swiper>
    )
  }, [deviceLogs, dataLog])

  return (
    <div className='p-3 px-5 overflow-hidden'>
      <div className='breadcrumbs text-sm mt-3'>
        <ul>
          <li>
            <a onClick={() => navigate('/dashboard')}>
              <RiDashboardLine size={16} className='mr-1' />
              {t('sideDashboard')}
            </a>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <RiTableFill size={16} className='mr-1' />
              <span>{t('fullTable')}</span>
              <span>-</span>
              <span>{deviceLogs?.id}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='flex items-center justify-between flex-col md:flex-row gap-3 mt-2'>
        <div role='tablist' className='tabs tabs-bordered justify-start w-full'>
          <a
            role='tab'
            className={`tab ${pageNumber === 1 ? 'tab-active' : ''}`}
            onClick={() => logDay()}
          >
            {t('chartDay')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 2 ? 'tab-active' : ''}`}
            onClick={() => logWeek()}
          >
            {t('chartWeek')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 3 ? 'tab-active' : ''}`}
            onClick={() => logMonth()}
          >
            {t('month')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 4 ? 'tab-active' : ''}`}
            onClick={() => setPagenumber(4)}
          >
            {t('chartCustom')}
          </a>
        </div>
        <div className='flex items-center gap-3 justify-end w-full'>
          {deviceLogs && deviceLogs?.probe?.length > 1 && (
            <label
              htmlFor='button'
              className='tooltip tooltip-top flex'
              data-tip={isPause ? t('startSlide') : t('stopSlide')}
            >
              <button
                className='btn btn-primary bg-opacity-15 text-primary border-primary border-2 p-0 hover:opacity-50 hover:border-primary hover:bg-transparent duration-300 ease-linear max-h-[28px] min-h-[28px] max-w-[28px] min-w-[28px]'
                onClick={togglePause}
              >
                {isPause ? <RiPlayLine size={20} /> : <RiStopLine size={20} />}
              </button>
            </label>
          )}
          <div className='dropdown dropdown-end z-50'>
            <button
              tabIndex={0}
              role='button'
              data-tip={t('menuButton')}
              className='btn btn-ghost flex p-0 max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px] tooltip tooltip-left'
            >
              <RiMenuLine size={20} />
            </button>
            <ul
              tabIndex={0}
              className='dropdown-content menu bg-base-100 rounded-box z-[1] max-w-[180px] w-[140px] p-2 shadow'
            >
              <li
                onClick={() => {
                  toast.promise(
                    convertArrayOfObjectsToExcel({
                      deviceData: deviceLogs,
                      log: dataLog
                    }),
                    {
                      loading: 'Downloading',
                      success: <span>Downloaded</span>,
                      error: <span>Something wrong</span>
                    }
                  )
                }}
              >
                <div className='flex items-center gap-3 text-[16px]'>
                  <RiFileExcel2Line size={20} />
                  <a>Excel</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {pageNumber === 4 && (
        <div className='flex items-end justify-center flex-col md:items-center md:flex-row gap-3 mt-3'>
          <input
            type='date'
            className='input input-bordered w-full md:max-w-xs'
            onChange={e =>
              setFilterDate({ ...filterDate, startDate: e.target.value })
            }
          />
          <input
            type='date'
            className='input input-bordered w-full md:max-w-xs'
            onChange={e =>
              setFilterDate({ ...filterDate, endDate: e.target.value })
            }
          />
          <button className='btn btn-primary' onClick={() => Logcustom()}>
            Search
          </button>
        </div>
      )}
      {tableWrapper}
    </div>
  )
}

export default FullTable
