import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'
import {
  RiAlertLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  // RiErrorWarningLine,
  RiPlugLine,
  RiTempColdLine
} from 'react-icons/ri'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'
import { tempOfDayTms } from '../../../../constants/utils/dashboardCardStatus'

type PropsType = {
  deviceData: DeviceLogTms | undefined
}

const CardStatusTms = (props: PropsType) => {
  const { t } = useTranslation()
  const { deviceData } = props

  return (
    <>
      <div className='bg-base-100 p-3 rounded-btn w-full h-[140px] overflow-hidden xl:col-span-6'>
        <div className='flex items-center gap-2 h-[30%]'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]`}
          >
            <RiTempColdLine size={20} />
          </div>
          <span>{t('dashProbe')}</span>
        </div>
        <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
          <div>
            <span>Temp: </span>
            <span>
              {deviceData?.log
                ? deviceData?.log[0]?.tempValue?.toFixed(2)
                : '—'}
            </span>
            <sub> °C</sub>
          </div>
        </div>
      </div>
      {/* <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && deviceData?.log[0]?.internet
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && deviceData?.log[0]?.internet ? (
              <RiSignalWifiOffLine size={20} />
            ) : (
              <RiSignalWifi1Line size={20} />
            )}
          </div>
          <span>{t('dashConnect')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && deviceData?.log[0]?.internet
              ? 'text-red-500'
              : ''
          }`}
        >
          {deviceData?.log
            ? deviceData?.log[0]?.internet
              ? t('stateDisconnect')
              : t('stateConnect')
            : '—'}
        </div>
      </div> */}
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-6'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && deviceData?.log[0]?.door
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && deviceData?.log[0]?.door ? (
              <RiDoorOpenLine size={20} />
            ) : (
              <RiDoorClosedLine size={20} />
            )}
          </div>
          <span>{t('dashDoor')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && deviceData?.log[0]?.door ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.log
            ? deviceData?.log[0]?.door
              ? t('doorOpen')
              : t('doorClose')
            : '—'}
        </div>
      </div>
      <div className='flex flex-col gap-2 p-3 bg-base-100 rounded-btn w-full h-[140px] xl:col-span-6'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px] ${
              deviceData?.log && !deviceData?.log[0]?.plugin
                ? 'text-base-content bg-opacity-80 bg-red-500'
                : ''
            }`}
          >
            {deviceData?.log && !deviceData?.log[0]?.plugin ? (
              <RiAlertLine size={20} />
            ) : (
              <RiPlugLine size={20} />
            )}
          </div>
          <span>{t('dashPlug')}</span>
        </div>
        <div
          className={`flex items-center justify-center text-[20px] font-bold h-full ${
            deviceData?.log && !deviceData?.log[0]?.plugin ? 'text-red-500' : ''
          }`}
        >
          {deviceData?.log
            ? !deviceData?.log[0]?.plugin
              ? t('stateProblem')
              : t('stateNormal')
            : '—'}
        </div>
      </div>
      <div className='bg-base-100 p-3 rounded-btn w-full h-[140px] overflow-hidden xl:col-span-6'>
        <div className='flex items-center gap-2 h-[30%]'>
          <div
            className={`flex items-center justify-center rounded-btn bg-base-300 w-[32px] h-[32px]`}
          >
            <HiOutlineArrowsUpDown size={20} />
          </div>
          <label
            htmlFor='span'
            className='tooltip tooltip-bottom'
            data-tip={t('dashTempofDay')}
          >
            <span className='truncate block max-w-[55px] lg:max-w-[200px]'>
              {t('dashTempofDay')}
            </span>
          </label>
        </div>
        <div className='flex flex-col items-center justify-center text-[18px] mt-1 font-bold h-[50%]'>
          <div>
            <span>↑ </span>
            <span>{tempOfDayTms(deviceData)?.max ?? '—'} °C</span>
          </div>
          <div>
            <span>↓</span>
            <span>{tempOfDayTms(deviceData)?.min ?? '—'} °C</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardStatusTms
