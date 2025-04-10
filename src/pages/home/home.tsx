import HospitalAndWard from '../../components/filter/hospitalAndWard'
import DataTableNoData from '../../components/skeleton/table/noData'
import axiosInstance from '../../constants/axios/axiosInstance'
import HomeCount from '../../components/pages/home/homeCount'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  setDeviceKey,
  setSearch,
  setSholdFetch,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import { DeviceCountType } from '../../types/smtrack/devices/deviceCount'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { RiLayoutGridLine, RiListUnordered } from 'react-icons/ri'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { useNavigate } from 'react-router-dom'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceResponseType } from '../../types/global/deviceResponseType'
import { DeviceType } from '../../types/smtrack/devices/deviceType'
import { columnData, subColumnData } from '../../components/pages/home/column'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'
import Loading from '../../components/skeleton/table/loading'
import HomeDeviceCard from '../../components/pages/home/homeDeviceCard'
import Adjustments from '../../components/adjustments/adjustments'
import { ProbeType } from '../../types/smtrack/probe/probeType'

const Home = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    globalSearch,
    userProfile,
    hosId,
    wardId,
    tokenDecode,
    socketData,
    shouldFetch
  } = useSelector((state: RootState) => state.utils)
  const {
    hospital,
    ward,
    searchRef,
    isFocused,
    setIsFocused,
    isCleared,
    setIsCleared
  } = useContext(GlobalContext) as GlobalContextType
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [devicesFiltered, setDevicesFiltered] = useState<DeviceType[]>([])
  const [countFilter, setCountFilter] = useState('')
  const [listAndGrid, setListandGrid] = useState(
    Number(localStorage.getItem('listGrid') ?? 1)
  )
  const [deviceConnect, setDeviceConnect] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState<number>(
    cookies.get('homeRowPerPage') ?? 10
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [probeData, setProbeData] = useState<ProbeType[]>([])
  const [serial, setSerial] = useState<string>('')
  const openAdjustModalRef = useRef<HTMLDialogElement>(null)
  const { role } = tokenDecode || {}
  const firstFetch = useRef<boolean>(false)
  const deviceFetchHistory = useRef<Record<string, number>>({})

  const fetchDeviceCount = useCallback(
    async (page: number, size = perPage) => {
      try {
        const response = await axiosInstance.get(
          `/dashboard/count?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDeviceCount(response.data.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          console.error(error.response?.data.message)
        } else {
          console.error(error)
        }
      }
    },
    [perPage, wardId]
  )

  const fetchDevices = useCallback(
    async (page: number, size = perPage, search?: string) => {
      try {
        if (!firstFetch.current) {
          setLoading(true)
        }
        const response = await axiosInstance.get<
          responseType<DeviceResponseType>
        >(
          `/devices/device?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}${search ? `&filter=${search}` : ''}`
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
    [perPage, wardId]
  )

  const changListAndGrid = (selected: number) => {
    localStorage.setItem('listGrid', String(selected))
    setListandGrid(selected)
  }

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    fetchDeviceCount(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDeviceCount(newPerPage)
    fetchDevices(page, newPerPage)
    cookies.set('homeRowPerPage', newPerPage, cookieOptions)
  }

  const handleRowClicked = (row: DeviceType) => {
    cookies.set('deviceKey', row.id, cookieOptions) // it's mean setSerial
    dispatch(setDeviceKey(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const handleFilterConnect = (status: string) => {
    if (deviceConnect === status) {
      setDeviceConnect('')
    } else {
      setDeviceConnect(status)
    }
  }

  useEffect(() => {
    const filter = devices?.filter(f => {
      const matchesConnection =
        deviceConnect === '' ||
        (deviceConnect === 'online' && f.online === true) ||
        (deviceConnect === 'offline' && f.online === false)

      return matchesConnection
    })

    setDevicesFiltered(filter)
  }, [devices, globalSearch, deviceConnect])

  useEffect(() => {
    const handleDeviceData = () => {
      if (socketData?.device && devices.length > 0) {
        const deviceName = socketData.device.toLowerCase()

        const matchedDevice = devices.find(f =>
          f.name?.toLowerCase().includes(deviceName)
        )

        if (matchedDevice) {
          const currentTime = Date.now()
          const lastFetchTime = deviceFetchHistory.current[deviceName] || 0

          if (currentTime - lastFetchTime >= 30000) {
            deviceFetchHistory.current[deviceName] = currentTime

            if (globalSearch !== '') {
              if (isFocused) return
              fetchDevices(currentPage, perPage, globalSearch)
              fetchDeviceCount(currentPage, perPage)
            } else {
              fetchDevices(currentPage, perPage)
              fetchDeviceCount(currentPage, perPage)
            }
          }
        }
      }
    }

    if (!firstFetch.current) {
      if (globalSearch !== '') {
        fetchDevices(currentPage, perPage, globalSearch)
        fetchDeviceCount(currentPage, perPage)
        firstFetch.current = true
      } else {
        fetchDevices(currentPage, perPage)
        fetchDeviceCount(currentPage, perPage)
        firstFetch.current = true
      }
    }

    if (socketData?.device) {
      handleDeviceData()
    }

    return () => {}
  }, [devices, socketData, currentPage, perPage, globalSearch, isFocused])

  const shouldFetchFunc = async () =>  {
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
    fetchDevices(1)
    fetchDeviceCount(1)
  }, [wardId])

  useEffect(() => {
    setInterval(() => {
      fetchDevices(currentPage, perPage, globalSearch)
      fetchDeviceCount(currentPage, perPage)
    }, 300000)
  }, [currentPage, perPage, globalSearch])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

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

  const openAdjustModal = (probe: ProbeType[], sn: string) => {
    setProbeData(probe)
    setSerial(sn)
    if (openAdjustModalRef.current) {
      openAdjustModalRef.current.showModal()
    }
  }

  const columns: TableColumn<DeviceType>[] = useMemo(
    () => columnData(t, handleRowClicked, openAdjustModal),
    [t, navigate]
  )

  const subColumns: TableColumn<ProbeType>[] = useMemo(
    () => subColumnData(t, devicesFiltered),
    [t, devicesFiltered]
  )

  const ExpandedComponent = ({ data }: { data: DeviceType }) => {
    const { probe } = data
    return (
      <div className='dataTableSubWrapper bg-base-100 rounded-btn duration-300 ease-linear'>
        <DataTable
          columns={subColumns}
          data={probe}
          noDataComponent={<DataTableNoData />}
          responsive
        />
      </div>
    )
  }

  return (
    <div className='p-3 px-[16px]'>
      <div className='grid grid-cols-1 md:grid-cols-2 content-between items-center gap-3 mt-[16px]'>
        <span className='font-medium text-[20px] w-full'>
          {t('showAllBox')}
        </span>
        <div className='flex items-center justify-end w-full'>
          {role === 'SUPER' && (
            <div className='flex items-center gap-2 bg-base-300 p-2 px-3 rounded-btn w-max'>
              <span className='truncate max-w-[150px] md:max-w-[300px]'>
                {hospital?.filter(f => f.id?.includes(hosId))[0]?.hosName ??
                  userProfile?.ward?.hospital?.hosName}
              </span>
              <span>-</span>
              <span className='truncate max-w-[100px] md:max-w-[250px]'>
                {ward?.filter(w => w.id?.includes(wardId))[0]?.wardName ??
                  'ALL'}
              </span>
            </div>
          )}
        </div>
      </div>
      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />
      <div className='flex lg:items-center justify-between flex-col lg:flex-row gap-3 lg:gap-0 my-4'>
        <span className='font-medium text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-end lg:items-center gap-3 flex-col lg:flex-row lg:h-[40px]'>
          <div className='flex items-center gap-3'>
            <button
              className={`flex items-center justify-center !border-base-content/70 btn w-max h-[36px] min-h-0 p-2 font-normal ${
                deviceConnect === 'online'
                  ? 'btn-primary bg-opacity-50 text-white !border-primary'
                  : 'btn-ghost border border-gray-500 text-gray-500'
              }`}
              onClick={() => handleFilterConnect('online')}
            >
              <div className={`w-[10px] h-[10px] ${deviceConnect === 'online' ? 'bg-base-content' : 'bg-green-500'} rounded-btn`}></div>
              <span
                className={`text-base-content font-medium`}
              >
                {t('deviceOnline')}
              </span>
            </button>
            <button
              className={`flex items-center justify-center !border-base-content/70 btn w-max h-[36px] min-h-0 p-2 font-normal ${
                deviceConnect === 'offline'
                  ? 'btn-primary bg-opacity-50 text-white !border-primary'
                  : 'btn-ghost border border-gray-500 text-gray-500'
              }`}
              onClick={() => handleFilterConnect('offline')}
            >
              <div className={`w-[10px] h-[10px] ${deviceConnect === 'offline' ? 'bg-base-content' : 'bg-red-500'} rounded-btn`}></div>
              <span
                className={`text-base-content font-medium`}
              >
                {t('deviceOffline')}
              </span>
            </button>
          </div>
          <div className='divider divider-horizontal mx-0 py-2 hidden lg:flex'></div>
          <HospitalAndWard />
          <div className='flex items-center gap-2'>
            <button
              className={`flex items-center justify-center btn ${
                listAndGrid === 1
                  ? 'btn-primary text-base-content'
                  : 'btn-ghost border-base-content text-base-content'
              } w-[36px] h-[36px] min-h-0 p-2 tooltip tooltip-top`}
              onClick={() => changListAndGrid(1)}
              data-tip={t('list')}
              name='List-view'
              aria-label={t('list')}
            >
              <RiListUnordered size={20} />
            </button>
            <button
              className={`flex items-center justify-center btn ${
                listAndGrid === 2
                  ? 'btn-primary text-base-content'
                  : 'btn-ghost border border-base-content text-base-content'
              } w-[36px] h-[36px] min-h-0 p-2 tooltip tooltip-top`}
              onClick={() => changListAndGrid(2)}
              data-tip={t('grid')}
              name='Grid-view'
              aria-label={t('grid')}
            >
              <RiLayoutGridLine size={20} />
            </button>
          </div>
        </div>
      </div>
      {listAndGrid === 1 ? (
        <div className='dataTableWrapper bg-base-100 rounded-btn p-3 duration-300 ease-linear'>
          <DataTable
            responsive
            fixedHeader
            pagination
            paginationServer
            pointerOnHover
            expandableRows
            columns={columns}
            data={devicesFiltered}
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
            paginationRowsPerPageOptions={[10, 25, 50]}
            className='md:!max-h-[calc(100dvh-490px)]'
          />
        </div>
      ) : (
        <HomeDeviceCard
          devicesFiltered={devicesFiltered}
          totalRows={totalRows}
          currentPage={currentPage}
          perPage={perPage}
          loading={loading}
          handlePerRowsChange={handlePerRowsChange}
          handlePageChange={handlePageChange}
          openAdjustModal={openAdjustModal}
        />
      )}

      <Adjustments
        openAdjustModalRef={openAdjustModalRef}
        serial={serial}
        probe={probeData}
        setProbeData={setProbeData}
        fetchDevices={fetchDevices}
      />
    </div>
  )
}

export default Home
