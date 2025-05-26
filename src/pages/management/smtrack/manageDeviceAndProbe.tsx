import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { useDispatch, useSelector } from 'react-redux'
import { setSearch } from '../../../redux/actions/utilsActions'
import { RootState } from '../../../redux/reducers/rootReducer'
import ManageProbe from './manageProbe'
import ManageDevice from './manageDevice'
import {
  RiBox3Fill,
  RiBox3Line,
  RiCodeSSlashFill,
  RiCodeSSlashLine,
  RiSensorFill,
  RiSensorLine
} from 'react-icons/ri'
import ManageFirmware from './manageFirmware'

const ManageDeviceAndProbe = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [tab, setTab] = useState(cookies.get('manageDeviceTab') ?? 1)
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { role } = tokenDecode || {}

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const manageMenu = useMemo(
    () => (
      <div className='flex items-center gap-2 border-b-2 border-base-content w-full mt-3'>
        <a
          className={`flex items-center text-sm md:text-base border border-b-0 px-2 py-[0.3rem] rounded-tl-md rounded-tr-md cursor-pointer ${
            tab === 1
              ? 'font-bold bg-primary border-primary text-primary-content'
              : 'font-medium border-base-content/70 text-base-content'
          }`}
          onClick={() => {
            cookies.set('manageDeviceTab', 1, cookieOptions)
            setTab(1)
          }}
        >
          {tab === 1 ? <RiBox3Fill size={24} /> : <RiBox3Line size={24} />}
          <span className='hidden md:block md:ml-2'>{t('subTabDevice')}</span>
        </a>
        {(role === 'SUPER' || role === 'SERVICE') && (
          <a
            className={`flex items-center text-sm md:text-base border border-b-0 px-2 py-[0.3rem] rounded-tl-md rounded-tr-md cursor-pointer ${
              tab === 2
                ? 'font-bold bg-primary border-primary text-primary-content'
                : 'font-medium border-base-content/70 text-base-content'
            }`}
            onClick={() => {
              cookies.set('manageDeviceTab', 2, cookieOptions)
              setTab(2)
            }}
          >
            {tab === 2 ? (
              <RiSensorFill size={24} />
            ) : (
              <RiSensorLine size={24} />
            )}
            <span className='hidden md:block md:ml-2'>{t('subTabProbe')}</span>
          </a>
        )}
        {role === 'SUPER' && (
          <a
            className={`flex items-center text-sm md:text-base border border-b-0 px-2 py-[0.3rem] rounded-tl-md rounded-tr-md cursor-pointer ${
              tab === 3
                ? 'font-bold bg-primary border-primary text-primary-content'
                : 'font-medium border-base-content/70 text-base-content'
            }`}
            onClick={() => {
              cookies.set('manageDeviceTab', 3, cookieOptions)
              setTab(3)
            }}
          >
            {tab === 3 ? (
              <RiCodeSSlashFill size={24} />
            ) : (
              <RiCodeSSlashLine size={24} />
            )}
            <span className='hidden md:block md:ml-2'>{t('firmWareVer')}</span>
          </a>
        )}
      </div>
    ),
    [tab, role, t]
  )

  return (
    <div>
      {manageMenu}
      <div className='mt-3'>
        {tab === 1 ? (
          <ManageDevice />
        ) : tab === 2 ? (
          <ManageProbe />
        ) : (
          <ManageFirmware />
        )}
      </div>
    </div>
  )
}

export default ManageDeviceAndProbe
