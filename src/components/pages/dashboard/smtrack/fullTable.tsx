import { useTranslation } from 'react-i18next'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../../skeleton/table/noData'
import {
  DeviceLog,
  DeviceLogs
} from '../../../../types/smtrack/devices/deviceType'
import Loading from '../../../skeleton/table/loading'
import { useEffect, useMemo, useState } from 'react'
import { DoorKey } from '../../../../types/global/doorQty'
import { RiDoorClosedLine, RiDoorOpenLine } from 'react-icons/ri'

interface FullTablePropType {
  dataLog: DeviceLogs[]
  deviceLogs: DeviceLog
  tempMin: number
  tempMax: number
  isLoading: boolean
}

const FullTableComponent = (props: FullTablePropType) => {
  const { t } = useTranslation()
  const { dataLog, deviceLogs, isLoading } = props
  const [reverseArray, setReverseArray] = useState<DeviceLogs[]>([])

  const columns: TableColumn<DeviceLogs>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{dataLog.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: () => <span title={deviceLogs.id}>{deviceLogs.id}</span>,
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceDate'),
      cell: items =>
        new Date(items._time).toLocaleString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          timeZone: 'UTC'
        }),
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: items =>
        new Date(items._time).toLocaleString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        }),
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item.temp.toFixed(2) + '°C',
      sortable: false,
      center: true
    },
    {
      name: t('deviceHumiTb'),
      cell: item => item.humidity.toFixed(2) + '%',
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      selector: items =>
        !items.internet ? t('stateDisconnect') : t('stateConnect'),
      sortable: false,
      center: true
    },
    {
      name: t('deviceSdCard'),
      cell: items => (
        <span>{!items.extMemory ? t('stateProblem') : t('stateNormal')}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceDoorTb'),
      cell: item => {
        const doorCount: number = deviceLogs.probe[0]?.doorQty || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return (
          <div className='flex items-center gap-2'>
            {doors.slice(0, doorCount).map(doorKey => {
              const isOpen = item[doorKey]

              return (
                <div
                  key={doorKey}
                  className={`w-[24px] h-[24px] flex items-center justify-center rounded-field ${
                    isOpen
                      ? 'bg-red-500 text-white'
                      : 'border border-primary text-primary'
                  } duration-300 ease-linear`}
                >
                  {isOpen ? (
                    <RiDoorOpenLine size={14} />
                  ) : (
                    <RiDoorClosedLine size={14} />
                  )}
                </div>
              )
            })}
          </div>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('devicePlugTb'),
      cell: items => (
        <span>{!items.plug ? t('stateProblem') : t('stateNormal')}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceBatteryTb'),
      cell: items => `${items.battery}%`,
      sortable: false,
      center: true
    }
  ]

  useEffect(() => {
    setReverseArray(
      [...dataLog].sort(
        (a, b) => new Date(b._time).getTime() - new Date(a._time).getTime()
      )
    )
  }, [dataLog])

  const table = useMemo(
    () => (
      <DataTable
        pagination
        fixedHeader
        responsive={true}
        progressPending={isLoading}
        columns={columns}
        data={reverseArray}
        noDataComponent={<DataTableNoData />}
        progressComponent={<Loading />}
        paginationPerPage={12}
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        className='md:!max-h-[calc(100dvh-300px)] lg:!max-h-[calc(100dvh-200px)] xl:!max-h-full !max-h-[calc(100dvh-420px)]'
      />
    ),
    [reverseArray, isLoading, columns]
  )

  return (
    <div className='dataTableWrapper bg-base-100 rounded-field p-3 duration-300 ease-linear mt-5'>
      {table}
    </div>
  )
}

export default FullTableComponent
