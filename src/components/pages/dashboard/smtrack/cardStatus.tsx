import { useTranslation } from 'react-i18next'
import {
  RiAlertLine,
  RiCollageLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiFolderSettingsLine,
  RiPlugLine,
  RiShieldCheckLine,
  RiSignalWifi1Line,
  RiSignalWifiOffLine,
  RiTempColdLine
} from 'react-icons/ri'
import { MdOutlineSdCard, MdOutlineSdCardAlert } from 'react-icons/md'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCreative } from 'swiper/modules'
import { DeviceLogsType } from '../../../../types/smtrack/devices/deviceType'
import {
  battertyLevel,
  doorOpen,
  humiLimit,
  probeLimitIcon,
  sdCard,
  tempLimit,
  tempOfDay,
  unPlug
} from '../../../../constants/utils/dashboardCardStatus'
import SwiperCore from 'swiper'
import {
  calculateDate,
  useSwiperSync
} from '../../../../constants/utils/utilsConstants'
import { GlobalContextType } from '../../../../types/global/globalContext'
import { RefObject, useEffect } from 'react'
import { Swiper as SwiperType } from 'swiper/types'

type PropsType = {
  deviceData: DeviceLogsType | undefined
  swiperTempRef: RefObject<SwiperType | null>
  swiperTempOfDayRef: RefObject<SwiperType | null>
  isPause: boolean
}

SwiperCore.use([Pagination])

const CardStatus = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData, swiperTempRef, swiperTempOfDayRef, isPause } = props
  const { activeIndex, setActiveIndex } = useSwiperSync() as GlobalContextType

  useEffect(() => {
    if (swiperTempRef.current && swiperTempOfDayRef.current) {
      swiperTempRef.current.slideTo(activeIndex)
      swiperTempOfDayRef.current.slideTo(activeIndex)

      if (!isPause) {
        swiperTempRef.current.autoplay.start()
        swiperTempOfDayRef.current.autoplay.start()
      } else {
        swiperTempRef.current.autoplay.stop()
        swiperTempOfDayRef.current.autoplay.stop()
      }
    }
  }, [activeIndex, isPause])

  return (
    <>
      <div className='bg-base-100 rounded-btn w-full h-[155px] overflow-hidden'>
        <Swiper
          key={'tempAndHumi'}
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          loop={deviceData?.probe && deviceData?.probe.length > 2}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
            waitForTransition: false
          }}
          pagination={{
            dynamicBullets: true,
            clickable: true
          }}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          onSwiper={swiper => (swiperTempRef.current = swiper)}
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
          className='mySwiper h-full'
        >
          {deviceData ? (
            deviceData?.probe?.map(item => {
              const findItem = deviceData.log.find(itemTwo =>
                itemTwo.probe.includes(item.channel)
              )
              return (
                <SwiperSlide className='p-3 h-full bg-base-100' key={item.id}>
                  <div className='flex items-center gap-2 h-[30%]'>
                    <div
                      className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                        probeLimitIcon(
                          item.tempMin,
                          item.tempMax,
                          findItem?.tempDisplay,
                          item.humiMin,
                          item.humiMax,
                          findItem?.humidityDisplay
                        )
                          ? 'text-base-content bg-opacity-80 bg-red-500'
                          : ''
                      }`}
                    >
                      {probeLimitIcon(
                        item.tempMin,
                        item.tempMax,
                        findItem?.tempDisplay,
                        item.humiMin,
                        item.humiMax,
                        findItem?.humidityDisplay
                      ) ? (
                        <RiErrorWarningLine size={20} />
                      ) : (
                        <RiTempColdLine size={20} />
                      )}
                    </div>
                    <span>{t('dashProbe')}</span>
                    <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2'>
                      P{item.channel}
                    </span>
                  </div>
                  <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                    <div
                      className={
                        tempLimit(
                          item.tempMin,
                          item.tempMax,
                          findItem?.tempDisplay
                        )
                          ? 'text-red-500'
                          : ''
                      }
                    >
                      <span>Temp: </span>
                      <span>{findItem?.tempDisplay.toFixed(2) ?? '—'}</span>
                      <sub> °C</sub>
                    </div>
                    <div
                      className={
                        humiLimit(
                          item.humiMin,
                          item.humiMax,
                          findItem?.humidityDisplay
                        )
                          ? 'text-red-500'
                          : ''
                      }
                    >
                      <span>Humi: </span>
                      <span>{findItem?.humidityDisplay.toFixed(2) ?? '—'}</span>
                      <sub> %RH</sub>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })
          ) : (
            <SwiperSlide className='p-3 h-full bg-base-100'>
              <div className='flex items-center gap-2 h-[30%]'>
                <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
                  <RiTempColdLine size={20} />
                </div>
                <span>{t('dashProbe')}</span>
                <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2'>
                  P—
                </span>
              </div>
              <div className='flex items-center justify-center text-[18px] mt-1 font-bold h-[70%]'>
                —
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              !deviceData?.online
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {!deviceData?.online ? (
              <RiSignalWifiOffLine size={20} />
            ) : (
              <RiSignalWifi1Line size={20} />
            )}
          </div>
          <span>{t('dashConnect')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            !deviceData?.online ? 'text-red-500' : ''
          }`}
        >
          {!deviceData?.online ? t('stateDisconnect') : t('stateConnect')}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              doorOpen(deviceData)
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {doorOpen(deviceData) ? (
              <RiDoorOpenLine size={20} />
            ) : (
              <RiDoorClosedLine size={20} />
            )}
          </div>
          <span>{t('dashDoor')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            doorOpen(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.log && deviceData?.log?.length > 0
            ? doorOpen(deviceData)
              ? t('doorOpen')
              : t('doorClose')
            : '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              !unPlug(deviceData)
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {!unPlug(deviceData) ? (
              <RiAlertLine size={20} />
            ) : (
              <RiPlugLine size={20} />
            )}
          </div>
          <span>{t('dashPlug')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            !unPlug(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {!unPlug(deviceData) ? t('stateProblem') : t('stateNormal') ?? '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log
                ? deviceData?.log[0]?.battery <= 20
                  ? 'text-yellow-500 bg-opacity-80 bg-yellow-300'
                  : deviceData?.log[0]?.battery <= 0
                  ? 'text-base-content bg-opacity-80 bg-red-500'
                  : ''
                : ''
            }`}
          >
            {battertyLevel(deviceData)}
          </div>
          <span>{t('dashBattery')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log
              ? deviceData?.log[0]?.battery <= 20
                ? 'text-yellow-500'
                : deviceData?.log[0]?.battery <= 0
                ? 'text-red-500'
                : ''
              : ''
          }`}
        >
          {deviceData?.log && deviceData?.log[0]?.battery
            ? `${deviceData?.log[0]?.battery} %`
            : '—'}
        </div>
      </div>
      <div className='bg-base-100 rounded-btn w-full h-[155px] overflow-hidden'>
        <Swiper
          key={'tempOfDaya'}
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          loop={deviceData?.probe && deviceData?.probe.length > 2}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
            waitForTransition: false
          }}
          pagination={{
            dynamicBullets: true,
            clickable: true
          }}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          onSwiper={swiper => (swiperTempOfDayRef.current = swiper)}
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
          className='mySwiper h-full'
        >
          {deviceData ? (
            deviceData?.probe?.map(item => {
              const findItem = deviceData.log.find(itemTwo =>
                itemTwo.probe.includes(item.channel)
              )
              return (
                <SwiperSlide className='p-3 h-full bg-base-100' key={item.id}>
                  <div className='flex items-center gap-2 h-[30%]'>
                    <div
                      className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
                        probeLimitIcon(
                          item.tempMin,
                          item.tempMax,
                          findItem?.tempDisplay,
                          item.humiMin,
                          item.humiMax,
                          findItem?.humidityDisplay
                        )
                          ? 'text-base-content bg-opacity-80 bg-red-500'
                          : ''
                      }`}
                    >
                      <HiOutlineArrowsUpDown size={20} />
                    </div>
                    <label
                      htmlFor='span'
                      className='tooltip tooltip-bottom'
                      data-tip={t('dashTempofDay')}
                    >
                      <span className='truncate block max-w-[55px] lg:max-w-[70px]'>
                        {t('dashTempofDay')}
                      </span>
                    </label>
                    <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2'>
                      P{item.channel}
                    </span>
                  </div>
                  <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
                    <div>
                      <span>↑ </span>
                      <span>
                        {deviceData?.log
                          ? tempOfDay(deviceData, item.channel).max
                          : '—'}{' '}
                        °C
                      </span>
                    </div>
                    <div>
                      <span>↓</span>
                      <span>
                        {deviceData?.log
                          ? tempOfDay(deviceData, item.channel).min
                          : '—'}{' '}
                        °C
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })
          ) : (
            <SwiperSlide className='p-3 h-full bg-base-100'>
              <div className='flex items-center gap-2 h-[30%]'>
                <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
                  <HiOutlineArrowsUpDown size={20} />
                </div>
                <label
                  htmlFor='span'
                  className='tooltip tooltip-bottom'
                  data-tip={t('dashTempofDay')}
                >
                  <span className='truncate block max-w-[55px] lg:max-w-[70px]'>
                    {t('dashTempofDay')}
                  </span>
                </label>
                <span className='badge badge-primary bg-opacity-15 text-primary font-bold border-2'>
                  P—
                </span>
              </div>
              <div className='flex items-center justify-center text-[18px] mt-1 font-bold h-[70%]'>
                —
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              !sdCard(deviceData)
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {!sdCard(deviceData) ? (
              <MdOutlineSdCardAlert size={20} />
            ) : (
              <MdOutlineSdCard size={20} />
            )}
          </div>
          <span>{t('dashSdCard')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            !sdCard(deviceData) ? 'text-red-500' : ''
          }`}
        >
          {!sdCard(deviceData) ? t('stateProblem') : t('stateNormal') ?? '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiCollageLine size={20} />
          </div>
          <span>{t('dashProbeandDoor')}</span>
        </div>
        <div className='flex items-center justify-center gap-3 text-[20px] font-bold h-full'>
          <span>
            {deviceData
              ? [...new Set(deviceData?.probe?.map(item => item.channel))]
                  .length ?? '—'
              : '—'}
          </span>
          <div className='w-[3px] h-7 py-2 bg-primary rounded-btn'></div>
          <span>
            {deviceData?.probe?.find(item => item.doorQty)?.doorQty ?? '—'}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiShieldCheckLine size={20} />
          </div>
          <span>{t('dashWarranty')}</span>
        </div>
        <div className='flex items-center justify-center text-[18px] font-bold h-full'>
          {deviceData?.warranty ? (
            <span
              className={`${
                calculateDate(deviceData).daysRemaining <= 0
                  ? 'text-red-500'
                  : ''
              }`}
            >
              {deviceData?.warranty[0]?.expire
                ? calculateDate(deviceData).daysRemaining > 0
                  ? calculateDate(deviceData).years > 0
                    ? `${calculateDate(deviceData).years} ${t('year')} ${
                        calculateDate(deviceData).months
                      } ${t('month')} ${calculateDate(deviceData).days} ${t(
                        'day'
                      )}`
                    : calculateDate(deviceData).months > 0
                    ? `${calculateDate(deviceData).months} ${t('month')} ${
                        calculateDate(deviceData).days
                      } ${t('day')}`
                    : `${calculateDate(deviceData).days} ${t('day')}`
                  : t('tabWarrantyExpired')
                : t('notRegistered')}
            </span>
          ) : (
            <span>{t('notRegistered')}</span>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[155px]'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]'>
            <RiFolderSettingsLine size={20} />
          </div>
          <span>{t('dashRepair')}</span>
        </div>
        <div className='flex items-center justify-center text-[20px] font-bold h-full'>
          <span>{deviceData?.repair?.length ?? '—'}</span>
        </div>
      </div>
    </>
  )
}

export default CardStatus
