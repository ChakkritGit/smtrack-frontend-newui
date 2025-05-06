import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
  const { role } = tokenDecode || {}

  const fetchDevices = useCallback(
    async (page: number, size = perPage, search?: string) => {
      try {
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
    fetchDevices(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDevices(page, newPerPage)
    cookies.set('homeRowPerPageTms', newPerPage, cookieOptions)
  }

  const handleRowClicked = (row: DeviceTmsType) => {
    cookies.set('deviceKey', row.sn, cookieOptions) // it's mean setSerial
    dispatch(setDeviceKey(row.sn))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    fetchDevices(1)
  }, [wardId, hosId])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const columns: TableColumn<DeviceTmsType>[] = useMemo(
    () => columnTms(t, handleRowClicked, role),
    [t, navigate]
  )

  const subColumns: TableColumn<TmsLogType>[] = useMemo(
    () => subColumnData(t),
    [t, devices]
  )

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

  const shouldFetchFunc = async () => {
    await fetchDevices(1, 10, globalSearch)
    dispatch(setSholdFetch())
  }

  useEffect(() => {
    if (globalSearch === '') return
    if (shouldFetch) {
      shouldFetchFunc()
    }
  }, [shouldFetch, globalSearch])

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (
        globalSearch !== '' &&
        e.key?.toLowerCase() === 'enter' &&
        isFocused
      ) {
        e.preventDefault()
        if (isFocused) {
          searchRef.current?.blur()
          setIsFocused(false)
        }
        fetchDevices(currentPage, perPage, globalSearch)
      }
    }

    window.addEventListener('keydown', handleCk)

    if (isCleared) {
      fetchDevices(currentPage, perPage)
      setIsCleared(false)
    }

    return () => {
      window.removeEventListener('keydown', handleCk)
    }
  }, [globalSearch, currentPage, perPage, isCleared, isFocused])

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
        fixedHeaderScrollHeight='calc(100dvh - 270px)'
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
