import { AxiosError } from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  DeviceLogTms,
  LogChartTms
} from '../../../types/tms/devices/deviceType'
import {
  cookieOptions,
  cookies,
  formatThaiDate,
  formatThaiDateSend
} from '../../../constants/utils/utilsConstants'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { useTranslation } from 'react-i18next'
import {
  RiBarChart2Fill,
  RiDashboardLine,
  RiFileImageLine,
  RiFilePdf2Line,
  RiMenuLine
} from 'react-icons/ri'
import FullChartTmsComponent from '../../../components/pages/dashboard/tms/fullChartTms'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDeviceKey,
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import { RootState } from '../../../redux/reducers/rootReducer'
import html2canvas from 'html2canvas-pro'
import Loading from '../../../components/skeleton/table/loading'
import ImagesOne from '../../../assets/images/Thanes.png'
import { DayPicker } from 'react-day-picker'
import { th, enUS } from 'react-day-picker/locale'

const FullChartTms = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userProfile, submitLoading, i18nInit } = useSelector(
    (state: RootState) => state.utils
  )
  const location = useLocation() as Location<{ deviceLogs: DeviceLogTms }>
  const { deviceLogs } = location.state ?? {
    deviceLogs: {
      sn: '',
      minTemp: 0,
      maxTemp: 0,
      name: '',
      ward: '',
      hospital: ''
    }
  }
  const [pageNumber, setPagenumber] = useState(1)
  const [dataLog, setDataLog] = useState<LogChartTms[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const abortPrevRequest = () => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
  }

  const logDay = async () => {
    abortPrevRequest()
    const controller = new AbortController()
    abortRef.current = controller

    setPagenumber(1)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=day&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`,
        {
          signal: controller.signal
        }
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
    abortPrevRequest()
    const controller = new AbortController()
    abortRef.current = controller

    setPagenumber(2)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=week&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`,
        {
          signal: controller.signal
        }
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
    abortPrevRequest()
    const controller = new AbortController()
    abortRef.current = controller

    setPagenumber(3)
    setDataLog([])
    setIsLoading(true)
    try {
      const response = await axiosInstance.get<responseType<LogChartTms[]>>(
        `/legacy/graph?filter=month&sn=${
          deviceLogs?.sn ? deviceLogs?.sn : cookies.get('deviceKey')
        }`,
        {
          signal: controller.signal
        }
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
    abortPrevRequest()
    const controller = new AbortController()
    abortRef.current = controller

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
            }`,
            {
              signal: controller.signal
            }
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

  const handleDownload = useCallback(
    async (type: string) => {
      if (canvasChartRef.current && tableInfoRef.current) {
        tableInfoRef.current.style.display = 'flex'
        tableInfoRef.current.style.color = 'black'
        canvasChartRef.current.style.color = 'black'

        const canvas = canvasChartRef.current

        const promise = html2canvas(canvas, { scale: 2 })
          .then(canvasImage => {
            const dataURL = canvasImage.toDataURL(
              type === 'png' ? 'image/png' : 'image/jpg',
              1.0
            )

            let pagename = ''
            if (pageNumber === 1) {
              pagename = 'Day_Chart'
            } else if (pageNumber === 2) {
              pagename = 'Week_Chart'
            } else {
              pagename = 'Custom_Chart'
            }

            const link = document.createElement('a')
            link.href = dataURL
            link.download = `${pagename}${type === 'png' ? '.png' : '.jpg'}`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
          .catch(error => {
            console.error('Error generating image:', error)
            throw new Error('Failed to download the image')
          })
          .finally(() => {
            if (tableInfoRef.current && canvasChartRef.current) {
              tableInfoRef.current.style.display = 'none'
              tableInfoRef.current.style.color = ''
              canvasChartRef.current.style.color = ''
            }
          })

        toast.promise(promise, {
          loading: t('processing'),
          success: <span>{t('downloaded')}</span>,
          error: <span>{t('descriptionErrorWrong')}</span>
        })
      } else {
        toast.error(t('nodata'))
      }
    },
    [t]
  )

  const exportChart = () => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          if (canvasChartRef.current) {
            canvasChartRef.current.style.width = '1480px'
            canvasChartRef.current.style.height = '680px'
            canvasChartRef.current.style.color = 'black'

            await new Promise(resolve => setTimeout(resolve, 500))
            const canvas = canvasChartRef.current

            html2canvas(canvas)
              .then(canvasImage => {
                resolve(canvasImage.toDataURL('image/png', 1.0))
              })
              .catch(error => {
                reject(error)
              })
          }
        } catch (error) {
          reject(error)
        }
      }, 600)
    })
  }

  const ChartWrapper = useMemo(
    () => (
      <FullChartTmsComponent
        dataLog={dataLog}
        tempMin={deviceLogs?.minTemp}
        tempMax={deviceLogs?.maxTemp}
        isLoading={isLoading}
      />
    ),
    [dataLog, isLoading]
  )

  useEffect(() => {
    logDay()
  }, [])

  useEffect(() => {
    if (!deviceLogs) {
      dispatch(setDeviceKey(''))
      cookies.remove('deviceKey', cookieOptions)
      navigate('/dashboard')
    }
  }, [deviceLogs])

  useEffect(() => {
    if (deviceLogs?.sn === '') {
      navigate('/dashboard')
    }
  }, [deviceLogs?.sn])

  useEffect(() => {
    if (submitLoading) {
      ;(async () => {
        try {
          const waitExport = await exportChart()
          dispatch(setSubmitLoading())
          navigate('/dashboard/chart/preview', {
            state: {
              title: 'Chart-Report',
              ward: deviceLogs?.ward,
              image: ImagesOne,
              hospital: deviceLogs?.hospital,
              devSn: deviceLogs?.sn,
              devName: deviceLogs?.name,
              chartIMG: waitExport,
              dateTime: String(new Date()).substring(0, 25),
              hosImg: userProfile?.ward.hospital.hosPic,
              deviceLogs
            }
          })
        } catch (error) {
          dispatch(setSubmitLoading())
          Swal.fire({
            title: t('alertHeaderError'),
            text: t('descriptionErrorWrong'),
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })()
    }
  }, [submitLoading])

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
              <RiBarChart2Fill size={16} className='mr-1' />
              <span>{t('fullChart')}</span>
              <span>-</span>
              <span>{deviceLogs?.sn}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='flex items-center justify-between flex-col md:flex-row gap-3 mt-2'>
        <div role='tablist' className='tabs tabs-border justify-start w-full'>
          <a
            role='tab'
            className={`tab ${pageNumber === 1 ? 'tab-active' : ''}`}
            onClick={() => {
              if (pageNumber !== 1) {
                logDay()
              }
            }}
          >
            {t('chartDay')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 2 ? 'tab-active' : ''}`}
            onClick={() => {
              if (pageNumber !== 2) {
                logWeek()
              }
            }}
          >
            {t('chartWeek')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 3 ? 'tab-active' : ''}`}
            onClick={() => {
              if (pageNumber !== 3) {
                logMonth()
              }
            }}
          >
            {t('month')}
          </a>
          <a
            role='tab'
            className={`tab ${pageNumber === 4 ? 'tab-active' : ''}`}
            onClick={() => {
              if (pageNumber !== 4) {
                setPagenumber(4)
              }
            }}
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
              <li onClick={() => handleDownload('png')}>
                <div className='flex items-center gap-3 text-[16px]'>
                  <RiFileImageLine size={20} />
                  <a>PNG</a>
                </div>
              </li>
              <li onClick={() => handleDownload('jpg')}>
                <div className='flex items-center gap-3 text-[16px]'>
                  <RiFileImageLine size={20} />
                  <a>JPG</a>
                </div>
              </li>
              <div className='divider my-1 h-2 before:h-[1px] after:h-[1px]'></div>
              <li
                onClick={async () => {
                  dispatch(setSubmitLoading())
                  if (dataLog.length === 0) {
                    Swal.fire({
                      title: t('alertHeaderWarning'),
                      text: t('dataNotReady'),
                      icon: 'warning',
                      timer: 2000,
                      showConfirmButton: false
                    })
                    dispatch(setSubmitLoading())
                  }
                }}
              >
                <div className='flex items-center gap-3 text-[16px]'>
                  <RiFilePdf2Line size={20} />
                  <a>PDF</a>
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
      <div ref={canvasChartRef}>
        <div ref={tableInfoRef} className='hidden'>
          <h4>{userProfile?.ward.hospital.hosName}</h4>
          <span>
            {deviceLogs?.name ? deviceLogs?.name : '--'} | {deviceLogs?.sn}
          </span>
        </div>
        {ChartWrapper}
      </div>
      {submitLoading && <Loading />}
    </div>
  )
}

export default FullChartTms
