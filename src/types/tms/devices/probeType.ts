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

export type { ProbeListType, Schedule, ScheduleHour, ScheduleMinute }
