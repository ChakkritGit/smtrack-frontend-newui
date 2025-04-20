import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'
import { RiArrowRightUpLine } from 'react-icons/ri'
import ChartMiniTms from './chartMiniTms'
import { useNavigate } from 'react-router-dom'
interface ChartSwiperWrapperProps {
  deviceLogs: DeviceLogTms | undefined
}

const ChartSwiperWrapperTms = (props: ChartSwiperWrapperProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceLogs } = props

  return (
    <div className='flex flex-col gap-3 bg-base-100 w-full h-full rounded-field p-3'>
      <div className='flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <span className='text-[20px] font-bold'>{t('pageChart')}</span>
        </div>
        <button
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
      <div className='h-full chart-h'>
        <ChartMiniTms
          deviceLogs={deviceLogs}
          minTemp={deviceLogs?.minTemp}
          maxTemp={deviceLogs?.maxTemp}
        />
      </div>
    </div>
  )
}

export default ChartSwiperWrapperTms
