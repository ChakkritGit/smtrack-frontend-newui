import { useTranslation } from 'react-i18next'
import { LogChartTms } from '../../../../types/tms/devices/deviceType'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../../skeleton/table/noData'
import { useEffect, useMemo, useState } from 'react'
import Loading from '../../../skeleton/table/loading'

interface FullTablePropType {
  dataLog: LogChartTms[]
  tempMin: number
  tempMax: number
  isLoading: boolean
}

const FullTableTmsComponent = (props: FullTablePropType) => {
  const { t } = useTranslation()
  const { dataLog, isLoading } = props
  const [reverseArray, setReverseArray] = useState<LogChartTms[]>([])

  const columns: TableColumn<LogChartTms>[] = [
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
      cell: item => <span title={item.serial ?? '—'}>{item.serial ?? '—'}</span>,
      sortable: false,
      center: true
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
      name: t('deviceProbeTb'),
      cell: item => <span title={item.probe}>{item.probe}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item._value.toFixed(2) + '°C',
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
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 30, 50, 100]}
        className='md:!max-h-[calc(100dvh-300px)] lg:!max-h-[calc(100dvh-200px)] xl:!max-h-full !max-h-[calc(100dvh-420px)]'
      />
    ),
    [reverseArray, isLoading]
  )

  return (
    <div className='dataTableWrapper bg-base-100 rounded-field p-3 duration-300 ease-linear mt-5'>
      {table}
    </div>
  )
}

export default FullTableTmsComponent
