import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import {
  setDeviceKey,
  setSearch,
  setSholdFetch,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { DeviceTmsType, TmsLogType } from '../../types/tms/devices/deviceType'
import { columnTms, subColumnData } from '../../components/pages/home/columnTms'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'

const HomeTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { wardId, globalSearch, shouldFetch, tokenDecode, hosId } = useSelector(
    (state: RootState) => state.utils
  )
  const { searchRef, isFocused, setIsFocused, isCleared, setIsCleared } =
    useContext(GlobalContext) as GlobalContextType
  const [devices, setDevices] = useState<DeviceTmsType[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(cookies.get('homeRowPerPageTms') ?? 10)
  const [currentPage, setCurrentPage] = useState(1)
    const firstFetch = useRef<boolean>(false)
  const { role } = tokenDecode || {}

  const fetchDevices = useCallback(
    async (
      checkPoint: string,
      page: number,
      size = perPage,
      search?: string
    ) => {
      try {
        console.log('checkPoint: ', checkPoint)
        setLoading(true)
        const response = await axiosInstance.get(
          `/legacy/device?${
            wardId ? `ward=${wardId}&` : hosId ? `ward=${hosId}&` : ''
          }page=${page}&perpage=${size} ${search ? `&filter=${search}` : ''}`
        )
        setDevices(response.data.data?.devices)
        setTotalRows(response.data.data?.total)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          console.error(error.message)
        } else {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    },
    [perPage, wardId, hosId]
  )

const handlePageChange = (page: number) => {
  setCurrentPage(page)
}

const handlePerRowsChange = async (newPerPage: number, page: number) => {
  setPerPage(newPerPage)
  setCurrentPage(page)
  cookies.set('homeRowPerPageTms', newPerPage, cookieOptions)
}

const handleRowClicked = (row: DeviceTmsType) => {
  cookies.set('deviceKey', row.sn, cookieOptions)
  dispatch(setDeviceKey(row.sn))
  navigate('/dashboard')
  window.scrollTo(0, 0)
}

useEffect(() => {
  const performFetch = async () => {
    if (firstFetch.current) return
    firstFetch.current = true

    const run = async () => {
      await fetchDevices('performFetch', currentPage, perPage, globalSearch)
    }

    await run()

    if (shouldFetch && globalSearch !== '') {
      await fetchDevices('shouldFetch', 1, perPage, globalSearch)
      dispatch(setSholdFetch())
    }
  }

  performFetch()
}, [shouldFetch, globalSearch, currentPage, perPage])

useEffect(() => {
  if (firstFetch.current) {
    if (hosId || wardId || hosId === '' || wardId === '') {
      fetchDevices('hosId, wardId', 1, perPage, globalSearch)
      setCurrentPage(1)
    }
  }
}, [hosId, wardId])

useEffect(() => {
  if (firstFetch.current && devices.length > 0) {
    fetchDevices('currentPage, perPage', currentPage, perPage, globalSearch)
  }
}, [currentPage, perPage])

useEffect(() => {
  const handleCk = (e: KeyboardEvent) => {
    if (globalSearch && e.key?.toLowerCase() === 'enter' && isFocused) {
      e.preventDefault()
      searchRef.current?.blur()
      setIsFocused(false)
      fetchDevices('keydown' ,currentPage, perPage, globalSearch)
    }
  }

  if (firstFetch.current) {
    window.addEventListener('keydown', handleCk)
  }

  return () => {
    window.removeEventListener('keydown', handleCk)
  }
}, [globalSearch, currentPage, perPage, isFocused])

useEffect(() => {
  if (firstFetch.current && isCleared) {
    fetchDevices('isCleared', currentPage, perPage)
    setIsCleared(false)
  }
}, [isCleared])


  const ExpandedComponent = ({ data }: { data: DeviceTmsType }) => {
    const { log } = data
    const filtered = Object.values(
      log.reduce<Record<string, TmsLogType>>((acc, item) => {
        if (!acc[item.mcuId] || acc[item.mcuId].updatedAt < item.updatedAt) {
          acc[item.mcuId] = item
        }
        return acc
      }, {})
    )

    return (
      <div className='dataTableSubWrapper bg-base-100 rounded-field duration-300 ease-linear'>
        <DataTable
          responsive
          columns={subColumns}
          data={filtered}
          noDataComponent={<DataTableNoData />}
        />
      </div>
    )
  }

  const columns: TableColumn<DeviceTmsType>[] = useMemo(
    () => columnTms(t, handleRowClicked, role),
    [t, navigate]
  )

  const subColumns: TableColumn<TmsLogType>[] = useMemo(
    () => subColumnData(t),
    [t, devices]
  )

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const dataTable = useMemo(
    () => (
      <DataTable
        responsive
        fixedHeader
        pagination
        paginationServer
        pointerOnHover
        expandableRows
        columns={columns}
        data={devices}
        paginationTotalRows={totalRows}
        paginationDefaultPage={currentPage}
        paginationPerPage={perPage}
        progressPending={loading}
        progressComponent={<Loading />}
        noDataComponent={<DataTableNoData />}
        expandableRowsComponent={ExpandedComponent}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={handleRowClicked}
        paginationRowsPerPageOptions={[10, 20, 40]}
        fixedHeaderScrollHeight='calc(100dvh - 300px)'
      />
    ),
    [devices, loading, totalRows, currentPage, perPage, columns, wardId]
  )

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex lg:items-center justify-between flex-col lg:flex-row gap-3 lg:gap-0 my-4'>
        <span className='font-medium text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-end lg:items-center gap-3 flex-col lg:flex-row lg:h-[40px]'>
          <HospitalAndWard />
        </div>
      </div>
      <div className='dataTableWrapper bg-base-100 rounded-field p-3 duration-300 ease-linear'>
        {dataTable}
      </div>
    </div>
  )
}

export default HomeTms
