import { WardType } from "../wards/wardType"

type HospitalType = {
  createAt: string
  hosAddress?: string
  hosLatitude?: string
  hosLongitude?: string
  hosName: string
  hosPic?: string
  hosSeq: number
  hosTel?: string
  id: string
  updateAt: string
  userContact?: string
  userTel?: string
  ward: WardType[]
}

export type { HospitalType }
