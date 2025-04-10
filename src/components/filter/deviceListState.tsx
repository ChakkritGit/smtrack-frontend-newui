import Select from 'react-select'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { DeviceListType } from '../../types/smtrack/devices/deviceType'
import { Option } from '../../types/global/hospitalAndWard'
import { useDispatch } from 'react-redux'
import { setTokenExpire } from '../../redux/actions/utilsActions'

interface MoveDeviceProps {
  deviceId: string
  setDeviceId: Dispatch<SetStateAction<string>>
}

const DeviceListWithSetState = (props: MoveDeviceProps) => {
  const dispatch = useDispatch()
  const { deviceId, setDeviceId } = props
  const [deviceList, setDeviceList] = useState<DeviceListType[]>([])

  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<DeviceListType[]>>(
        '/devices/dashboard/device'
      )
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

  return (
    <Select
      key={deviceId}
      options={mapOptions<DeviceListType, keyof DeviceListType>(
        deviceList,
        'id',
        'name'
      )}
      value={mapDefaultValue<DeviceListType, keyof DeviceListType>(
        deviceList,
        deviceId,
        'id',
        'name'
      )}
      onChange={e => {
        setDeviceId(String(e?.value))
      }}
      autoFocus={false}
      className='react-select-container custom-device-select z-[76] min-w-full md:min-w-[315px]'
      classNamePrefix='react-select'
    />
  )
}

export default DeviceListWithSetState
