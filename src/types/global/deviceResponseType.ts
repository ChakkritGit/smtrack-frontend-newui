import { DeviceType } from '../smtrack/devices/deviceType'

type DeviceResponseType = {
  devices: DeviceType[]
  total: number
}

type DevicesOnlineType = {
  hospitalName: string
  id: string
  name: string
  updateAt: string
  wardName: string
}

export type { DeviceResponseType, DevicesOnlineType }
