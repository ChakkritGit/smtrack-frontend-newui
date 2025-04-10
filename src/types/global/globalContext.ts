import { Dispatch, RefObject, SetStateAction } from 'react'
import { HospitalType } from '../smtrack/hospitals/hospitalType'
import { WardType } from '../smtrack/wards/wardType'

type GlobalContextType = {
  hospital: HospitalType[]
  ward: WardType[]
  setHospital: Dispatch<SetStateAction<HospitalType[]>>
  setWard: Dispatch<SetStateAction<WardType[]>>
  fetchHospital: () => Promise<void>
  fetchWard: () => Promise<void>
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  searchRef: RefObject<HTMLInputElement | null>
  isFocused: boolean
  setIsFocused: Dispatch<SetStateAction<boolean>>
  isCleared: boolean
  setIsCleared: Dispatch<SetStateAction<boolean>>
}

export type { GlobalContextType }
