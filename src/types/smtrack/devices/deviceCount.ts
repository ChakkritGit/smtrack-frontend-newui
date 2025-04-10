import { Dispatch, SetStateAction } from "react"

type DeviceCountType = {
  door: number,
  internet: number,
  plug: number,
  repairs: number,
  sdcard: number,
  temp: number,
  warranties: number
}

type DeviceCountPropType = {
  deviceCount: DeviceCountType | undefined,
  countFilter: string,
  setCountFilter: Dispatch<SetStateAction<string>>
}

export type { DeviceCountType, DeviceCountPropType }