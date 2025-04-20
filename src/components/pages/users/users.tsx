import { TFunction } from 'i18next'
import { UserRole } from '../../../types/global/users/usersType'

type RoleButtonProps = {
  role: UserRole | undefined
  userConnect: string
  handleFilterConnect: (status: string) => void
  t: TFunction
  disabled: boolean
}

const RoleButtons = (props: RoleButtonProps) => {
  const { userConnect, handleFilterConnect, role, t, disabled } = props

  const renderButton = (level: string) => {
    return (
      <button
        key={level}
        disabled={disabled}
        className={`flex items-center justify-center btn w-max h-[36px] min-h-0 p-2 font-normal ${
          userConnect === level
            ? 'btn-neutral text-white'
            : 'btn-ghost border border-base-content/50 text-base-content'
        }`}
        onClick={() => handleFilterConnect(level)}
      >
        <span>
          {t(`level${level.charAt(0).toUpperCase() + level.slice(1)}`)}
        </span>
      </button>
    )
  }

  return (
    <div className='flex items-center justify-start flex-wrap gap-3'>
      {/* LEGACY_ADMIN เห็นแค่ LEGACY_ADMIN และ LEGACY_USER */}
      {role === UserRole.LEGACY_ADMIN ? (
        <>
          {renderButton(UserRole.LEGACY_ADMIN)}
          {renderButton(UserRole.LEGACY_USER)}
        </>
      ) : (
        <>
          {/* SUPER เห็นทุก Role */}
          {role === UserRole.SUPER && (
            <>
              {renderButton(UserRole.SUPER)}
              {renderButton(UserRole.SERVICE)}
              {renderButton(UserRole.ADMIN)}
              {renderButton(UserRole.USER)}
              {renderButton(UserRole.LEGACY_ADMIN)}
              {renderButton(UserRole.LEGACY_USER)}
              {renderButton(UserRole.GUEST)}
            </>
          )}

          {/* SERVICE เห็น SERVICE ลงไปทั้งหมด (แต่ไม่เห็น GUEST) */}
          {role === UserRole.SERVICE && (
            <>
              {renderButton(UserRole.SERVICE)}
              {renderButton(UserRole.ADMIN)}
              {renderButton(UserRole.USER)}
              {renderButton(UserRole.LEGACY_ADMIN)}
              {renderButton(UserRole.LEGACY_USER)}
            </>
          )}

          {/* ADMIN เห็น ADMIN ลงไปทั้งหมด (แต่ไม่เห็น LEGACY_ADMIN, LEGACY_USER, GUEST) */}
          {role === UserRole.ADMIN && (
            <>
              {renderButton(UserRole.ADMIN)}
              {renderButton(UserRole.USER)}
            </>
          )}

          {/* USER เห็นแค่ USER */}
          {role === UserRole.USER && <>{renderButton(UserRole.USER)}</>}
        </>
      )}
    </div>
  )
}

export default RoleButtons
