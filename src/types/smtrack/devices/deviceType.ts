import { ConfigType } from '../configs/configType'
import { ProbeType } from '../probe/probeType'
import { WarrantiesType } from '../warranties/warranties'

type DeviceLogType = {
  battery: number
  createAt: string
  door1: boolean
  door2: boolean
  door3: boolean
  extMemory: boolean
  humidity: number
  humidityDisplay: number
  id: string
  internet: boolean
  plug: boolean
  probe: string
  sendTime: string
  serial: string
  temp: number
  tempDisplay: number
  tempInternal: number
  updateAt: string
}

type DevicesType = {
  createAt: string
  firmware: string
  hospital: string
  hospitalName: string
  wardName: string
  id: string
  installDate: string
  location?: string
  name?: string
  online: boolean
  position?: string
  positionPic?: string
  remark?: string
  seq: number
  staticName: string
  status: boolean
  tag?: string
  token: string
  updateAt: string
  ward: string
}

interface DeviceType extends DevicesType {
  config: ConfigType
  probe: ProbeType[]
  log: DeviceLogType[]
  warranty: WarrantiesType[]
}

interface DeviceLogsType extends DevicesType {
  config: ConfigType
  probe: ProbeType[]
  log: DeviceLogType[]
  warranty: WarrantiesType[]
  repair: []
}

type DeviceListType = {
  id: string
  name: string
  ward: string
  sn?: string
  staticName: string
  hospital: string
  hospitalName: string
  location: string
  wardName: string
  firmware: string
}

interface DeviceLog extends DevicesType {
  config: ConfigType
  log: DeviceLogType[]
  probe: ProbeType[]
  repair: []
  warranty: WarrantiesType[]
}

type DeviceLogs = {
  _time: string
  battery: number
  door1: boolean
  door2: boolean
  door3: boolean
  extMemory: boolean
  humidity: number
  plug: boolean
  probe: string
  temp: number
  internet: boolean
}

type FirmwareListType = {
  fileName: string
  filePath: string
  fileSize: string
  createDate: string
}

export type {
  DevicesType,
  DeviceType,
  DeviceLogsType,
  DeviceListType,
  DeviceLog,
  DeviceLogs,
  FirmwareListType,
  DeviceLogType
}
