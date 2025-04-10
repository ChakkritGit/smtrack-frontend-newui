import { Option, Status } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { FormState } from '../../types/smtrack/users/usersType'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

interface StatusSelectPropsType {
  formData: FormState
  setFormData: Dispatch<SetStateAction<FormState>>
}

const StatusSelect = (props: StatusSelectPropsType) => {
  const { t } = useTranslation()
  const { formData, setFormData } = props

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

  const getStatus = (status: string | undefined) => {
    if (status !== '') {
      setFormData({ ...formData, status: status === 'true' })
    }
  }

  const statusData = [
    {
      key: 'true',
      value: t('userActive')
    },
    {
      key: 'false',
      value: t('userInactive')
    }
  ]

  return (
    <Select
      options={mapOptions<Status, keyof Status>(statusData, 'key', 'value')}
      value={mapDefaultValue<Status, keyof Status>(
        statusData,
        formData.status ? 'true' : 'false',
        'key',
        'value'
      )}
      onChange={e => getStatus(e?.value)}
      autoFocus={false}
      className='react-select-container w-full'
      classNamePrefix='react-select'
    />
  )
}

export default StatusSelect
