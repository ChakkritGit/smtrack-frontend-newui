import mqtt, { MqttClient, IClientOptions } from 'mqtt'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import { cookies } from '../constants/utils/utilsConstants'
import { UserProfileType } from '../types/smtrack/utilsRedux/utilsReduxType'

class MQTTService {
  // private static instance: MQTTService
  private client: MqttClient

  private constructor (private host: string) {
    const userProfile: UserProfileType = cookies.get('userProfile')

    const options: IClientOptions = {
      path: '/mqtt',
      protocol: 'wss',
      host: this.host,
      port: Number(import.meta.env.VITE_APP_MQTT_PORT),
      username: `${import.meta.env.VITE_APP_MQTT_USERNAME}`,
      password: `${import.meta.env.VITE_APP_MQTT_PASSWORD}`,
      clientId: `${userProfile?.id}-${uuidv5(
        `${import.meta.env.VITE_APP_DOMAIN}`,
        uuidv4()
      )}`,
      protocolVersion: 5,
      clean: true,
      rejectUnauthorized: false,
      queueQoSZero: true
    }

    this.client = mqtt.connect(options)

    this.client.on('connect', () => {
      console.info('✅ MQTT Connected:', options.clientId)
    })

    this.client.on('error', err => {
      console.error('❌ MQTT Error:', err)
      this.client.end()
    })

    this.client.on('reconnect', () => {
      console.warn('🔄 MQTT Reconnecting...')
    })
  }

  public static getInstance (host: string): MQTTService {
    // if (!MQTTService.instance) {
    //   MQTTService.instance = new MQTTService(host)
    // }
    return new MQTTService(host)
  }

  public getClient (): MqttClient {
    return this.client
  }
}

export const mqttSMTRackService = MQTTService.getInstance(`${import.meta.env.VITE_APP_MQTT}`)
export const mqttTMSService = MQTTService.getInstance(`${import.meta.env.VITE_APP_MQTT_TMS}`)
export const client = mqttSMTRackService.getClient()
export const clientTms = mqttTMSService.getClient()
