import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { AxiosError } from 'axios'
import axiosInstance from '../../../constants/axios/axiosInstance'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import Loading from '../../../components/skeleton/table/loading'
import { DeviceLogTms } from '../../../types/tms/devices/deviceType'
import CardInfoTms from '../../../components/pages/dashboard/tms/cardInfoTms'
import CardStatusTms from '../../../components/pages/dashboard/tms/cardStatusTms'
import ChartSwiperWrapperTms from '../../../components/pages/dashboard/tms/chartSwiperWrapperTms'
import DataTableWrapperTms from '../../../components/pages/dashboard/tms/dataTableWrapperTms'
import DeviceTmsList from '../../../components/filter/deviceListTms'
import { setSearch, setTokenExpire } from '../../../redux/actions/utilsActions'
import { useTranslation } from 'react-i18next'
import { RiCloseLargeLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const DashboardTms = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { deviceKey } = useSelector((state: RootState) => state.utils)
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogTms>()
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null)

  const fetchDeviceLogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get<responseType<DeviceLogTms>>(
        `/legacy/device/${deviceKey}`
      )
      setDeviceLogs(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }, [deviceKey])

  useEffect(() => {
    fetchDeviceLogs()
  }, [deviceKey])

  const CardInfoComponent = useMemo(() => {
    return <CardInfoTms deviceData={deviceLogs} />
  }, [deviceKey, deviceLogs])

  const CardStatusComponent = useMemo(() => {
    return <CardStatusTms deviceData={deviceLogs} />
  }, [deviceKey, deviceLogs])

  useEffect(() => {
    if (!deviceKey) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
    }
  }, [deviceKey])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  return (
    <div className='p-3 px-[16px]'>
      <dialog ref={modalRef} className='modal'>
        <div className='modal-box h-[500px]'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl mb-0'>{t('selectDeviceDrop')}</h2>
            <button
              type='button'
              className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear'
              onClick={() => navigate('/')}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>
          <DeviceTmsList />
        </div>
      </dialog>
      {deviceKey && (
        <>
          <div className='flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-[16px]'>
            <DeviceTmsList />
            <HospitalAndWard />
          </div>
          {loading ? (
            <div className='flex items-center justify-center h-[calc(100dvh-200px)]'>
              <Loading />
            </div>
          ) : (
            <>
              <div className='flex items-start gap-4 mt-4 flex-wrap lg:flex-wrap xl:flex-nowrap'>
                <div className='w-full xl:w-[35%] lg:h-[295px] bg-base-100 rounded-btn overflow-hidden'>
                  {CardInfoComponent}
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-12 gap-4 w-full xl:w-[65%]'>
                  {CardStatusComponent}
                </div>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 mt-4 gap-3'>
                <div className='w-full min-h-[385px]'>
                  <ChartSwiperWrapperTms deviceLogs={deviceLogs} />
                </div>
                <div className='w-full min-h-[385px]'>
                  <DataTableWrapperTms deviceLogs={deviceLogs} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default DashboardTms
