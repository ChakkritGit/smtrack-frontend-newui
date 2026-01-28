import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DataTable, { TableColumn } from 'react-data-table-component'
import { AxiosError } from 'axios'

// Icons
import { RiCloseLine, RiLayoutGridLine, RiListUnordered } from 'react-icons/ri'

// Redux & Context
import { RootState } from '../../redux/reducers/rootReducer'
import {
  setDeviceKey,
  setSearch,
  setSholdFetch,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'

// Components
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import DataTableNoData from '../../components/skeleton/table/noData'
import Loading from '../../components/skeleton/table/loading'
import HomeCount from '../../components/pages/home/homeCount'
import HomeDeviceCard from '../../components/pages/home/homeDeviceCard'
import Adjustments from '../../components/adjustments/adjustments'

// Utils & Constants
import axiosInstance from '../../constants/axios/axiosInstance'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { columnData, subColumnData } from '../../components/pages/home/column'

// Types
import { DeviceCountType } from '../../types/smtrack/devices/deviceCount'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import {
  DeviceResponseType,
  DevicesOnlineType
} from '../../types/global/deviceResponseType'
import { DeviceType } from '../../types/smtrack/devices/deviceType'
import { ProbeType } from '../../types/smtrack/probe/probeType'

// --- Helper Function: Calculate Time Difference ---
const formatTimeDuration = (dateString: string, t: any) => {
  if (!dateString) return '—'
  const updateAt = new Date(dateString)
  const now = new Date()
  const diffInMilliseconds = now.getTime() - updateAt.getTime()

  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
  const hours = totalHours % 24
  const totalDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
  const days = totalDays % 30
  const months = Math.floor(totalDays / 30) % 12
  const years = Math.floor(totalDays / 365)

  if (years > 0)
    return `${years} ${t('year')} ${months} ${t('month')} ${days} ${t('day')}`
  if (months > 0) return `${months} ${t('month')} ${days} ${t('day')}`
  if (days > 0) return `${days} ${t('day')} ${hours} ${t('hour')}`
  if (hours > 0) return `${hours} ${t('hour')} ${minutes} ${t('minute')}`
  if (minutes > 0) return `${minutes} ${t('minute')}`
  return t('amoment')
}

const Home = () => {
  // Hooks
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Redux State
  const {
    globalSearch,
    userProfile,
    hosId,
    wardId,
    tokenDecode,
    socketData,
    ambientDisabled,
    shouldFetch,
    i18nInit
  } = useSelector((state: RootState) => state.utils)

  // Context
  const {
    hospital,
    ward,
    searchRef,
    isFocused,
    setIsFocused,
    isCleared,
    setIsCleared
  } = useContext(GlobalContext) as GlobalContextType

  const { role } = tokenDecode || {}

  // Local State
  const [deviceCount, setDeviceCount] = useState<DeviceCountType>()
  const [devices, setDevices] = useState<DeviceType[]>([])
  // Note: devicesFiltered removed from state, use useMemo instead
  const [countFilter, setCountFilter] = useState('')
  const [listAndGrid, setListandGrid] = useState<number>(
    Number(localStorage.getItem('listGrid') ?? 1)
  )

  // Filter States
  const [deviceConnect, setDeviceConnect] = useState<'online' | 'offline' | ''>(
    ''
  )
  const [onlineAll, setOnlineAll] = useState<1 | 2>(1) // 1 = Normal, 2 = Warranty/Online Tab? (Naming implies Tab switch)
  const [cancelOnline, setCanCelOnline] = useState(false)

  // Data States
  const [devicesOnline, setDevicesOnline] = useState<DevicesOnlineType[]>([])
  const [loading, setLoading] = useState(false)

  // Pagination
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState<number>(
    cookies.get('homeRowPerPage') ?? 10
  )
  const [currentPage, setCurrentPage] = useState(1)

  // Adjust Modal State
  const [probeData, setProbeData] = useState<ProbeType[]>([])
  const [serial, setSerial] = useState<string>('')
  const openAdjustModalRef = useRef<HTMLDialogElement>(null)

  // Refs for Fetch Logic
  const firstFetch = useRef<boolean>(false)
  const deviceFetchHistory = useRef<Record<string, number>>({})

  // --- API Actions ---

  const handleAxiosError = (error: unknown) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        dispatch(setTokenExpire(true))
      }
      console.error(error.message)
    } else {
      console.error(error)
    }
  }

  const fetchDeviceOnline = useCallback(
    async (targetHosId?: string) => {
      setLoading(true)
      try {
        const query = targetHosId ? `?hospital=${targetHosId}` : ''
        const response = await axiosInstance.get<
          responseType<DevicesOnlineType[]>
        >(`/devices/online${query}`)
        setDevicesOnline(response.data.data)
      } catch (error) {
        handleAxiosError(error)
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  const fetchDeviceCount = useCallback(
    async (page: number, size = perPage) => {
      try {
        const queryParams = new URLSearchParams()
        if (wardId) queryParams.append('ward', wardId)
        else if (hosId) queryParams.append('ward', hosId) // Logic เดิมดูแปลกๆ (hosId ใช้ key 'ward') แต่คงไว้ตามเดิม

        queryParams.append('page', page.toString())
        queryParams.append('perpage', size.toString())

        const response = await axiosInstance.get(
          `/dashboard/count?${queryParams.toString()}`
        )
        setDeviceCount(response.data.data)
      } catch (error) {
        handleAxiosError(error)
      }
    },
    [perPage, wardId, hosId, dispatch]
  )

  const fetchDevices = useCallback(
    async (page: number, size = perPage, search?: string) => {
      if (!firstFetch.current) setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (wardId) queryParams.append('ward', wardId)
        else if (hosId) queryParams.append('ward', hosId)

        queryParams.append('page', page.toString())
        queryParams.append('perpage', size.toString())
        if (search) queryParams.append('filter', search)

        const response = await axiosInstance.get<
          responseType<DeviceResponseType>
        >(`/devices/device?${queryParams.toString()}`)
        setDevices(response.data.data?.devices)
        setTotalRows(response.data.data?.total)
      } catch (error) {
        handleAxiosError(error)
      } finally {
        setLoading(false)
      }
    },
    [perPage, wardId, hosId, dispatch]
  )

  // --- Derived State (Memoized Filters) ---

  // 1. Devices Filtered (Main Table)
  const devicesFiltered = useMemo(() => {
    return devices?.filter(f => {
      if (deviceConnect === '') return true
      if (deviceConnect === 'online') return f.online === true
      if (deviceConnect === 'offline') return f.online === false
      return true
    })
  }, [devices, deviceConnect])

  // 2. Devices Online Filtered (Second Tab)
  const devicesOnlineFilter = useMemo(() => {
    if (onlineAll !== 2) return []
    const lowerSearch = globalSearch.toLowerCase()

    return devicesOnline.filter(
      f =>
        !lowerSearch || // If no search, return all
        f.name?.toLowerCase().includes(lowerSearch) ||
        f.hospitalName?.toLowerCase().includes(lowerSearch) ||
        f.wardName?.toLowerCase().includes(lowerSearch) ||
        f.id?.toLowerCase().includes(lowerSearch)
    )
  }, [devicesOnline, onlineAll, globalSearch])

  // --- Event Handlers ---

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    setCurrentPage(page)
    cookies.set('homeRowPerPage', newPerPage, cookieOptions)
  }

  const handleRowClicked = (row: { id: string }) => {
    cookies.set('deviceKey', row.id, cookieOptions)
    dispatch(setDeviceKey(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const changListAndGrid = (selected: number) => {
    localStorage.setItem('listGrid', String(selected))
    setListandGrid(selected)
  }

  const handleFilterConnect = (status: 'online' | 'offline') => {
    setDeviceConnect(prev => (prev === status ? '' : status))
  }

  const openAdjustModal = (probe: ProbeType[], sn: string) => {
    setProbeData(probe)
    setSerial(sn)
    openAdjustModalRef.current?.showModal()
  }

  // --- Effects ---

  // Initial Data Fetch & Socket Logic
  useEffect(() => {
    const shouldFetchFromSocket = () => {
      if (!socketData?.device || devices.length === 0) return false
      const deviceName = socketData.device.toLowerCase()
      // Check if device exists in current list
      const matched = devices.some(d =>
        d.name?.toLowerCase().includes(deviceName)
      )
      if (!matched) return false

      const now = Date.now()
      const lastFetched = deviceFetchHistory.current[deviceName] || 0
      // Throttle 30s
      if (now - lastFetched >= 30000) {
        deviceFetchHistory.current[deviceName] = now
        return true
      }
      return false
    }

    const performFetch = async () => {
      if (!firstFetch.current) {
        firstFetch.current = true
        // Initial Fetch
        await Promise.all([
          fetchDevices(currentPage, perPage),
          fetchDeviceCount(currentPage, perPage)
        ])
        return
      }

      // Socket Update Logic
      if (shouldFetchFromSocket()) {
        const searchParam =
          !isFocused && globalSearch !== '' ? globalSearch : undefined
        await Promise.all([
          fetchDevices(currentPage, perPage, searchParam),
          fetchDeviceCount(currentPage, perPage)
        ])
      }
    }

    // Redux Trigger Fetch
    if (shouldFetch && globalSearch !== '') {
      fetchDevices(1, perPage, globalSearch)
      fetchDeviceCount(1, perPage)
      dispatch(setSholdFetch()) // Reset
    }

    performFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData, globalSearch, isFocused, shouldFetch, currentPage, perPage])

  // Fetch when Hospital/Ward changes
  useEffect(() => {
    if (firstFetch.current) {
      fetchDevices(1, perPage, globalSearch)
      fetchDeviceCount(1, perPage)
      setCurrentPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hosId, wardId])

  // Fetch when Pagination changes (Handled by dep array in first effect, but specific explicit check here if needed)
  // Note: The logic in the original code for `useEffect [currentPage, perPage]` was slightly redundant with the socket one.
  // Simplified: The pagination components call `fetchDevices` indirectly via state change triggers if we rely on effects,
  // BUT standard practice with react-data-table-component is to fetch inside `onChangePage`.
  // Here we follow the pattern of "State Change -> Effect Fetch".
  useEffect(() => {
    if (firstFetch.current && devices.length > 0) {
      fetchDevices(currentPage, perPage, globalSearch)
      fetchDeviceCount(currentPage, perPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage])

  // Search Enter Key
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (globalSearch && e.key?.toLowerCase() === 'enter' && isFocused) {
        e.preventDefault()
        searchRef.current?.blur()
        setIsFocused(false)
        fetchDevices(currentPage, perPage, globalSearch)
      }
    }
    if (firstFetch.current) window.addEventListener('keydown', handleEnterKey)
    return () => window.removeEventListener('keydown', handleEnterKey)
  }, [
    globalSearch,
    currentPage,
    perPage,
    isFocused,
    fetchDevices,
    searchRef,
    setIsFocused
  ])

  // Clear Search
  useEffect(() => {
    if (firstFetch.current && isCleared) {
      fetchDevices(currentPage, perPage)
      setIsCleared(false)
    }
  }, [isCleared, currentPage, perPage, fetchDevices, setIsCleared])

  // Tab: Online All Fetch
  useEffect(() => {
    if (onlineAll === 2) {
      fetchDeviceOnline(hosId || undefined)
    }
  }, [onlineAll, hosId, fetchDeviceOnline])

  // Cleanup Search on Unmount
  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [dispatch])

  // --- Columns Definitions ---

  const columns: TableColumn<DeviceType>[] = useMemo(
    () => columnData(t, handleRowClicked, openAdjustModal, role),
    [t, role]
  )

  const devicesOnlineColumns: TableColumn<DevicesOnlineType>[] = useMemo(
    () => [
      {
        name: t('deviceSerialTb'),
        selector: i => i.id ?? '—',
        sortable: false,
        center: true
      },
      {
        name: t('deviceNameTb'),
        cell: item => (
          <div
            className='flex justify-center tooltip w-70'
            data-tip={item.name ?? '—'}
          >
            <div className='truncate max-w-37.5'>
              <span>{item.name ?? '—'}</span>
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('hosName'),
        cell: item => (
          <div
            className='flex justify-center tooltip w-70'
            data-tip={item.hospitalName ?? '—'}
          >
            <div className='truncate max-w-37.5'>
              <span>{item.hospitalName ?? '—'}</span>
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('wardName'),
        cell: item => (
          <div
            className='flex justify-center tooltip w-70'
            data-tip={item.wardName ?? '—'}
          >
            <div className='truncate max-w-37.5'>
              <span>{item.wardName ?? '—'}</span>
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('deviceTime'),
        cell: i => <span>{formatTimeDuration(i.updateAt, t)}</span>,
        sortable: false,
        center: true
      },
      {
        name: t('deviceConnectTb'),
        cell: () => (
          <div className='w-max h-6 px-2 text-black flex items-center justify-center rounded-field bg-red-400 duration-300 ease-linear'>
            {t('deviceOffline')}
          </div>
        ),
        sortable: false,
        center: true
      }
    ],
    [t]
  )

  const subColumns: TableColumn<ProbeType>[] = useMemo(
    () => subColumnData(t, devicesFiltered, role),
    [t, devicesFiltered, role]
  )

  const ExpandedComponent = ({ data }: { data: DeviceType }) => {
    return (
      <div className='dataTableSubWrapper bg-base-100 rounded-field duration-300 ease-linear'>
        <DataTable
          columns={subColumns}
          data={data.probe.sort(
            (a, b) => (Number(a.channel) || 0) - (Number(b.channel) || 0)
          )}
          noHeader
          noDataComponent={<DataTableNoData />}
          responsive
        />
      </div>
    )
  }

  // --- Render Helpers ---

  const renderBreadcrumb = () => {
    const isSpecialRole = [
      'SUPER',
      'SERVICE',
      'ADMIN',
      'LEGACY_ADMIN'
    ].includes(role || '')
    return (
      <div className='flex items-center gap-2 bg-base-300 p-2 px-3 rounded-field w-max'>
        {isSpecialRole && (
          <>
            <span className='truncate max-w-37.5 md:max-w-75'>
              {hospital?.find(f => f.id?.includes(hosId))?.hosName ??
                userProfile?.ward?.hospital?.hosName}
            </span>
            <span>-</span>
          </>
        )}
        <span className='truncate max-w-25 md:max-w-62.5'>
          {ward?.find(w => w.id?.includes(wardId))?.wardName ?? 'ALL'}
        </span>
      </div>
    )
  }

  const renderSuperAdminButtons = () => {
    if (!cancelOnline) {
      // Button to Open Menu (Offline state trigger)
      return (
        <button
          className='h-9 w-21 min-h-0 p-2 font-normal text-base-content btn btn-ghost max-w-47.5 flex items-center justify-center border border-base-content/70! px-1.5 duration-300'
          onClick={() => {
            setCanCelOnline(true)
            setDeviceConnect('offline')
            setOnlineAll(1)
          }}
        >
          <div
            className={`w-2.5 h-2.5 ${
              deviceConnect === 'offline' ? 'bg-primary-content' : 'bg-red-500'
            } rounded-field`}
          ></div>
          <span className='font-medium'>{t('deviceOffline')}</span>
        </button>
      )
    }

    // Opened Menu
    return (
      <div
        className={`flex items-center gap-1.5 h-9 min-[36px] ${
          i18nInit === 'th' ? 'w-47' : 'w-39.5'
        } bg-base-300/50 btn btn-ghost border border-base-content/70! px-1.5`}
      >
        {/* Offline Filter */}
        <div
          className={`${
            onlineAll === 1
              ? 'bg-primary text-primary-content border-0'
              : 'hover:opacity-85 hover:bg-neutral/10'
          } flex items-center justify-center btn btn-ghost gap-1.5 p-1 w-max h-6.75 px-2 border-0 cursor-pointer`}
          onClick={() => {
            setOnlineAll(1)
            setDeviceConnect('offline')
          }}
        >
          <div
            className={`w-2.5 h-2.5 ${
              deviceConnect === 'offline' ? 'bg-primary-content' : 'bg-red-500'
            } rounded-field`}
          ></div>
          <span className='font-medium text-sm'>{t('deviceOffline')}</span>
        </div>

        {/* Warranty Tab (Online All) */}
        <div
          className={`${
            onlineAll === 2
              ? 'bg-primary text-primary-content border-0'
              : 'hover:opacity-85 hover:bg-neutral/10'
          } flex items-center justify-center p-1 w-max h-6.75 btn btn-ghost px-2 border-0 cursor-pointer`}
          onClick={() => {
            setOnlineAll(2)
            setDeviceConnect('')
            fetchDeviceOnline(hosId)
          }}
        >
          <span className='font-medium text-sm'>{t('tabWarrantyAll')}</span>
        </div>

        {/* Close Button */}
        <div
          className='flex items-center justify-center bg-primary text-primary-content btn btn-ghost border-0 p-1 w-6.75 h-6.75 cursor-pointer hover:opacity-70'
          onClick={() => {
            setCanCelOnline(false)
            setDeviceConnect('')
            setOnlineAll(1)
          }}
        >
          <RiCloseLine size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className='p-3 px-4'>
      {/* Header Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 content-between items-center gap-3 mt-4'>
        <span className='font-medium text-[20px] w-full'>
          {t('showAllBox')}
        </span>
        <div className='flex items-center justify-end w-full'>
          {renderBreadcrumb()}
        </div>
      </div>

      <HomeCount
        deviceCount={deviceCount}
        countFilter={countFilter}
        setCountFilter={setCountFilter}
      />

      {/* Toolbar & Filters */}
      <div className='flex lg:items-center justify-between flex-col lg:flex-row gap-3 lg:gap-0 my-4'>
        <span className='font-medium text-[20px]'>{t('detailAllBox')}</span>
        <div className='flex items-end lg:items-center gap-3 flex-col lg:flex-row lg:h-10'>
          <div className='flex items-center gap-3'>
            {/* Online Button */}
            <button
              disabled={onlineAll === 2}
              className={`flex items-center justify-center border-base-content/70! btn w-max h-9 disabled:opacity-30 min-h-0 p-2 font-normal ${
                deviceConnect === 'online'
                  ? 'btn-primary bg-opacity-50 text-primary-content border-primary!'
                  : 'btn-ghost border border-base-content text-base-content'
              }`}
              onClick={() => {
                handleFilterConnect('online')
                setCanCelOnline(false)
                setOnlineAll(1)
              }}
            >
              <div
                className={`w-2.5 h-2.5 ${
                  deviceConnect === 'online'
                    ? 'bg-primary-content'
                    : 'bg-green-500'
                } rounded-field`}
              ></div>
              <span className='font-medium'>{t('deviceOnline')}</span>
            </button>

            {/* Offline Button Logic (Role Based) */}
            {role === 'SUPER' ? (
              renderSuperAdminButtons()
            ) : (
              <button
                disabled={onlineAll === 2}
                className={`flex items-center justify-center border-base-content/70! btn w-max h-9 min-h-0 p-2 font-normal disabled:opacity-30 ${
                  deviceConnect === 'offline'
                    ? 'btn-primary bg-opacity-50 text-primary-content border-primary!'
                    : 'btn-ghost border border-base-content text-base-content'
                }`}
                onClick={() => handleFilterConnect('offline')}
              >
                <div
                  className={`w-2.5 h-2.5 ${
                    deviceConnect === 'offline'
                      ? 'bg-primary-content'
                      : 'bg-red-500'
                  } rounded-field`}
                ></div>
                <span className='font-medium'>{t('deviceOffline')}</span>
              </button>
            )}
          </div>

          <div className='divider divider-horizontal mx-0 py-2 hidden lg:flex'></div>
          <HospitalAndWard />

          {/* View Toggle */}
          <div className='flex items-center gap-2'>
            <button
              disabled={onlineAll === 2}
              className={`flex items-center justify-center btn w-9 h-9 min-h-0 p-2 tooltip tooltip-top ${
                listAndGrid === 1
                  ? 'btn-primary text-primary-content pointer-events-none'
                  : 'btn-ghost border-base-content disabled:border-base-content/30 text-base-content disabled:text-base-content/30'
              }`}
              onClick={() => changListAndGrid(1)}
              data-tip={t('list')}
            >
              <RiListUnordered size={20} />
            </button>
            <button
              disabled={onlineAll === 2}
              className={`flex items-center justify-center btn w-9 h-9 min-h-0 p-2 tooltip tooltip-top ${
                listAndGrid === 2
                  ? 'btn-primary text-primary-content pointer-events-none'
                  : 'btn-ghost border-base-content disabled:border-base-content/30 text-base-content disabled:text-base-content/30'
              }`}
              onClick={() => changListAndGrid(2)}
              data-tip={t('grid')}
            >
              <RiLayoutGridLine size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {onlineAll === 2 ? (
        // --- Tab 2: Online/Warranty List ---
        <div className='dataTableWrapper bg-base-100 rounded-field p-3 duration-300 ease-linear'>
          <DataTable
            responsive
            fixedHeader
            pagination
            pointerOnHover
            columns={devicesOnlineColumns}
            data={devicesOnlineFilter}
            paginationTotalRows={
              devicesOnlineFilter.length > 0 ? devicesOnlineFilter.length : 10
            }
            paginationDefaultPage={1}
            paginationPerPage={10}
            progressPending={loading}
            progressComponent={<Loading />}
            noDataComponent={<DataTableNoData />}
            onRowClicked={handleRowClicked}
            paginationRowsPerPageOptions={[10, 25, 50, 75, 100]}
            className='md:max-h-[calc(100dvh-530px)]!'
          />
        </div>
      ) : listAndGrid === 1 ? (
        // --- Tab 1: List View ---
        <div className='dataTableWrapper bg-base-100 rounded-field p-3 duration-300 ease-linear'>
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
            className='md:max-h-[calc(100dvh-530px)]!'
          />
        </div>
      ) : (
        // --- Tab 1: Grid View ---
        <HomeDeviceCard
          devicesFiltered={devicesFiltered}
          totalRows={totalRows}
          currentPage={currentPage}
          perPage={perPage}
          loading={loading}
          ambientDisabled={ambientDisabled}
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
