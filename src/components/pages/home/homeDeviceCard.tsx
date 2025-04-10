import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceType } from '../../../types/smtrack/devices/deviceType'
import DevicePagination from '../../pagination/devicePagination'
import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine,
  RiDashboardLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiSettings3Line,
  RiTempColdLine
} from 'react-icons/ri'
import Default from '../../../assets/images/default-pic.png'
import { ProbeType } from '../../../types/smtrack/probe/probeType'
import { DeviceLogType } from '../../../types/smtrack/logs/deviceLog'
import { TbPlug, TbPlugX } from 'react-icons/tb'
import { MdOutlineSdCard, MdOutlineSdCardAlert, MdOutlineWaterDrop } from 'react-icons/md'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { setDeviceKey } from '../../../redux/actions/utilsActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loading from '../../skeleton/table/loading'
import { getColor } from '../../../constants/utils/color'

interface DeviceCardProps {
  devicesFiltered: DeviceType[]
  handlePageChange: (page: number) => void
  handlePerRowsChange: (newPerPage: number, page: number) => Promise<void>
  loading: boolean
  openAdjustModal: (probe: ProbeType[], sn: string) => void
  perPage: number
  totalRows: number
  currentPage: number
}

const HomeDeviceCard = (props: DeviceCardProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    devicesFiltered,
    handlePageChange,
    handlePerRowsChange,
    loading,
    openAdjustModal,
    perPage,
    totalRows,
    currentPage
  } = props
  const [colors, setColors] = useState<string[]>([])

  const doorComponent = (probe: ProbeType[], log: DeviceLogType[]) => {
    return (
      <>
        {Array.from({ length: probe[0]?.doorQty || 1 }, (_, index) => {
          const doorKey = `door${index + 1}` as keyof DeviceLogType
          const doorLog = log[0]?.[doorKey]
          return (
            <div
              className={`border border-base-content/50 w-[32px] h-[32px] rounded-btn flex items-center justify-center tooltip tooltip-top ${
                doorLog ? 'bg-red-500 text-white border-none' : ''
              }`}
              data-tip={`${t('deviceDoor')} ${index + 1}`}
              key={index}
            >
              {doorLog ? (
                <RiDoorOpenLine size={20} />
              ) : (
                <RiDoorClosedLine size={20} />
              )}
            </div>
          )
        })}
      </>
    )
  }

  const handleRowClicked = (row: DeviceType) => {
    cookies.set('deviceKey', row.id, cookieOptions) // it's mean setSerial
    dispatch(setDeviceKey(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (devicesFiltered.length > 0) {
      devicesFiltered.forEach((item, index) => {
        getColor(item.positionPic ?? Default, index, setColors)
      })
    }
  }, [devicesFiltered])

  const UserCard = useMemo(() => {
    if (loading)
      return (
        <div className='h-[calc(100dvh-420px)]'>
          <Loading />
        </div>
      )
    if (devicesFiltered?.length > 0) {
      return (
        <DevicePagination
          totalRows={totalRows}
          data={devicesFiltered}
          initialPerPage={perPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          itemPerPage={[10, 25, 50]}
          renderItem={(item, index) => {
            const bgColor = colors[index] || 'transparent'

            return (
              <div
                key={index}
                className='w-[350px] sm:w-[310px] lg:w-full h-[356px] bg-base-100 rounded-btn shadow-sm p-4 overflow-hidden'
              >
                <div className='flex items-start justify-between'>
                  <div className='relative w-28 h-28'>
                    <div className='avatar absolute z-20'>
                      <div className='w-28 rounded-btn'>
                        <img
                          src={item.positionPic ?? Default}
                          alt={`device-image-${item.id ?? 'dev_img'}`}
                        />
                      </div>
                    </div>
                    <div
                      className='blur-[128px] w-28 h-28 absolute opacity-75 z-10 duration-700 ease-linear'
                      style={{ backgroundColor: bgColor }}
                    ></div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <button
                        className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear tooltip tooltip-left'
                        data-tip={t('sideDashboard')}
                        onClick={() => handleRowClicked(item)}
                        name='to-dashboard'
                        aria-label={t('sideDashboard')}
                      >
                        <RiDashboardLine size={24} />
                      </button>
                      <button
                        className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear tooltip tooltip-left'
                        data-tip={t('adjustMents')}
                        onClick={() => openAdjustModal(item.probe, item.id)}
                        name='device-adjustments'
                        aria-label={t('adjustMents')}
                      >
                        <RiSettings3Line size={24} />
                      </button>
                    </div>
                    <div
                      className={`badge text-black font-medium border-none h-[30px] ${
                        item.online ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    >
                      {item.online ? t('deviceOnline') : t('deviceOffline')}
                    </div>
                  </div>
                </div>
                <div className='mt-3 truncate'>
                  <span className='text-[20px]'>{item.name ?? '—'}</span>
                </div>
                <div className='truncate'>
                  <span className='text-[14px]'>{item.id ?? '—'}</span>
                </div>
                <div className='truncate'>
                  <span className='text-[14px]'>{item.location ?? '—'}</span>
                </div>
                <div className='flex items-center gap-2 w-max mt-2'>
                  {doorComponent(item.probe, item.log)}
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <div
                    className='flex items-center justify-center gap-1 text-[14px] h-[32px] w-max px-2 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                    data-tip={t('devicTemperatureTb')}
                  >
                    {item.log[0]?.tempDisplay ? (
                      <>
                        <RiTempColdLine size={18} />
                        {item.log[0]?.tempDisplay} <sub>°C</sub>
                      </>
                    ) : (
                      <span>
                        — <sub>°C</sub>
                      </span>
                    )}
                  </div>
                  <div
                    className='flex items-center justify-center gap-1 text-[14px] h-[32px] w-max px-2 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                    data-tip={t('deviceHumiTb')}
                  >
                    {item.log[0]?.humidityDisplay ? (
                      <>
                        <MdOutlineWaterDrop size={18} />
                        {item.log[0]?.humidityDisplay} <sub>%</sub>
                      </>
                    ) : (
                      <span>
                        — <sub>%</sub>
                      </span>
                    )}
                  </div>
                  <div
                    className='flex items-center justify-center text-[14px] h-[32px] w-max px-2 min-w-[30px] border border-base-content/50 rounded-btn tooltip tooltip-top'
                    data-tip={t('deviceTime')}
                  >
                    {item.log[0]?.sendTime.substring(11, 16) ?? '—'}
                  </div>
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <div
                    className={`${
                      item.log[0]?.tempDisplay >= item.probe[0]?.tempMax ||
                      item.log[0]?.tempDisplay <= item.probe[0]?.tempMin
                        ? 'bg-red-500 border-red-500'
                        : ''
                    } flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-2 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                    data-tip={t('deviceProbe')}
                  >
                    {item.log[0] ? (
                      item.log[0]?.tempDisplay >= item.probe[0]?.tempMax ||
                      item.log[0]?.tempDisplay <= item.probe[0]?.tempMin ? (
                        <RiErrorWarningLine size={20} />
                      ) : (
                        <RiTempColdLine size={20} />
                      )
                    ) : (
                      '—'
                    )}
                  </div>
                  <div
                    className={`${
                      item.log[0] && !item.log[0]?.plug
                        ? 'bg-red-500 border-red-500'
                        : ''
                    } flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-2 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                    data-tip={t('devicePlug')}
                  >
                    {item.log[0] ? (
                      !item.log[0]?.plug ? (
                        <TbPlugX size={20} />
                      ) : (
                        <TbPlug size={20} />
                      )
                    ) : (
                      '—'
                    )}
                  </div>
                  <div
                    className={`${
                      item.log[0] && !item.log[0]?.extMemory
                        ? 'bg-red-500 border-red-500'
                        : ''
                    } flex items-center justify-center text-[14px] h-[32px] min-w-[30px] w-max px-2 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                    data-tip={t('dashSdCard')}
                  >
                    {item.log[0] ? (
                      !item.log[0]?.extMemory ? (
                        <MdOutlineSdCardAlert size={20} />
                      ) : (
                        <MdOutlineSdCard size={20} />
                      )
                    ) : (
                      '—'
                    )}
                  </div>
                  <div
                    className={`${
                      item.log[0]?.battery <= 20
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : item.log[0]?.battery === 0
                        ? 'bg-red-500 border-red-500 text-white'
                        : ''
                    } flex items-center justify-center gap-1 text-[14px] h-[32px] min-w-[30px] w-max px-2 border border-base-content/50 rounded-btn tooltip tooltip-top`}
                    data-tip={t('deviceBatteryTb')}
                  >
                    <div>
                      {item.log[0] ? (
                        item.log[0]?.plug ? (
                          <RiBatteryChargeLine size={20} />
                        ) : item.log[0]?.battery === 0 ? (
                          <RiBatteryLine size={20} />
                        ) : item.log[0]?.battery <= 50 ? (
                          <RiBatteryLowLine size={20} />
                        ) : item.log[0]?.battery <= 100 ? (
                          <RiBatteryFill size={20} />
                        ) : (
                          <RiAlertLine size={20} />
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <span>
                      {item.log[0] ? `${item.log[0]?.battery}` : '—'}
                      <sub> %</sub>
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
        />
      )
    } else {
      return (
        <div className='flex items-center justify-center loading-hieght-full'>
          <div>{t('nodata')}</div>
        </div>
      )
    }
  }, [devicesFiltered, t, loading, totalRows, perPage, currentPage, colors])

  return <div>{UserCard}</div>
}

export default HomeDeviceCard
