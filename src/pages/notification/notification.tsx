import { useTranslation } from "react-i18next";
import { RiAlarmWarningFill } from "react-icons/ri";
import { RootState } from "../../redux/reducers/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { extractValues } from "../../constants/utils/utilsConstants";
import { JSX, useCallback, useEffect, useState } from "react";
import axiosInstance from "../../constants/axios/axiosInstance";
import { responseType } from "../../types/smtrack/utilsRedux/utilsReduxType";
import {
  NotificationHistoryType,
  NotificationTmsHistoryType,
} from "../../types/global/notification";
import { AxiosError } from "axios";
import { setTokenExpire } from "../../redux/actions/utilsActions";
import Loading from "../../components/skeleton/table/loading";
import NotificationPagination from "../../components/pagination/notificationPagination";
import {
  PiDoorLight,
  PiDoorOpenLight,
  PiLinkBreakLight,
  PiLinkSimpleLight,
  PiNoteLight,
  PiPlugsConnectedLight,
  PiPlugsLight,
  PiSimCardLight,
  PiSirenLight,
  PiThermometerColdLight,
  PiThermometerHotLight,
  PiThermometerSimpleLight,
  PiWifiHighLight,
  PiWifiSlashLight,
} from "react-icons/pi";

const Notification = () => {
  const dispatch = useDispatch();
  const { tokenDecode, tmsMode } = useSelector(
    (state: RootState) => state.utils,
  );
  const { t } = useTranslation();
  const [notificationList, setNotification] = useState<
    NotificationHistoryType[] | NotificationTmsHistoryType[]
  >([]);
  const [datePicker, setDatePicker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { role } = tokenDecode || {};

  const subTextNotiDetails = (text: string) => {
    const [topic, sub, status, value] = text.split("/");

    if (topic.startsWith("PROBE")) {
      const probeNum = topic.replace("PROBE", "");

      // กรณีอุณหภูมิ
      if (sub === "TEMP") {
        const tempMap: Record<string, string> = {
          OVER: "tempHigherLimmit",
          LOWER: "tempBelowLimmit",
        };
        return `${t(tempMap[status] || "tempBackToNormal")} ${value ? `(${value}°C)` : ""}`;
      }

      // กรณี DOOR หรือ SENSOR (ใช้ Logic เปิด/ปิด เหมือนกัน)
      if (sub.startsWith("DOOR")) {
        const state = status === "ON" ? t("stateOn") : t("stateOff");

        // ถ้าเป็น Door ให้ตัดคำว่า DOOR ออกเพื่อเอาเลข, ถ้าเป็น SENSOR ให้ใช้ชื่อ SENSOR เลย
        const doorNum = sub.replace("DOOR", "");
        let subName = "";

        if (Number(doorNum) > 0) {
          subName = sub.startsWith("DOOR")
            ? `${t("doorNum")} ${doorNum} ${state}`
            : `${t("doorNum")} 1 ${state}`; // หรือใส่ t('sensor')
        } else {
          if (status === "ON") {
            subName = `${t("doorLongOpen")} ${value ? `(${value}) ${t("doorTime")}` : ""}`;
          } else {
            subName = t("doorClosed");
          }
        }

        return `${t("deviceProbeTb")} ${probeNum} ${subName}`;
      } else if (sub.startsWith("SENSOR")) {
        const state = status === "ON" ? t("sensorNormal") : t("sensorFailed");
        const subName = sub.startsWith("SENSOR")
          ? `${t("sensor")} ${sub.replace("SENSOR", "")}`
          : `${t("sensor")} 1`; // หรือใส่ t('sensor')

        return `${t("deviceProbeTb")} ${probeNum} ${subName} ${state}`;
      }
    }

    switch (topic) {
      case "AC":
        return sub === "ON" ? t("plugBackToNormal") : t("plugProblem");
      case "SD":
        return sub === "ON" ? t("SdCardProblem") : t("SdCardBackToNormal");
      case "INTERNET":
        return sub === "ON" ? t("InternetProblem") : t("InternetBackToNormal");
      case "REPORT":
        const val = extractValues(text);
        return `${t("reportText")}/ ${t("devicsmtrackTb")}: ${
          val?.temperature ?? "- -"
        }°C, ${t("deviceHumiTb")}: ${val?.humidity ?? "- -"}%`;
      default:
        return text;
    }
  };

  const subTextNotiDetailsIcon = (text: string) => {
    const [topic, sub, status] = text.split("/");
    const iconSize = 24;

    // 1. จัดการกลุ่ม PROBE
    if (topic.startsWith("PROBE")) {
      // --- กรณีอุณหภูมิ ---
      if (sub === "TEMP") {
        const tempIcons: Record<string, JSX.Element> = {
          OVER: (
            <PiThermometerHotLight size={iconSize} className="text-error" />
          ),
          LOWER: (
            <PiThermometerColdLight size={iconSize} className="text-warning" />
          ),
        };
        return (
          tempIcons[status] || <PiThermometerSimpleLight size={iconSize} />
        );
      }

      // --- กรณี SENSOR (เซ็นเซอร์หลุด/ปกติ) ---
      if (sub.startsWith("SENSOR")) {
        // ตาม Logic subTextNotiDetails ของคุณ: ON = ปกติ, OFF = หลุด/พัง
        return status === "ON" ? (
          <PiLinkSimpleLight size={iconSize} className="text-success" /> // ไอคอนเชื่อมต่อปกติ
        ) : (
          <PiLinkBreakLight size={iconSize} className="text-error" /> // ไอคอนเซ็นเซอร์หลุด
        );
      }

      // --- กรณี DOOR (เปิด/ปิด) ---
      if (sub.startsWith("DOOR")) {
        return status === "ON" ? (
          <PiDoorOpenLight size={iconSize} className="text-error" />
        ) : (
          <PiDoorLight size={iconSize} className="text-success" />
        );
      }
    }

    // 2. จัดการกลุ่มอื่นๆ ด้วย Switch
    switch (topic) {
      case "AC":
        return sub === "ON" ? (
          <PiPlugsConnectedLight size={iconSize} className="text-success" />
        ) : (
          <PiPlugsLight size={iconSize} className="text-error" />
        );

      case "SD":
        return <PiSimCardLight size={iconSize} />;

      case "INTERNET":
        return sub === "ON" ? (
          <PiWifiSlashLight size={iconSize} className="text-error" />
        ) : (
          <PiWifiHighLight size={iconSize} className="text-success" />
        );

      case "REPORT":
        return <PiNoteLight size={iconSize} />;

      default:
        return <PiSirenLight size={iconSize} />;
    }
  };

  const fetchNotificaton = useCallback(async () => {
    setIsLoading(true);

    const baeUrl =
      role === "LEGACY_ADMIN" || role === "LEGACY_USER" || tmsMode
        ? `/legacy/templog/history/notification${
            datePicker !== "" ? `?filter=${datePicker}` : ""
          }`
        : `/log/notification/history/filter${
            datePicker !== "" ? `?filter=${datePicker}` : ""
          }`;

    try {
      const response =
        role === "LEGACY_ADMIN" || role === "LEGACY_USER" || tmsMode
          ? await axiosInstance.get<responseType<NotificationTmsHistoryType[]>>(
              baeUrl,
            )
          : await axiosInstance.get<responseType<NotificationHistoryType[]>>(
              baeUrl,
            );
      setNotification(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true));
        }
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [role, tmsMode, datePicker]);

  useEffect(() => {
    fetchNotificaton();
  }, [datePicker]);

  return (
    <div className="p-3 px-4">
      <div className="flex flex-col items-start gap-2 mb-3">
        <span>{t("seeLastData")}</span>
        <input
          type="date"
          value={datePicker}
          onChange={(e) => setDatePicker(e.target.value)}
          className="input  w-full md:max-w-xs"
        />
      </div>
      <div className="bg-base-100 rounded-field py-4 px-5">
        {!isLoading ? (
          role === "LEGACY_ADMIN" || role === "LEGACY_USER" || tmsMode ? (
            <div>
              {notificationList.length > 0 ? (
                <NotificationPagination
                  data={
                    notificationList.sort(
                      (a, b) =>
                        new Date(b._time).getTime() -
                        new Date(a._time).getTime(),
                    ) as NotificationTmsHistoryType[]
                  }
                  initialPerPage={10}
                  itemPerPage={[10, 30, 50, 100]}
                  renderItem={(item, index) => (
                    <li
                      className={`flex items-center gap-3 py-2 px-3 border-b border-base-content/5`}
                      key={index}
                    >
                      <div className="bg-primary/10 text-primary/70 rounded-field p-1">
                        <RiAlarmWarningFill size={24} />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between gap-3">
                          <span>{item?.message}</span>
                          <div className="flex flex-col items-end opacity-70">
                            <span className="text-[14px]">
                              {item?._time?.substring(11, 16)}
                            </span>
                            <span className="w-max text-[14px]">
                              {item?._time?.substring(0, 10)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[14px] opacity-70">
                          {item?.sn ?? "—"}
                        </span>
                      </div>
                    </li>
                  )}
                />
              ) : (
                <div className="flex items-center justify-center loading-hieght-full">
                  <div>{t("notificationEmpty")}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {notificationList.length > 0 ? (
                <NotificationPagination
                  data={
                    notificationList.sort(
                      (a, b) =>
                        new Date(b._time).getTime() -
                        new Date(a._time).getTime(),
                    ) as NotificationHistoryType[]
                  }
                  initialPerPage={10}
                  itemPerPage={[10, 30, 50, 100]}
                  renderItem={(item, index) => (
                    <li
                      className={`flex items-center gap-3 py-2 px-3 border-b border-base-content/5 hover:bg-base-200 duration-300 ease-linear`}
                      key={index}
                    >
                      <div className="bg-base-300/80 text-primary/70 rounded-field p-1">
                        {subTextNotiDetailsIcon(item?.message)}
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between gap-3">
                          <span>{subTextNotiDetails(item?.message)}</span>
                          <div className="flex flex-col items-end opacity-70">
                            <span className="text-[14px]">
                              {new Date(item._time).toLocaleString("th-TH", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZone: "UTC",
                              })}
                            </span>
                            <span className="w-max text-[14px]">
                              {new Date(item._time).toLocaleString("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                timeZone: "UTC",
                              })}
                            </span>
                          </div>
                        </div>
                        <span className="text-[14px] opacity-70">
                          {item?.sn ?? "—"}
                        </span>
                      </div>
                    </li>
                  )}
                />
              ) : (
                <div className="flex items-center justify-center loading-hieght-full">
                  <div>{t("notificationEmpty")}</div>
                </div>
              )}
            </div>
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Notification;
