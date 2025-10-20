/* eslint-disable react-hooks/rules-of-hooks */
import { useTranslation } from 'react-i18next'
import { DeviceLogsType } from '../../../../types/smtrack/devices/deviceType'
import { RiSettings3Line } from 'react-icons/ri'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules'
import SwiperCore from 'swiper'
import DefaultPic from '../../../../assets/images/default-pic.png'
import Adjustments from '../../../adjustments/adjustments'
import { RefObject, useEffect, useRef, useState } from 'react'
import { ProbeType } from '../../../../types/smtrack/probe/probeType'
import { useSwiperSync } from '../../../../constants/utils/utilsConstants'
import { GlobalContextType } from '../../../../types/global/globalContext'
import { Swiper as SwiperType } from 'swiper/types'
import ImageModal from '../../../ui/imageModal'
import { getColor } from '../../../../constants/utils/color'
import { UserRole } from '../../../../types/global/users/usersType'

type PropsType = {
  deviceData: DeviceLogsType | undefined
  fetchDevices: () => Promise<void>
  swiperInfoRef: RefObject<SwiperType | null>
  isPause: boolean
  ambientDisabled: boolean
  role: UserRole | undefined
}

SwiperCore.use([Pagination])

const CardInFoComponent = (props: PropsType) => {
  const { t } = useTranslation()
  const {
    deviceData,
    fetchDevices,
    swiperInfoRef,
    isPause,
    ambientDisabled,
    role
  } = props
  const [serial, setSerial] = useState<string>('')
  const [probeData, setProbeData] = useState<ProbeType[]>([])
  const [colors, setColors] = useState<string[]>([])
  const openAdjustModalRef = useRef<HTMLDialogElement>(null)
  const { activeIndex, setActiveIndex } = useSwiperSync() as GlobalContextType
  const modalRef = useRef<HTMLDialogElement>(null)

  const openAdjustModal = (probe: ProbeType[], sn: string) => {
    setProbeData(probe)
    setSerial(sn)
    if (openAdjustModalRef.current) {
      openAdjustModalRef.current.showModal()
    }
  }

  useEffect(() => {
    if (swiperInfoRef.current) {
      swiperInfoRef.current.slideTo(activeIndex)

      if (!isPause) {
        swiperInfoRef.current.autoplay.start()
      } else {
        swiperInfoRef.current.autoplay.stop()
      }
    }
  }, [activeIndex, isPause, swiperInfoRef])

  useEffect(() => {
    if (!ambientDisabled) return

    if (deviceData) {
      getColor(deviceData?.positionPic ?? DefaultPic, 0, setColors)
    }
  }, [deviceData, ambientDisabled])

  return (
    <div className='p-5 h-full'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <p className='font-bold'>{t('deviceNameBox')} • </p>
            <p
              className='max-w-[150px] lg:max-w-[300px] block truncate text-left'
              style={{ direction: 'rtl' }}
              title={deviceData?.name ?? '—'}
            >
              {deviceData?.name ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <p className='font-bold'>{t('deviceSnBox')} • </p>
            <p
              className='max-w-[150px] lg:max-w-[300px] block truncate text-left'
              style={{ direction: 'rtl' }}
              title={deviceData?.id ?? '—'}
            >
              {deviceData?.id ?? '—'}
            </p>
          </div>
          <div className='truncate max-w-[450px]'>
            <span className='font-bold'>{t('hospitalsName')} • </span>
            <span>{deviceData?.hospitalName ?? '—'}</span>
          </div>
          <div className='truncate max-w-[450px]'>
            <span className='font-bold'>{t('wardsName')} • </span>
            <span>{deviceData?.wardName ?? '—'}</span>
          </div>
        </div>
        {(role === 'SUPER' ||
          role === 'SERVICE' ||
          role === 'ADMIN' ||
          role === 'LEGACY_ADMIN') && (
          <button
            aria-label={t('adjustMents')}
            className='btn btn-ghost flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear tooltip tooltip-left z-30'
            data-tip={t('adjustMents')}
            onClick={() =>
              openAdjustModal(
                deviceData?.probe as ProbeType[],
                deviceData?.id as string
              )
            }
          >
            <RiSettings3Line size={24} />
          </button>
        )}
      </div>
      <div className='flex justify-between flex-col lg:flex-row gap-3 mt-2 h-full'>
        <div
          className='flex justify-center items-center w-full h-56 md:h-52 lg:h-48 relative'
          onClick={() => modalRef.current?.showModal()}
        >
          <div className='avatar cursor-pointer hover:scale-95 duration-300 ease-linear absolute z-20'>
            <div className='w-56 h-56 md:w-52 md:h-52 lg:w-48 lg:h-48 rounded-field'>
              <img
                src={deviceData?.positionPic ?? DefaultPic}
                alt='Device-image'
              />
            </div>
          </div>
          {ambientDisabled && (
            <div
              className='blur-[128px] w-28 h-[85%] absolute opacity-75 z-10 duration-700 ease-linear'
              style={{ backgroundColor: colors[0] }}
            ></div>
          )}
        </div>
        <div className='w-full lg:w-[60%] lg:h-48 p-1'>
          <Swiper
            key={'adjustmentsSetting'}
            slidesPerView={'auto'}
            spaceBetween={100}
            centeredSlides={true}
            loop={deviceData?.probe && deviceData?.probe.length > 2}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              waitForTransition: false
            }}
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            onSwiper={swiper => (swiperInfoRef.current = swiper)}
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
            className='mySwiper'
          >
            {deviceData ? (
              deviceData?.probe?.map(item => {
                return (
                  <SwiperSlide key={item.id}>
                    <span className='badge badge-soft badge-primary bg-opacity-15 font-bold border mb-2'>
                      P{item.channel}
                    </span>
                    <div className='flex items-center gap-3'>
                      <p className='font-bold'>• {t('tempValueUnit')}:</p>
                      <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                        {item.tempMin ?? '—'} / {item.tempMax ?? '—'} °C
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <p className='font-bold'>• {t('humValueUnit')}:</p>
                      <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                        {item.humiMin ?? '—'} / {item.humiMax ?? '—'} %
                      </p>
                    </div>
                  </SwiperSlide>
                )
              })
            ) : (
              <SwiperSlide>
                <span className='badge badge-soft badge-secondary bg-opacity-15 font-bold border mb-2'>
                  P—
                </span>
                <div className='flex items-center gap-3'>
                  <p className='font-bold'>• {t('tempValueUnit')}:</p>
                  <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                    — / — °C
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <p className='font-bold'>• {t('humValueUnit')}:</p>
                  <p className='truncate max-w-[150px] lg:max-w-[300px]'>
                    — / — %
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>•</p>
            <p className='truncate max-w-[200px] lg:max-w-[300px]'>
              {deviceData?.location ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('ipAddress')}:</p>
            <p className='truncate max-w-[200px] lg:max-w-[300px]'>
              {deviceData?.config?.ip ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('macAddress')}:</p>
            <p className='truncate max-w-[200px] lg:max-w-[300px]'>
              {deviceData?.config?.mac ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('firmWareVer')}:</p>
            <p className='truncate max-w-[200px] lg:max-w-[300px]'>
              {deviceData?.firmware ?? '—'}
            </p>
          </div>
        </div>
      </div>

      <Adjustments
        openAdjustModalRef={openAdjustModalRef}
        serial={serial}
        probe={probeData}
        setProbeData={setProbeData}
        fetchDevices={fetchDevices}
      />

      <ImageModal modalRef={modalRef} deviceData={deviceData} />
    </div>
  )
}

export default CardInFoComponent
