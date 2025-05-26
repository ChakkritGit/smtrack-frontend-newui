import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setSearch } from '../../../redux/actions/utilsActions'
import { useDispatch, useSelector } from 'react-redux'
import { cookieOptions, cookies } from '../../../constants/utils/utilsConstants'
import { RootState } from '../../../redux/reducers/rootReducer'
import ManageDevice from './manageDevice'
import ManageHospital from '../manageHospital'
import HistoryLog from '../../../components/historyLog/historyLog'
import {
  RiBox3Fill,
  RiBox3Line,
  RiFileHistoryFill,
  RiFileHistoryLine,
  RiHospitalFill,
  RiHospitalLine
} from 'react-icons/ri'

const ManagementTms = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const [tab, setTab] = useState(cookies.get('manageHospitalTab') ?? 1)
  const { role } = tokenDecode ?? {}

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  const manageMenu = useMemo(
    () => (
      <div className='flex items-center gap-2 border-b border-base-content w-full mt-3'>
        <a
          className={`flex items-center text-sm md:text-lg border border-b-0 p-2 rounded-tl-md rounded-tr-md cursor-pointer ${
            tab === 1
              ? 'font-bold bg-primary border-primary text-primary-content'
              : 'font-medium border-base-content/70 text-base-content'
          }`}
          onClick={() => {
            cookies.set('manageHospitalTab', 1, cookieOptions)
            setTab(1)
          }}
        >
          {tab === 1 ? <RiBox3Fill size={24} /> : <RiBox3Line size={24} />}
          <span className='hidden md:block md:ml-2'>
            {t('tabManageDevice')}
          </span>
        </a>
        {(role === 'SUPER' ||
          role === 'SERVICE' ||
          role === 'LEGACY_ADMIN') && (
          <>
            <a
              className={`flex items-center text-sm md:text-lg border border-b-0 p-2 rounded-tl-md rounded-tr-md cursor-pointer ${
                tab === 2
                  ? 'font-bold bg-primary border-primary text-primary-content'
                  : 'font-medium border-base-content/70 text-base-content'
              }`}
              onClick={() => {
                cookies.set('manageHospitalTab', 2, cookieOptions)
                setTab(2)
              }}
            >
              {tab === 2 ? (
                <RiHospitalFill size={24} />
              ) : (
                <RiHospitalLine size={24} />
              )}
              <span className='hidden md:block md:ml-2'>
                {t('tabManageHospitals')}
              </span>
            </a>
            <a
              className={`flex items-center text-sm md:text-lg border border-b-0 p-2 rounded-tl-md rounded-tr-md cursor-pointer ${
                tab === 3
                  ? 'font-bold bg-primary border-primary text-primary-content'
                  : 'font-medium border-base-content/70 text-base-content'
              }`}
              onClick={() => {
                cookies.set('manageHospitalTab', 3, cookieOptions)
                setTab(3)
              }}
            >
              {tab === 3 ? (
                <RiFileHistoryFill size={24} />
              ) : (
                <RiFileHistoryLine size={24} />
              )}
              <span className='hidden md:block md:ml-2'>
                {t('tabAdjustHistory')}
              </span>
            </a>
          </>
        )}
      </div>
    ),
    [tab, role, t]
  )

  return (
    <div className='p-3 px-[16px]'>
      {manageMenu}
      <div className='mt-3'>
        {tab === 1 ? (
          <ManageDevice />
        ) : tab === 2 ? (
          <ManageHospital />
        ) : (
          <HistoryLog />
        )}
      </div>
    </div>
  )
}

export default ManagementTms
