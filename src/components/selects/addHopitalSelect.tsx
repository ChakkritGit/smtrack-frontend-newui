import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useContext } from 'react'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import { Hospital, Option } from '../../types/global/hospitalAndWard'
import { setHosId } from '../../redux/actions/utilsActions'
import Select from 'react-select'

const AddHopitalSelect = () => {
  const dispatch = useDispatch()
  const { hosId } = useSelector((state: RootState) => state.utils)
  const { hospital } = useContext(GlobalContext) as GlobalContextType

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

  const getHospital = (hospitalID: string | undefined) => {
    if (hospitalID !== '') {
      dispatch(setHosId(String(hospitalID)))
    } else {
      dispatch(setHosId(''))
    }
  }

  return (
    <Select
      key={hosId}
      options={mapOptions<Hospital, keyof Hospital>(hospital, 'id', 'hosName')}
      value={mapDefaultValue<Hospital, keyof Hospital>(
        hospital,
        hosId ? hosId : '',
        'id',
        'hosName'
      )}
      onChange={e => getHospital(e?.value)}
      autoFocus={false}
      className='react-select-container custom-menu-select w-full z-20'
      classNamePrefix='react-select'
    />
  )
}

export default AddHopitalSelect
