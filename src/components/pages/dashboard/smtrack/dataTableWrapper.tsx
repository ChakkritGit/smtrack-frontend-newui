import { useTranslation } from 'react-i18next'
import { RiArrowRightUpLine } from 'react-icons/ri'
import { useEffect, useMemo, useRef } from 'react'
import { Swiper as SwiperType } from 'swiper/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import DataTableMini from './dataTableMini'
import { DeviceLogsType } from '../../../../types/smtrack/devices/deviceType'
import { useNavigate } from 'react-router-dom'
import SwiperCore from 'swiper'
import { useSwiperSync } from '../../../../constants/utils/utilsConstants'
import { GlobalContextType } from '../../../../types/global/globalContext'

interface DataTableWrapperProps {
  deviceLogs: DeviceLogsType | undefined
  isPause: boolean
}

SwiperCore.use([Pagination])

const DataTableWrapper = (props: DataTableWrapperProps) => {
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

  const DataTableFragment = useMemo(() => {
    return (
      <Swiper
        key={'tableSwiper'}
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
                <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border ml-3'>
                  P{item.channel}
                </span>
                <DataTableMini logData={filterItem} />
              </SwiperSlide>
            )
          })
        ) : (
          <SwiperSlide>
            <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border ml-3'>
              P—
            </span>
            <div className='flex items-center justify-center h-full'>—</div>
          </SwiperSlide>
        )}
      </Swiper>
    )
  }, [deviceLogs, activeIndex, swiperRef, isPause])

  return (
    <div className='flex flex-col gap-3 bg-base-100 w-full h-full rounded-field p-3'>
      <div className='flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-[20px] font-bold'>{t('pageTable')}</span>
        </div>
        <button
          aria-label={t('fullTable')}
          className='btn btn-ghost border border-base-content/20 flex p-0 duration-300 ease-linear max-h-[34px] min-h-[34px] max-w-[34px] min-w-[34px] tooltip tooltip-left'
          data-tip={t('fullTable')}
          onClick={() =>
            navigate('/dashboard/table', {
              state: { deviceLogs: deviceLogs }
            })
          }
        >
          <RiArrowRightUpLine size={20} />
        </button>
      </div>
      <div>{DataTableFragment}</div>
    </div>
  )
}

export default DataTableWrapper
