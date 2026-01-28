import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Option } from '../../types/global/hospitalAndWard'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { setDeviceKey, setTokenExpire } from '../../redux/actions/utilsActions'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { AxiosError } from 'axios'
import { DeviceListTmsType } from '../../types/tms/devices/deviceType'

const DeviceTmsList = () => {
  const dispatch = useDispatch()
  const { deviceKey, wardId } = useSelector((state: RootState) => state.utils)
  const [deviceList, setDeviceList] = useState<DeviceListTmsType[]>([])
  const [deviceListFilter, setDeviceListFilter] = useState<DeviceListTmsType[]>(
    []
  )

  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        responseType<DeviceListTmsType[]>
      >('/legacy/device/devices/list')
      setDeviceList(response.data.data)
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
  }, [])

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data?.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      ?.filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  useEffect(() => {
    fetchDeviceList()
  }, [])

  useEffect(() => {
    const filter = deviceList?.filter(item =>
      wardId ? item.ward?.toLowerCase().includes(wardId?.toLowerCase()) : item
    )
    setDeviceListFilter(filter)
  }, [deviceList, wardId])

  return (
    <Select
      options={mapOptions<DeviceListTmsType, keyof DeviceListTmsType>(
        deviceListFilter,
        'sn',
        'name'
      )}
      value={mapDefaultValue<DeviceListTmsType, keyof DeviceListTmsType>(
        deviceListFilter,
        deviceKey,
        'sn',
        'name'
      )}
      onChange={e => {
        cookies.set('deviceKey', String(e?.value), cookieOptions)
        dispatch(setDeviceKey(String(e?.value)))
      }}
      autoFocus={false}
      className='react-select-container custom-device-select z-[75] min-w-full md:min-w-[315px]'
      classNamePrefix='react-select'
    />
  )
}

export default DeviceTmsList
