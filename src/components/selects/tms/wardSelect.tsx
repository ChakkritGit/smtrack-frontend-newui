import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { GlobalContextType } from '../../../types/global/globalContext'
import { GlobalContext } from '../../../contexts/globalContext'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { Option, Ward } from '../../../types/global/hospitalAndWard'
import { WardType } from '../../../types/smtrack/wards/wardType'
import Select from 'react-select'
import { AddDeviceForm } from '../../../types/tms/devices/deviceType'

interface WardSelectType {
  hosIdforManageDev: string
  formData: AddDeviceForm
  setFormData: Dispatch<SetStateAction<AddDeviceForm>>
}

const WardSelectTms = (props: WardSelectType) => {
  const { tmsMode, tokenDecode } = useSelector((state: RootState) => state.utils)
  const { formData, setFormData, hosIdforManageDev } = props
  const { ward } = useContext(GlobalContext) as GlobalContextType
  const [filterWard, setFilterWard] = useState<WardType[]>([])
  const { role } = tokenDecode || {}

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
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
      .filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  const getWard = (
    wardID: string | undefined,
    wardName: string | undefined
  ) => {
    if (wardID !== '') {
      setFormData({ ...formData, ward: wardID, wardName: wardName })
    }
  }

  useEffect(() => {
    const filteredWard = ward.filter(item =>
      hosIdforManageDev ? item?.hosId?.toLowerCase().includes(hosIdforManageDev?.toLowerCase()) : item
    )

    if (
      role === 'SUPER' ||
      role === 'SERVICE' ||
      role === 'ADMIN' ||
      role === 'USER' ||
      role === 'GUEST'
    ) {
      const filterNewSystem = filteredWard.filter(f =>
        !tmsMode ? f.type.includes('NEW') : f.type.includes('LEGACY')
      )
      setFilterWard(filterNewSystem)
    } else {
      const filterNewSystem = filteredWard.filter(f =>
        tmsMode ? f.type.includes('NEW') : f.type.includes('LEGACY')
      )
      setFilterWard(filterNewSystem)
    }
  }, [ward, hosIdforManageDev, role, tmsMode])

  return (
    <Select
      key={formData.ward}
      options={mapOptions<Ward, keyof Ward>(filterWard, 'id', 'wardName')}
      value={mapDefaultValue<Ward, keyof Ward>(
        filterWard,
        String(formData.ward),
        'id',
        'wardName'
      )}
      onChange={e => {
        getWard(e?.value, e?.label)
      }}
      autoFocus={false}
      className='react-select-container w-full'
      classNamePrefix='react-select'
    />
  )
}

export default WardSelectTms
