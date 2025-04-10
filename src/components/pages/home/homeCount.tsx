import { RiDoorClosedLine, RiFolderSettingsLine, RiPlugLine, RiSdCardMiniLine, RiShieldCheckLine, RiSignalWifi1Line, RiTempColdLine } from "react-icons/ri"
import { DeviceCountPropType } from "../../../types/smtrack/devices/deviceCount"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const HomeCount = (props: DeviceCountPropType) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { deviceCount, countFilter, setCountFilter } = props

  const card = [
    { name: t('countProbe'), count: deviceCount?.temp, time: t('countNormalUnit'), icon: <RiTempColdLine /> },
    { name: t('countDoor'), count: deviceCount?.door, time: t('countNormalUnit'), icon: <RiDoorClosedLine /> },
    { name: t('countConnect'), count: deviceCount?.internet, time: t('countNormalUnit'), icon: <RiSignalWifi1Line /> },
    { name: t('countPlug'), count: deviceCount?.plug, time: t('countNormalUnit'), icon: <RiPlugLine /> },
    { name: t('countSdCard'), count: deviceCount?.sdcard, time: t('countNormalUnit'), icon: <RiSdCardMiniLine /> },
    { name: t('countRepair'), count: deviceCount?.repairs, time: t('countDeviceUnit'), icon: <RiFolderSettingsLine /> },
    { name: t('countWarranty'), count: deviceCount?.warranties, time: t('countDeviceUnit'), icon: <RiShieldCheckLine /> }
  ]

  const changFilter = (selected: string) => {
    if (countFilter === selected) {
      setCountFilter('')
    } else if (selected === t('countRepair')) {
      navigate("/repair")
    } else if (selected === t('countWarranty')) {
      navigate("/warranty")
    }
    else {
      setCountFilter(selected)
    }
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 mt-4 p-4">
      {card.map((card, index) => (
        <div className={`card ${countFilter === card.name ? "bg-primary text-base-100" : "bg-base-100"} w-[145px] h-[125px] overflow-hidden shadow-xl hover:scale-105 duration-300 ease-linear cursor-pointer`} key={index} onClick={() => changFilter(card.name)}>
          <div className="card-body justify-between p-3">
            <h5 className="text-[12px]">{card.name}</h5>
            <span className={`text-[28px] text-center font-bold ${card.count || 0 > 0 ? "text-red-500" : ""}`}>{card.count ?? "—"}</span>
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px]">{card.time}</span>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomeCount