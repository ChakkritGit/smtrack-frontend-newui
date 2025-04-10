import { DeviceType } from "../smtrack/devices/deviceType"

type DeviceResponseType = {
  devices: DeviceType[],
  total: number
}

export type { DeviceResponseType }