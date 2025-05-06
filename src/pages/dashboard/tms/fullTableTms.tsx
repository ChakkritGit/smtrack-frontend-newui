import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import {
  DeviceLogTms,
  LogChartTms
} from '../../../types/tms/devices/deviceType'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import {
  cookieOptions,
  cookies,
  formatThaiDate,
  formatThaiDateSend
} from '../../../constants/utils/utilsConstants'
import { AxiosError } from 'axios'
import {
  RiDashboardLine,
  RiFileExcel2Line,
  RiMenuLine,
  RiTableFill
} from 'react-icons/ri'
import FullTableTmsComponent from '../../../components/pages/dashboard/tms/fullTableTms'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDeviceKey,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { DayPicker } from 'react-day-picker'
import { enUS, th } from 'react-day-picker/locale'
import { RootState } from '../../../redux/reducers/rootReducer'

const FullTableTms = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as Location<{ deviceLogs: DeviceLogTms }>
  const { i18nInit } = useSelector((state: RootState) => state.utils)
  const { deviceLogs } = location.state ?? {
    deviceLogs: { sn: '', minTemp: 0, maxTemp: 0 }
  }
  const [pageNumber, setPagenumber] = useState(1)
  const [dataLog, setDataLog] = useState<LogChartTms[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

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
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=day&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`
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
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=week&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`
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
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=month&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`
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
    let startDateNew = startDate
    let endDateNew = endDate
    if (startDateNew && endDateNew) {
      let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      if (diffDays <= 31) {
        try {
          setDataLog([])
          setIsLoading(true)
          const responseData = await axiosInstance.get<
            responseType<LogChartTms[]>
          >(
            `/legacy/graph?filter=${formatThaiDateSend(
              startDateNew
            )},${formatThaiDateSend(endDateNew)}&sn=${
              deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
            }`
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
    deviceData: DeviceLogTms | undefined
    log: LogChartTms[]
  }) => {
    return new Promise<boolean>((resolve, reject) => {
      if (!object.deviceData || object.log.length === 0) {
        return reject(false)
      }

      const workbook = XLSX.utils.book_new()
      const groupedData: Record<string, LogChartTms[]> = {}

      object.log.forEach(log => {
        if (!groupedData[log.probe]) {
          groupedData[log.probe] = []
        }
        groupedData[log.probe].push(log)
      })

      Object.keys(groupedData).forEach(probe => {
        const data = groupedData[probe].map((log, index) => {
          const isHumidity = /hum/i.test(probe)
          return {
            No: index + 1,
            DeviceSN: log.sn,
            DeviceName: object.deviceData?.name,
            Date: new Date(log._time).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC'
            }),
            Time: new Date(log._time).toLocaleString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'UTC'
            }),
            [isHumidity ? 'Humidity' : 'Temperature']: log._value.toFixed(2)
          }
        })

        const worksheet = XLSX.utils.json_to_sheet(data)
        XLSX.utils.book_append_sheet(workbook, worksheet, `Probe_${probe}`)
      })

      try {
        XLSX.writeFile(workbook, `Device_${object.deviceData.sn}_Data.xlsx`)
        resolve(true)
      } catch (error) {
        console.error(error)
        reject(false)
      }
    })
  }

  useEffect(() => {
    logDay()
  }, [])

  useEffect(() => {
    if (deviceLogs?.sn === '') {
      navigate('/dashboard')
    }
  }, [deviceLogs?.sn])

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
              <span>{t('fullChart')}</span>
              <span>-</span>
              <span>{deviceLogs?.id}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='flex items-center justify-between flex-col md:flex-row gap-3 mt-2'>
        <div role='tablist' className='tabs tabs-border justify-start w-full'>
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
        <div className='flex items-center justify-end w-full'>
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
          <button
            popoverTarget='startDate-popover'
            className='input input-border w-full md:w-56'
          >
            {startDate ? formatThaiDate(startDate) : t('selectData')}
          </button>

          <div popover='auto' id='startDate-popover' className='dropdown'>
            <DayPicker
              className='react-day-picker'
              mode='single'
              selected={startDate}
              onSelect={setStartDate}
              locale={i18nInit === 'th' ? th : enUS}
            />
          </div>

          <button
            popoverTarget='endDate-popover'
            className='input input-border w-full md:w-56'
          >
            {endDate ? formatThaiDate(endDate) : t('selectData')}
          </button>

          <div popover='auto' id='endDate-popover' className='dropdown'>
            <DayPicker
              className='react-day-picker'
              mode='single'
              selected={endDate}
              onSelect={setEndDate}
              locale={i18nInit === 'th' ? th : enUS}
            />
          </div>

          <button
            className='btn btn-neutral w-full md:w-24'
            onClick={() => Logcustom()}
          >
            {t('searchButton')}
          </button>
        </div>
      )}
      <FullTableTmsComponent
        dataLog={dataLog.reverse()}
        tempMin={deviceLogs?.minTemp}
        tempMax={deviceLogs?.maxTemp}
        isLoading={isLoading}
      />
    </div>
  )
}

export default FullTableTms
