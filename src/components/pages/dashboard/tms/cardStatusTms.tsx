import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeviceLogTms } from "../../../../types/tms/devices/deviceType";
import { RiCloseLargeLine, RiTempColdLine } from "react-icons/ri";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import MqttRealTempType from "../../../../types/tms/devices/mqttRealTemp";
import UserPagination from "../../../pagination/userPagination";

type PropsType = {
  deviceData: DeviceLogTms | undefined;
  mqttData: MqttRealTempType[];
};

const CardStatusTms = (props: PropsType) => {
  const { t } = useTranslation();
  const { deviceData, mqttData } = props;

  // Ref สำหรับเปิด/ปิด Modal
  const currentTempModalRef = useRef<HTMLDialogElement>(null);
  const minMaxTempModalRef = useRef<HTMLDialogElement>(null);

  // State สำหรับสลับหน้าอัตโนมัติ (หน้าละ 3 รายการ)
  const [mqttSlideIndex, setMqttSlideIndex] = useState(0);
  const [apiSlideIndex, setApiSlideIndex] = useState(0);
  const itemsPerSlide = 3;

  // 1. กรองชื่อโพรบจาก API (ไม่ซ้ำ)
  const apiProbes = useMemo(() => {
    if (!deviceData?.log) return [];
    const uniqueProbes = Array.from(
      new Set(deviceData.log.map((log) => log.probe)),
    );
    return uniqueProbes.filter(Boolean) as string[];
  }, [deviceData?.log]);

  // 2. ตั้งค่า Auto-Slide สำหรับ MqttData (อุณหภูมิปัจจุบัน)
  useEffect(() => {
    const maxPage = Math.ceil(mqttData.length / itemsPerSlide);
    if (maxPage > 1) {
      const interval = setInterval(() => {
        setMqttSlideIndex((prev) => (prev + 1) % maxPage);
      }, 5000); // สลับทุกๆ 5 วินาที
      return () => clearInterval(interval);
    }
  }, [mqttData.length]);

  // 3. ตั้งค่า Auto-Slide สำหรับ ApiProbes (อุณหภูมิทั้งวัน)
  useEffect(() => {
    const maxPage = Math.ceil(apiProbes.length / itemsPerSlide);
    if (maxPage > 1) {
      const interval = setInterval(() => {
        setApiSlideIndex((prev) => (prev + 1) % maxPage);
      }, 5000); // สลับทุกๆ 5 วินาที
      return () => clearInterval(interval);
    }
  }, [apiProbes.length]);

  // ฟังก์ชันหาค่า Min/Max ประจำวันจาก API
  const getProbeMinMax = (probeName: string) => {
    if (!deviceData?.log || deviceData.log.length === 0)
      return { min: "—", max: "—" };
    const probeLogs = deviceData.log.filter((log) => log.probe === probeName);
    if (probeLogs.length === 0) return { min: "—", max: "—" };

    const temps = probeLogs.map((log) => log.tempValue);
    return {
      min: Math.min(...temps).toFixed(2),
      max: Math.max(...temps).toFixed(2),
    };
  };

  // ฟังก์ชันแปลง Status เป็นข้อความ/สี
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "H":
        return {
          text: t("statusHigh"),
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500",
        };
      case "L":
        return {
          text: t("statusLow"),
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500",
        };
      case "N":
      default:
        return {
          text: t("sensorNormal"),
          color: "text-success",
          bg: "bg-success/10",
          border: "border-success",
        };
    }
  };

  // หั่นข้อมูลเฉพาะหน้าที่กำลังแสดงอยู่
  const displayMqttData = mqttData.slice(
    mqttSlideIndex * itemsPerSlide,
    (mqttSlideIndex + 1) * itemsPerSlide,
  );
  const displayApiProbes = apiProbes.slice(
    apiSlideIndex * itemsPerSlide,
    (apiSlideIndex + 1) * itemsPerSlide,
  );

  return (
    <>
      {/* ----------------- การ์ดอุณหภูมิปัจจุบัน (Real-time) ----------------- */}
      <div className="bg-base-100 p-4 rounded-field w-full xl:col-span-12 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-base-300 pb-2">
          <div className="flex items-center gap-2">
            <RiTempColdLine size={20} className="text-gray-500" />
            <span className="font-bold text-[16px]">
              {t("dashProbe")} ({mqttData?.length || 0})
            </span>
          </div>
          {/* เอาเงื่อนไข > 3 ออก เพื่อให้ปุ่ม Modal แสดงตลอดเวลา */}
          {mqttData.length > 0 && (
            <button
              type="button"
              className="btn btn-xs btn-outline btn-neutral rounded-md"
              onClick={() => currentTempModalRef.current?.showModal()}
            >
              {t("viewAll")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 h-max min-h-22.5">
          {displayMqttData.length > 0 ? (
            displayMqttData.map((item, index) => {
              const { text, color, bg, border } = getStatusDisplay(item.status);
              return (
                <div
                  key={`current-${index}`}
                  className={`flex flex-col bg-base-200/50 rounded-field p-3 border-l-4 ${border} animate-fade-in`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="font-semibold text-sm text-base-content/80 truncate pr-2"
                      title={item.probe}
                    >
                      {item.probe}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${bg} ${color}`}
                    >
                      {text}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 mt-1">
                    <span className={`text-2xl font-bold ${color}`}>
                      {item.temp.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-gray-500 pb-1">
                      °C
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-sm text-gray-400 py-2">
              {t("nodata")}
            </div>
          )}
        </div>
      </div>

      {/* ----------------- การ์ดช่วงอุณหภูมิทั้งวัน (Min/Max) ----------------- */}
      <div className="bg-base-100 p-4 rounded-field w-full xl:col-span-12 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-base-300 pb-2">
          <div className="flex items-center gap-2">
            <HiOutlineArrowsUpDown size={20} className="text-gray-500" />
            <span className="font-bold text-[16px]">
              {t("dashTempofDay")} (
              {apiProbes.length || 0})
            </span>
          </div>
          {/* เอาเงื่อนไข > 3 ออก เพื่อให้ปุ่ม Modal แสดงตลอดเวลา */}
          {apiProbes.length > 0 && (
            <button
              type="button"
              className="btn btn-xs btn-outline btn-neutral rounded-md"
              onClick={() => minMaxTempModalRef.current?.showModal()}
            >
              {t("viewAll")}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 h-max min-h-22.5">
          {displayApiProbes.length > 0 ? (
            displayApiProbes.map((probeName, index) => {
              const { min, max } = getProbeMinMax(probeName);
              return (
                <div
                  key={`minmax-${index}`}
                  className="flex flex-col bg-base-200/50 rounded-field p-3 border-l-4 border-base-300 animate-fade-in"
                >
                  <span
                    className="font-semibold text-sm text-base-content/80 truncate mb-2"
                    title={probeName}
                  >
                    {probeName}
                  </span>
                  <div className="flex flex-col gap-1 text-[15px] font-bold mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 w-3">↑</span>
                      <span className="text-base-content">{max} °C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 w-3">↓</span>
                      <span className="text-base-content">{min} °C</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-sm text-gray-400 py-2">
              {t("nodata")}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ============================= MODALS SECTION ============================ */}
      {/* ========================================================================= */}

      {/* Modal 1: ดูโพรบปัจจุบันทั้งหมด */}
      <dialog
        ref={currentTempModalRef}
        className="modal overflow-y-scroll py-10"
      >
        <div className="modal-box md:w-5/6 max-w-6xl h-max max-h-[95%]">
          <div className="flex justify-between items-start gap-2 mb-4 border-b border-base-300 pb-3">
            <div>
              <h3 className="font-bold text-lg">
                {t("allProbes", "โพรบทั้งหมด (อุณหภูมิปัจจุบัน)")}
              </h3>
              <span className="text-gray-500 text-sm">
                {deviceData?.name ?? "—"}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost outline-none flex p-0 min-w-7.5 min-h-7.5 max-w-7.5 max-h-7.5 duration-300 ease-linear"
              onClick={() => currentTempModalRef.current?.close()}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>

          <UserPagination
            data={mqttData}
            initialPerPage={10}
            itemPerPage={[10, 20, 30, 50]}
            renderItem={(item, index) => {
              const { text, color, bg, border } = getStatusDisplay(item.status);
              return (
                <div
                  key={`modal-curr-${index}`}
                  className={`flex flex-col w-full h-full bg-base-200/50 rounded-field p-4 border-l-4 ${border} shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="font-semibold text-sm text-base-content/80 truncate pr-2"
                      title={item.probe}
                    >
                      {item.probe}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${bg} ${color}`}
                    >
                      {text}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 mt-2">
                    <span className={`text-3xl font-bold ${color}`}>
                      {item.temp.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-gray-500 pb-1">
                      °C
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Modal 2: ดูโพรบช่วงอุณหภูมิทั้งวันทั้งหมด */}
      <dialog
        ref={minMaxTempModalRef}
        className="modal overflow-y-scroll py-10"
      >
        <div className="modal-box md:w-5/6 max-w-6xl h-max max-h-[95%]">
          <div className="flex justify-between items-start gap-2 mb-4 border-b border-base-300 pb-3">
            <div>
              <h3 className="font-bold text-lg">
                {t("dashTempofDay")}
              </h3>
              <span className="text-gray-500 text-sm">
                {deviceData?.name ?? "—"}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost outline-none flex p-0 min-w-7.5 min-h-7.5 max-w-7.5 max-h-7.5 duration-300 ease-linear"
              onClick={() => minMaxTempModalRef.current?.close()}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>

          <UserPagination
            data={apiProbes}
            initialPerPage={10}
            itemPerPage={[10, 20, 30, 50]}
            renderItem={(probeName, index) => {
              const { min, max } = getProbeMinMax(probeName);
              return (
                <div
                  key={`modal-minmax-${index}`}
                  className="flex flex-col w-full h-full bg-base-200/50 rounded-field p-4 border-l-4 border-base-300 shadow-sm"
                >
                  <span
                    className="font-semibold text-sm text-base-content/80 truncate mb-3"
                    title={probeName}
                  >
                    {probeName}
                  </span>
                  <div className="flex flex-col gap-2 text-[16px] font-bold mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 w-4">↑</span>
                      <span className="text-base-content">{max} °C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 w-4">↓</span>
                      <span className="text-base-content">{min} °C</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CardStatusTms;
