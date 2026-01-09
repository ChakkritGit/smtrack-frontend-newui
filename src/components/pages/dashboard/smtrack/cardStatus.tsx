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
  swiperDoorRef: RefObject<SwiperType | null>
  isPause: boolean
}

SwiperCore.use([Pagination])

const CardStatus = (props: PropsType) => {
  const { t } = useTranslation()
  const {
    deviceData,
    swiperTempRef,
    swiperTempOfDayRef,
    swiperDoorRef,
    isPause
  } = props
  const { activeIndex, setActiveIndex } = useSwiperSync() as GlobalContextType

  useEffect(() => {
    if (
      swiperTempRef.current &&
      swiperTempOfDayRef.current &&
      swiperDoorRef.current
    ) {
      // เช็คก่อน slideTo ป้องกัน Loop
      if (swiperTempRef.current.activeIndex !== activeIndex)
        swiperTempRef.current.slideTo(activeIndex)

      if (swiperTempOfDayRef.current.activeIndex !== activeIndex)
        swiperTempOfDayRef.current.slideTo(activeIndex)

      if (swiperDoorRef.current.activeIndex !== activeIndex)
        swiperDoorRef.current.slideTo(activeIndex)

      if (!isPause) {
        swiperTempRef.current.autoplay.start()
        swiperTempOfDayRef.current.autoplay.start()
        swiperDoorRef.current.autoplay.start()
      } else {
        swiperTempRef.current.autoplay.stop()
        swiperTempOfDayRef.current.autoplay.stop()
        swiperDoorRef.current.autoplay.stop()
      }
    }
  }, [activeIndex, isPause])

  return (
    <>
      <div className='bg-base-100 rounded-field w-full h-38.75 overflow-hidden shadow-sm shadow-neutral/05'>
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
          pagination={{ dynamicBullets: true, clickable: true }}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          onSwiper={swiper => (swiperTempRef.current = swiper)}
          roundLengths={true}
          effect={'creative'}
          creativeEffect={{
            prev: { shadow: false, translate: ['-120%', 0, -500] },
            next: { shadow: false, translate: ['120%', 0, -500] }
          }}
          modules={[Autoplay, Pagination, EffectCreative]}
          className=' h-full'
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
                      className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
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
                    <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
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
                <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
                  <RiTempColdLine size={20} />
                </div>
                <span>{t('dashProbe')}</span>
                <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
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

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
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

      {/* --- Door Swiper --- */}
      <div className='bg-base-100 rounded-field w-full h-38.75 overflow-hidden shadow-sm shadow-neutral/05'>
        <Swiper
          key={'doorSwiper'}
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          loop={deviceData?.probe && deviceData?.probe.length > 2}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
            waitForTransition: false
          }}
          pagination={{ dynamicBullets: true, clickable: true }}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          onSwiper={swiper => (swiperDoorRef.current = swiper)}
          roundLengths={true}
          effect={'creative'}
          creativeEffect={{
            prev: { shadow: false, translate: ['-120%', 0, -500] },
            next: { shadow: false, translate: ['120%', 0, -500] }
          }}
          modules={[Autoplay, Pagination, EffectCreative]}
          className=' h-full'
        >
          {deviceData ? (
            deviceData?.probe?.map(item => {
              const isDoorOpen = doorOpen(deviceData)
              return (
                <SwiperSlide className='p-3 h-full bg-base-100' key={item.id}>
                  <div className='flex items-center gap-2 h-[30%]'>
                    <div
                      className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
                        isDoorOpen
                          ? 'text-base-content bg-opacity-80 bg-red-500'
                          : ''
                      }`}
                    >
                      {isDoorOpen ? (
                        <RiDoorOpenLine size={20} />
                      ) : (
                        <RiDoorClosedLine size={20} />
                      )}
                    </div>
                    <label
                      className='tooltip tooltip-bottom'
                      data-tip={t('dashDoor')}
                    >
                      <span className='truncate block max-w-13.75 lg:max-w-17.5'>
                        {t('dashDoor')}
                      </span>
                    </label>
                    <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
                      P{item.channel}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-center text-[20px] font-bold h-[70%] ${
                      isDoorOpen ? 'text-red-500' : ''
                    }`}
                  >
                    {deviceData?.log && deviceData?.log?.length > 0
                      ? isDoorOpen
                        ? t('doorOpen')
                        : t('doorClose')
                      : '—'}
                  </div>
                </SwiperSlide>
              )
            })
          ) : (
            <SwiperSlide className='p-3 h-full bg-base-100'>
              <div className='flex items-center gap-2 h-[30%]'>
                <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
                  <RiDoorClosedLine size={20} />
                </div>
                <span>{t('dashDoor')}</span>
                <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
                  P—
                </span>
              </div>
              <div className='flex items-center justify-center text-[20px] font-bold h-[70%]'>
                —
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      {/* --- End Door Swiper --- */}

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
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

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
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

      <div className='bg-base-100 rounded-field w-full h-38.75 overflow-hidden shadow-sm shadow-neutral/05'>
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
          pagination={{ dynamicBullets: true, clickable: true }}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          onSwiper={swiper => (swiperTempOfDayRef.current = swiper)}
          roundLengths={true}
          effect={'creative'}
          creativeEffect={{
            prev: { shadow: false, translate: ['-120%', 0, -500] },
            next: { shadow: false, translate: ['120%', 0, -500] }
          }}
          modules={[Autoplay, Pagination, EffectCreative]}
          className=' h-full'
        >
          {deviceData ? (
            deviceData?.probe?.map(item => {
              return (
                <SwiperSlide className='p-3 h-full bg-base-100' key={item.id}>
                  <div className='flex items-center gap-2 h-[30%]'>
                    <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
                      <HiOutlineArrowsUpDown size={20} />
                    </div>
                    <label
                      className='tooltip tooltip-bottom'
                      data-tip={t('dashTempofDay')}
                    >
                      <span className='truncate block max-w-13.75 lg:max-w-17.5'>
                        {t('dashTempofDay')}
                      </span>
                    </label>
                    <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
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
                <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
                  <HiOutlineArrowsUpDown size={20} />
                </div>
                <label
                  className='tooltip tooltip-bottom'
                  data-tip={t('dashTempofDay')}
                >
                  <span className='truncate block max-w-13.75 lg:max-w-17.5'>
                    {t('dashTempofDay')}
                  </span>
                </label>
                <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border'>
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

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-field bg-base-300 w-8 h-8 ${
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

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
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
          <div className='w-0.75 h-7 py-2 bg-primary rounded-field'></div>
          <span>
            {deviceData?.probe?.find(item => item.doorQty)?.doorQty ?? '—'}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
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

      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-field w-full h-38.75 shadow-sm shadow-neutral/05'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-field bg-base-300 w-8 h-8'>
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
