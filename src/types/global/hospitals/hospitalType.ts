type HospitalsType = {
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

type WardType = {
  createAt: string
  hosId: string
  id: string
  updateAt: string
  wardName: string
  wardSeq: number
  type: string
}

export type { HospitalsType, WardType }
