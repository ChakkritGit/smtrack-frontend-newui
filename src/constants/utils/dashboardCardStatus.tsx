import {
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine
} from 'react-icons/ri'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'
import { DeviceLogTms } from '../../types/tms/devices/deviceType'

const probeLimitIcon = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined,
  humiMin: number,
  humiMax: number,
  humiDisplay: number | undefined
) => {
  return (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax) ||
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  )
}

const tempLimit = (
  tempMin: number,
  tempMax: number,
  tempDisplay: number | undefined
) => {
  return (
    (tempDisplay && tempDisplay <= tempMin) ||
    (tempDisplay && tempDisplay >= tempMax)
  )
}

const humiLimit = (
  humiMin: number,
  humiMax: number,
  humiDisplay: number | undefined
) => {
  return (
    (humiDisplay && humiDisplay <= humiMin) ||
    (humiDisplay && humiDisplay >= humiMax)
  )
}

const doorOpen = (deviceData: DeviceLogsType | undefined) => {
  const logEntry = deviceData?.log?.[0]

  // หาค่า doorQty (ตรวจสอบให้แน่ใจว่าเป็น number หรือจะ cast เป็น Number() ก็ได้)
  const doorQty = deviceData?.probe?.find(item => item.doorQty)?.doorQty

  // ถ้าไม่มี log ไม่ต้องไปต่อ
  if (!logEntry) return undefined

  switch (doorQty) {
    case 1:
      // กรณีมี 1 ประตู: สนใจแค่ door1 เท่านั้น
      return logEntry.door1

    case 2:
      // กรณีมี 2 ประตู: สนใจแค่ door1 หรือ door2 (ถ้า door1 เปิด จะ return door1 ก่อน)
      return logEntry.door1 || logEntry.door2

    case 3:
      // กรณีมี 3 ประตู: เช็คทั้ง 3 บาน
      return logEntry.door1 || logEntry.door2 || logEntry.door3

    default:
      // กรณีไม่ระบุ doorQty หรือเป็น 0
      return undefined
  }
}

const unPlug = (deviceData: DeviceLogsType | undefined) => {
  if (deviceData?.log) {
    return deviceData?.log[0]?.plug
  }
}

const battertyLevel = (deviceData: DeviceLogsType | undefined) => {
  if (deviceData?.log) {
    const plugIn = deviceData?.log[0]?.plug
    const level = deviceData?.log[0]?.battery
    if (plugIn) {
      return <RiBatteryChargeLine size={20} />
    } else if (level === 0) {
      return <RiBatteryLine size={20} />
    } else if (level && level <= 50) {
      return <RiBatteryLowLine size={20} />
    } else if (level && level <= 100) {
      return <RiBatteryFill size={20} />
    } else {
      return <RiAlertLine size={20} />
    }
  }
}

const tempOfDay = (deviceData: DeviceLogsType | undefined, channel: string) => {
  const max =
    deviceData?.log?.length &&
    Number(
      Math.max(
        ...deviceData.log
          .filter(filter => filter.probe.includes(channel))
          .map(item => item.tempDisplay)
      )
    ).toFixed(2)
  const min =
    deviceData?.log?.length &&
    Number(
      Math.min(
        ...deviceData.log
          .filter(filter => filter.probe.includes(channel))
          .map(item => item.tempDisplay)
      )
    ).toFixed(2)

  return {
    min,
    max
  }
}

const tempOfDayTms = (deviceData: DeviceLogTms | undefined) => {
  if (deviceData?.log) {
    const max =
      deviceData?.log?.length &&
      Number(Math.max(...deviceData.log.map(item => item.tempValue))).toFixed(2)
    const min =
      deviceData?.log?.length &&
      Number(Math.min(...deviceData.log.map(item => item.tempValue))).toFixed(2)

    return {
      min,
      max
    }
  }
}

const sdCard = (deviceData: DeviceLogsType | undefined) => {
  if (deviceData?.log) {
    return deviceData?.log[0]?.extMemory
  }
}

export {
  probeLimitIcon,
  tempLimit,
  humiLimit,
  doorOpen,
  unPlug,
  battertyLevel,
  tempOfDay,
  sdCard,
  tempOfDayTms
}
