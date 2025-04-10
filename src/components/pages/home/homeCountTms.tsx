import { useTranslation } from 'react-i18next'
import { RiDoorClosedLine, RiPlugLine, RiTempColdLine } from 'react-icons/ri'
import { CountTms } from '../../../types/tms/devices/deviceType'

interface DeviceCountPropType {
  deviceCount: CountTms | undefined
}

const HomeCountTms = (props: DeviceCountPropType) => {
  const { t } = useTranslation()
  const { deviceCount } = props

  const card = [
    {
      name: t('countProbe'),
      count: deviceCount?.temp,
      time: t('countNormalUnit'),
      icon: <RiTempColdLine />
    },
    {
      name: t('countDoor'),
      count: deviceCount?.door,
      time: t('countNormalUnit'),
      icon: <RiDoorClosedLine />
    },
    {
      name: t('countPlug'),
      count: deviceCount?.plug,
      time: t('countNormalUnit'),
      icon: <RiPlugLine />
    }
  ]

  return (
    <div className='flex items-center justify-center flex-wrap gap-4 mt-4 p-4'>
      {card.map((card, index) => (
        <div
          className={`card bg-base-100 w-[145px] h-[125px] overflow-hidden shadow-xl`}
          key={index}
        >
          <div className='card-body justify-between p-3'>
            <h5 className='text-[12px]'>{card.name}</h5>
            <span
              className={`text-[28px] text-center font-bold ${
                card.count || 0 > 0 ? 'text-red-500' : ''
              }`}
            >
              {card.count ?? '—'}
            </span>
            <div className='flex items-center justify-between w-full'>
              <span className='text-[12px]'>{card.time}</span>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomeCountTms
