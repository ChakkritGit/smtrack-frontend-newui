import { ConfigType } from '../../smtrack/configs/configType'

type DeviceTmsType = {
  adjTemp: number
  hospital: string
  id: string
  log: TmsLogType[]
  maxTemp: number
  minTemp: number
  name: string
  record: number
  sn: string
  ward: string
  token: string
  hospitalName: string
  wardName: string
  serial: string
}

type TmsLogType = {
  createdAt: string
  date: string
  door: boolean
  id: string
  internet: boolean
  isAlert: boolean
  mcuId: string
  message?: string
  plugin: boolean
  probe: string
  realValue: number
  tempValue: number
  time: string
  updatedAt: string
}

type CountTms = {
  door: number
  plug: number
  temp: number
}

type DeviceListTmsType = {
  hospital: string
  id: string
  name: string
  sn: string
  serial: string
  ward: string
}

type DeviceLogTms = {
  adjTemp: number
  hospital: string
  hospitalName: string
  id: string
  maxTemp: number
  minTemp: number
  name: string
  record: number
  sn: string
  serial: string
  ward: string
  wardName: string
  log: DeviceLogsTms[]
}

type DeviceLogsTms = {
  createdAt: string
  date: string
  door: boolean
  id: string
  internet: boolean
  isAlert: boolean
  mcuId: string
  message?: string
  plugin: boolean
  probe: string
  realValue: number
  tempValue: number
  time: string
  updatedAt: string
}

type LogChartTms = {
  probe: string
  result: string
  sn: string
  serial: string
  table: number
  _field: string
  _measurement: string
  _start: string
  _stop: string
  _time: string
  _value: number
}

type AddDeviceForm = {
  id?: string
  hospital?: string
  hospitalName?: string
  ward?: string
  name?: string
  wardName?: string
  location?: string
  position?: string
  remark?: string
  tag?: string
  image?: File | null
  imagePreview?: string | null
  config?: ConfigType | null
  serial?: string
}

type NetworkFormInit = {
  wifi?: {
    ssid?: string
    password?: string
    macAddress?: string
    ip?: string
    subnet?: string
    gateway?: string
    dns?: string
  }
  lan?: {
    ip?: string
    subnet?: string
    gateway?: string
    dns?: string
  }
  sim?: {
    simSp?: string
  }
}

export type {
  CountTms,
  DeviceTmsType,
  DeviceListTmsType,
  DeviceLogTms,
  DeviceLogsTms,
  LogChartTms,
  AddDeviceForm,
  NetworkFormInit,
  TmsLogType
}
