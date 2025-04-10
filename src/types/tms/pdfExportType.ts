import { DeviceLog } from '../smtrack/devices/deviceType'

type pdftype = {
  title?: string
  image?: string
  chartIMG?: string
  devSn?: string
  devName?: string
  hospital?: string
  ward?: string
  dateTime?: string
  hosImg?: string
  deviceLogs: DeviceLog
}

export type { pdftype }
