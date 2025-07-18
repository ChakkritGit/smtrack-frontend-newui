import { useTranslation } from 'react-i18next'
import {
  DeviceLogsTms,
  DeviceLogTms
} from '../../../../types/tms/devices/deviceType'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/reducers/rootReducer'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../../skeleton/table/noData'

interface TableMiniProps {
  deviceLogs: DeviceLogTms | undefined
}

const DataTableMiniTms = (props: TableMiniProps) => {
  const { t } = useTranslation()
  const { globalSearch } = useSelector((state: RootState) => state.utils)
  const { deviceLogs } = props
  const [tableData, setTableData] = useState<DeviceLogsTms[]>([])
  const [reverseArray, setReverseArray] = useState<DeviceLogsTms[]>([])

  useEffect(() => {
    const filtered = deviceLogs?.log
      ? deviceLogs?.log.filter(
          item =>
            item.createdAt &&
            item.createdAt
              .substring(11, 16)
              .toLowerCase()
              .includes(globalSearch.toLowerCase())
        )
      : []

    setTableData(filtered)
  }, [globalSearch, deviceLogs])

  const columns: TableColumn<DeviceLogsTms>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{tableData.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <span title={item.mcuId}>...{item.mcuId.length > 10 ? item.mcuId.substring(15) : item.mcuId}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: item => item.createdAt.substring(11, 16),
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: item => <span title={item.mcuId}>{item.probe}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeTempSubTb'),
      cell: item => item.tempValue.toFixed(2) + '°C',
      sortable: false,
      center: true
    }
    // {
    //   name: t('deviceConnectTb'),
    //   cell: item => (item.internet ? t('deviceOffline') : t('deviceOnline')),
    //   sortable: false,
    //   center: true
    // }
  ]

  useEffect(() => {
    setReverseArray(
      [...tableData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
  }, [tableData])

  return (
    <div
      className={`dataTableWrapper mb-5`}
    >
      <DataTable
        dense
        pagination
        fixedHeader
        responsive={true}
        columns={columns}
        data={reverseArray}
        noDataComponent={<DataTableNoData />}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 30, 50, 100]}
        className='!max-h-[calc(100dvh-435px)]'
      />
    </div>
  )
}

export default DataTableMiniTms
