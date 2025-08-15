import { TFunctionNonStrict } from 'i18next'
import {
  DeviceTmsType,
  TmsLogType
} from '../../../types/tms/devices/deviceType'
import { TableColumn } from 'react-data-table-component'
import { DoorKey } from '../../../types/global/doorQty'
import { RiDoorClosedLine, RiDoorOpenLine } from 'react-icons/ri'
import { UserRole } from '../../../types/global/users/usersType'

const columnTms = (
  t: TFunctionNonStrict<'translation', undefined>,
  handleRowClicked: (row: DeviceTmsType) => void,
  role: UserRole | undefined
): TableColumn<DeviceTmsType>[] => {
  return [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span
          className='tooltip'
          data-tip={item.serial ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          {item.serial ?? '—'}
        </span>
      ),
      sortable: false,
      center: true,
      width: '200px'
    },
    ...(role === 'SUPER'
      ? [
          {
            name: t('hosName'),
            cell: (item: DeviceTmsType) => (
              <div
                className='tooltip w-[280px]'
                data-tip={item.hospitalName ?? '—'}
                onClick={() => handleRowClicked(item)}
              >
                <div className='truncate max-w-[150px]'>
                  <span>{item.hospitalName ?? '—'}</span>
                </div>
              </div>
            ),
            sortable: false,
            width: '280px'
          }
        ]
      : []),
    ...(role === 'SUPER' || role === 'LEGACY_ADMIN' || role === 'ADMIN'
      ? [
          {
            name: t('wardName'),
            cell: (item: DeviceTmsType) => (
              <div
                className='tooltip w-[280px]'
                data-tip={item.wardName ?? '—'}
                onClick={() => handleRowClicked(item)}
              >
                <div className='truncate max-w-[150px]'>
                  <span>{item.wardName ?? '—'}</span>
                </div>
              </div>
            ),
            sortable: false,
            width: '280px'
          }
        ]
      : []),
    {
      name: t('deviceNameTb'),
      cell: (item: DeviceTmsType) => (
        <div
          className='tooltip w-[280px]'
          data-tip={item.name ?? '—'}
          onClick={() => handleRowClicked(item)}
        >
          <div className='truncate max-w-[150px]'>
            <span>{item.name ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      width: '280px'
    },
    {
      name: t('devicTemperatureTb'),
      selector: item =>
        item.log[0]?.tempValue ? `${item.log[0]?.tempValue.toFixed(2)}°C` : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = 1
        const doors: DoorKey[] = ['door1']

        return (
          <>
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
                  item.log[0]?.door
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300 ease-linear`}
              >
                {item.log[0]?.door ? (
                  <RiDoorOpenLine size={14} />
                ) : (
                  <RiDoorClosedLine size={14} />
                )}
              </div>
            ))}
          </>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      selector: item =>
        !item.log[0]?.plugin ? t('stateProblem') : t('stateNormal'),
      sortable: false,
      center: true
    }
  ]
}

const subColumnData = (
  t: TFunctionNonStrict<'translation', undefined>
): TableColumn<TmsLogType>[] => {
  return [
    {
      name: 'MCUID',
      selector: item => item.mcuId,
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      selector: item => item.probe,
      sortable: false,
      center: true
    },
    {
      name: t('devicTemperatureTb'),
      selector: item =>
        item.tempValue ? `${item.tempValue.toFixed(2)}°C` : '—',
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = 1
        const doors: DoorKey[] = ['door1']

        return (
          <>
            {doors.slice(0, doorCount).map(doorKey => (
              <div
                key={doorKey}
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
                  item?.door
                    ? 'bg-red-500 text-white'
                    : 'border border-primary text-primary'
                } duration-300 ease-linear`}
              >
                {item?.door ? (
                  <RiDoorOpenLine size={14} />
                ) : (
                  <RiDoorClosedLine size={14} />
                )}
              </div>
            ))}
          </>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      selector: item => (!item?.plugin ? t('stateProblem') : t('stateNormal')),
      sortable: false,
      center: true
    }
  ]
}

export { columnTms, subColumnData }
