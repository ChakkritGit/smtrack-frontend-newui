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
import { Option } from '../../types/global/hospitalAndWard'
import { useDispatch } from 'react-redux'
import { UsersType } from '../../types/smtrack/users/usersType'
import { setTokenExpire } from '../../redux/actions/utilsActions'

interface MoveDeviceProps {
  userId: string
  setUserId: Dispatch<SetStateAction<string>>
}

const UserListWithSetState = (props: MoveDeviceProps) => {
  const dispatch = useDispatch()
  const { userId, setUserId } = props
  const [users, setUsers] = useState<UsersType[]>([])

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<UsersType[]>>(
        '/auth/user'
      )
      setUsers(response.data.data)
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
    fetchUsers()
  }, [])

  const allUser = {
    display: 'ALL',
    id: '',
    pic: '',
    role: '',
    status: false,
    username: '',
    ward: {
      hosId: '',
      id: '',
      wardName: ''
    }
  }
  const updatedUsersData = [allUser, ...(Array.isArray(users) ? users : [])]

  return (
    <Select
      options={mapOptions<UsersType, keyof UsersType>(updatedUsersData, 'id', 'display')}
      value={mapDefaultValue<UsersType, keyof UsersType>(
        updatedUsersData,
        userId,
        'id',
        'display'
      )}
      onChange={e => {
        setUserId(String(e?.value))
      }}
      autoFocus={false}
      className='react-select-container custom-device-select z-[75] min-w-full md:min-w-[315px]'
      classNamePrefix='react-select'
    />
  )
}

export default UserListWithSetState
