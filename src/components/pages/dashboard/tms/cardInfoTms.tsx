import { useTranslation } from "react-i18next";
import { DeviceLogTms } from "../../../../types/tms/devices/deviceType";
import DefaultPic from "../../../../assets/images/default-pic.png";
import { RiDoorClosedLine, RiDoorOpenLine } from "react-icons/ri";

type PropsType = {
  deviceData: DeviceLogTms | undefined;
};

const CardInfoTms = (props: PropsType) => {
  const { t } = useTranslation();
  const { deviceData } = props;

  // ดึงสถานะการเปิด/ปิดประตู
  const isDoorOpen = deviceData?.log ? deviceData.log[0]?.door : false;

  return (
    <div className="p-6 h-full flex flex-col justify-center items-center">
      <div className="flex justify-center items-start flex-col lg:flex-row gap-8 w-full">
        {/* ส่วนรูปภาพ */}
        <div className="flex justify-center items-center w-full lg:w-[40%]">
          <img
            src={DefaultPic}
            alt="Device-image"
            className="rounded-field w-25 lg:w-full max-w-30 object-contain cursor-pointer hover:scale-105 duration-300 ease-linear drop-shadow-sm"
          />
        </div>

        {/* ส่วนรายละเอียด */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4 text-base-content">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[100px_auto] sm:grid-cols-[120px_auto] gap-2 items-start">
              <span className="font-bold text-gray-500">
                {t("deviceNameBox", "ชื่อกล่อง")}
              </span>
              <span className="font-semibold wrap-break-word">
                : {deviceData?.name ?? "—"}
              </span>
            </div>

            <div className="grid grid-cols-[100px_auto] sm:grid-cols-[120px_auto] gap-2 items-start">
              <span className="font-bold text-gray-500">
                {t("deviceSnBox", "S/N")}
              </span>
              <span className="font-semibold wrap-break-word">
                : {deviceData?.serial ?? "—"}
              </span>
            </div>

            <div className="grid grid-cols-[100px_auto] sm:grid-cols-[120px_auto] gap-2 items-start">
              <span className="font-bold text-gray-500">
                {t("hospitalsName", "โรงพยาบาล")}
              </span>
              <span className="font-semibold wrap-break-word">
                : {deviceData?.hospitalName ?? "—"}
              </span>
            </div>

            <div className="grid grid-cols-[100px_auto] sm:grid-cols-[120px_auto] gap-2 items-start">
              <span className="font-bold text-gray-500">
                {t("wardsName", "วอร์ด")}
              </span>
              <span className="font-semibold wrap-break-word">
                : {deviceData?.wardName ?? "—"}
              </span>
            </div>
          </div>

          {/* ส่วนแสดงสถานะประตู */}
          <div className="mt-2 pt-4 border-t border-base-300">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center rounded-lg w-12 h-12 ${
                  isDoorOpen
                    ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                    : "bg-base-300 text-base-content"
                }`}
              >
                {isDoorOpen ? (
                  <RiDoorOpenLine size={26} />
                ) : (
                  <RiDoorClosedLine size={26} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-500 text-sm">
                  {t("dashDoor", "สถานะประตู")}
                </span>
                <span
                  className={`text-[20px] font-bold leading-tight ${
                    isDoorOpen ? "text-red-500" : "text-base-content"
                  }`}
                >
                  {deviceData?.log
                    ? isDoorOpen
                      ? t("doorOpen", "เปิดอยู่")
                      : t("doorClose", "ปิดสนิท")
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfoTms;
