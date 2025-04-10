import { Dispatch, SetStateAction } from 'react'
import { Option, Role } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { FormState } from '../../types/smtrack/users/usersType'
import { UserRole } from '../../types/global/users/usersType'
import { useTranslation } from 'react-i18next'

interface UserSelectRoleType {
  formData: FormState
  setFormData: Dispatch<SetStateAction<FormState>>
  roleToken: UserRole | undefined
}

const RoleSelect = (props: UserSelectRoleType) => {
  const { t } = useTranslation()
  const { formData, setFormData, roleToken } = props

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

  const getRole = (role: string | undefined) => {
    if (role !== '') {
      setFormData({ ...formData, role: String(role) as UserRole })
    } else {
      setFormData({ ...formData, role: '' as UserRole })
    }
  }

  const roleLevels: Record<UserRole, { key: UserRole; value: string }[]> = {
    [UserRole.SUPER]: [
      { key: UserRole.SUPER, value: t('levelSUPER') },
      { key: UserRole.SERVICE, value: t('levelSERVICE') },
      { key: UserRole.ADMIN, value: t('levelADMIN') },
      { key: UserRole.USER, value: t('levelUSER') },
      { key: UserRole.LEGACY_ADMIN, value: t('levelLEGACY_ADMIN') },
      { key: UserRole.LEGACY_USER, value: t('levelLEGACY_USER') },
      { key: UserRole.GUEST, value: t('levelGUEST') }
    ],
    [UserRole.SERVICE]: [
      { key: UserRole.SERVICE, value: t('levelSERVICE') },
      { key: UserRole.ADMIN, value: t('levelADMIN') },
      { key: UserRole.USER, value: t('levelUSER') }
    ],
    [UserRole.ADMIN]: [
      { key: UserRole.ADMIN, value: t('levelADMIN') },
      { key: UserRole.USER, value: t('levelUSER') }
    ],
    [UserRole.LEGACY_ADMIN]: [
      { key: UserRole.LEGACY_ADMIN, value: t('levelLEGACY_ADMIN') },
      { key: UserRole.LEGACY_USER, value: t('levelLEGACY_USER') }
    ],
    [UserRole.LEGACY_USER]: [
      { key: UserRole.LEGACY_USER, value: t('levelLEGACY_USER') }
    ],
    [UserRole.GUEST]: [{ key: UserRole.GUEST, value: t('levelGUEST') }],
    [UserRole.USER]: [{ key: UserRole.USER, value: t('levelUSER') }]
  }

  const RoleData =
    roleToken && roleLevels[roleToken as UserRole]
      ? roleLevels[roleToken as UserRole]
      : roleLevels[UserRole.LEGACY_USER]

  return (
    <Select
      options={mapOptions<Role, keyof Role>(RoleData, 'key', 'value')}
      value={mapDefaultValue<Role, keyof Role>(
        RoleData,
        formData.role ? formData.role : '',
        'key',
        'value'
      )}
      onChange={e => getRole(e?.value)}
      autoFocus={false}
      menuPlacement='top'
      className='react-select-container w-full custom-role-select'
      classNamePrefix='react-select'
    />
  )
}

export default RoleSelect
