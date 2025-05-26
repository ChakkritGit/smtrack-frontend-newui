import { Swiper, SwiperSlide } from 'swiper/react'
import ChartMini from './chartMini'
import { useTranslation } from 'react-i18next'
import { RiArrowRightUpLine } from 'react-icons/ri'
import { useEffect, useMemo, useRef } from 'react'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import { Swiper as SwiperType } from 'swiper/types'
import { DeviceLogsType } from '../../../../types/smtrack/devices/deviceType'
import { useNavigate } from 'react-router-dom'
import SwiperCore from 'swiper'
import { GlobalContextType } from '../../../../types/global/globalContext'
import { useSwiperSync } from '../../../../constants/utils/utilsConstants'

interface ChartSwiperWrapperProps {
  deviceLogs: DeviceLogsType | undefined
  isPause: boolean
}

SwiperCore.use([Pagination])

const ChartSwiperWrapper = (props: ChartSwiperWrapperProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceLogs, isPause } = props
  const swiperRef = useRef<SwiperType>(null)
  const { activeIndex, setActiveIndex } = useSwiperSync() as GlobalContextType

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(activeIndex)

      if (!isPause) {
        swiperRef.current.autoplay.start()
      } else {
        swiperRef.current.autoplay.stop()
      }
    }
  }, [activeIndex, isPause])

  const SwiperFragment = useMemo(() => {
    return (
      <Swiper
        key={'chartSwiper'}
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
        onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
        onSwiper={swiper => (swiperRef.current = swiper)}
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
        {deviceLogs ? (
          deviceLogs?.probe?.map(item => {
            const filterItem = deviceLogs.log.filter(itemTwo =>
              itemTwo.probe.includes(item.channel)
            )
            return (
              <SwiperSlide key={item.id}>
                <span className='badge badge-soft badge-secondary bg-opacity-15 font-bold border ml-3'>
                  P{item.channel}
                </span>
                <ChartMini
                  logData={filterItem.slice(0, 80)}
                  tempMin={item.tempMin}
                  tempMax={item.tempMax}
                />
              </SwiperSlide>
            )
          })
        ) : (
          <SwiperSlide>
            <span className='badge badge-soft badge-secondary bg-opacity-15 font-bold border ml-3'>
              P—
            </span>
            <div className='flex items-center justify-center h-full'>—</div>
          </SwiperSlide>
        )}
      </Swiper>
    )
  }, [deviceLogs, swiperRef, activeIndex, swiperRef, isPause])

  return (
    <div className='flex flex-col gap-3 bg-base-100 w-full h-full rounded-field p-3'>
      <div className='flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-[20px] font-bold'>{t('pageChart')}</span>
        </div>
        <button
          aria-label={t('fullChart')}
          className='btn btn-ghost border border-base-content/20 flex p-0 duration-300 ease-linear max-h-[34px] min-h-[34px] max-w-[34px] min-w-[34px] tooltip tooltip-left'
          data-tip={t('fullChart')}
          onClick={() =>
            navigate('/dashboard/chart', {
              state: { deviceLogs: deviceLogs }
            })
          }
        >
          <RiArrowRightUpLine size={20} />
        </button>
      </div>
      <div>{SwiperFragment}</div>
    </div>
  )
}

export default ChartSwiperWrapper
