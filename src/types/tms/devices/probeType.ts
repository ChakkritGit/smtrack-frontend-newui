type ProbeListFormType = {
  channel: string
  createAt?: string
  doorAlarmTime?: string
  doorQty: number
  doorSound: boolean
  firstDay: string
  firstTime: string
  humiAdj: number
  humiMax: number
  humiMin: number
  id: string
  muteAlarmDuration?: string
  muteDoorAlarmDuration?: string
  name?: string
  notiDelay: number
  notiMobile: boolean
  notiRepeat: number
  notiToNormal: boolean
  position?: string
  secondDay: string
  secondTime: string
  sn: string
  stampTime?: string
  tempAdj: number
  tempMax: number
  tempMin: number
  thirdDay: string
  thirdTime: string
  type?: string
  updateAt?: string
}

type ProbeListType = {
  channel: string
  createAt?: string
  doorAlarmTime?: string
  doorQty: number
  doorSound: boolean
  firstDay: string
  firstTime: string
  humiAdj: number
  humiMax: number
  humiMin: number
  id: string
  muteAlarmDuration?: string
  muteDoorAlarmDuration?: string
  name?: string
  notiDelay: number
  notiMobile: boolean
  notiRepeat: number
  notiToNormal: boolean
  position?: string
  secondDay: string
  secondTime: string
  sn: string
  stampTime?: string
  tempAdj: number
  tempMax: number
  tempMin: number
  thirdDay: string
  thirdTime: string
  type?: string
  updateAt?: string
  device?: {
    createAt: string
    deviceId: string
    firmware: string
    hospital: string
    hospitalName: string
    id: string
    installDate: string
    location: string
    log: []
    name: string
    online: boolean
    position: string
    positionPic: string
    remark?: string | null
    seq: number
    staticName: string
    status: boolean
    tag?: string |null
    token: string
    updateAt: string
    ward: string
    wardName: string
  }
}

type Schedule = {
  scheduleKey: string
  scheduleLabel: string
}

type ScheduleHour = {
  scheduleHourKey: string
  scheduleHourLabel: string
}

type ScheduleMinute = {
  scheduleMinuteKey: string
  scheduleMinuteLabel: string
}

export type { ProbeListType, Schedule, ScheduleHour, ScheduleMinute, ProbeListFormType }
