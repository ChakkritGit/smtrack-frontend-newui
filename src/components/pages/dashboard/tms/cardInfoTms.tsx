import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'
import DefaultPic from '../../../../assets/images/default-pic.png'

type PropsType = {
  deviceData: DeviceLogTms | undefined
}

const CardInfoTms = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData } = props

  return (
    <div className='p-5 h-full'>
      <div className='flex justify-between flex-col lg:flex-row gap-3 mt-4 h-full'>
        <div className='flex justify-center items-center w-full lg:w-[35%] h-3/4'>
          <img
            src={DefaultPic}
            alt='Device-image'
            className='rounded-btn w-max h-[85%] object-contain cursor-pointer hover:scale-95 duration-300 ease-linear'
          />
        </div>

        <div className='w-full lg:w-[60%] h-3/4 p-1 leading-6'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <p className='font-bold'>{t('deviceNameBox')} • </p>
                <p
                  className='block truncate text-left max-w-[150px] lg:max-w-[300px]'
                  style={{ direction: 'rtl' }}
                  title={deviceData?.name ?? '—'}
                >
                  {deviceData?.name ?? '—'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-bold'>{t('deviceSnBox')} • </p>
                <p
                  className='truncate max-w-[150px] lg:max-w-[300px]'
                  title={deviceData?.sn ?? '—'}
                >
                  {deviceData?.sn ?? '—'}
                </p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{t('hospitalsName')}</span>
            <p className='font-bold'>•</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.hospitalName ?? '—'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <span className='font-medium'>{t('wardsName')}</span>
            <p className='font-bold'>•</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.wardName ?? '—'}
            </p>
          </div>
          {/* <div className='flex items-center gap-3'>
            <p className='font-bold'>• {t('tempValueUnit')}:</p>
            <p className='truncate max-w-[150px] lg:max-w-[300px]'>
              {deviceData?.minTemp ?? '—'} / {deviceData?.maxTemp ?? '—'} °C
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default CardInfoTms
