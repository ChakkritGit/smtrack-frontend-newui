import { TFunctionNonStrict } from 'i18next'
import { DeviceType } from '../../../types/smtrack/devices/deviceType'
import { TableColumn } from 'react-data-table-component'
import {
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiSettings3Line,
  RiTempColdLine
} from 'react-icons/ri'
import { DoorKey } from '../../../types/global/doorQty'
import { calculateDate } from '../../../constants/utils/utilsConstants'
import { ProbeType } from '../../../types/smtrack/probe/probeType'

const columnData = (
  t: TFunctionNonStrict<'translation', undefined>,
  handleRowClicked: (row: DeviceType) => void,
  openAdjustModal: (probe: ProbeType[], sn: string) => void
): TableColumn<DeviceType>[] => {
  return [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span
          className='tooltip'
          data-tip={item.id}
          onClick={() => handleRowClicked(item)}
        >
          {item.id}
        </span>
      ),
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceNameTb'),
      cell: item => (
        <div
          className='flex justify-center tooltip w-[200px]'
          data-tip={item.name ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          <div className='truncate max-w-[150px]'>
            <span>{item.name ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceLocationTb'),
      cell: item => (
        <div
          className='flex justify-center tooltip w-[150px]'
          data-tip={item.location ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          <div className='truncate max-w-[130px]'>
            <span>{item.location ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '150px'
    },
    {
      name: t('devicTemperatureTb'),
      selector: item =>
        item.log[0]?.tempDisplay
          ? `${item.log[0]?.tempDisplay.toFixed(2)}°C`
          : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceHumiTb'),
      selector: item =>
        item.log[0]?.humidityDisplay
          ? `${item.log[0]?.humidityDisplay.toFixed(2)}%`
          : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: item => {
        const [temp] = item.log.filter(log => log.serial === item.id)
        const [probe] = item.probe.filter(probe => probe.sn === item.id)
        const isTempOutOfRange =
          temp?.tempDisplay >= probe?.tempMax ||
          temp?.tempDisplay <= probe?.tempMin

        return (
          <div
            className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
              isTempOutOfRange
                ? 'bg-red-500 text-white'
                : 'border border-primary text-primary'
            } duration-300 ease-linear`}
            onClick={() => handleRowClicked(item)}
          >
            {isTempOutOfRange ? (
              <RiErrorWarningLine size={14} />
            ) : (
              <RiTempColdLine size={14} />
            )}
          </div>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = item.probe[0]?.doorQty || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return (
          <div
            className='flex items-center gap-2'
            onClick={() => handleRowClicked(item)}
          >
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
                  item.log[0]?.[doorKey]
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300 ease-linear`}
              >
                {item.log[0]?.[doorKey] ? (
                  <RiDoorOpenLine size={14} />
                ) : (
                  <RiDoorClosedLine size={14} />
                )}
              </div>
            ))}
          </div>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: item => (
        <div
          className={`w-max h-[24px] px-2 text-black flex items-center justify-center rounded-field ${
            item.online ? 'bg-green-400' : 'bg-red-400'
          } duration-300 ease-linear`}
          onClick={() => handleRowClicked(item)}
        >
          {item.online ? t('deviceOnline') : t('deviceOffline')}
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      selector: item =>
        item.log[0]?.plug ? t('stateNormal') : t('stateProblem'),
      sortable: false,
      center: true
    },
    {
      name: t('deviceBatteryTb'),
      selector: item =>
        item.log[0]?.battery ? `${item.log[0].battery}%` : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceWarrantyTb'),
      cell: item => {
        return (
          <span
            className={`w-max max-w-[150px] h-[24px] px-2 flex items-center justify-center rounded-field ${
              calculateDate(item).daysRemaining <= 0
                ? 'bg-red-500 text-white'
                : ''
            } duration-300 ease-linear`}
            onClick={() => handleRowClicked(item)}
          >
            {item.warranty[0]?.expire
              ? calculateDate(item).daysRemaining > 0
                ? calculateDate(item).years > 0
                  ? `${calculateDate(item).years} ${t('year')} ${
                      calculateDate(item).months
                    } ${t('month')} ${calculateDate(item).days} ${t('day')}`
                  : calculateDate(item).months > 0
                  ? `${calculateDate(item).months} ${t('month')} ${
                      calculateDate(item).days
                    } ${t('day')}`
                  : `${calculateDate(item).days} ${t('day')}`
                : t('tabWarrantyExpired')
              : t('notRegistered')}
          </span>
        )
      },
      sortable: false,
      center: true,
      width: '140px'
    },
    {
      name: t('deviceActionTb'),
      cell: item => (
        <RiSettings3Line
          size={24}
          className='hover:fill-primary duration-300 ease-linear'
          onClick={() => openAdjustModal(item.probe, item.id)}
        />
      ),
      sortable: false,
      center: true
    }
  ]
}

const subColumnData = (
  t: TFunctionNonStrict<'translation', undefined>,
  devicesFiltered: DeviceType[]
): TableColumn<ProbeType>[] => {
  return [
    {
      name: t('probeChannelSubTb'),
      cell: (items, index) => <span key={index}>{items.channel}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('refrigeratorName'),
      cell: (items, index) => (
        <span key={index}>{items.name ?? 'Name is not assigned'}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('probeTypeSubTb'),
      cell: (items, index) => (
        <span key={index}>{items.type ?? 'Type is not assigned'}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('devicTemperatureTb'),
      cell: (items, index) => {
        const deviceLog = devicesFiltered
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        return (
          <span key={index}>
            {deviceLog?.tempDisplay
              ? `${deviceLog?.tempDisplay.toFixed(2)}°C`
              : '- -'}
          </span>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: (items, index) => {
        const deviceLog = devicesFiltered
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        return (
          <span key={index}>
            {deviceLog?.humidityDisplay
              ? `${deviceLog?.humidityDisplay.toFixed(2)}%`
              : '- -'}
          </span>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: (items, index) => {
        if (!devicesFiltered?.length) return null

        const logData = devicesFiltered[0]?.log ?? []
        const probeData = devicesFiltered[0]?.probe ?? []

        const [temp] = logData.filter(log => log.serial === items.sn)
        const [probe] = probeData.filter(probe => probe.sn === items.sn)

        const isTempOutOfRange =
          temp?.tempDisplay >= probe?.tempMax ||
          temp?.tempDisplay <= probe?.tempMin

        return (
          <div
            key={index}
            className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
              isTempOutOfRange
                ? 'bg-red-500 text-white'
                : 'border border-primary text-primary'
            } duration-300 ease-linear`}
          >
            {isTempOutOfRange ? (
              <RiErrorWarningLine size={14} />
            ) : (
              <RiTempColdLine size={14} />
            )}
          </div>
        )
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('probeDoorSubTb'),
      cell: items => {
        const deviceLog = devicesFiltered
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        const doorCount: number = items.doorQty || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return (
          <div className='flex items-center gap-2'>
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
                  deviceLog?.door1 || deviceLog?.door2 || deviceLog?.door3
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300 ease-linear`}
              >
                {deviceLog?.door1 || deviceLog?.door2 || deviceLog?.door3 ? (
                  <RiDoorOpenLine size={14} />
                ) : (
                  <RiDoorClosedLine size={14} />
                )}
              </div>
            ))}
          </div>
        )
      },
      sortable: false,
      center: true
    }
  ]
}

export { columnData, subColumnData }
