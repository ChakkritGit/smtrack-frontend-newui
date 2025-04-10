import { HospitalType } from '../hospitals/hospitalType'

type WardType = {
  id: string
  type: string
  updateAt: string
  wardName: string
  wardSeq: number
  createAt: string
  hosId: string
  hospital: HospitalType
}

export type { WardType }
