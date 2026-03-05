type MqttRealTempType = {
  probe: string;
  temp: number;
  status: "N" | "L" | "H";
  timestamp: string;
};

export default MqttRealTempType;