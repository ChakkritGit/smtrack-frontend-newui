import { DevicesType } from '../devices/deviceType'

type WarrantiesType = {
  id: string
  devName: string
  product: string
  model: string
  installDate: string
  customerName: string
  customerAddress: string
  saleDepartment: string
  invoice: string
  expire: string
  status: boolean
  createAt: string
  updateAt: string
  device: DevicesType
}

export type { WarrantiesType }
