type NotificationType = {
  createAt: string
  detail: string
  id: string
  message: string
  serial: string
  status: boolean
  updateAt: string
  mcuId: string
  device: {
    hospital: string
    name: string
    ward: string
  }
  createdAt: string
}

type NotificationHistoryType = {
  _measurement: string
  _start: string
  _stop: string
  _time: string
  message: string
  sn: string
}

type NotificationTmsHistoryType = {
  _measurement: string
  _start: string
  _stop: string
  _time: string
  message: string
  probe: string
  result: string
  sn: string
  table: number
}

export type {
  NotificationType,
  NotificationHistoryType,
  NotificationTmsHistoryType
}
