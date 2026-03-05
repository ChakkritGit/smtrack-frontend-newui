import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers/rootReducer";
import { responseType } from "../../../types/smtrack/utilsRedux/utilsReduxType";
import { AxiosError } from "axios";
import axiosInstance from "../../../constants/axios/axiosInstance";
import HospitalAndWard from "../../../components/filter/hospitalAndWard";
import Loading from "../../../components/skeleton/table/loading";
import { DeviceLogTms } from "../../../types/tms/devices/deviceType";
import CardInfoTms from "../../../components/pages/dashboard/tms/cardInfoTms";
import CardStatusTms from "../../../components/pages/dashboard/tms/cardStatusTms";
import ChartSwiperWrapperTms from "../../../components/pages/dashboard/tms/chartSwiperWrapperTms";
import DataTableWrapperTms from "../../../components/pages/dashboard/tms/dataTableWrapperTms";
import DeviceTmsList from "../../../components/filter/deviceListTms";
import { setSearch, setTokenExpire } from "../../../redux/actions/utilsActions";
import { useTranslation } from "react-i18next";
import { RiCloseLargeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { clientTms } from "../../../services/mqtt";
import MqttRealTempType from "../../../types/tms/devices/mqttRealTemp";

const DashboardTms = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deviceKey, switchingMode } = useSelector(
    (state: RootState) => state.utils,
  );
  const [deviceLogs, setDeviceLogs] = useState<DeviceLogTms>();
  const [loading, setLoading] = useState(false);
  const [mqttData, setMqttData] = useState<MqttRealTempType[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchDeviceLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<responseType<DeviceLogTms>>(
        `/legacy/device/${deviceKey}`,
      );
      setDeviceLogs(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true));
        }
        console.error(error.response?.data.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [deviceKey]);

  useEffect(() => {
    fetchDeviceLogs();
  }, [deviceKey]);

  useEffect(() => {
    if (!deviceKey) return;
    setMqttData([]); // เคลียร์ข้อมูลเก่าเมื่อเปลี่ยนเครื่องใหม่

    const topicToSubscribe = `tms/${deviceKey}/#`;

    // 1. Subscribe หัวข้อใหม่
    clientTms.subscribe(topicToSubscribe, (err) => {
      if (err) console.error("MQTT Subscribe Error", err);
    });

    // 2. สร้างฟังก์ชันรับข้อความ
    const handleMqttMessage = (topic: string, message: any) => {
      // ป้องกันบัค: รับเฉพาะข้อมูลของ deviceKey ที่กำลังเปิดดูอยู่เท่านั้น!
      if (!topic.includes(`tms/${deviceKey}`)) return;

      try {
        const mqData: MqttRealTempType[] = JSON.parse(message.toString());

        if (mqData && mqData.length > 0) {
          // 3. เซ็ต State แบบอัปเดตค่าเดิม (Merge) ไม่ลบทับ
          setMqttData((prevData) => {
            let updatedData = [...prevData];

            mqData.forEach((incomingProbe) => {
              // หาว่าโพรบที่ส่งมา มีอยู่ใน state หรือยัง
              const existingIndex = updatedData.findIndex(
                (p) => p.probe === incomingProbe.probe,
              );

              if (existingIndex !== -1) {
                // ถ้ามีแล้ว ให้อัปเดตข้อมูลของโพรบนั้น
                updatedData[existingIndex] = incomingProbe;
              } else {
                // ถ้ายังไม่มี ให้เพิ่มเข้าไปใน Array
                updatedData.push(incomingProbe);
              }
            });

            return updatedData;
          });
        }
      } catch (error) {
        console.error("MQTT Parse Error: ", error);
      }
    };

    // เปิดรับข้อความ
    clientTms.on("message", handleMqttMessage);

    // 4. Cleanup Function: ทำงานเมื่อเปลี่ยนเครื่อง (เปลี่ยน deviceKey) หรือออกจากหน้า
    return () => {
      clientTms.unsubscribe(topicToSubscribe);
      clientTms.off("message", handleMqttMessage); // ถอด event ออก ป้องกันการทำงานซ้ำซ้อน
    };
  }, [deviceKey]);

  const CardInfoComponent = useMemo(() => {
    return <CardInfoTms deviceData={deviceLogs} />;
  }, [deviceLogs]);

  const CardStatusComponent = useMemo(() => {
    return <CardStatusTms deviceData={deviceLogs} mqttData={mqttData} />;
  }, [deviceLogs, mqttData]);

  const DeviceDetailLog = useMemo(() => {
    if (!deviceLogs) return;

    return (
      <>
        {/* เปลี่ยน Layout ตรงนี้เป็น Grid เพื่อแบ่งสัดส่วน ซ้าย-ขวา */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4 items-stretch">
          {/* ฝั่งซ้าย: ข้อมูลอุปกรณ์ (ให้กว้าง 5 ส่วน) ลบ lg:h-73.75 ออก */}
          <div className="xl:col-span-5 2xl:col-span-4 bg-base-100 rounded-field shadow-sm overflow-hidden h-full">
            {CardInfoComponent}
          </div>

          {/* ฝั่งขวา: การ์ดสถานะ (ให้กว้าง 7 ส่วน) ใช้ flex-col เพื่อให้เรียงลงมาตามธรรมชาติ */}
          <div className="xl:col-span-7 2xl:col-span-8 flex flex-col gap-4">
            {CardStatusComponent}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-4">
          <div className="w-full min-h-96.25 bg-base-100 rounded-field p-4 shadow-sm">
            <ChartSwiperWrapperTms deviceLogs={deviceLogs} />
          </div>
          <div className="w-full min-h-96.25 bg-base-100 rounded-field p-4 shadow-sm">
            <DataTableWrapperTms deviceLogs={deviceLogs} />
          </div>
        </div>
      </>
    );
  }, [deviceLogs, mqttData, CardInfoComponent, CardStatusComponent]);

  useEffect(() => {
    if (!deviceKey && !switchingMode) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [deviceKey]);

  useEffect(() => {
    return () => {
      dispatch(setSearch(""));
    };
  }, []);

  return (
    <div className="p-3 px-4">
      <dialog ref={modalRef} className="modal">
        <div className="modal-box h-125">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl mb-0">{t("selectDeviceDrop")}</h2>
            <button
              type="button"
              className="btn btn-ghost outline-none flex p-0 min-w-7.5 min-h-7.5 max-w-7.5 max-h-7.5 duration-300 ease-linear"
              onClick={() => navigate("/")}
            >
              <RiCloseLargeLine size={20} />
            </button>
          </div>
          <DeviceTmsList />
        </div>
      </dialog>
      <div className="flex items-center justify-between flex-wrap lg:flex-nowrap xl:flex-nowrap gap-3 mt-4">
        <DeviceTmsList />
        <HospitalAndWard />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100dvh-200px)]">
          <Loading />
        </div>
      ) : (
        DeviceDetailLog
      )}
    </div>
  );
};

export default DashboardTms;
