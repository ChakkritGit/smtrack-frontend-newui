import { Dispatch, SetStateAction, useContext } from 'react'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import { Hospital, Option } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { AddDeviceForm } from '../../types/tms/devices/deviceType'

interface HosSelectType {
  formData: AddDeviceForm
  hosIdforManageDev: string
  setFormData: Dispatch<SetStateAction<AddDeviceForm>>
  setHosIdforManageDev: Dispatch<SetStateAction<string>>
}

const HopitalSelect = (props: HosSelectType) => {
  const { hospital } = useContext(GlobalContext) as GlobalContextType
  const { formData, setFormData, hosIdforManageDev, setHosIdforManageDev } =
    props

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

  const getHospital = (
    hospitalID: string | undefined,
    hosName: string | undefined
  ) => {
    if (hospitalID !== '') {
      setHosIdforManageDev(String(hospitalID))
      setFormData({ ...formData, hospitalName: hosName })
    } else {
      setHosIdforManageDev('')
    }
  }

  return (
    <Select
      key={hosIdforManageDev}
      options={mapOptions<Hospital, keyof Hospital>(hospital, 'id', 'hosName')}
      value={mapDefaultValue<Hospital, keyof Hospital>(
        hospital,
        hosIdforManageDev ? hosIdforManageDev : '',
        'id',
        'hosName'
      )}
      onChange={e => getHospital(e?.value, e?.label)}
      autoFocus={false}
      className='react-select-container custom-menu-select w-full'
      classNamePrefix='react-select'
    />
  )
}

export default HopitalSelect
