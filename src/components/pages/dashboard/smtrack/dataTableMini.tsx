import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeviceLogType } from '../../../../types/smtrack/logs/deviceLog'
import { RootState } from '../../../../redux/reducers/rootReducer'
import DataTableNoData from '../../../skeleton/table/noData'

interface TableMiniProps {
  logData: DeviceLogType[]
}

const DataTableMini = (props: TableMiniProps) => {
  const { t } = useTranslation()
  const { logData } = props
  const { globalSearch } = useSelector((state: RootState) => state.utils)
  const [tableData, setTableData] = useState<DeviceLogType[]>([])
  const [reverseArray, setReverseArray] = useState<DeviceLogType[]>([])

  useEffect(() => {
    const filtered = logData.filter(
      item =>
        item.sendTime &&
        item.sendTime
          .substring(11, 16)
          .toLowerCase()
          .includes(globalSearch.toLowerCase())
    )

    setTableData(filtered)
  }, [globalSearch, logData])

  const columns: TableColumn<DeviceLogType>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{logData.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span title={item.serial}>...{item.serial.substring(15)}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: item => item.sendTime.substring(11, 16),
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item.tempDisplay.toFixed(2) + '°C',
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: item => item.humidityDisplay.toFixed(2) + '%',
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: item => (!item.internet ? t('stateDisconnect') : t('stateConnect')),
      sortable: false,
      center: true
    }
  ]

  useEffect(() => {
    setReverseArray(
      [...tableData].sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )
    )
  }, [tableData])

  return (
    <div className='dataTableWrapper mb-5'>
      <DataTable
        dense
        pagination
        fixedHeader
        responsive={true}
        columns={columns}
        data={reverseArray}
        noDataComponent={<DataTableNoData />}
        paginationPerPage={12}
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        className='md:!max-h-[calc(100dvh-635px)] !max-h-[calc(100dvh-435px)]'
      />
    </div>
  )
}

export default DataTableMini
